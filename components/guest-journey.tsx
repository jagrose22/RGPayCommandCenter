"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Search, 
  User, 
  CreditCard, 
  CheckCircle2, 
  Zap, 
  RefreshCw, 
  Route, 
  Gift,
  Smartphone,
  AlertTriangle,
  Sparkles,
  ArrowRight
} from "lucide-react"

interface GuestJourneyProps {
  onNavigateToCalculator: () => void
}

export function GuestJourney({ onNavigateToCalculator }: GuestJourneyProps) {
  return (
    <div className="space-y-16">
      {/* ============================================================ */}
      {/* SECTION 1: HOOK / IMPACT HERO */}
      {/* ============================================================ */}
      <section className="pt-8">
        {/* Hero Headline - NOT inside a card */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance leading-tight">
            Every failed payment is a booking<br />
            <span className="text-red-500">that almost walked</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Hidden payment friction turns direct bookings into OTA commissions
          </p>
        </div>

        {/* 2x2 Premium KPI Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Bookings at Risk - Red */}
          <Card className="relative overflow-hidden p-6 border-t-4 border-t-red-500 shadow-lg hover:shadow-xl transition-all group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-red-500/20 transition-colors" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <span className="text-xs font-semibold text-red-500 uppercase tracking-wide">Bookings at Risk</span>
              </div>
              <p className="text-4xl font-bold text-foreground mb-1">2,400</p>
              <p className="text-sm text-muted-foreground">monthly</p>
            </div>
          </Card>

          {/* Checkout Abandonment - Amber */}
          <Card className="relative overflow-hidden p-6 border-t-4 border-t-amber-500 shadow-lg hover:shadow-xl transition-all group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-amber-500/20 transition-colors" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-semibold text-amber-500 uppercase tracking-wide">Checkout Abandonment</span>
              </div>
              <p className="text-4xl font-bold text-foreground mb-1">34%</p>
              <p className="text-sm text-muted-foreground">drop-off rate</p>
            </div>
          </Card>

          {/* Recoverable Revenue - Purple */}
          <Card className="relative overflow-hidden p-6 border-t-4 border-t-[#8021FF] shadow-lg hover:shadow-xl transition-all group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#8021FF]/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-[#8021FF]/20 transition-colors" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-[#8021FF]" />
                <span className="text-xs font-semibold text-[#8021FF] uppercase tracking-wide">Recoverable Revenue</span>
              </div>
              <p className="text-4xl font-bold text-foreground mb-1">₹3.2 Cr</p>
              <p className="text-sm text-muted-foreground">annually</p>
            </div>
          </Card>

          {/* OTA Fees Avoidable - Green */}
          <Card className="relative overflow-hidden p-6 border-t-4 border-t-green-500 shadow-lg hover:shadow-xl transition-all group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-green-500/20 transition-colors" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span className="text-xs font-semibold text-green-500 uppercase tracking-wide">OTA Fees Avoidable</span>
              </div>
              <p className="text-4xl font-bold text-foreground mb-1">₹48L</p>
              <p className="text-sm text-muted-foreground">commission saved</p>
            </div>
          </Card>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 2: REAL BOOKING EXPERIENCE (NEW HERO VISUAL) */}
      {/* ============================================================ */}
      <section>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">What the Guest Sees at Checkout</h2>
          <p className="text-muted-foreground">The digital moment where bookings are won or lost</p>
        </div>

        {/* Wide Visual Panel - Modern Checkout Interface */}
        <div className="max-w-5xl mx-auto">
          <Card className="relative overflow-hidden border-2 border-border shadow-2xl">
            {/* Browser Chrome */}
            <div className="flex items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-800 border-b border-border">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 mx-4">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-700 rounded-lg text-xs text-muted-foreground">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  secure.marriott.com/checkout
                </div>
              </div>
            </div>

            {/* Checkout Interface */}
            <div className="grid md:grid-cols-5 min-h-[400px]">
              {/* Left: Booking Summary */}
              <div className="md:col-span-2 p-6 bg-gray-50 dark:bg-gray-900 border-r border-border">
                <div className="space-y-4">
                  {/* Hotel Image Placeholder */}
                  <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto bg-white/80 rounded-lg flex items-center justify-center mb-2">
                        <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <span className="text-xs font-medium text-blue-700 dark:text-blue-300">JW Marriott Mumbai</span>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="space-y-3">
                    <h3 className="font-bold text-foreground">Ocean View Suite</h3>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>Dec 15 - Dec 17, 2024</p>
                      <p>2 Nights, 2 Adults</p>
                    </div>
                    <div className="pt-3 border-t border-border">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Room Rate</span>
                        <span className="text-foreground">₹18,500</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Taxes & Fees</span>
                        <span className="text-foreground">₹3,330</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t border-border">
                        <span>Total</span>
                        <span className="text-[#8021FF]">₹21,830</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Payment Selection */}
              <div className="md:col-span-3 p-6 bg-white dark:bg-gray-950">
                <h3 className="text-lg font-bold text-foreground mb-2">Choose Payment Method</h3>
                <p className="text-sm text-muted-foreground mb-6">Select your preferred way to pay</p>

                {/* Payment Options Grid */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {/* UPI - Selected/Recommended */}
                  <div className="relative col-span-2 p-4 bg-[#8021FF]/5 border-2 border-[#8021FF] rounded-xl cursor-pointer hover:bg-[#8021FF]/10 transition-colors">
                    <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-[#8021FF] text-white text-[10px] font-bold rounded-full">
                      RECOMMENDED
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shrink-0">
                        <span className="text-white font-bold text-sm">UPI</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">UPI / BHIM</p>
                        <p className="text-xs text-muted-foreground">GPay, PhonePe, Paytm & more</p>
                      </div>
                      <CheckCircle2 className="w-6 h-6 text-[#8021FF]" />
                    </div>
                  </div>

                  {/* Wallet */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-900 border border-border rounded-xl cursor-pointer hover:border-[#8021FF]/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center shrink-0">
                        <Smartphone className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm">Wallets</p>
                        <p className="text-xs text-muted-foreground">PhonePe, Paytm</p>
                      </div>
                    </div>
                  </div>

                  {/* Cards */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-900 border border-border rounded-xl cursor-pointer hover:border-[#8021FF]/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center shrink-0">
                        <CreditCard className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm">Card</p>
                        <p className="text-xs text-muted-foreground">Visa, Mastercard</p>
                      </div>
                    </div>
                  </div>

                  {/* BNPL */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-900 border border-border rounded-xl cursor-pointer hover:border-[#8021FF]/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center shrink-0">
                        <Gift className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm">Pay Later</p>
                        <p className="text-xs text-muted-foreground">LazyPay, Simpl</p>
                      </div>
                    </div>
                  </div>

                  {/* Net Banking */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-900 border border-border rounded-xl cursor-pointer hover:border-[#8021FF]/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm">Net Banking</p>
                        <p className="text-xs text-muted-foreground">All major banks</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RG Pay Badge */}
                <div className="flex items-center justify-center gap-2 py-3 px-4 bg-[#8021FF]/5 border border-[#8021FF]/20 rounded-lg mb-6">
                  <Zap className="w-4 h-4 text-[#8021FF]" />
                  <span className="text-xs font-medium text-[#8021FF]">Preferred method surfaced by RG Pay</span>
                </div>

                {/* Pay Button */}
                <Button className="w-full h-14 bg-[#8021FF] hover:bg-[#6B1AD6] text-white text-lg font-bold shadow-lg shadow-[#8021FF]/25">
                  Pay ₹21,830 with UPI
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 3: GUEST BOOKING JOURNEY */}
      {/* ============================================================ */}
      <section>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">Guest Booking Journey</h2>
          <p className="text-muted-foreground">Where payment friction causes drop-off — and where RG Pay intervenes</p>
        </div>

        {/* Connected Journey Strip */}
        <div className="relative max-w-5xl mx-auto">
          {/* Connection Line */}
          <div className="absolute top-10 left-0 right-0 h-1 bg-gradient-to-r from-gray-200 via-gray-200 via-50% to-gray-200 hidden md:block" style={{ left: '10%', right: '10%' }} />
          
          {/* Journey Nodes */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4">
            {/* Node 1: Search */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center mb-3 z-10">
                <Search className="w-8 h-8 text-gray-500" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">Search</span>
            </div>

            {/* Connector Arrow (mobile) */}
            <ArrowRight className="w-5 h-5 text-gray-300 md:hidden" />

            {/* Node 2: Guest Details */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center mb-3 z-10">
                <User className="w-8 h-8 text-gray-500" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">Guest Details</span>
            </div>

            {/* Connector Arrow (mobile) */}
            <ArrowRight className="w-5 h-5 text-gray-300 md:hidden" />

            {/* Node 3: Payment / Checkout - DOMINANT */}
            <div className="flex flex-col items-center relative">
              {/* Glow Effect */}
              <div className="absolute inset-0 w-28 h-28 bg-[#8021FF]/20 rounded-full blur-xl -top-4" />
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#8021FF] to-[#6B1AD6] border-4 border-[#8021FF]/30 flex items-center justify-center mb-3 z-10 shadow-lg shadow-[#8021FF]/30">
                <CreditCard className="w-10 h-10 text-white" />
              </div>
              <span className="text-sm font-bold text-[#8021FF]">Payment / Checkout</span>
              <span className="text-xs font-semibold text-red-500 mt-1">Risk Moment</span>
            </div>

            {/* Connector Arrow (mobile) */}
            <ArrowRight className="w-5 h-5 text-gray-300 md:hidden" />

            {/* Node 4: Outcome */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center mb-3 z-10">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">Outcome</span>
            </div>
          </div>

          {/* RG Pay Recovery Layer - Floating Purple Band */}
          <div className="mt-8 relative">
            {/* Injection Arrow */}
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-0.5 h-6 bg-gradient-to-b from-transparent to-[#8021FF]" />
            
            {/* The Band */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#8021FF] via-[#6B1AD6] to-[#8021FF] p-6 shadow-xl shadow-[#8021FF]/20">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl -ml-24 -mb-24" />
              
              <div className="relative">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-5 h-5 text-white" />
                  <span className="text-white font-bold">RG Pay Recovery Layer</span>
                </div>
                
                {/* 4 Intervention Chips */}
                <div className="flex flex-wrap gap-3">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium hover:bg-white/30 transition-colors">
                    <CreditCard className="w-4 h-4" />
                    12 Local Rails Activated
                  </div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium hover:bg-white/30 transition-colors">
                    <RefreshCw className="w-4 h-4" />
                    Smart Retry Logic
                  </div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium hover:bg-white/30 transition-colors">
                    <Route className="w-4 h-4" />
                    Gateway Re-route
                  </div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium hover:bg-white/30 transition-colors">
                    <Gift className="w-4 h-4" />
                    BNPL Conversion Offer
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 3: RAJ KUMAR PROOF STORY */}
      {/* ============================================================ */}
      <section className="bg-muted/30 -mx-6 px-6 py-12 rounded-3xl">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-2">The Raj Kumar Story</h2>
          <p className="text-muted-foreground">A real booking recovery journey in 4 beats</p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* 4-Beat Timeline */}
          <div className="relative">
            {/* Vertical Connection Line */}
            <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-gray-200 via-red-300 via-50% via-[#8021FF] to-green-400 hidden md:block" />

            {/* Beat 1: Neutral */}
            <div className="relative flex items-start gap-6 mb-8">
              <div className="relative z-10 w-16 h-16 rounded-full bg-gray-100 border-4 border-gray-200 flex items-center justify-center shrink-0">
                <User className="w-7 h-7 text-gray-500" />
              </div>
              <Card className="flex-1 p-5 border border-border shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-gray-400 uppercase">Beat 1</span>
                  <span className="w-2 h-2 rounded-full bg-gray-300" />
                </div>
                <h3 className="font-bold text-foreground mb-1">Raj is ready to book</h3>
                <p className="text-sm text-muted-foreground">High-intent traveler at checkout — selected dates, room type, ready to pay</p>
              </Card>
            </div>

            {/* Beat 2: Red Problem */}
            <div className="relative flex items-start gap-6 mb-8">
              <div className="relative z-10 w-16 h-16 rounded-full bg-red-50 border-4 border-red-300 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-7 h-7 text-red-500" />
              </div>
              <Card className="flex-1 p-5 border-2 border-red-200 bg-red-50/50 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-red-500 uppercase">Beat 2</span>
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                </div>
                <h3 className="font-bold text-red-700 mb-1">No UPI. No wallet. Raj closes the tab.</h3>
                <p className="text-sm text-red-600/80">Credit card only checkout. Payment declined. Booking lost to OTA.</p>
              </Card>
            </div>

            {/* Beat 3: Purple Activation */}
            <div className="relative flex items-start gap-6 mb-8">
              <div className="relative z-10 w-16 h-16 rounded-full bg-[#8021FF]/10 border-4 border-[#8021FF] flex items-center justify-center shrink-0 shadow-lg shadow-[#8021FF]/20">
                <Zap className="w-7 h-7 text-[#8021FF]" />
              </div>
              <Card className="flex-1 p-5 border-2 border-[#8021FF]/30 bg-[#8021FF]/5 shadow-md">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-[#8021FF] uppercase">Beat 3</span>
                  <span className="w-2 h-2 rounded-full bg-[#8021FF]" />
                </div>
                <h3 className="font-bold text-[#8021FF] mb-1">RG Pay activates instantly</h3>
                <p className="text-sm text-muted-foreground">UPI, PhonePe, Paytm appear. Raj sees his preferred method. Trust restored.</p>
              </Card>
            </div>

            {/* Beat 4: Green Resolution */}
            <div className="relative flex items-start gap-6">
              <div className="relative z-10 w-16 h-16 rounded-full bg-green-50 border-4 border-green-400 flex items-center justify-center shrink-0 shadow-lg shadow-green-500/20">
                <CheckCircle2 className="w-7 h-7 text-green-500" />
              </div>
              <Card className="flex-1 p-5 border-2 border-green-300 bg-green-50/50 shadow-md">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-green-600 uppercase">Beat 4</span>
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                </div>
                <h3 className="font-bold text-green-700 mb-1">Payment authorized. Booking recovered.</h3>
                <p className="text-sm text-green-600/80">Direct booking saved. No OTA commission. Raj is a happy guest.</p>
              </Card>
            </div>
          </div>

          {/* Mini Phone Mockup */}
          <div className="mt-10 flex justify-center">
            <div className="relative">
              <div className="w-48 h-96 bg-gray-900 rounded-[2.5rem] p-2 shadow-2xl">
                <div className="w-full h-full bg-white rounded-[2rem] overflow-hidden">
                  {/* Phone Screen Content */}
                  <div className="p-4">
                    <div className="text-center mb-4">
                      <div className="w-10 h-10 mx-auto bg-[#8021FF]/10 rounded-full flex items-center justify-center mb-2">
                        <CreditCard className="w-5 h-5 text-[#8021FF]" />
                      </div>
                      <p className="text-xs font-semibold text-gray-900">Choose Payment</p>
                    </div>
                    
                    {/* Payment Options */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 p-3 bg-[#8021FF]/10 border-2 border-[#8021FF] rounded-lg">
                        <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                          <span className="text-white text-xs font-bold">UPI</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-gray-900">UPI</p>
                          <p className="text-[10px] text-gray-500">Pay with any UPI app</p>
                        </div>
                        <CheckCircle2 className="w-5 h-5 text-[#8021FF]" />
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                        <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                          <span className="text-white text-xs font-bold">PP</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-gray-900">PhonePe</p>
                          <p className="text-[10px] text-gray-500">Wallet + UPI</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                          <span className="text-white text-xs font-bold">PT</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-gray-900">Paytm</p>
                          <p className="text-[10px] text-gray-500">Wallet + UPI</p>
                        </div>
                      </div>
                    </div>

                    {/* Pay Button */}
                    <button className="w-full mt-4 py-3 bg-[#8021FF] text-white text-xs font-bold rounded-lg">
                      Pay ₹12,450
                    </button>
                  </div>
                </div>
              </div>
              {/* Phone Notch */}
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-20 h-6 bg-gray-900 rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 4: TRUST / CONFIDENCE STRIP */}
      {/* ============================================================ */}
      <section>
        <div className="border-y border-border py-6">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span>Market Benchmarks</span>
            </div>
            <div className="w-px h-6 bg-border hidden md:block" />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span>Verified Sources</span>
            </div>
            <div className="w-px h-6 bg-border hidden md:block" />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <span>Property Overrides</span>
            </div>
            <div className="w-px h-6 bg-border hidden md:block" />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <span>Methodology</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 5: COMMERCIAL CLOSE CTA */}
      {/* ============================================================ */}
      <section className="pb-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#8021FF] via-[#6B1AD6] to-[#8021FF] p-10 shadow-2xl shadow-[#8021FF]/20">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-2xl -ml-32 -mb-32" />
          
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="text-white">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                Quantify Your Recovery Opportunity
              </h2>
              <p className="text-white/80 text-lg max-w-lg">
                See enterprise, market, or property-level revenue recovery projections
              </p>
            </div>
            <Button 
              size="lg"
              onClick={onNavigateToCalculator}
              className="bg-white text-[#8021FF] hover:bg-white/90 font-bold shadow-lg hover:shadow-xl transition-all text-base px-8 py-6"
            >
              Launch Recovery Calculator
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
