"use client"

import { useState, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { 
  ArrowRight, 
  Sparkles, 
  TrendingUp, 
  Globe, 
  DollarSign,
  Clock,
  Target,
  Building2,
  Percent,
  Calculator,
  ArrowUpRight
} from "lucide-react"
import Link from "next/link"

// ============================================================================
// V3 LOCKED FORMULAS — DO NOT MODIFY
// shift = target direct – current direct
// net savings % = OTA commission – RG Pay fee
// annual savings = rooms × occupancy% × ADR × 365 × shift% × net savings%
// monthly savings = annual savings / 12
// USD = INR / FX rate
// ============================================================================

// ============================================================================
// REGIONAL DEFAULTS (Preserved for Geography View)
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
    defaultBookingValue: 850
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

// Segment multipliers (preserved for Geography View calculations)
const SEGMENT_MULTIPLIERS: Record<string, number> = {
  "Luxury & Ultra-Luxury": 1.35,
  "Upper Upscale": 1.25,
  "Upscale": 1.15,
  "Upper Midscale": 1.0,
  "Midscale": 0.9,
  "Economy": 0.75
}

// ============================================================================
// CURRENCY FORMATTING
// ============================================================================
function formatINR(value: number): string {
  // Indian numbering system with lakhs/crores
  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(2)} Cr`
  } else if (value >= 100000) {
    return `₹${(value / 100000).toFixed(2)} L`
  }
  return `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
}

