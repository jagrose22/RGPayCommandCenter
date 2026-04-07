"use client"

import { useState, useEffect, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, TrendingUp, CheckCircle2 } from "lucide-react"
import Link from "next/link"

// Market defaults with business intelligence
const marketDefaults: Record<string, {
  sessions: number
  bookingValue: number
  paymentGap: number
  recoveryRate: number
  bnplUplift: number
  retryRecovery: number
  benchmarkLift: number
  primaryPayment: string
  insight: string
  apmAdoption: string
}> = {
  "India": {
    sessions: 8500,
    bookingValue: 847,
    paymentGap: 40,
    recoveryRate: 35,
    bnplUplift: 6,
    retryRecovery: 3,
    benchmarkLift: 12,
    primaryPayment: "UPI",
    insight: "UPI dominates 83% of all retail digital payments",
    apmAdoption: "Card-first with rising APM adoption"
  },
  "Brazil": {
    sessions: 8500,
    bookingValue: 690,
    paymentGap: 36,
    recoveryRate: 33,
    bnplUplift: 6,
    retryRecovery: 3,
    benchmarkLift: 16,
    primaryPayment: "Pix",
    insight: "Merchants adding Pix saw 16% revenue increase",
    apmAdoption: "Pix-first with strong BNPL growth"
  },
  "UAE": {
    sessions: 8500,
    bookingValue: 910,
    paymentGap: 25,
    recoveryRate: 24,
    bnplUplift: 4,
    retryRecovery: 2,
    benchmarkLift: 6,
    primaryPayment: "Local Cards",
    insight: "High digital wallet and premium card usage",
    apmAdoption: "Premium card-first market"
  },
  "Mexico": {
    sessions: 8500,
    bookingValue: 580,
    paymentGap: 38,
    recoveryRate: 30,
    bnplUplift: 7,
    retryRecovery: 4,
    benchmarkLift: 14,
    primaryPayment: "OXXO / SPEI",
    insight: "Cash-based payments remain significant",
    apmAdoption: "Mixed cash and digital adoption"
  },
  "China": {
    sessions: 8500,
    bookingValue: 1200,
    paymentGap: 20,
    recoveryRate: 28,
    bnplUplift: 3,
    retryRecovery: 2,
    benchmarkLift: 8,
    primaryPayment: "Alipay / WeChat Pay",
    insight: "Super-app dominance in travel bookings",
    apmAdoption: "Mobile wallet-first ecosystem"
  },
  "Indonesia": {
    sessions: 8500,
    bookingValue: 420,
    paymentGap: 45,
    recoveryRate: 38,
    bnplUplift: 8,
    retryRecovery: 5,
    benchmarkLift: 18,
    primaryPayment: "GoPay / OVO",
    insight: "E-wallet adoption growing rapidly",
    apmAdoption: "E-wallet first with BNPL growth"
  },
  "Thailand": {
    sessions: 8500,
    bookingValue: 380,
    paymentGap: 42,
    recoveryRate: 35,
    bnplUplift: 7,
    retryRecovery: 4,
    benchmarkLift: 15,
    primaryPayment: "PromptPay",
    insight: "QR payments dominate retail transactions",
    apmAdoption: "QR-first with growing BNPL"
  },
  "Philippines": {
    sessions: 8500,
    bookingValue: 350,
    paymentGap: 48,
    recoveryRate: 40,
    bnplUplift: 9,
    retryRecovery: 5,
    benchmarkLift: 20,
    primaryPayment: "GCash / Maya",
    insight: "Mobile wallets driving financial inclusion",
    apmAdoption: "Mobile wallet-first market"
  },
  "Malaysia": {
    sessions: 8500,
    bookingValue: 480,
    paymentGap: 35,
    recoveryRate: 32,
    bnplUplift: 6,
    retryRecovery: 3,
    benchmarkLift: 12,
    primaryPayment: "DuitNow / Touch n Go",
    insight: "Strong e-wallet and BNPL ecosystem",
    apmAdoption: "Balanced card and e-wallet usage"
  },
  "North America": {
    sessions: 10000,
    bookingValue: 420,
    paymentGap: 18,
    recoveryRate: 64,
    bnplUplift: 4,
    retryRecovery: 2,
    benchmarkLift: 6,
    primaryPayment: "Credit/Debit Cards (78%)",
    insight: "Card-dominant market with Apple Pay growth",
    apmAdoption: "Card-first with rising APM adoption"
  }
}

