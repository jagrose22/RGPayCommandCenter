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
// REGIONAL MARKET DOSSIER DATA
// ============================================================================
type MarketKey = "india" | "china" | "brazil" | "indonesia"

interface MarketData {
  code: string
  name: string
  tag: string
  tagColor: string
  conversionUpside: string
  tagline: string
  benchmarks: {
    digitalPayment: number
    railShare: number
    railName: string
    mobileBooking: number
    abandonment: number
  }
  heroAmount: string
  heroContext: string
  whyItMatters: string
  paymentRails: Array<{
    name: string
    priority: "Critical" | "High" | "Medium"
    priorityColor: string
    description: string
  }>
  railAdoption: Array<{ name: string; percent: number }>
  hotelsMiss: string[]
  winningLooksLike: {
    features: string[]
    coverageGap: Array<{ metric: string; bestInClass: number; typical: number }>
  }
  rgPayAdvantage: {
    without: string[]
    with: string[]
    callout: string
  }
}

const MARKET_DOSSIER_DATA: Record<MarketKey, MarketData> = {
  india: {
    code: "IN",
    name: "India",
    tag: "High-growth",
    tagColor: "bg-purple-100 text-purple-700",
    conversionUpside: "+18–23% conversion upside",
    tagline: "UPI-first market with strong wallet and affordability expectations",
    benchmarks: {
      digitalPayment: 87,
      railShare: 62,
      railName: "UPI rail share of transactions",
      mobileBooking: 71,
      abandonment: 34
    },
    heroAmount: "$3.8M",
    heroContext: "Based on avg 450-room property at 68% occupancy",
    whyItMatters: "India's outbound and domestic hotel traveler base overwhelmingly prefers UPI and digital wallet checkout. Properties that offer card-only flows encounter friction at the payment step that directly suppresses booking completions. Affordability features like EMI and BNPL have become conversion drivers, not differentiators — properties without them are invisible to a large qualified segment.",
    paymentRails: [
      { name: "UPI", priority: "Critical", priorityColor: "text-red-600", description: "Must-have at checkout" },
      { name: "Wallets (Paytm, PhonePe)", priority: "High", priorityColor: "text-orange-600", description: "Expected, not optional" },
      { name: "Credit / debit card", priority: "Medium", priorityColor: "text-green-600", description: "Supported, not primary" },
      { name: "EMI", priority: "High", priorityColor: "text-orange-600", description: "Conversion driver" },
      { name: "BNPL", priority: "Medium", priorityColor: "text-green-600", description: "Upsell opportunity" }
    ],
    railAdoption: [
      { name: "UPI", percent: 88 },
      { name: "Wallets (Paytm, PhonePe)", percent: 64 },
      { name: "Credit / debit card", percent: 38 },
      { name: "EMI", percent: 52 },
      { name: "BNPL", percent: 29 }
    ],
    hotelsMiss: [
      "No UPI support",
      "Poor wallet coverage",
      "No EMI / affordability",
      "Slow payment handoff",
      "Missing local rails",
      "Card-only checkout"
    ],
    winningLooksLike: {
      features: [
        "Full UPI coverage",
        "Wallet support (Paytm, PhonePe)",
        "EMI / affordability options",
        "Localized payment rails",
        "Fast confirmation flow",
        "Rupee-native pricing"
      ],
      coverageGap: [
        { metric: "UPI coverage", bestInClass: 92, typical: 18 },
        { metric: "Wallet support", bestInClass: 78, typical: 12 },
        { metric: "EMI availability", bestInClass: 70, typical: 8 },
        { metric: "Affordability options", bestInClass: 65, typical: 5 }
      ]
    },
    rgPayAdvantage: {
      without: [
        "4 local vendor contracts",
        "4 mapping/integration efforts",
        "4 compliance workflows",
        "Ongoing maintenance per rail"
      ],
      with: [
        "1 contract",
        "1 integration",
        "Full India rail coverage",
        "Compliance handled centrally"
      ],
      callout: "One contract. One integration. Full India coverage — with RG Pay handling compliance, mapping, and ongoing maintenance across all local rails."
    }
  },
  china: {
    code: "CN",
    name: "China",
    tag: "Super-app dominant",
    tagColor: "bg-blue-100 text-blue-700",
    conversionUpside: "+22–28% conversion upside",
    tagline: "Super-app ecosystem where Alipay and WeChat Pay are non-negotiable",
    benchmarks: {
      digitalPayment: 94,
      railShare: 78,
      railName: "Super-app share of transactions",
      mobileBooking: 86,
      abandonment: 41
    },
    heroAmount: "$5.1M",
    heroContext: "Based on avg 450-room property at 68% occupancy",
    whyItMatters: "Chinese travelers expect seamless Alipay and WeChat Pay integration at every touchpoint. Properties without super-app support are essentially invisible to this high-value segment. Cross-border payment capabilities and UnionPay acceptance are baseline requirements, not competitive advantages.",
    paymentRails: [
      { name: "Alipay", priority: "Critical", priorityColor: "text-red-600", description: "Non-negotiable for Chinese guests" },
      { name: "WeChat Pay", priority: "Critical", priorityColor: "text-red-600", description: "Expected everywhere" },
      { name: "UnionPay", priority: "High", priorityColor: "text-orange-600", description: "Card backup required" },
      { name: "Credit card", priority: "Medium", priorityColor: "text-green-600", description: "Secondary option" },
      { name: "Cross-border QR", priority: "High", priorityColor: "text-orange-600", description: "Outbound essential" }
    ],
    railAdoption: [
      { name: "Alipay", percent: 82 },
      { name: "WeChat Pay", percent: 79 },
      { name: "UnionPay", percent: 56 },
      { name: "Credit card", percent: 34 },
      { name: "Cross-border QR", percent: 61 }
    ],
    hotelsMiss: [
      "No Alipay support",
      "Missing WeChat Pay",
      "No UnionPay acceptance",
      "USD-only pricing",
      "No cross-border QR",
      "Slow settlement"
    ],
    winningLooksLike: {
      features: [
        "Full Alipay integration",
        "WeChat Pay native",
        "UnionPay acceptance",
        "RMB pricing display",
        "Cross-border QR codes",
        "Instant confirmation"
      ],
      coverageGap: [
        { metric: "Alipay coverage", bestInClass: 95, typical: 22 },
        { metric: "WeChat Pay", bestInClass: 92, typical: 18 },
        { metric: "UnionPay", bestInClass: 85, typical: 35 },
        { metric: "Cross-border QR", bestInClass: 78, typical: 12 }
      ]
    },
    rgPayAdvantage: {
      without: [
        "Separate Alipay contract",
        "WeChat Pay integration",
        "UnionPay gateway setup",
        "Cross-border compliance"
      ],
      with: [
        "1 contract",
        "1 integration",
        "Full China coverage",
        "Cross-border handled"
      ],
      callout: "One contract. One integration. Full China super-app coverage — with RG Pay handling cross-border compliance and settlement across all rails."
    }
  },
  brazil: {
    code: "BR",
    name: "Brazil",
    tag: "Installment-first",
    tagColor: "bg-green-100 text-green-700",
    conversionUpside: "+15–20% conversion upside",
    tagline: "Pix-dominant market with strong installment (parcelado) culture",
    benchmarks: {
      digitalPayment: 79,
      railShare: 71,
      railName: "Pix share of transactions",
      mobileBooking: 64,
      abandonment: 38
    },
    heroAmount: "$2.9M",
    heroContext: "Based on avg 450-room property at 68% occupancy",
    whyItMatters: "Brazilian consumers expect Pix as the default payment option — it's instant, free, and ubiquitous. The installment culture (parcelado) means properties without 6-12 month payment plans lose bookings to OTAs that offer them. Boleto remains relevant for cash-preferred segments.",
    paymentRails: [
      { name: "Pix", priority: "Critical", priorityColor: "text-red-600", description: "Default payment method" },
      { name: "Credit card (parcelado)", priority: "Critical", priorityColor: "text-red-600", description: "Installments expected" },
      { name: "Boleto", priority: "Medium", priorityColor: "text-green-600", description: "Cash segment coverage" },
      { name: "Debit card", priority: "Medium", priorityColor: "text-green-600", description: "Growing adoption" },
      { name: "Digital wallets", priority: "High", priorityColor: "text-orange-600", description: "Mercado Pago, PicPay" }
    ],
    railAdoption: [
      { name: "Pix", percent: 85 },
      { name: "Credit card (parcelado)", percent: 72 },
      { name: "Boleto", percent: 31 },
      { name: "Debit card", percent: 44 },
      { name: "Digital wallets", percent: 38 }
    ],
    hotelsMiss: [
      "No Pix support",
      "No installment options",
      "Missing Boleto",
      "USD-only pricing",
      "No local wallets",
      "Single payment only"
    ],
    winningLooksLike: {
      features: [
        "Full Pix integration",
        "6-12 month parcelado",
        "Boleto generation",
        "BRL-native pricing",
        "Mercado Pago support",
        "Instant Pix confirmation"
      ],
      coverageGap: [
        { metric: "Pix coverage", bestInClass: 94, typical: 25 },
        { metric: "Parcelado options", bestInClass: 88, typical: 15 },
        { metric: "Boleto support", bestInClass: 72, typical: 8 },
        { metric: "Local wallets", bestInClass: 65, typical: 10 }
      ]
    },
    rgPayAdvantage: {
      without: [
        "Pix gateway contract",
        "Parcelado acquirer setup",
        "Boleto integration",
        "BRL settlement complexity"
      ],
      with: [
        "1 contract",
        "1 integration",
        "Full Brazil coverage",
        "BRL settlement included"
      ],
      callout: "One contract. One integration. Full Brazil coverage — with RG Pay handling Pix, parcelado, and Boleto across all properties."
    }
  },
  indonesia: {
    code: "ID",
    name: "Indonesia",
    tag: "Emerging digital",
    tagColor: "bg-amber-100 text-amber-700",
    conversionUpside: "+12–17% conversion upside",
    tagline: "Fast-growing digital payments with strong e-wallet adoption",
    benchmarks: {
      digitalPayment: 68,
      railShare: 54,
      railName: "E-wallet share of transactions",
      mobileBooking: 72,
      abandonment: 42
    },
    heroAmount: "$2.1M",
    heroContext: "Based on avg 450-room property at 68% occupancy",
    whyItMatters: "Indonesia's payment landscape is fragmenting across GoPay, OVO, Dana, and ShopeePay. Properties that support only cards miss the majority of domestic travelers. Bank transfer (virtual account) remains critical for higher-value bookings where travelers prefer traditional rails.",
    paymentRails: [
      { name: "GoPay", priority: "Critical", priorityColor: "text-red-600", description: "Largest e-wallet" },
      { name: "OVO", priority: "High", priorityColor: "text-orange-600", description: "Strong retail presence" },
      { name: "Dana", priority: "High", priorityColor: "text-orange-600", description: "Growing adoption" },
      { name: "Virtual Account", priority: "High", priorityColor: "text-orange-600", description: "Bank transfer coverage" },
      { name: "Credit card", priority: "Medium", priorityColor: "text-green-600", description: "International guests" }
    ],
    railAdoption: [
      { name: "GoPay", percent: 62 },
      { name: "OVO", percent: 58 },
      { name: "Dana", percent: 45 },
      { name: "Virtual Account", percent: 52 },
      { name: "Credit card", percent: 28 }
    ],
    hotelsMiss: [
      "No GoPay support",
      "Missing OVO/Dana",
      "No virtual account",
      "USD-only pricing",
      "Card-only checkout",
      "Slow confirmation"
    ],
    winningLooksLike: {
      features: [
        "Full GoPay integration",
        "OVO and Dana support",
        "Virtual Account coverage",
        "IDR-native pricing",
        "ShopeePay acceptance",
        "Instant confirmation"
      ],
      coverageGap: [
        { metric: "GoPay coverage", bestInClass: 85, typical: 15 },
        { metric: "OVO support", bestInClass: 80, typical: 12 },
        { metric: "Virtual Account", bestInClass: 75, typical: 20 },
        { metric: "Multi-wallet", bestInClass: 70, typical: 8 }
      ]
    },
    rgPayAdvantage: {
      without: [
        "GoPay contract",
        "OVO integration",
        "Dana setup",
        "VA bank connections"
      ],
      with: [
        "1 contract",
        "1 integration",
        "Full Indonesia coverage",
        "All e-wallets included"
      ],
      callout: "One contract. One integration. Full Indonesia coverage — with RG Pay handling GoPay, OVO, Dana, and virtual accounts across all properties."
    }
  }
}

