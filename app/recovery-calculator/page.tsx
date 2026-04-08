"use client"

import { useState, useEffect, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { 
  ArrowRight, 
  Sparkles, 
  TrendingUp, 
  CheckCircle2, 
  Globe, 
  DollarSign,
  Zap,
  Clock,
  Target,
  ChevronDown,
  ChevronUp
} from "lucide-react"
import Link from "next/link"

// ============================================================================
// REGIONAL DEFAULTS (V2 Locked Values)
// ============================================================================
const REGIONAL_DEFAULTS: Record<string, {
  altPayPercent: number
  retryPercent: number
  recoverySpeed: "Fast" | "Medium" | "Longer-term"
  currency: string
  currencySymbol: string
  primaryPayment: string
  cardPenetration: "High" | "Medium" | "Low"
  defaultPaymentGap: number
  defaultRecoveryRate: number
  defaultSessions: number
  defaultBookingValue: number
}> = {
  "North America": {
    altPayPercent: 6.5,
    retryPercent: 2.5,
    recoverySpeed: "Medium",
    currency: "USD",
    currencySymbol: "$",
    primaryPayment: "Credit/Debit Cards",
    cardPenetration: "High",
    defaultPaymentGap: 8,
    defaultRecoveryRate: 60,
    defaultSessions: 10000,
    defaultBookingValue: 420
  },
  "UK / Europe": {
    altPayPercent: 9,
    retryPercent: 2.5,
    recoverySpeed: "Medium",
    currency: "EUR",
    currencySymbol: "€",
    primaryPayment: "Cards + BNPL",
    cardPenetration: "High",
    defaultPaymentGap: 12,
    defaultRecoveryRate: 55,
    defaultSessions: 8500,
    defaultBookingValue: 380
  },
  "India": {
    altPayPercent: 18,
    retryPercent: 4,
    recoverySpeed: "Fast",
    currency: "INR",
    currencySymbol: "₹",
    primaryPayment: "UPI / Wallets",
    cardPenetration: "Low",
    defaultPaymentGap: 40,
    defaultRecoveryRate: 35,
    defaultSessions: 8500,
    defaultBookingValue: 847
  },
  "LATAM": {
    altPayPercent: 15,
    retryPercent: 3.5,
    recoverySpeed: "Fast",
    currency: "BRL",
    currencySymbol: "R$",
    primaryPayment: "Pix / Boleto",
    cardPenetration: "Medium",
    defaultPaymentGap: 36,
    defaultRecoveryRate: 33,
    defaultSessions: 8500,
    defaultBookingValue: 690
  },
  "Middle East": {
    altPayPercent: 12,
    retryPercent: 3,
    recoverySpeed: "Medium",
    currency: "AED",
    currencySymbol: "د.إ",
    primaryPayment: "Local Cards / Wallets",
    cardPenetration: "Medium",
    defaultPaymentGap: 25,
    defaultRecoveryRate: 28,
    defaultSessions: 8500,
    defaultBookingValue: 910
  }
}

// Detailed market lookup (preserved under the hood)
const DETAILED_MARKETS: Record<string, string> = {
  "India": "India",
  "Brazil": "LATAM",
  "Mexico": "LATAM",
  "Argentina": "LATAM",
  "UAE": "Middle East",
  "Saudi Arabia": "Middle East",
  "UK": "UK / Europe",
  "Germany": "UK / Europe",
  "France": "UK / Europe",
  "Spain": "UK / Europe",
  "Italy": "UK / Europe",
  "Netherlands": "UK / Europe",
  "USA": "North America",
  "Canada": "North America"
}

// Segment multipliers
const SEGMENT_MULTIPLIERS: Record<string, number> = {
  "Luxury & Ultra-Luxury": 1.35,
  "Upper Upscale": 1.25,
  "Upscale": 1.15,
  "Upper Midscale": 1.0,
  "Midscale": 0.9,
  "Economy": 0.75
}

// Confidence modifiers
const CONFIDENCE_MODIFIERS: Record<string, { modifier: number; label: string; description: string }> = {
  "High": { modifier: 0.85, label: "High Confidence", description: "Conservative estimate based on proven performance" },
  "Expected": { modifier: 1.0, label: "Expected", description: "Based on typical market performance" },
  "Stretch": { modifier: 1.15, label: "Stretch Target", description: "Optimistic scenario with full optimization" }
}

// Alt payment mode presets
const ALT_PAY_MODES: Record<string, { label: string; description: string }> = {
  "auto": { label: "Auto by Region", description: "Uses regional default percentages" },
  "bnpl_heavy": { label: "BNPL Heavy", description: "Higher BNPL adoption markets" },
  "local_heavy": { label: "Local Pay Heavy", description: "Higher local payment adoption" },
  "balanced": { label: "Balanced Mix", description: "Equal BNPL and local pay mix" },
  "custom": { label: "Custom", description: "Set your own percentage" }
}

// ============================================================================
// CURRENCY FORMATTING
// ============================================================================
function formatCurrency(value: number, region: string): string {
  const config = REGIONAL_DEFAULTS[region]
  const symbol = config?.currencySymbol || "$"
  
  // Convert to local currency approximation for display
  const exchangeRates: Record<string, number> = {
    "USD": 1,
    "EUR": 0.92,
    "INR": 83,
    "BRL": 4.97,
    "AED": 3.67,
    "GBP": 0.79
  }
  
  const rate = exchangeRates[config?.currency || "USD"] || 1
  const localValue = value * rate
  
  if (localValue >= 1000000) {
    return `${symbol}${(localValue / 1000000).toFixed(1)}M`
  } else if (localValue >= 1000) {
    return `${symbol}${(localValue / 1000).toFixed(0)}K`
  }
  return `${symbol}${localValue.toFixed(0)}`
}

function formatCurrencyFull(value: number, region: string): string {
  const config = REGIONAL_DEFAULTS[region]
  const symbol = config?.currencySymbol || "$"
  
  const exchangeRates: Record<string, number> = {
    "USD": 1,
    "EUR": 0.92,
    "INR": 83,
    "BRL": 4.97,
    "AED": 3.67,
    "GBP": 0.79
  }
  
  const rate = exchangeRates[config?.currency || "USD"] || 1
  const localValue = value * rate
  
  return `${symbol}${localValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function RecoveryCalculatorPage() {
  // Primary inputs
  const [market, setMarket] = useState("North America")
  const [hotelSegment, setHotelSegment] = useState("Upscale")
  const [monthlySessions, setMonthlySessions] = useState(10000)
  const [conversionRate, setConversionRate] = useState(3.2)
  const [avgBookingValue, setAvgBookingValue] = useState(420)
  const [paymentGap, setPaymentGap] = useState(8)
  
  // Recovery assumptions
  const [recoveryRate, setRecoveryRate] = useState(60)
  const [retryRecovery, setRetryRecovery] = useState(2.5)
  const [otaCommission, setOtaCommission] = useState(18)
  const [altPayUplift, setAltPayUplift] = useState(6.5)
  const [altPayMode, setAltPayMode] = useState("auto")
  const [confidenceBand, setConfidenceBand] = useState("Expected")
  
  // UI state
  const [showAssumptions, setShowAssumptions] = useState(false)
  const [activeTab, setActiveTab] = useState("executive")
  
  // Get current region config
  const regionConfig = REGIONAL_DEFAULTS[market]
  
  // Update values when market changes
  useEffect(() => {
    if (regionConfig) {
      setPaymentGap(regionConfig.defaultPaymentGap)
      setRecoveryRate(regionConfig.defaultRecoveryRate)
      setRetryRecovery(regionConfig.retryPercent)
      setMonthlySessions(regionConfig.defaultSessions)
      setAvgBookingValue(regionConfig.defaultBookingValue)
      
      if (altPayMode === "auto") {
        setAltPayUplift(regionConfig.altPayPercent)
      }
    }
  }, [market])
  
  // Update alt pay when mode changes
  useEffect(() => {
    if (altPayMode === "auto" && regionConfig) {
      setAltPayUplift(regionConfig.altPayPercent)
    } else if (altPayMode === "bnpl_heavy") {
      setAltPayUplift(Math.min(regionConfig.altPayPercent * 1.3, 25))
    } else if (altPayMode === "local_heavy") {
      setAltPayUplift(Math.min(regionConfig.altPayPercent * 1.2, 22))
    } else if (altPayMode === "balanced") {
      setAltPayUplift(regionConfig.altPayPercent)
    }
  }, [altPayMode, regionConfig])

  // ============================================================================
  // LOCKED FORMULAS (V2 Spec)
  // ============================================================================
  const calculations = useMemo(() => {
    const segmentMultiplier = SEGMENT_MULTIPLIERS[hotelSegment] || 1.0
    const confidenceModifier = CONFIDENCE_MODIFIERS[confidenceBand]?.modifier || 1.0
    
    // Revenue at Risk = Monthly Sessions × Current Conversion Rate × Average Booking Value × Payment Gap %
    const revenueAtRisk = monthlySessions * (conversionRate / 100) * avgBookingValue * (paymentGap / 100)
    
    // Base Recovery = Revenue at Risk × Recovery Rate %
    const baseRecovery = revenueAtRisk * (recoveryRate / 100) * segmentMultiplier
    
    // Alternative Payment Recovery = Revenue at Risk × Alternative Payment Uplift %
    const altPayRecovery = revenueAtRisk * (altPayUplift / 100)
    
    // Retry Recovery = Revenue at Risk × Retry Recovery %
    const retryRecoveryAmount = revenueAtRisk * (retryRecovery / 100)
    
    // Total Annual Recovery = (Base Recovery + Alt Pay + Retry) × Confidence × 12
    const totalAnnualRecovery = (baseRecovery + altPayRecovery + retryRecoveryAmount) * confidenceModifier * 12
    
    // OTA Margin Protected = Total Annual Recovery × OTA Commission %
    const otaMarginProtected = totalAnnualRecovery * (otaCommission / 100)
    
    // Recovered Bookings = Total Annual Recovery ÷ Average Booking Value
    const recoveredBookings = Math.round(totalAnnualRecovery / avgBookingValue)
    
    // Monthly values
    const monthlyRecovery = (baseRecovery + altPayRecovery + retryRecoveryAmount) * confidenceModifier
    
    return {
      revenueAtRisk,
      baseRecovery,
      altPayRecovery,
      retryRecoveryAmount,
      totalAnnualRecovery,
      otaMarginProtected,
      recoveredBookings,
      monthlyRecovery,
      confidenceLabel: CONFIDENCE_MODIFIERS[confidenceBand]?.label || "Expected"
    }
  }, [
    monthlySessions, 
    conversionRate, 
    avgBookingValue, 
    paymentGap, 
    recoveryRate, 
    altPayUplift, 
    retryRecovery, 
    otaCommission, 
    hotelSegment, 
    confidenceBand
  ])

  // Geography calculations for all regions
  const geographyData = useMemo(() => {
    return Object.entries(REGIONAL_DEFAULTS).map(([region, config]) => {
      const segmentMultiplier = SEGMENT_MULTIPLIERS[hotelSegment] || 1.0
      const confidenceModifier = CONFIDENCE_MODIFIERS[confidenceBand]?.modifier || 1.0
      
      const revenueAtRisk = config.defaultSessions * (conversionRate / 100) * config.defaultBookingValue * (config.defaultPaymentGap / 100)
      const baseRecovery = revenueAtRisk * (config.defaultRecoveryRate / 100) * segmentMultiplier
      const altPayRecovery = revenueAtRisk * (config.altPayPercent / 100)
      const retryRecoveryAmount = revenueAtRisk * (config.retryPercent / 100)
      const totalAnnualRecovery = (baseRecovery + altPayRecovery + retryRecoveryAmount) * confidenceModifier * 12
      
      return {
        region,
        altPayPercent: config.altPayPercent,
        retryPercent: config.retryPercent,
        recoverySpeed: config.recoverySpeed,
        currency: config.currency,
        currencySymbol: config.currencySymbol,
        primaryPayment: config.primaryPayment,
        cardPenetration: config.cardPenetration,
        totalAnnualRecovery,
        priority: config.recoverySpeed === "Fast" ? 1 : config.recoverySpeed === "Medium" ? 2 : 3
      }
    }).sort((a, b) => a.priority - b.priority)
  }, [hotelSegment, conversionRate, confidenceBand])

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#8021FF] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">RG</span>
            </div>
            <span className="font-semibold text-foreground">RG PAY</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <Link href="/why-rg-pay" className="hover:text-foreground transition-colors">Why RG Pay?</Link>
            <Link href="/recovery-calculator" className="text-[#8021FF] font-medium">Recovery Calculator</Link>
            <Link href="/faq" className="hover:text-foreground transition-colors">FAQ</Link>
            <Link href="/" className="hover:text-foreground transition-colors">Demo</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#8021FF]/10 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-[#8021FF]" />
            <span className="text-sm font-medium text-[#8021FF]">V2 Recovery Decision Engine</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            Executive Recovery & Geography Prioritization Engine
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty">
            Quantify revenue at risk, annual recovery potential, OTA margin protected, and identify which markets unlock gains fastest.
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="executive" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Executive View
            </TabsTrigger>
            <TabsTrigger value="geography" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Geography View
            </TabsTrigger>
          </TabsList>

          {/* EXECUTIVE VIEW (DEFAULT) */}
          <TabsContent value="executive" className="mt-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left Column - Inputs */}
              <div className="space-y-6">
                {/* Business Inputs Card */}
                <Card className="p-6 border border-border">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-[#8021FF]/10 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-[#8021FF]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Business Inputs</h3>
                      <p className="text-sm text-muted-foreground">Customize to match your operations</p>
                    </div>
                  </div>
                  
                  {/* Dropdowns Row */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Market</label>
                      <Select value={market} onValueChange={setMarket}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(REGIONAL_DEFAULTS).map((m) => (
                            <SelectItem key={m} value={m}>{m}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Hotel Segment</label>
                      <Select value={hotelSegment} onValueChange={setHotelSegment}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(SEGMENT_MULTIPLIERS).map((seg) => (
                            <SelectItem key={seg} value={seg}>{seg}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {/* Sliders */}
                  <div className="space-y-5">
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-sm font-medium text-foreground">Monthly Sessions</label>
                        <span className="text-sm font-semibold text-[#8021FF]">{monthlySessions.toLocaleString()}</span>
                      </div>
                      <Slider
                        value={[monthlySessions]}
                        onValueChange={([v]) => setMonthlySessions(v)}
                        min={1000}
                        max={100000}
                        step={500}
                        className="[&_[role=slider]]:bg-[#8021FF]"
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-sm font-medium text-foreground">Current Conversion Rate %</label>
                        <span className="text-sm font-semibold text-[#8021FF]">{conversionRate.toFixed(1)}%</span>
                      </div>
                      <Slider
                        value={[conversionRate]}
                        onValueChange={([v]) => setConversionRate(v)}
                        min={0.5}
                        max={10}
                        step={0.1}
                        className="[&_[role=slider]]:bg-[#8021FF]"
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-sm font-medium text-foreground">Average Booking Value</label>
                        <span className="text-sm font-semibold text-[#8021FF]">${avgBookingValue.toLocaleString()}</span>
                      </div>
                      <Slider
                        value={[avgBookingValue]}
                        onValueChange={([v]) => setAvgBookingValue(v)}
                        min={50}
                        max={2500}
                        step={10}
                        className="[&_[role=slider]]:bg-[#8021FF]"
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-sm font-medium text-foreground">Payment Gap %</label>
                        <span className="text-sm font-semibold text-[#8021FF]">{paymentGap.toFixed(1)}%</span>
                      </div>
                      <Slider
                        value={[paymentGap]}
                        onValueChange={([v]) => setPaymentGap(v)}
                        min={1}
                        max={50}
                        step={0.5}
                        className="[&_[role=slider]]:bg-[#8021FF]"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Checkout abandonment, missing methods, payment failure, traveler drop-off</p>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-sm font-medium text-foreground">OTA Commission %</label>
                        <span className="text-sm font-semibold text-[#8021FF]">{otaCommission}%</span>
                      </div>
                      <Slider
                        value={[otaCommission]}
                        onValueChange={([v]) => setOtaCommission(v)}
                        min={10}
                        max={30}
                        step={1}
                        className="[&_[role=slider]]:bg-[#8021FF]"
                      />
                    </div>
                  </div>
                </Card>
                
                {/* Assumptions Panel (Collapsible) */}
                <Card className="p-6 border border-border">
                  <button
                    onClick={() => setShowAssumptions(!showAssumptions)}
                    className="flex items-center justify-between w-full"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                        <Zap className="w-5 h-5 text-amber-600" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-foreground">Recovery Assumptions</h3>
                        <p className="text-sm text-muted-foreground">Tune recovery rates and uplift factors</p>
                      </div>
                    </div>
                    {showAssumptions ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </button>
                  
                  {showAssumptions && (
                    <div className="mt-6 space-y-5 pt-4 border-t border-border">
                      <div>
                        <div className="flex justify-between mb-2">
                          <label className="text-sm font-medium text-foreground">Recovery Rate %</label>
                          <span className="text-sm font-semibold text-[#8021FF]">{recoveryRate}%</span>
                        </div>
                        <Slider
                          value={[recoveryRate]}
                          onValueChange={([v]) => setRecoveryRate(v)}
                          min={20}
                          max={80}
                          step={1}
                          className="[&_[role=slider]]:bg-[#8021FF]"
                        />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-2">
                          <label className="text-sm font-medium text-foreground">Retry Recovery %</label>
                          <span className="text-sm font-semibold text-[#8021FF]">{retryRecovery}%</span>
                        </div>
                        <Slider
                          value={[retryRecovery]}
                          onValueChange={([v]) => setRetryRecovery(v)}
                          min={1}
                          max={10}
                          step={0.5}
                          className="[&_[role=slider]]:bg-[#8021FF]"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Alternative Payment Uplift (BNPL / Local Pay) %
                        </label>
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <Select value={altPayMode} onValueChange={setAltPayMode}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(ALT_PAY_MODES).map(([key, { label }]) => (
                                <SelectItem key={key} value={key}>{label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <div className="flex items-center gap-2">
                            <Slider
                              value={[altPayUplift]}
                              onValueChange={([v]) => {
                                setAltPayUplift(v)
                                if (altPayMode !== "custom") setAltPayMode("custom")
                              }}
                              min={1}
                              max={25}
                              step={0.5}
                              className="[&_[role=slider]]:bg-[#8021FF]"
                            />
                            <span className="text-sm font-semibold text-[#8021FF] w-12">{altPayUplift}%</span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">{ALT_PAY_MODES[altPayMode]?.description}</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-3">Confidence Band</label>
                        <div className="grid grid-cols-3 gap-2">
                          {Object.entries(CONFIDENCE_MODIFIERS).map(([key, { label }]) => (
                            <button
                              key={key}
                              onClick={() => setConfidenceBand(key)}
                              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                confidenceBand === key
                                  ? "bg-[#8021FF] text-white"
                                  : "bg-muted text-muted-foreground hover:bg-muted/80"
                              }`}
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">{CONFIDENCE_MODIFIERS[confidenceBand]?.description}</p>
                      </div>
                    </div>
                  )}
                </Card>
              </div>

              {/* Right Column - Results */}
              <div className="space-y-6">
                {/* Hero Cards Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Annual Recovery Potential - Hero */}
                  <Card className="col-span-2 bg-gradient-to-br from-[#8021FF] to-[#6010DD] p-6 text-white">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-5 h-5 text-white/80" />
                      <span className="text-white/80 text-sm font-medium">Annual Recovery Potential</span>
                    </div>
                    <div className="text-4xl md:text-5xl font-bold mb-2">
                      {formatCurrency(calculations.totalAnnualRecovery, market)}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{calculations.confidenceLabel}</span>
                      <span className="text-white/60 text-sm">{regionConfig?.currency}</span>
                    </div>
                  </Card>
                  
                  {/* Revenue at Risk */}
                  <Card className="p-5 border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-4 h-4 text-red-500" />
                      <span className="text-xs text-muted-foreground">Revenue at Risk</span>
                    </div>
                    <div className="text-2xl font-bold text-red-600">
                      {formatCurrency(calculations.revenueAtRisk * 12, market)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Annual</p>
                  </Card>
                  
                  {/* OTA Margin Protected */}
                  <Card className="p-5 border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-xs text-muted-foreground">OTA Margin Protected</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(calculations.otaMarginProtected, market)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">at {otaCommission}% commission</p>
                  </Card>
                  
                  {/* Recovered Bookings */}
                  <Card className="p-5 border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-4 h-4 text-[#8021FF]" />
                      <span className="text-xs text-muted-foreground">Recovered Bookings</span>
                    </div>
                    <div className="text-2xl font-bold text-foreground">
                      {calculations.recoveredBookings.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">per year</p>
                  </Card>
                  
                  {/* Confidence Band */}
                  <Card className="p-5 border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-amber-500" />
                      <span className="text-xs text-muted-foreground">Confidence Band</span>
                    </div>
                    <div className="text-2xl font-bold text-foreground">
                      {confidenceBand}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{(CONFIDENCE_MODIFIERS[confidenceBand]?.modifier * 100).toFixed(0)}% modifier</p>
                  </Card>
                </div>

                {/* Recovery Breakdown */}
                <Card className="p-6 border border-border">
                  <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#8021FF] rounded-full" />
                    Recovery Breakdown
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-sm text-muted-foreground">Base Recovery (monthly)</span>
                      <span className="font-medium text-foreground">{formatCurrency(calculations.baseRecovery, market)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-sm text-muted-foreground">Alternative Payment Add-On</span>
                      <span className="font-medium text-foreground">+{formatCurrency(calculations.altPayRecovery, market)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-sm text-muted-foreground">Retry Recovery Add-On</span>
                      <span className="font-medium text-foreground">+{formatCurrency(calculations.retryRecoveryAmount, market)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 bg-[#8021FF]/5 rounded-lg px-3 -mx-3">
                      <span className="text-sm font-semibold text-foreground">Total Annual Recovery</span>
                      <span className="font-bold text-[#8021FF] text-lg">{formatCurrency(calculations.totalAnnualRecovery, market)}</span>
                    </div>
                  </div>
                </Card>

                {/* CTA */}
                <Card className="p-6 bg-gradient-to-br from-[#8021FF] to-[#6B1AD6] text-white border-0">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-white/80" />
                    <h3 className="font-semibold">Ready to Recover This Revenue?</h3>
                  </div>
                  <p className="text-white/80 mb-4 text-sm">
                    Get a custom analysis tailored to your specific markets, segments, and transaction volumes.
                  </p>
                  <div className="flex gap-3">
                    <Button className="flex-1 bg-white text-[#8021FF] hover:bg-gray-100 font-semibold">
                      Let&apos;s Talk
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    <Link href="/">
                      <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                        See Demo
                      </Button>
                    </Link>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* GEOGRAPHY VIEW */}
          <TabsContent value="geography" className="mt-8">
            <div className="space-y-8">
              {/* Region Cards Grid */}
              <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
                {geographyData.map((geo) => (
                  <Card 
                    key={geo.region}
                    className={`p-5 border transition-all cursor-pointer ${
                      market === geo.region 
                        ? "border-[#8021FF] ring-2 ring-[#8021FF]/20 bg-[#8021FF]/5" 
                        : "border-border hover:border-[#8021FF]/50"
                    }`}
                    onClick={() => {
                      setMarket(geo.region)
                      setActiveTab("executive")
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold text-foreground text-sm">{geo.region}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        geo.recoverySpeed === "Fast" 
                          ? "bg-green-100 text-green-700" 
                          : geo.recoverySpeed === "Medium"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-gray-100 text-gray-700"
                      }`}>
                        {geo.recoverySpeed}
                      </span>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Alt Pay %</span>
                        <span className="font-medium text-foreground">{geo.altPayPercent}%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Retry %</span>
                        <span className="font-medium text-foreground">{geo.retryPercent}%</span>
                      </div>
                    </div>
                    
                    <div className="pt-3 border-t border-border">
                      <p className="text-xs text-muted-foreground mb-1">Recovery Opportunity</p>
                      <p className="text-lg font-bold text-[#8021FF]">
                        {geo.currencySymbol}{(geo.totalAnnualRecovery * (
                          geo.currency === "INR" ? 83 :
                          geo.currency === "EUR" ? 0.92 :
                          geo.currency === "BRL" ? 4.97 :
                          geo.currency === "AED" ? 3.67 : 1
                        ) / 1000000).toFixed(1)}M
                      </p>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Selected Region Detail */}
              <Card className="p-6 border border-border">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#8021FF]/10 rounded-lg flex items-center justify-center">
                      <Globe className="w-5 h-5 text-[#8021FF]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{market} Market Details</h3>
                      <p className="text-sm text-muted-foreground">Regional payment characteristics</p>
                    </div>
                  </div>
                  <span className={`text-sm px-3 py-1 rounded-full font-medium ${
                    regionConfig?.recoverySpeed === "Fast" 
                      ? "bg-green-100 text-green-700" 
                      : regionConfig?.recoverySpeed === "Medium"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-gray-100 text-gray-700"
                  }`}>
                    <Clock className="w-3 h-3 inline mr-1" />
                    {regionConfig?.recoverySpeed} Recovery
                  </span>
                </div>
                
                <div className="grid md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Primary Payment Method</p>
                    <p className="font-semibold text-foreground">{regionConfig?.primaryPayment}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Card Penetration</p>
                    <p className="font-semibold text-foreground">{regionConfig?.cardPenetration}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Currency</p>
                    <p className="font-semibold text-foreground">{regionConfig?.currency} ({regionConfig?.currencySymbol})</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Default Payment Gap</p>
                    <p className="font-semibold text-foreground">{regionConfig?.defaultPaymentGap}%</p>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-border">
                  <h4 className="font-medium text-foreground mb-3">Recommended Actions for {market}</h4>
                  <div className="grid md:grid-cols-3 gap-3">
                    {market === "India" && (
                      <>
                        <div className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-green-500" /> Enable UPI payments</div>
                        <div className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-green-500" /> Add EMI options</div>
                        <div className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-green-500" /> Support Indian wallets</div>
                      </>
                    )}
                    {market === "LATAM" && (
                      <>
                        <div className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-green-500" /> Enable Pix instant transfer</div>
                        <div className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-green-500" /> Add Boleto payment</div>
                        <div className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-green-500" /> Support installments</div>
                      </>
                    )}
                    {market === "UK / Europe" && (
                      <>
                        <div className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-green-500" /> Enable Klarna BNPL</div>
                        <div className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-green-500" /> Add iDEAL (NL)</div>
                        <div className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-green-500" /> Support SEPA transfers</div>
                      </>
                    )}
                    {market === "Middle East" && (
                      <>
                        <div className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-green-500" /> Enable Tabby BNPL</div>
                        <div className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-green-500" /> Add Mada cards</div>
                        <div className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-green-500" /> Support Apple Pay</div>
                      </>
                    )}
                    {market === "North America" && (
                      <>
                        <div className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-green-500" /> Enable Affirm/Klarna</div>
                        <div className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-green-500" /> Add Apple/Google Pay</div>
                        <div className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-green-500" /> Smart retry logic</div>
                      </>
                    )}
                  </div>
                </div>
              </Card>

              {/* Priority Ranking Table */}
              <Card className="p-6 border border-border">
                <h4 className="font-semibold text-foreground mb-4">Market Priority Ranking</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-2 text-muted-foreground font-medium">Rank</th>
                        <th className="text-left py-3 px-2 text-muted-foreground font-medium">Region</th>
                        <th className="text-left py-3 px-2 text-muted-foreground font-medium">Recovery Speed</th>
                        <th className="text-left py-3 px-2 text-muted-foreground font-medium">Alt Pay %</th>
                        <th className="text-left py-3 px-2 text-muted-foreground font-medium">Recovery Opportunity</th>
                        <th className="text-left py-3 px-2 text-muted-foreground font-medium">Currency</th>
                      </tr>
                    </thead>
                    <tbody>
                      {geographyData.map((geo, index) => (
                        <tr key={geo.region} className="border-b border-border last:border-0 hover:bg-muted/50">
                          <td className="py-3 px-2">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              index === 0 ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"
                            }`}>
                              {index + 1}
                            </span>
                          </td>
                          <td className="py-3 px-2 font-medium text-foreground">{geo.region}</td>
                          <td className="py-3 px-2">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              geo.recoverySpeed === "Fast" 
                                ? "bg-green-100 text-green-700" 
                                : geo.recoverySpeed === "Medium"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-gray-100 text-gray-700"
                            }`}>
                              {geo.recoverySpeed}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-foreground">{geo.altPayPercent}%</td>
                          <td className="py-3 px-2 font-semibold text-[#8021FF]">
                            {formatCurrency(geo.totalAnnualRecovery, geo.region)}
                          </td>
                          <td className="py-3 px-2 text-muted-foreground">{geo.currency}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