// Segment multipliers
const segmentMultipliers: Record<string, number> = {
  "Luxury & Ultra-Luxury": 1.35,
  "Upper Upscale": 1.25,
  "Upscale": 1.15,
  "Upper Midscale": 1.0,
  "Midscale": 0.9,
  "Economy": 0.75
}

// Segment benchmark data
const segmentBenchmarks: Record<string, { avgBooking: number; recovery: string }> = {
  "Luxury & Ultra-Luxury": { avgBooking: 1250, recovery: "68%" },
  "Upper Upscale": { avgBooking: 890, recovery: "64%" },
  "Upscale": { avgBooking: 420, recovery: "62%" },
  "Upper Midscale": { avgBooking: 280, recovery: "58%" },
  "Midscale": { avgBooking: 180, recovery: "55%" },
  "Economy": { avgBooking: 95, recovery: "52%" }
}

export default function RecoveryCalculatorPage() {
  // State for dropdowns
  const [sourceMarket, setSourceMarket] = useState("North America")
  const [hotelSegment, setHotelSegment] = useState("Upscale")
  
  // State for sliders
  const [monthlyTransactions, setMonthlyTransactions] = useState(10000)
  const [avgBookingValue, setAvgBookingValue] = useState(420)
  const [paymentFailureRate, setPaymentFailureRate] = useState(7.2)
  const [recoveryRate, setRecoveryRate] = useState(60)
  
  // Get current market defaults
  const currentMarket = marketDefaults[sourceMarket]
  
  // Update values when market changes
  useEffect(() => {
    if (currentMarket) {
      setMonthlyTransactions(currentMarket.sessions)
      setAvgBookingValue(currentMarket.bookingValue)
      setPaymentFailureRate(currentMarket.paymentGap > 20 ? currentMarket.paymentGap / 5 : 7.2)
      setRecoveryRate(currentMarket.recoveryRate * 1.8)
    }
  }, [sourceMarket])
  
  // Calculate recovery metrics
  const calculations = useMemo(() => {
    const multiplier = segmentMultipliers[hotelSegment] || 1.0
    const monthlyFailedRevenue = monthlyTransactions * avgBookingValue * (paymentFailureRate / 100)
    const monthlyRecovery = monthlyFailedRevenue * (recoveryRate / 100) * multiplier
    const annualRecovery = monthlyRecovery * 12
    const failedTransactions = Math.round(monthlyTransactions * (paymentFailureRate / 100))
    const revenueAtRisk = monthlyFailedRevenue
    const bookingsSaved = Math.round(failedTransactions * (recoveryRate / 100))
    const expectedLift = currentMarket?.benchmarkLift || 12
    
    return {
      annualRecovery,
      monthlyRecovery,
      failedTransactions,
      revenueAtRisk,
      recoveredAmount: monthlyRecovery,
      bookingsSaved,
      expectedLift,
      totalMonthlyRevenue: monthlyTransactions * avgBookingValue
    }
  }, [monthlyTransactions, avgBookingValue, paymentFailureRate, recoveryRate, hotelSegment, currentMarket])
  
  // Format currency
  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`
    }
    return `$${value.toFixed(0)}`
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#8021FF] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">RG</span>
            </div>
            <span className="font-semibold text-gray-900">RG PAY</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-600">
            <Link href="/why-rg-pay" className="hover:text-gray-900 transition-colors">Why RG Pay?</Link>
            <Link href="/recovery-calculator" className="text-[#8021FF] font-medium">Recovery Calculator</Link>
            <Link href="/faq" className="hover:text-gray-900 transition-colors">FAQ</Link>
            <Link href="/" className="hover:text-gray-900 transition-colors">Demo</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#8021FF]/10 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-[#8021FF]" />
            <span className="text-sm font-medium text-[#8021FF]">Revenue Recovery Simulator</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Calculate Your Recovery Potential
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            See how much revenue you could recover from failed payments. Customize the inputs below to match your business profile.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Left Column - Inputs */}
          <div className="space-y-6">
            {/* Business Profile Card */}
            <Card className="p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#8021FF]/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-[#8021FF]" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Your Business Profile</h3>
                  <p className="text-sm text-gray-500">Adjust inputs to match your operations</p>
                </div>
              </div>
              
              {/* Dropdowns */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Source Market</label>
                  <Select value={sourceMarket} onValueChange={setSourceMarket}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(marketDefaults).map((market) => (
                        <SelectItem key={market} value={market}>{market}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hotel Segment</label>
                  <Select value={hotelSegment} onValueChange={setHotelSegment}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(segmentMultipliers).map((segment) => (
                        <SelectItem key={segment} value={segment}>{segment}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Market Intelligence Card */}
              <div className="bg-gradient-to-r from-[#8021FF]/5 to-purple-50 rounded-xl p-4 mb-6 border border-[#8021FF]/10">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#8021FF] mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">{sourceMarket}</span>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{currentMarket?.apmAdoption}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-600 mb-2">
                      <div>Primary Payment Method</div>
                      <div className="font-medium text-gray-900">{currentMarket?.primaryPayment}</div>
                      <div>Payment Gap</div>
                      <div className="font-medium text-gray-900">Limited BNPL & wallet coverage</div>
                      <div>Recovery Benchmark</div>
                      <div className="font-medium text-gray-900">{currentMarket?.recoveryRate}%</div>
                    </div>
                    <p className="text-xs text-gray-500 italic">{currentMarket?.insight}</p>
                  </div>
                </div>
              </div>
              
              {/* Sliders */}
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">Monthly Transactions</label>
                    <span className="text-sm font-semibold text-[#8021FF]">{monthlyTransactions.toLocaleString()}</span>
                  </div>
                  <Slider
                    value={[monthlyTransactions]}
                    onValueChange={([v]) => setMonthlyTransactions(v)}
                    min={1000}
                    max={100000}
                    step={500}
                    className="[&_[role=slider]]:bg-[#8021FF]"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>1,000</span>
                    <span>100,000</span>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">Average Booking Value</label>
                    <span className="text-sm font-semibold text-[#8021FF]">${avgBookingValue.toLocaleString()}</span>
                  </div>
                  <Slider
                    value={[avgBookingValue]}
                    onValueChange={([v]) => setAvgBookingValue(v)}
                    min={50}
                    max={2000}
                    step={10}
                    className="[&_[role=slider]]:bg-[#8021FF]"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>$50</span>
                    <span>$2,000</span>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">Payment Failure Rate</label>
                    <span className="text-sm font-semibold text-[#8021FF]">{paymentFailureRate.toFixed(1)}%</span>
                  </div>
                  <Slider
                    value={[paymentFailureRate]}
                    onValueChange={([v]) => setPaymentFailureRate(v)}
                    min={1}
                    max={20}
                    step={0.1}
                    className="[&_[role=slider]]:bg-[#8021FF]"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>1%</span>
                    <span>20%</span>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">RG Pay Recovery Rate</label>
                    <span className="text-sm font-semibold text-[#8021FF]">{recoveryRate.toFixed(0)}%</span>
                  </div>
                  <Slider
                    value={[recoveryRate]}
                    onValueChange={([v]) => setRecoveryRate(v)}
                    min={30}
                    max={85}
                    step={1}
                    className="[&_[role=slider]]:bg-[#8021FF]"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>30% Conservative</span>
                    <span>85% Optimized</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Results */}
          <div className="space-y-6">
            {/* Hero Recovery Card */}
            <Card className="bg-gradient-to-br from-[#8021FF] to-[#6010DD] p-8 text-white shadow-xl">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-white/80" />
                <span className="text-white/80 text-sm font-medium">Annual Recovery Potential</span>
              </div>
              <div className="text-5xl md:text-6xl font-bold mb-3">
                {formatCurrency(calculations.annualRecovery)}
              </div>
              <p className="text-white/70 text-sm">
                Annual recovery opportunity for {hotelSegment} hotels in {sourceMarket}
              </p>
            </Card>

            {/* Recommended Action Card */}
            <Card className="p-6 border-2 border-orange-200 bg-orange-50/50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-orange-500" />
                  <span className="font-semibold text-gray-900">Recommended Next Best Action</span>
                </div>
                <span className="text-xs font-medium bg-orange-100 text-orange-700 px-2 py-1 rounded-full">High Priority</span>
              </div>
              <div className="flex items-center gap-2 text-[#8021FF] font-medium">
                <CheckCircle2 className="w-4 h-4" />
                <span>Deploy Apple Pay + smart retry logic</span>
              </div>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4 text-center border border-gray-200">
                <div className="text-xs text-gray-500 mb-1">Expected Annual Lift</div>
                <div className="text-2xl font-bold text-green-600">+{calculations.expectedLift}%</div>
              </Card>
              <Card className="p-4 text-center border border-gray-200">
                <div className="text-xs text-gray-500 mb-1">Bookings Saved/Mo</div>
                <div className="text-2xl font-bold text-gray-900">{calculations.bookingsSaved.toLocaleString()}</div>
              </Card>
              <Card className="p-4 text-center border border-gray-200">
                <div className="text-xs text-gray-500 mb-1">Recovery Benchmark</div>
                <div className="text-2xl font-bold text-gray-900">{recoveryRate}%</div>
              </Card>
            </div>

            {/* Monthly Breakdown */}
            <Card className="p-6 border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-[#8021FF] rounded-full" />
                <span className="text-sm font-medium text-gray-500">Monthly Recovery</span>
                <div className="w-2 h-2 bg-gray-300 rounded-full ml-4" />
                <span className="text-sm font-medium text-gray-500">Bookings Saved/Month</span>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-3xl font-bold text-gray-900">{formatCurrency(calculations.monthlyRecovery)}</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">{calculations.bookingsSaved}</div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h4 className="text-sm font-semibold text-gray-900 mb-4">Monthly Breakdown</h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Monthly Revenue</span>
                    <span className="font-medium text-gray-900">{formatCurrency(calculations.totalMonthlyRevenue)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Failed Transactions</span>
                    <span className="font-medium text-red-600">{calculations.failedTransactions.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Revenue at Risk</span>
                    <span className="font-medium text-orange-600">{formatCurrency(calculations.revenueAtRisk)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Recovered by RG Pay</span>
                    <span className="font-medium text-green-600">{formatCurrency(calculations.recoveredAmount)}</span>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex gap-3 mt-6">
                <Button className="flex-1 bg-[#8021FF] hover:bg-[#6B1AD6] text-white">
                  Get Your Custom Analysis
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Link href="/">
                  <Button variant="outline" className="border-gray-300">
                    See Demo
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>

        {/* Hotel Segment Benchmarks */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Hotel Segment Benchmarks</h2>
            <p className="text-gray-600">Average booking values and recovery potential by hotel category</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(segmentBenchmarks).map(([segment, data]) => (
              <Card 
                key={segment} 
                className={`p-4 text-center border transition-all ${
                  segment === hotelSegment 
                    ? "border-[#8021FF] bg-[#8021FF]/5 ring-2 ring-[#8021FF]/20" 
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className={`text-xs font-medium mb-2 ${segment === hotelSegment ? "text-[#8021FF]" : "text-gray-500"}`}>
                  {segment}
                </div>
                <div className="text-sm text-gray-600 mb-1">Avg Booking</div>
                <div className="text-lg font-bold text-gray-900">${data.avgBooking}</div>
                <div className="text-sm text-gray-600 mt-2 mb-1">Recovery</div>
                <div className="text-lg font-bold text-green-600">{data.recovery}</div>
              </Card>
            ))}
          </div>
        </div>

        {/* Executive Summary & Let's Talk CTA */}
        <div className="mt-12 grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Executive Summary */}
          <Card className="p-6 bg-gradient-to-r from-[#8021FF]/5 to-purple-50 border border-[#8021FF]/10">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-[#8021FF]" />
              <h3 className="font-semibold text-gray-900">Your Recovery Summary</h3>
            </div>
            <p className="text-gray-700">
              <span className="font-semibold">RG Pay</span> can recover approximately{" "}
              <span className="font-bold text-[#8021FF] text-xl">{formatCurrency(calculations.annualRecovery)}</span> annually for{" "}
              <span className="font-semibold">{hotelSegment}</span> hotels in{" "}
              <span className="font-semibold">{sourceMarket}</span> through localized payments, BNPL, and smart retry logic.
            </p>
            <div className="mt-4 pt-4 border-t border-[#8021FF]/10">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-gray-600">No integration fees required</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-gray-600">Go live in 2 weeks</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Let's Talk CTA */}
          <Card className="p-6 bg-gradient-to-br from-[#8021FF] to-[#6B1AD6] text-white border-0">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-white/80" />
              <h3 className="font-semibold">Ready to Stop Losing Revenue?</h3>
            </div>
            <p className="text-white/80 mb-6">
              See how much you could recover with a custom analysis tailored to your specific markets, segments, and transaction volumes.
            </p>
            <div className="space-y-3">
              <Button className="w-full bg-white text-[#8021FF] hover:bg-gray-100 font-semibold">
                Let&apos;s Talk
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <p className="text-xs text-white/60 text-center">
                15-minute call with a payments specialist
              </p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