// ============================================================================
// REGIONAL MARKET DOSSIER COMPONENT
// ============================================================================
function RegionalMarketDossier() {
  const [selectedMarket, setSelectedMarket] = useState<MarketKey>("india")
  const [activeSection, setActiveSection] = useState("why")
  
  const market = MARKET_DOSSIER_DATA[selectedMarket]
  const markets: MarketKey[] = ["india", "china", "brazil", "indonesia"]
  
  const sectionTabs = [
    { id: "why", label: "Why it matters" },
    { id: "rails", label: "Payment rails" },
    { id: "miss", label: "What hotels miss" },
    { id: "winning", label: "What winning looks like" },
    { id: "advantage", label: "RG Pay advantage" }
  ]

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-[#8021FF] rounded-xl p-6 flex items-center justify-between">
        <div className="text-white">
          <p className="text-lg font-semibold">One global contract. Four high-growth markets.</p>
          <p className="text-white/80">Localized checkout confidence everywhere.</p>
        </div>
        <span className="px-4 py-2 bg-white/20 rounded-full text-white text-sm font-medium">
          Market intelligence layer
        </span>
      </div>

      {/* Main Layout: Sidebar + Content */}
      <div className="flex gap-6">
        {/* Left Sidebar - Market Selection */}
        <div className="w-56 shrink-0">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">Select Market</p>
          <div className="space-y-2">
            {markets.map((key) => {
              const m = MARKET_DOSSIER_DATA[key]
              const isSelected = selectedMarket === key
              return (
                <button
                  key={key}
                  onClick={() => setSelectedMarket(key)}
                  className={`w-full text-left p-4 rounded-lg border transition-all duration-150 ${
                    isSelected 
                      ? "border-[#8021FF] bg-[#8021FF]/5 shadow-sm" 
                      : "border-border hover:border-[#8021FF]/50 hover:bg-[#8021FF]/5"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-muted-foreground">{m.code}</span>
                    <span className="font-semibold text-foreground">{m.name}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${m.tagColor}`}>
                    {m.tag}
                  </span>
                  <p className="text-xs text-[#8021FF] font-medium mt-2">{m.conversionUpside}</p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 space-y-6">
          {/* Market Header */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-sm font-mono text-muted-foreground">{market.code}</span>
              <h2 className="text-2xl font-bold text-foreground">{market.name}</h2>
            </div>
            <p className="text-muted-foreground">{market.tagline}</p>
          </div>

          {/* Benchmark Tiles */}
          <div className="grid grid-cols-4 gap-4">
            <Card className="p-4 border border-border bg-muted/30">
              <p className="text-3xl font-bold text-foreground mb-1">{market.benchmarks.digitalPayment}%</p>
              <p className="text-xs text-muted-foreground">Digital payment adoption</p>
            </Card>
            <Card className="p-4 border border-border bg-muted/30">
              <p className="text-3xl font-bold text-foreground mb-1">{market.benchmarks.railShare}%</p>
              <p className="text-xs text-muted-foreground">{market.benchmarks.railName}</p>
            </Card>
            <Card className="p-4 border border-border bg-muted/30">
              <p className="text-3xl font-bold text-foreground mb-1">{market.benchmarks.mobileBooking}%</p>
              <p className="text-xs text-muted-foreground">Mobile-first booking share</p>
            </Card>
            <Card className="p-4 border border-border bg-muted/30">
              <p className="text-3xl font-bold text-foreground mb-1">{market.benchmarks.abandonment}%</p>
              <p className="text-xs text-muted-foreground">Checkout abandonment benchmark</p>
            </Card>
          </div>

          {/* Hero Commercial Card */}
          <Card className="p-6 border border-border bg-[#8021FF]/5">
            <div className="flex items-baseline gap-4">
              <div>
                <p className="text-4xl font-bold text-[#8021FF]">{market.heroAmount}</p>
                <p className="text-sm text-muted-foreground mt-1">Annual direct revenue opportunity at full rail coverage</p>
              </div>
              <p className="text-xs text-muted-foreground italic ml-auto">{market.heroContext}</p>
            </div>
          </Card>

          {/* Section Indicator */}
          <div className="w-1 h-6 bg-[#8021FF] rounded-full" />

          {/* Section Tabs */}
          <div className="flex gap-2 border-b border-border pb-0">
            {sectionTabs.map((tab) => {
              const isActive = activeSection === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id)}
                  className={`px-4 py-3 text-sm font-medium transition-all duration-150 rounded-t-lg border-b-2 -mb-px ${
                    isActive 
                      ? "bg-[#8021FF]/10 border-[#8021FF] text-foreground font-semibold shadow-sm" 
                      : "border-transparent text-muted-foreground hover:bg-[#8021FF]/5 hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Section Content */}
          <div className="min-h-[300px]">
            {/* Why It Matters */}
            {activeSection === "why" && (
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                  Section 1 — Why this market matters
                </p>
                <Card className="p-6 border border-border">
                  <p className="text-foreground leading-relaxed">{market.whyItMatters}</p>
                </Card>
              </div>
            )}

            {/* Payment Rails */}
            {activeSection === "rails" && (
              <div className="space-y-6">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Section 2 — Local payment expectations
                </p>
                
                {/* Rail Priority Cards */}
                <div className="grid grid-cols-5 gap-3">
                  {market.paymentRails.map((rail) => (
                    <Card key={rail.name} className="p-4 border border-border text-center">
                      <p className="font-semibold text-foreground text-sm mb-1">{rail.name}</p>
                      <p className={`text-xs font-medium ${rail.priorityColor}`}>{rail.priority}</p>
                      <p className="text-xs text-muted-foreground mt-2">{rail.description}</p>
                    </Card>
                  ))}
                </div>

                {/* Rail Adoption Chart */}
                <Card className="p-6 border border-border">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-4">
                    Payment rail adoption benchmark
                  </p>
                  <div className="space-y-4">
                    {market.railAdoption.map((rail) => (
                      <div key={rail.name} className="flex items-center gap-4">
                        <span className="text-sm text-foreground w-40 shrink-0">{rail.name}</span>
                        <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#8021FF] rounded-full transition-all duration-500"
                            style={{ width: `${rail.percent}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-foreground w-12 text-right">{rail.percent}%</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {/* What Hotels Miss */}
            {activeSection === "miss" && (
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                  Section 3 — What hotels often miss
                </p>
                <Card className="p-6 border border-border">
                  <div className="grid grid-cols-2 gap-4">
                    {market.hotelsMiss.map((item) => (
                      <div key={item} className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                        <span className="text-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {/* What Winning Looks Like */}
            {activeSection === "winning" && (
              <div className="space-y-6">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Section 4 — What winning looks like
                </p>
                
                <Card className="p-6 border border-border">
                  <p className="text-sm text-muted-foreground mb-4">Best-in-class checkout in {market.name} includes:</p>
                  <div className="flex flex-wrap gap-2">
                    {market.winningLooksLike.features.map((feature) => (
                      <span key={feature} className="px-3 py-1.5 bg-muted rounded-full text-sm text-foreground border border-border">
                        {feature}
                      </span>
                    ))}
                  </div>
                </Card>

                {/* Coverage Gap Chart */}
                <Card className="p-6 border border-border">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-4">
                    Gold standard vs. typical hotel — coverage gap
                  </p>
                  <div className="space-y-6">
                    {market.winningLooksLike.coverageGap.map((item) => (
                      <div key={item.metric}>
                        <p className="text-sm font-medium text-foreground mb-2">{item.metric}</p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-muted-foreground w-16">Best-in-class</span>
                            <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-green-500 rounded-full"
                                style={{ width: `${item.bestInClass}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium text-foreground w-10 text-right">{item.bestInClass}%</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-muted-foreground w-16">Typical hotel</span>
                            <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-red-500 rounded-full"
                                style={{ width: `${item.typical}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium text-foreground w-10 text-right">{item.typical}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {/* RG Pay Advantage */}
            {activeSection === "advantage" && (
              <div className="space-y-6">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Section 5 — RG Pay advantage
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  {/* Without RG Pay */}
                  <Card className="p-6 border border-border bg-red-50">
                    <p className="text-sm font-semibold text-red-700 uppercase tracking-wide mb-4">Without RG Pay</p>
                    <div className="space-y-3">
                      {market.rgPayAdvantage.without.map((item) => (
                        <div key={item} className="flex items-start gap-2">
                          <span className="text-muted-foreground">—</span>
                          <span className="text-foreground text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* With RG Pay */}
                  <Card className="p-6 border border-border bg-green-50">
                    <p className="text-sm font-semibold text-green-700 uppercase tracking-wide mb-4">With RG Pay</p>
                    <div className="space-y-3">
                      {market.rgPayAdvantage.with.map((item) => (
                        <div key={item} className="flex items-start gap-2">
                          <span className="text-green-600">+</span>
                          <span className="text-foreground text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>

                {/* Callout */}
                <Card className="p-5 border-l-4 border-l-[#8021FF] border border-border bg-[#8021FF]/5">
                  <p className="text-foreground">{market.rgPayAdvantage.callout}</p>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// DEMAND AUDIT DATA
// ============================================================================
type DemandTerritoryKey = "india" | "indonesia" | "china" | "brazil"

interface OTAData {
  name: string
  rails: number[]  // [Banks, UPI/SuperApp, Wallets, APM, BNPL, Crypto, Local Credit]
}

interface TerritoryBenchmark {
  name: string
  code: string
  railLabels: string[]
  gold: number[]      // Gold standard benchmark
  average: number[]   // Market average
  otas: OTAData[]     // OTA-specific data
  riskCallout: string // Territory-specific risk statement
}

const DEMAND_AUDIT_DATA: Record<DemandTerritoryKey, TerritoryBenchmark> = {
  india: {
    name: "India",
    code: "IN",
    railLabels: ["Banks", "UPI Apps", "Wallets", "APM", "BNPL", "Crypto", "Local Credit"],
    gold: [5, 5, 50, 10, 20, 2, 3],
    average: [4, 4, 35, 6, 12, 1, 2],
    otas: [
      { name: "MakeMyTrip", rails: [4, 3, 28, 5, 8, 0, 1] },
      { name: "Goibibo", rails: [4, 3, 25, 4, 6, 0, 1] },
      { name: "EaseMyTrip", rails: [3, 2, 18, 3, 4, 0, 0] },
      { name: "Yatra", rails: [3, 2, 15, 3, 5, 0, 1] }
    ],
    riskCallout: "MakeMyTrip trails gold standard by 22 wallet providers and 12 BNPL options — a direct conversion gap for UPI-native travelers."
  },
  indonesia: {
    name: "Indonesia",
    code: "ID",
    railLabels: ["Banks", "E-Wallets", "VA Transfer", "APM", "BNPL", "Crypto", "Local Credit"],
    gold: [8, 6, 45, 8, 15, 1, 4],
    average: [6, 4, 30, 5, 8, 0, 2],
    otas: [
      { name: "Traveloka", rails: [6, 5, 32, 5, 10, 0, 2] },
      { name: "Tiket.com", rails: [5, 4, 25, 4, 7, 0, 1] },
      { name: "PegiPegi", rails: [4, 3, 20, 3, 5, 0, 1] }
    ],
    riskCallout: "Traveloka missing 13 VA bank connections and 5 BNPL providers vs. gold standard — high-value travelers defaulting to direct bank transfer."
  },
  china: {
    name: "China",
    code: "CN",
    railLabels: ["Banks", "Alipay/WeChat", "Wallets", "APM", "BNPL", "Crypto", "Local Credit"],
    gold: [6, 4, 40, 12, 18, 0, 5],
    average: [5, 3, 28, 8, 10, 0, 3],
    otas: [
      { name: "Ctrip", rails: [5, 4, 30, 8, 12, 0, 3] },
      { name: "Fliggy", rails: [5, 3, 25, 6, 8, 0, 2] },
      { name: "Qunar", rails: [4, 3, 22, 5, 6, 0, 2] },
      { name: "Meituan", rails: [5, 4, 28, 7, 10, 0, 2] }
    ],
    riskCallout: "Ctrip missing 10 wallet integrations and 6 BNPL options — super-app travelers expect complete coverage at checkout."
  },
  brazil: {
    name: "Brazil",
    code: "BR",
    railLabels: ["Banks", "Pix Apps", "Wallets", "APM", "BNPL", "Crypto", "Parcelado"],
    gold: [7, 5, 35, 10, 16, 2, 6],
    average: [5, 4, 22, 6, 10, 1, 4],
    otas: [
      { name: "Decolar", rails: [5, 4, 20, 5, 8, 0, 4] },
      { name: "Submarino Viagens", rails: [4, 3, 15, 4, 6, 0, 3] },
      { name: "Hotel Urbano", rails: [4, 3, 18, 4, 7, 0, 3] }
    ],
    riskCallout: "Decolar trails gold standard by 15 wallet providers and 8 BNPL options — parcelado-first travelers abandoning at payment."
  }
}

// ============================================================================
// DEMAND AUDIT COMPONENT
// ============================================================================
interface DemandAuditProps {
  onSwitchToExecutive: () => void
}

function DemandAudit({ onSwitchToExecutive }: DemandAuditProps) {
  const [selectedTerritory, setSelectedTerritory] = useState<DemandTerritoryKey>("india")
  const [selectedOTA, setSelectedOTA] = useState<string>("")
  
  const territory = DEMAND_AUDIT_DATA[selectedTerritory]
  const territories: DemandTerritoryKey[] = ["india", "indonesia", "china", "brazil"]
  
  // Set default OTA when territory changes
  const currentOTA = territory.otas.find(o => o.name === selectedOTA) || territory.otas[0]
  
  // Calculate gaps
  const gaps = territory.gold.map((goldVal, idx) => ({
    rail: territory.railLabels[idx],
    gold: goldVal,
    average: territory.average[idx],
    ota: currentOTA.rails[idx],
    gapFromGold: goldVal - currentOTA.rails[idx],
    gapFromAverage: territory.average[idx] - currentOTA.rails[idx]
  }))
  
  // Find critical gaps (>5 providers behind gold)
  const criticalGaps = gaps.filter(g => g.gapFromGold > 5)
  
  // Calculate totals
  const totalGold = territory.gold.reduce((a, b) => a + b, 0)
  const totalOTA = currentOTA.rails.reduce((a, b) => a + b, 0)
  const totalGap = totalGold - totalOTA
  const gapPercentage = Math.round((totalGap / totalGold) * 100)

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-6 flex items-center justify-between">
        <div className="text-white">
          <p className="text-lg font-semibold">Demand-Side Payment Audit</p>
          <p className="text-white/80">Where OTAs lag. Which rails are missing. How far behind gold standard.</p>
        </div>
        <span className="px-4 py-2 bg-white/20 rounded-full text-white text-sm font-medium">
          Competitive intelligence
        </span>
      </div>

      {/* Territory + OTA Selection */}
      <div className="flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Select Territory</label>
          <div className="flex gap-2">
            {territories.map((key) => {
              const t = DEMAND_AUDIT_DATA[key]
              const isSelected = selectedTerritory === key
              return (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedTerritory(key)
                    setSelectedOTA("")
                  }}
                  className={`px-4 py-2 rounded-lg border font-medium transition-all ${
                    isSelected 
                      ? "bg-[#8021FF] text-white border-[#8021FF]" 
                      : "bg-card border-border text-foreground hover:border-[#8021FF]/50"
                  }`}
                >
                  {t.code} {t.name}
                </button>
              )
            })}
          </div>
        </div>
        
        <div className="min-w-[200px]">
          <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Select OTA</label>
          <select
            value={selectedOTA || currentOTA.name}
            onChange={(e) => setSelectedOTA(e.target.value)}
            className="w-full h-10 px-3 rounded-lg border border-border bg-card text-foreground"
          >
            {territory.otas.map((ota) => (
              <option key={ota.name} value={ota.name}>{ota.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Gap Summary Hero */}
      <Card className="p-6 border-l-4 border-l-red-500 bg-red-50 dark:bg-red-950/20">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-red-600 uppercase tracking-wide mb-1">Coverage Gap vs Gold Standard</p>
            <p className="text-3xl font-bold text-red-700">{totalGap} providers missing</p>
            <p className="text-sm text-red-600/80 mt-1">{currentOTA.name} covers {totalOTA} of {totalGold} gold-standard providers ({gapPercentage}% gap)</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{totalGold}</p>
              <p className="text-xs text-muted-foreground">Gold Standard</p>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground" />
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{totalOTA}</p>
              <p className="text-xs text-muted-foreground">{currentOTA.name}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Benchmark Comparison Table */}
      <Card className="border border-border overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/30">
          <h3 className="font-semibold text-foreground">Rail Coverage Comparison — {territory.name}</h3>
          <p className="text-sm text-muted-foreground">Number of supported providers per payment rail</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Payment Rail</th>
                <th className="text-center py-3 px-4 font-medium text-green-600">Gold Standard</th>
                <th className="text-center py-3 px-4 font-medium text-amber-600">Market Avg</th>
                <th className="text-center py-3 px-4 font-medium text-foreground">{currentOTA.name}</th>
                <th className="text-center py-3 px-4 font-medium text-red-600">Gap</th>
              </tr>
            </thead>
            <tbody>
              {gaps.map((row, idx) => (
                <tr key={row.rail} className={`border-b border-border ${idx % 2 === 0 ? "bg-card" : "bg-muted/10"}`}>
                  <td className="py-3 px-4 font-medium text-foreground">{row.rail}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center justify-center w-10 h-8 rounded bg-green-100 text-green-700 font-semibold">
                      {row.gold}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center justify-center w-10 h-8 rounded bg-amber-100 text-amber-700 font-semibold">
                      {row.average}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-flex items-center justify-center w-10 h-8 rounded font-semibold ${
                      row.gapFromGold > 5 ? "bg-red-100 text-red-700" : "bg-gray-100 text-foreground"
                    }`}>
                      {row.ota}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {row.gapFromGold > 0 ? (
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        row.gapFromGold > 5 ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                      }`}>
                        -{row.gapFromGold}
                      </span>
                    ) : (
                      <span className="text-green-600 font-medium">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Critical Gap Callouts */}
      {criticalGaps.length > 0 && (
        <Card className="p-6 border border-border">
          <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full" />
            Critical Coverage Gaps
          </h4>
          <div className="grid md:grid-cols-2 gap-4">
            {criticalGaps.map((gap) => (
              <div key={gap.rail} className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-900">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-foreground">{gap.rail}</span>
                  <span className="text-red-600 font-bold">-{gap.gapFromGold} providers</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-red-500 rounded-full"
                      style={{ width: `${(gap.ota / gap.gold) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">{gap.ota}/{gap.gold}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Commercial Risk Callout */}
      <Card className="p-6 border-l-4 border-l-[#8021FF] bg-[#8021FF]/5">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-[#8021FF] rounded-lg flex items-center justify-center shrink-0">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-foreground mb-1">Commercial Risk Insight</p>
            <p className="text-foreground">{territory.riskCallout}</p>
          </div>
        </div>
      </Card>

      {/* CTA Panel */}
      <Card className="relative overflow-hidden p-8 border-2 border-[#8021FF]/30 bg-gradient-to-r from-[#8021FF]/10 via-[#8021FF]/5 to-transparent">
        <div className="absolute top-0 right-0 w-64 h-32 bg-[#8021FF]/10 rounded-full blur-3xl -mr-32" />
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              See How RG Pay Closes This Gap
            </h3>
            <p className="text-muted-foreground">
              Calculate the revenue impact of full rail coverage with RG Pay
            </p>
          </div>
          <Button 
            size="lg"
            className="bg-[#8021FF] hover:bg-[#6B1AD6] text-white shrink-0 shadow-lg shadow-[#8021FF]/25 transition-all hover:shadow-xl hover:shadow-[#8021FF]/30"
            onClick={onSwitchToExecutive}
          >
            Open Revenue Calculator
            <ArrowUpRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </Card>
    </div>
  )
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
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#8021FF]/10 rounded-full mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#8021FF]" />
            <span className="text-xs font-medium text-[#8021FF]">RG Pay Revenue Calculator</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 text-balance">
            Direct booking savings model
          </h1>
          <p className="text-muted-foreground max-w-2xl text-pretty">
            Quantify the revenue shift from OTA to direct and the net savings retained through localized checkout
          </p>
        </div>

        {/* COMPACT KPI STRIP - Executive Summary */}
        <div className="mb-8 px-6 py-4 rounded-xl bg-muted/50 border border-border">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Direct Shift</span>
                <span className="text-lg font-bold text-[#8021FF]">+{calculations.shift}%</span>
              </div>
              <div className="w-px h-6 bg-border" />
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Net Margin</span>
                <span className="text-lg font-bold text-green-600">{calculations.netSavingsPercent.toFixed(1)}%</span>
              </div>
              <div className="w-px h-6 bg-border hidden sm:block" />
              <div className="flex items-center gap-2 hidden sm:flex">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Monthly</span>
                <span className="text-lg font-bold text-foreground">{formatINR(calculations.monthlySavingsINR)}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Annual</span>
              <span className="text-lg font-bold text-foreground">{formatINR(calculations.annualSavingsINR)}</span>
            </div>
          </div>
        </div>

        {/* Tabs - Enhanced Visibility */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full max-w-2xl grid-cols-3 h-12 p-1 bg-muted/80 border border-border shadow-sm">
            <TabsTrigger 
              value="executive" 
              className="flex items-center gap-2 h-10 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:border data-[state=active]:border-[#8021FF]/30 data-[state=active]:text-[#8021FF] font-medium transition-all"
            >
              <Calculator className="w-4 h-4" />
              Executive View
            </TabsTrigger>
            <TabsTrigger 
              value="geography" 
              className="flex items-center gap-2 h-10 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:border data-[state=active]:border-[#8021FF]/30 data-[state=active]:text-[#8021FF] font-medium transition-all"
            >
              <Globe className="w-4 h-4" />
              Regional Dossier
            </TabsTrigger>
            <TabsTrigger 
              value="demand" 
              className="flex items-center gap-2 h-10 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:border data-[state=active]:border-[#8021FF]/30 data-[state=active]:text-[#8021FF] font-medium transition-all"
            >
              <Target className="w-4 h-4" />
              Demand Audit
            </TabsTrigger>
          </TabsList>

          {/* ================================================================ */}
          {/* EXECUTIVE VIEW (V3 Revenue Calculator) */}
          {/* ================================================================ */}
          <TabsContent value="executive" className="mt-8 space-y-8">
            
            {/* TOP INPUT STRIP - Premium Styled */}
            <Card className="p-6 border-t-4 border-t-[#8021FF] border border-border shadow-lg bg-card">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#8021FF] rounded-lg flex items-center justify-center shadow-md">
                  <Building2 className="w-5 h-5 text-white" />
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

              {/* Right Card: Net Savings Model - Premium */}
              <Card className="p-6 border border-border border-t-4 border-t-[#8021FF] shadow-sm">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 bg-[#8021FF]/10 rounded-lg flex items-center justify-center">
                    <Percent className="w-4 h-4 text-[#8021FF]" />
                  </div>
                  <span className="text-sm font-semibold text-foreground uppercase tracking-wide">Net Savings Model</span>
                </div>
                <div className="space-y-3 mb-5">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-muted-foreground">OTA commission</span>
                    <span className="font-semibold text-foreground text-lg">{otaCommission}.0%</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-muted-foreground">Less RG Pay fee</span>
                    <span className="font-semibold text-red-500 text-lg">−{rgPayFee}%</span>
                  </div>
                </div>
                <div className="pt-4 border-t-2 border-[#8021FF]/20 bg-[#8021FF]/5 -mx-6 px-6 -mb-6 pb-6 rounded-b-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-foreground">Net savings</span>
                    <span className="text-3xl font-bold text-[#8021FF]">{calculations.netSavingsPercent.toFixed(1)}%</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* COMMERCIAL INSIGHT BAND - Story-driven */}
            <div className="relative p-6 rounded-xl bg-gradient-to-r from-[#8021FF]/10 to-[#8021FF]/5 border border-[#8021FF]/20 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#8021FF]/10 rounded-full blur-3xl -mr-16 -mt-16" />
              <div className="relative">
                <p className="text-xs font-medium text-[#8021FF] uppercase tracking-wide mb-2">Commercial Impact</p>
                <p className="text-lg text-foreground leading-relaxed">
                  <span className="font-bold text-[#8021FF]">+{calculations.shift}% direct capture</span>
                  <span className="mx-2 text-muted-foreground">→</span>
                  <span className="font-bold text-green-600">{formatINR(calculations.otaCommissionAvoidedINR)}</span>
                  <span className="text-muted-foreground"> OTA commission avoided</span>
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Net savings of {formatINR(calculations.annualSavingsINR)} annually after RG Pay processing fees
                </p>
              </div>
            </div>

            {/* HERO KPI CARD - Premium Gradient */}
            <Card className="relative overflow-hidden p-8 bg-gradient-to-br from-[#8021FF] via-[#6B1AD6] to-[#4A0FB0] text-white shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl -ml-24 -mb-24" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white/90 text-sm font-medium uppercase tracking-wide">Projected Annual Net Savings</span>
                </div>
                <div className="text-5xl md:text-6xl font-bold mb-2 tracking-tight">
                  {formatINR(calculations.annualSavingsINR)}
                </div>
                <div className="text-xl text-white/70 mb-6">
                  {formatUSD(calculations.annualSavingsUSD)}
                </div>
                <div className="flex flex-wrap gap-3">
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm font-medium">
                    <TrendingUp className="w-4 h-4" />
                    +{calculations.shift}% direct capture
                  </span>
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/30 rounded-full text-sm font-medium">
                    {calculations.netSavingsPercent.toFixed(1)}% net margin
                  </span>
                </div>
              </div>
            </Card>

            {/* SUPPORTING KPI ROW (3 Cards) - Color-coded */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* OTA Commission Avoided - Green accent */}
              <Card className="p-6 border border-border bg-gradient-to-br from-green-50 to-transparent dark:from-green-950/20">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">OTA Commission Avoided</span>
                </div>
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {formatINR(calculations.otaCommissionAvoidedINR)}
                </div>
                <div className="text-sm text-muted-foreground">
                  {formatUSD(calculations.otaCommissionAvoidedUSD)}
                </div>
              </Card>

              {/* Direct Revenue Retained - Purple accent */}
              <Card className="p-6 border border-border bg-gradient-to-br from-[#8021FF]/5 to-transparent">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-[#8021FF]/10 rounded-lg flex items-center justify-center">
                    <Target className="w-4 h-4 text-[#8021FF]" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">Direct Revenue Retained</span>
                </div>
                <div className="text-2xl font-bold text-[#8021FF] mb-1">
                  {formatINR(calculations.directRevenueINR)}
                </div>
                <div className="text-sm text-muted-foreground">
                  {formatUSD(calculations.directRevenueUSD)}
                </div>
              </Card>

              {/* Monthly Savings - Amber accent */}
              <Card className="p-6 border border-border bg-gradient-to-br from-amber-50 to-transparent dark:from-amber-950/20">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                    <Clock className="w-4 h-4 text-amber-600" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">Monthly Savings</span>
                </div>
                <div className="text-2xl font-bold text-amber-600 mb-1">
                  {formatINR(calculations.monthlySavingsINR)}
                </div>
                <div className="text-sm text-muted-foreground">
                  {formatUSD(calculations.monthlySavingsUSD)}
                </div>
              </Card>
            </div>

            {/* COLLAPSIBLE SECTIONS (Default Closed) - Polished */}
            <Accordion type="multiple" className="space-y-4">
              <AccordionItem value="checkout" className="border border-border rounded-lg px-6 shadow-sm hover:shadow-md transition-shadow bg-card">
                <AccordionTrigger className="text-foreground hover:no-underline py-5 [&>svg]:w-5 [&>svg]:h-5 [&>svg]:text-[#8021FF] [&>svg]:transition-transform">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-[#8021FF] rounded-lg flex items-center justify-center shadow-sm">
                      <Building2 className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-semibold text-base">Checkout Assumptions</span>
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

              <AccordionItem value="revenue" className="border border-border rounded-lg px-6 shadow-sm hover:shadow-md transition-shadow bg-card">
                <AccordionTrigger className="text-foreground hover:no-underline py-5 [&>svg]:w-5 [&>svg]:h-5 [&>svg]:text-[#8021FF] [&>svg]:transition-transform">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-[#8021FF] rounded-lg flex items-center justify-center shadow-sm">
                      <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-semibold text-base">Revenue & Cost Model</span>
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

              <AccordionItem value="output" className="border border-border rounded-lg px-6 shadow-sm hover:shadow-md transition-shadow bg-card">
                <AccordionTrigger className="text-foreground hover:no-underline py-5 [&>svg]:w-5 [&>svg]:h-5 [&>svg]:text-[#8021FF] [&>svg]:transition-transform">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-[#8021FF] rounded-lg flex items-center justify-center shadow-sm">
                      <Calculator className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-semibold text-base">Output / Impact Formulas</span>
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

            {/* BOTTOM CTA PANEL - Premium */}
            <Card className="relative overflow-hidden p-8 border-2 border-[#8021FF]/30 bg-gradient-to-r from-[#8021FF]/10 via-[#8021FF]/5 to-transparent">
              <div className="absolute top-0 right-0 w-64 h-32 bg-[#8021FF]/10 rounded-full blur-3xl -mr-32" />
              <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Ready to explore regional opportunities?
                  </h3>
                  <p className="text-muted-foreground">
                    Dive into market-specific payment intelligence for India, China, Brazil, and Indonesia
                  </p>
                </div>
                <Button 
                  size="lg"
                  className="bg-[#8021FF] hover:bg-[#6B1AD6] text-white shrink-0 shadow-lg shadow-[#8021FF]/25 transition-all hover:shadow-xl hover:shadow-[#8021FF]/30"
                  onClick={() => setActiveTab("geography")}
                >
                  Explore regional market dossier
                  <ArrowUpRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* ================================================================ */}
          {/* REGIONAL MARKET DOSSIER (Tab 2) */}
          {/* ================================================================ */}
          <TabsContent value="geography" className="mt-8">
            <RegionalMarketDossier />
          </TabsContent>

          {/* ================================================================ */}
          {/* DEMAND AUDIT (Tab 3) */}
          {/* ================================================================ */}
          <TabsContent value="demand" className="mt-8">
            <DemandAudit onSwitchToExecutive={() => setActiveTab("executive")} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