function formatUSD(value: number): string {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(2)}M`
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`
  }
  return `$${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
}

function formatCurrencyRegion(value: number, region: string): string {
  const config = REGIONAL_DEFAULTS[region]
  const symbol = config?.currencySymbol || "$"
  
  const exchangeRates: Record<string, number> = {
    "USD": 1,
    "EUR": 0.92,
    "INR": 83,
    "BRL": 4.97,
    "AED": 3.67,
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

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function RecoveryCalculatorPage() {
  // V3 Executive View Inputs (with defaults)
  const [rooms, setRooms] = useState(6500)
  const [occupancy, setOccupancy] = useState(70)
  const [adr, setAdr] = useState(6000)
  const [currentDirect, setCurrentDirect] = useState(2)
  const [targetDirect, setTargetDirect] = useState(5)
  const [otaCommission, setOtaCommission] = useState(15)
  const [rgPayFee, setRgPayFee] = useState(3.5)
  const [fxRate, setFxRate] = useState(84)
  
  // UI state
  const [activeTab, setActiveTab] = useState("executive")
  const [selectedRegion, setSelectedRegion] = useState("India")
  const [hotelSegment] = useState("Upscale")
  
  // Get region config for Geography View
  const regionConfig = REGIONAL_DEFAULTS[selectedRegion]

  // ============================================================================
  // V3 LOCKED FORMULAS — Executive View Calculations
  // ============================================================================
  const calculations = useMemo(() => {
    // shift = target direct – current direct
    const shift = targetDirect - currentDirect
    
    // net savings % = OTA commission – RG Pay fee
    const netSavingsPercent = otaCommission - rgPayFee
    
    // annual savings = rooms × occupancy% × ADR × 365 × shift% × net savings%
    const annualSavingsINR = rooms * (occupancy / 100) * adr * 365 * (shift / 100) * (netSavingsPercent / 100)
    
    // monthly savings = annual savings / 12
    const monthlySavingsINR = annualSavingsINR / 12
    
    // USD = INR / FX rate
    const annualSavingsUSD = annualSavingsINR / fxRate
    const monthlySavingsUSD = monthlySavingsINR / fxRate
    
    // OTA Commission Avoided (what would have been paid on shifted revenue)
    const shiftedRevenueINR = rooms * (occupancy / 100) * adr * 365 * (shift / 100)
    const otaCommissionAvoidedINR = shiftedRevenueINR * (otaCommission / 100)
    const otaCommissionAvoidedUSD = otaCommissionAvoidedINR / fxRate
    
    // Direct Revenue Retained (total direct revenue after shift)
    const directRevenueINR = shiftedRevenueINR
    const directRevenueUSD = directRevenueINR / fxRate
    
    return {
      shift,
      netSavingsPercent,
      annualSavingsINR,
      annualSavingsUSD,
      monthlySavingsINR,
      monthlySavingsUSD,
      otaCommissionAvoidedINR,
      otaCommissionAvoidedUSD,
      directRevenueINR,
      directRevenueUSD
    }
  }, [rooms, occupancy, adr, currentDirect, targetDirect, otaCommission, rgPayFee, fxRate])

  // Geography calculations for all regions
  const geographyData = useMemo(() => {
    return Object.entries(REGIONAL_DEFAULTS).map(([region, config]) => {
      const segmentMultiplier = SEGMENT_MULTIPLIERS[hotelSegment] || 1.0
      const conversionRate = 3.2
      
      const revenueAtRisk = config.defaultSessions * (conversionRate / 100) * config.defaultBookingValue * (config.defaultPaymentGap / 100)
      const baseRecovery = revenueAtRisk * (config.defaultRecoveryRate / 100) * segmentMultiplier
      const altPayRecovery = revenueAtRisk * (config.altPayPercent / 100)
      const retryRecoveryAmount = revenueAtRisk * (config.retryPercent / 100)
      const totalAnnualRecovery = (baseRecovery + altPayRecovery + retryRecoveryAmount) * 12
      
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
  }, [hotelSegment])

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
            <Link href="/recovery-calculator" className="text-[#8021FF] font-medium">Revenue Calculator</Link>
            <Link href="/faq" className="hover:text-foreground transition-colors">FAQ</Link>
            <Link href="/" className="hover:text-foreground transition-colors">Demo</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#8021FF]/10 rounded-full mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#8021FF]" />
            <span className="text-xs font-medium text-[#8021FF]">RG Pay</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 text-balance">
            Revenue savings calculator
          </h1>
          <p className="text-muted-foreground max-w-2xl text-pretty">
            Quantify the revenue shift from OTA to direct and the net savings retained through localized checkout
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="executive" className="flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              Executive View
            </TabsTrigger>
            <TabsTrigger value="geography" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Geography View
            </TabsTrigger>
          </TabsList>

          {/* ================================================================ */}
          {/* EXECUTIVE VIEW (V3 Revenue Calculator) */}
          {/* ================================================================ */}
          <TabsContent value="executive" className="mt-8 space-y-8">
            
            {/* TOP INPUT STRIP - Always Visible */}
            <Card className="p-6 border border-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#8021FF]/10 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-[#8021FF]" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Property Inputs</h3>
                  <p className="text-sm text-muted-foreground">Configure your hotel portfolio metrics</p>
                </div>
              </div>
              
              {/* First Row: Property Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Rooms</label>
                  <Input
                    type="number"
                    value={rooms}
                    onChange={(e) => setRooms(Number(e.target.value))}
                    className="h-10"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Occupancy %</label>
                  <Input
                    type="number"
                    value={occupancy}
                    onChange={(e) => setOccupancy(Number(e.target.value))}
                    className="h-10"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">ADR (₹)</label>
                  <Input
                    type="number"
                    value={adr}
                    onChange={(e) => setAdr(Number(e.target.value))}
                    className="h-10"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Current direct %</label>
                  <Input
                    type="number"
                    value={currentDirect}
                    onChange={(e) => setCurrentDirect(Number(e.target.value))}
                    className="h-10"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Target direct %</label>
                  <Input
                    type="number"
                    value={targetDirect}
                    onChange={(e) => setTargetDirect(Number(e.target.value))}
                    className="h-10"
                  />
                </div>
              </div>
              
              {/* Second Row: Commission & FX */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">OTA commission %</label>
                  <Input
                    type="number"
                    value={otaCommission}
                    onChange={(e) => setOtaCommission(Number(e.target.value))}
                    className="h-10"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">RG Pay fee %</label>
                  <Input
                    type="number"
                    value={rgPayFee}
                    onChange={(e) => setRgPayFee(Number(e.target.value))}
                    step="0.1"
                    className="h-10"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">FX rate (USD/INR)</label>
                  <Input
                    type="number"
                    value={fxRate}
                    onChange={(e) => setFxRate(Number(e.target.value))}
                    className="h-10"
                  />
                </div>
              </div>
            </Card>

            {/* HERO STORY BAND - Two cards side by side */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Left Card: Direct Mix Shift */}
              <Card className="p-6 border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-4 h-4 text-[#8021FF]" />
                  <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Direct Mix Shift</span>
                </div>
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-4xl font-bold text-foreground">{currentDirect}%</span>
                  <ArrowRight className="w-6 h-6 text-muted-foreground" />
                  <span className="text-4xl font-bold text-foreground">{targetDirect}%</span>
                </div>
                <p className="text-[#8021FF] font-semibold">+{calculations.shift}% direct capture</p>
              </Card>

              {/* Right Card: Net Savings Model */}
              <Card className="p-6 border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <Percent className="w-4 h-4 text-[#8021FF]" />
                  <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Net Savings Model</span>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">OTA commission</span>
                    <span className="font-medium text-foreground">{otaCommission}.0%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Less RG Pay fee</span>
                    <span className="font-medium text-foreground">−{rgPayFee}%</span>
                  </div>
                </div>
                <div className="pt-3 border-t border-border">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-foreground">Net savings</span>
                    <span className="text-2xl font-bold text-[#8021FF]">{calculations.netSavingsPercent.toFixed(1)}%</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* COMMERCIAL INSIGHT BAND */}
            <Card className="p-5 border-l-4 border-l-[#8021FF] border border-border bg-[#8021FF]/5">
              <p className="text-foreground">
                A <span className="font-semibold text-[#8021FF]">{calculations.shift}-point</span> direct shift delivers{" "}
                <span className="font-semibold text-[#8021FF]">{formatINR(calculations.annualSavingsINR)}</span> in annual net savings while avoiding{" "}
                <span className="font-semibold text-[#8021FF]">{formatINR(calculations.otaCommissionAvoidedINR)}</span> in OTA commissions.
              </p>
            </Card>

            {/* HERO KPI CARD */}
            <Card className="p-8 bg-gradient-to-br from-[#8021FF] to-[#6010DD] text-white">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-white/80" />
                <span className="text-white/80 text-sm font-medium uppercase tracking-wide">Projected Annual Net Savings</span>
              </div>
              <div className="text-5xl md:text-6xl font-bold mb-2">
                {formatINR(calculations.annualSavingsINR)}
              </div>
              <div className="text-xl text-white/80 mb-4">
                {formatUSD(calculations.annualSavingsUSD)}
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-full">
                <span className="text-sm text-white/90">Based on +{calculations.shift}% direct capture</span>
              </div>
            </Card>

            {/* SUPPORTING KPI ROW (3 Cards) */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* OTA Commission Avoided */}
              <Card className="p-6 border border-border">
                <div className="flex items-center gap-2 mb-3">
                  <DollarSign className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-muted-foreground">OTA Commission Avoided</span>
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">
                  {formatINR(calculations.otaCommissionAvoidedINR)}
                </div>
                <div className="text-sm text-muted-foreground">
                  {formatUSD(calculations.otaCommissionAvoidedUSD)}
                </div>
              </Card>

              {/* Direct Revenue Retained */}
              <Card className="p-6 border border-border">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-4 h-4 text-[#8021FF]" />
                  <span className="text-sm text-muted-foreground">Direct Revenue Retained</span>
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">
                  {formatINR(calculations.directRevenueINR)}
                </div>
                <div className="text-sm text-muted-foreground">
                  {formatUSD(calculations.directRevenueUSD)}
                </div>
              </Card>

              {/* Monthly Savings */}
              <Card className="p-6 border border-border">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span className="text-sm text-muted-foreground">Monthly Savings</span>
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">
                  {formatINR(calculations.monthlySavingsINR)}
                </div>
                <div className="text-sm text-muted-foreground">
                  {formatUSD(calculations.monthlySavingsUSD)}
                </div>
              </Card>
            </div>

            {/* COLLAPSIBLE SECTIONS (Default Closed) */}
            <Accordion type="multiple" className="space-y-4">
              <AccordionItem value="checkout" className="border border-border rounded-lg px-6">
                <AccordionTrigger className="text-foreground hover:no-underline">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#8021FF]/10 rounded-lg flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-[#8021FF]" />
                    </div>
                    <span className="font-semibold">Checkout Assumptions</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 pb-6">
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Localized payment methods</span>
                      <span className="font-medium">UPI, Cards, Wallets</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Multi-currency support</span>
                      <span className="font-medium">Enabled</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Checkout conversion lift</span>
                      <span className="font-medium">+15-25%</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Payment failure recovery</span>
                      <span className="font-medium">Retry engine enabled</span>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="revenue" className="border border-border rounded-lg px-6">
                <AccordionTrigger className="text-foreground hover:no-underline">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#8021FF]/10 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-[#8021FF]" />
                    </div>
                    <span className="font-semibold">Revenue & Cost Model</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 pb-6">
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Total Room Nights (Annual)</span>
                      <span className="font-medium">{(rooms * (occupancy / 100) * 365).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Total Revenue (Annual)</span>
                      <span className="font-medium">{formatINR(rooms * (occupancy / 100) * adr * 365)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Current Direct Revenue</span>
                      <span className="font-medium">{formatINR(rooms * (occupancy / 100) * adr * 365 * (currentDirect / 100))}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Target Direct Revenue</span>
                      <span className="font-medium">{formatINR(rooms * (occupancy / 100) * adr * 365 * (targetDirect / 100))}</span>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="output" className="border border-border rounded-lg px-6">
                <AccordionTrigger className="text-foreground hover:no-underline">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#8021FF]/10 rounded-lg flex items-center justify-center">
                      <Calculator className="w-4 h-4 text-[#8021FF]" />
                    </div>
                    <span className="font-semibold">Output / Impact Formulas</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 pb-6">
                  <div className="space-y-3 text-sm font-mono bg-muted/50 p-4 rounded-lg">
                    <p><span className="text-[#8021FF]">shift</span> = target_direct − current_direct = {targetDirect} − {currentDirect} = <span className="font-bold">{calculations.shift}%</span></p>
                    <p><span className="text-[#8021FF]">net_savings%</span> = ota_commission − rgpay_fee = {otaCommission} − {rgPayFee} = <span className="font-bold">{calculations.netSavingsPercent}%</span></p>
                    <p><span className="text-[#8021FF]">annual_savings</span> = rooms × occupancy × ADR × 365 × shift% × net_savings%</p>
                    <p className="pl-4">= {rooms} × {occupancy}% × ₹{adr} × 365 × {calculations.shift}% × {calculations.netSavingsPercent}%</p>
                    <p className="pl-4">= <span className="font-bold">{formatINR(calculations.annualSavingsINR)}</span></p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* BOTTOM CTA PANEL */}
            <Card className="p-6 border border-[#8021FF]/20 bg-gradient-to-r from-[#8021FF]/5 to-transparent">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    Projected annual savings and direct revenue retention from improved checkout conversion.
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Model property-level and portfolio-level savings scenarios
                  </p>
                </div>
                <Button 
                  className="bg-[#8021FF] hover:bg-[#6B1AD6] text-white shrink-0"
                  onClick={() => setActiveTab("geography")}
                >
                  Launch regional market playbook
                  <ArrowUpRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* ================================================================ */}
          {/* GEOGRAPHY VIEW (Preserved from V2) */}
          {/* ================================================================ */}
          <TabsContent value="geography" className="mt-8">
            <div className="space-y-8">
              {/* Region Cards Grid */}
              <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
                {geographyData.map((geo) => (
                  <Card 
                    key={geo.region}
                    className={`p-5 border transition-all cursor-pointer ${
                      selectedRegion === geo.region 
                        ? "border-[#8021FF] ring-2 ring-[#8021FF]/20 bg-[#8021FF]/5" 
                        : "border-border hover:border-[#8021FF]/50"
                    }`}
                    onClick={() => {
                      setSelectedRegion(geo.region)
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
                      <h3 className="font-semibold text-foreground">{selectedRegion} Market Details</h3>
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
              </Card>

              {/* Priority Table */}
              <Card className="p-6 border border-border">
                <h4 className="font-semibold text-foreground mb-4">Regional Priority Ranking</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 font-medium text-muted-foreground">Region</th>
                        <th className="text-left py-3 font-medium text-muted-foreground">Recovery Speed</th>
                        <th className="text-left py-3 font-medium text-muted-foreground">Alt Pay %</th>
                        <th className="text-left py-3 font-medium text-muted-foreground">Primary Method</th>
                        <th className="text-right py-3 font-medium text-muted-foreground">Opportunity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {geographyData.map((geo, idx) => (
                        <tr key={geo.region} className="border-b border-border last:border-0">
                          <td className="py-3 font-medium text-foreground">
                            <span className="text-[#8021FF] mr-2">#{idx + 1}</span>
                            {geo.region}
                          </td>
                          <td className="py-3">
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
                          <td className="py-3 text-foreground">{geo.altPayPercent}%</td>
                          <td className="py-3 text-muted-foreground">{geo.primaryPayment}</td>
                          <td className="py-3 text-right font-semibold text-[#8021FF]">
                            {formatCurrencyRegion(geo.totalAnnualRecovery, geo.region)}
                          </td>
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
