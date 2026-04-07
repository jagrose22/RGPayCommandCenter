"use client"

import { CreditCard, Smartphone, Wallet, Clock, Check, X, Loader2, ShieldCheck, Building2 } from "lucide-react"

interface Account {
  id: string
  name: string
  color: string
  avgBooking?: number
}

// Custom demo accounts - these have tailored experiences
const CUSTOM_DEMO_ACCOUNTS = ["wyndham", "expedia", "despegar", "baholidays", "hertz", "marriott", "ihg"]

// Account-specific phone data
const PHONE_DATA: Record<string, {
  guest: string; property: string; room: string; nights: number;
  baseRate: number; taxes: number; grandTotal: number; dateRange: string;
  headerText: string; paymentRecovered: string; confirmation: string;
  market: string; bankOffer?: string; bankSaving?: string;
}> = {
  wyndham: {
    guest: "Raj Kumar", property: "Wyndham Pittsburgh", room: "Deluxe King Room",
    nights: 3, baseRate: 694, taxes: 153, grandTotal: 847,
    dateRange: "Mar 15–18, 2024 · 3 nights", headerText: "Complete Your Booking",
    paymentRecovered: "UPI", confirmation: "WYN-2024-32847", market: "India",
    bankOffer: "HDFC Bank: Save ₹2,000", bankSaving: "on this booking"
  },
  marriott: {
    guest: "Li Wei", property: "Paris Marriott Opera Ambassador", room: "Deluxe City View Room",
    nights: 4, baseRate: 1140, taxes: 182, grandTotal: 1322,
    dateRange: "Jun 10–14, 2024 · 4 nights", headerText: "MARRIOTT BONVOY",
    paymentRecovered: "Alipay", confirmation: "MAR-2024-49371", market: "China",
    bankOffer: "Bank of China: Save ¥500", bankSaving: "on this booking"
  },
  ihg: {
    guest: "Amit Patel", property: "InterContinental London Park Lane", room: "Classic King Room",
    nights: 3, baseRate: 1260, taxes: 189, grandTotal: 1449,
    dateRange: "Sep 3–6, 2024 · 3 nights", headerText: "IHG · INTERCONTINENTAL",
    paymentRecovered: "UPI", confirmation: "IHG-2024-88214", market: "India",
    bankOffer: "HDFC Bank: Save ₹3,500", bankSaving: "on this booking"
  },
  hertz: {
    guest: "Priya Sharma", property: "LAX Airport", room: "Toyota Camry · Full Size",
    nights: 7, baseRate: 623, taxes: 94, grandTotal: 717,
    dateRange: "Pickup: LAX Airport · Jul 15, 2024\nReturn: Jul 22 · 7 days", headerText: "HERTZ",
    paymentRecovered: "UPI", confirmation: "HTZ-2024-61829", market: "India",
    bankOffer: "SBI Card: Save ₹1,200", bankSaving: "on this rental"
  },
  despegar: {
    guest: "Maria González", property: "Hyatt Ziva Cancún", room: "Ocean Front Suite",
    nights: 5, baseRate: 1550, taxes: 232, grandTotal: 1782,
    dateRange: "Aug 10–15, 2024 · 5 nights", headerText: "DESPEGAR",
    paymentRecovered: "Pix", confirmation: "DSP-2024-73041", market: "Brazil",
    bankOffer: "Itaú Bank: 5% cashback on this booking", bankSaving: ""
  },
  baholidays: {
    guest: "Zhang Wei", property: "Executive Club Dubai Package", room: "Return flights + 4 nights hotel",
    nights: 4, baseRate: 1680, taxes: 252, grandTotal: 1932,
    dateRange: "Oct 18–22, 2024", headerText: "BRITISH AIRWAYS HOLIDAYS",
    paymentRecovered: "Alipay", confirmation: "BA-2024-52917", market: "China",
    bankOffer: "ICBC: Save ¥800 on this package", bankSaving: ""
  }
}

// Account-specific configurations
const getAccountConfig = (account: Account) => {
  const isCarRental = account.id === "hertz" || account.id === "avis" || account.id === "enterprise"
  const isOTA = ["expedia", "booking", "agoda"].includes(account.id)
  const isAirline = account.id === "baholidays"
  const isGenericHotel = account.id === "generic-hotel"
  const isWyndham = account.id === "wyndham"
  const isMarriott = account.id === "marriott"
  const isIHG = account.id === "ihg"
  const isHertz = account.id === "hertz"
  const isDespegar = account.id === "despegar"
  const isBAHolidays = account.id === "baholidays"
  const hasCustomDemo = CUSTOM_DEMO_ACCOUNTS.includes(account.id)
  const phoneData = PHONE_DATA[account.id]
  
  const bookingAmount = phoneData?.grandTotal || account.avgBooking || 450
  const guestName = phoneData?.guest || (isAirline ? "Maria Santos" : "Raj Kumar")
  const itemName = phoneData?.room || (isCarRental ? "Full-Size SUV" : isAirline ? "London to Barcelona" : "Deluxe King Room")
  const property = phoneData?.property || ""
  const itemDetails = isCarRental ? "Nissan Pathfinder or similar" : isAirline ? "Flight + Hotel Package" : ""
  const dateRange = phoneData?.dateRange || (isCarRental ? "May 6 - May 9, 2024 (3 days)" : isAirline ? "Jun 30 - Jul 6, 2024 (6 nights)" : "Mar 15 - Mar 18, 2024 (3 nights)")
  const headerText = phoneData?.headerText || (isCarRental ? "Complete Your Rental" : isAirline ? "Complete Your Package" : "Complete Your Booking")
  const baseRate = phoneData?.baseRate || Math.round(bookingAmount * 0.82)
  const taxes = phoneData?.taxes || (bookingAmount - baseRate)
  const market = phoneData?.market || "India"
  const paymentRecovered = phoneData?.paymentRecovered || "Klarna"
  const confirmation = phoneData?.confirmation || `${account.name.slice(0,3).toUpperCase()}-2024-78456`
  const bankOffer = phoneData?.bankOffer
  const bankSaving = phoneData?.bankSaving
  
  return { 
    isCarRental, isOTA, isAirline, isGenericHotel, isWyndham, isMarriott, isIHG, isHertz, isDespegar, isBAHolidays, hasCustomDemo, 
    bookingAmount, guestName, itemName, property, itemDetails, dateRange, headerText,
    baseRate, taxes, market, paymentRecovered, confirmation, bankOffer, bankSaving
  }
}

interface PhoneMockupProps {
  state: "checkout" | "failure" | "activating" | "options" | "processing" | "confirmed"
  account: Account
  step?: number
}

export function PhoneMockup({ state, account, step }: PhoneMockupProps) {
  const config = getAccountConfig(account)
  
  return (
    <div className="relative">
      {/* Floating Payment Chips - Only on Step 4 - The "Expanded Universe" Effect */}
      {state === "options" && (
        <>
          {/* Outer glow ring */}
          <div className="absolute inset-0 -m-12 rounded-full bg-gradient-to-r from-blue-200/30 via-green-200/20 to-amber-200/30 blur-2xl animate-pulse" />
          
          {/* Left side floating chips - Market specific */}
          <div className="absolute -left-24 top-12 flex flex-col gap-3 opacity-60">
            {config.isMarriott || config.isBAHolidays ? (
              <>
                <PaymentChip label="Alipay" delay="0ms" highlight />
                <PaymentChip label="WeChat Pay" delay="100ms" highlight />
                <PaymentChip label="UnionPay" delay="200ms" />
              </>
            ) : config.isDespegar ? (
              <>
                <PaymentChip label="Pix" delay="0ms" highlight />
                <PaymentChip label="Boleto" delay="100ms" highlight />
                <PaymentChip label="Parcelamento" delay="200ms" />
              </>
            ) : (
              <>
                <PaymentChip label="Google Pay" delay="0ms" highlight={config.isWyndham || config.isIHG || config.isHertz} />
                <PaymentChip label="PhonePe" delay="100ms" highlight={config.isWyndham || config.isIHG || config.isHertz} />
                <PaymentChip label="Paytm" delay="200ms" />
              </>
            )}
          </div>
          <div className="absolute -left-20 bottom-24 flex flex-col gap-3 opacity-50">
            {config.isMarriott || config.isBAHolidays ? (
              <PaymentChip label="Bank of China" delay="400ms" highlight />
            ) : config.isDespegar ? (
              <>
                <PaymentChip label="Itaú" delay="400ms" highlight />
                <PaymentChip label="Elo" delay="500ms" />
              </>
            ) : (
              <>
                <PaymentChip label="BHIM UPI" delay="400ms" highlight={config.isWyndham || config.isIHG || config.isHertz} />
                <PaymentChip label="Rupay" delay="500ms" />
              </>
            )}
          </div>
          
          {/* Right side floating chips - BNPL & Global */}
          <div className="absolute -right-24 top-20 flex flex-col gap-3 opacity-60">
            {config.isMarriott || config.isBAHolidays ? (
              <>
                <PaymentChip label="UnionPay EMI" delay="150ms" />
                <PaymentChip label="Installments" delay="250ms" />
              </>
            ) : config.isDespegar ? (
              <>
                <PaymentChip label="12x sem juros" delay="150ms" highlight />
                <PaymentChip label="Hipercard" delay="250ms" />
              </>
            ) : (
              <>
                <PaymentChip label="Klarna" delay="150ms" highlight={!config.hasCustomDemo} />
                <PaymentChip label="Affirm" delay="250ms" />
                <PaymentChip label="EMI" delay="350ms" highlight={config.isWyndham || config.isIHG || config.isHertz} />
              </>
            )}
          </div>
          <div className="absolute -right-20 bottom-28 flex flex-col gap-3 opacity-50">
            <PaymentChip label={config.bankOffer?.split(":")[0] || "Bank Offer"} delay="450ms" highlight={config.hasCustomDemo} />
          </div>
          
          {/* Top floating chip */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-60">
            <PaymentChip label={config.isDespegar ? "Pix Instantâneo" : "Bank Transfer"} delay="300ms" />
          </div>
        </>
      )}

      {/* Phone Frame - Enhanced with glass effect, shadow, and slight tilt */}
      <div 
        className="relative h-[600px] w-[300px] rounded-[44px] border-[10px] border-gray-900 bg-gray-900 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5),0_30px_60px_-30px_rgba(0,0,0,0.6)]"
        style={{ transform: "rotate(1deg)" }}
      >
        {/* Glass reflection overlay */}
        <div className="absolute inset-0 rounded-[34px] bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none z-20" />
        
        {/* Subtle edge highlight */}
        <div className="absolute -inset-[1px] rounded-[45px] bg-gradient-to-b from-gray-600 via-gray-800 to-gray-900 -z-10" />
        
        {/* Notch */}
        <div className="absolute left-1/2 top-2 z-30 h-7 w-28 -translate-x-1/2 rounded-full bg-gray-900">
          {/* Camera dot */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-gray-800 border border-gray-700">
            <div className="absolute inset-1 rounded-full bg-gray-900" />
          </div>
        </div>
        
        {/* Screen */}
        <div className="h-full w-full overflow-hidden rounded-[34px] bg-white">
          {/* Status Bar */}
          <div className="flex items-center justify-between bg-gray-100 px-6 pt-10 pb-2 text-xs text-gray-600">
            <span className="font-medium">9:41</span>
            <div className="flex items-center gap-1">
              <div className="flex gap-0.5">
                <div className="h-2.5 w-0.5 rounded-full bg-gray-600" />
                <div className="h-2.5 w-0.5 rounded-full bg-gray-600" />
                <div className="h-2.5 w-0.5 rounded-full bg-gray-600" />
                <div className="h-2.5 w-0.5 rounded-full bg-gray-300" />
              </div>
              <div className="ml-1 h-2.5 w-5 rounded-sm bg-gray-600">
                <div className="h-full w-3/4 rounded-sm bg-green-500" />
              </div>
            </div>
          </div>

          {/* Brand Header */}
          <div
            className="px-4 py-3 text-white relative overflow-hidden"
            style={{ backgroundColor: account.color === "#FFD100" ? "#1a1a1a" : account.color }}
          >
            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "16px 16px" }} />
            <p className="text-xs font-medium opacity-80">{account.name}</p>
            <p className="text-sm font-semibold">{config.headerText}</p>
          </div>

          {/* Screen Content */}
          <div className="h-[calc(100%-110px)] overflow-y-auto p-4">
            {state === "checkout" && <CheckoutScreen account={account} />}
            {state === "failure" && <FailureScreen account={account} />}
            {state === "activating" && <ActivatingScreen account={account} />}
            {state === "options" && <OptionsScreen account={account} />}
            {state === "processing" && <ProcessingScreen account={account} />}
            {state === "confirmed" && <ConfirmedScreen account={account} />}
          </div>
        </div>
        
        {/* Bottom indicator bar */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 h-1 w-24 rounded-full bg-gray-600 z-30" />
      </div>
    </div>
  )
}

function PaymentChip({ label, delay = "0ms", highlight = false }: { label: string; delay?: string; highlight?: boolean }) {
  return (
    <div 
      className={`rounded-full px-3 py-1.5 text-xs font-medium shadow-lg whitespace-nowrap animate-fade-in-float backdrop-blur-sm ${
        highlight 
          ? "bg-green-50/90 text-green-700 border border-green-300 ring-1 ring-green-200" 
          : "bg-white/90 text-gray-700 border border-gray-200"
      }`}
      style={{ animationDelay: delay }}
    >
      {label}
    </div>
  )
}

function CheckoutScreen({ account }: { account: Account }) {
  const config = getAccountConfig(account)
  const showCustomCheckout = config.isWyndham || config.isMarriott || config.isIHG || config.isHertz || config.isDespegar || config.isBAHolidays
  const missingMethodsNote = config.isDespegar ? "Brazilian payment methods not available" : 
    config.isBAHolidays || config.market === "China" ? "Chinese payment methods not available" : 
    "Indian payment methods not available"
  
  return (
    <div className="space-y-4">
      {/* Guest Name for custom accounts */}
      {showCustomCheckout && (
        <div className="rounded-lg bg-blue-50 border border-blue-100 p-2 text-center">
          <p className="text-xs text-blue-600">Booking for: <span className="font-semibold">{config.guestName}</span></p>
        </div>
      )}
      
      {/* Selection Details */}
      <div className="rounded-lg border border-gray-200 p-3">
        <p className="text-xs text-gray-500">{config.isCarRental ? "Vehicle Selection" : config.isAirline ? "Package Selection" : "Room Selection"}</p>
        <p className="font-medium text-gray-900">{config.itemName}</p>
        {config.property && <p className="text-xs text-gray-500">{config.property}</p>}
        {config.itemDetails && <p className="text-xs text-gray-500">{config.itemDetails}</p>}
        <p className="text-sm text-gray-600 whitespace-pre-line">{config.dateRange}</p>
      </div>

      {/* Price Breakdown */}
      <div className="space-y-2 rounded-lg bg-gray-50 p-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">{config.isCarRental ? "Base" : config.isAirline ? "Package Rate" : "Room rate"}</span>
          <span className="text-gray-900">${config.baseRate.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Taxes</span>
          <span className="text-gray-900">${config.taxes.toLocaleString()}</span>
        </div>
        <div className="border-t border-gray-200 pt-2">
          <div className="flex justify-between font-medium">
            <span className="text-gray-900">Total</span>
            <span className="text-gray-900">${config.bookingAmount.toLocaleString()}.00</span>
          </div>
        </div>
      </div>

      {/* Payment Method Section */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-900">Payment Method</p>
        {showCustomCheckout ? (
          <div className="rounded-lg border border-gray-200 p-3 space-y-2">
            {["Visa", "Mastercard", "American Express"].map((card) => (
              <div key={card} className="flex items-center gap-3">
                <div className="h-4 w-4 rounded border border-gray-300" />
                <CreditCard className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-700">{card}</span>
              </div>
            ))}
            <p className="text-xs text-[#9CA3AF] mt-2">{missingMethodsNote}</p>
          </div>
        ) : (
          <div className="rounded-lg border border-gray-200 p-3">
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Visa •••• 4242</p>
                <p className="text-xs text-gray-500">Expires 03/24</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pay Button */}
      <button
        className="w-full rounded-lg py-3 text-sm font-medium transition-all hover:opacity-90 active:scale-[0.98]"
        style={{ 
          backgroundColor: account.color === "#FFD100" ? "#1a1a1a" : account.color,
          color: account.color === "#FFD100" ? "#FFD100" : "white"
        }}
      >
        {config.isCarRental ? `Confirm Rental — $${config.bookingAmount.toLocaleString()}.00` : `Pay $${config.bookingAmount.toLocaleString()}.00`}
      </button>
    </div>
  )
}

function FailureScreen({ account }: { account: Account }) {
  const config = getAccountConfig(account)
  const showAbandonedCheckout = config.isWyndham || config.isMarriott || config.isIHG || config.isHertz || config.isDespegar || config.isBAHolidays
  
  // Custom accounts: Abandoned empty checkout (guest left silently)
  if (showAbandonedCheckout) {
    return (
      <div className="space-y-4">
        {/* Selection Details */}
        <div className="rounded-lg border border-gray-200 p-3">
          <p className="text-xs text-gray-500">{config.isCarRental ? "Vehicle Selection" : "Room Selection"}</p>
          <p className="font-medium text-gray-900">{config.itemName}</p>
          {config.property && <p className="text-xs text-gray-500">{config.property}</p>}
          <p className="text-sm text-gray-600 whitespace-pre-line">{config.dateRange} · ${config.bookingAmount.toLocaleString()}</p>
        </div>

        {/* Payment Method - Still showing unchecked options */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-900">Payment Method</p>
          <div className="rounded-lg border border-gray-200 p-3 space-y-2">
            {["Visa", "Mastercard", "American Express"].map((card) => (
              <div key={card} className="flex items-center gap-3">
                <div className="h-4 w-4 rounded border border-gray-300" />
                <CreditCard className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-700">{card}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Session inactive text */}
        <p className="text-xs text-gray-400 text-center">Session inactive</p>

        {/* Disabled Complete Booking button */}
        <button
          className="w-full rounded-lg py-3 text-sm font-medium text-gray-400 bg-gray-100 cursor-not-allowed"
          disabled
        >
          Complete Booking
        </button>
      </div>
    )
  }
  
  // Other accounts: Standard card declined flow
  return (
    <div className="space-y-4">
      {/* Selection Details */}
      <div className="rounded-lg border border-gray-200 p-3">
        <p className="text-xs text-gray-500">{config.isCarRental ? "Vehicle Selection" : config.isAirline ? "Package Selection" : "Room Selection"}</p>
        <p className="font-medium text-gray-900">{config.itemName}</p>
        {config.itemDetails && <p className="text-xs text-gray-500">{config.itemDetails}</p>}
        <p className="text-sm text-gray-600">{config.dateRange}</p>
        <p className="text-sm font-semibold text-gray-900 mt-1">${config.bookingAmount.toLocaleString()}</p>
      </div>

      {/* Payment Method with Declined Status */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-900">Payment Method</p>
        <div className="rounded-lg border border-gray-200 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Visa •••• 4242</p>
                <p className="text-xs text-[#B91C1C]">Card declined</p>
              </div>
            </div>
            <X className="h-4 w-4 text-[#B91C1C]" />
          </div>
        </div>
      </div>

      {/* Warning Box - Amber */}
      <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
        <p className="text-sm font-medium text-amber-800">Payment unsuccessful</p>
        <p className="text-xs text-amber-700 mt-1">
          Your card was declined. Please try a different payment method.
        </p>
      </div>

      {/* Finding alternatives spinner */}
      <div className="flex items-center justify-center gap-2 py-2">
        <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
        <p className="text-sm text-gray-500">Finding alternative options...</p>
      </div>

      {/* Disabled Complete Booking button */}
      <button
        className="w-full rounded-lg py-3 text-sm font-medium text-gray-400 bg-gray-100 cursor-not-allowed"
        disabled
      >
        Complete Booking
      </button>
    </div>
  )
}

function ActivatingScreen({ account }: { account: Account }) {
  const config = getAccountConfig(account)
  
  return (
    <div className="space-y-4">
      {/* RG Pay Activating */}
      <div className="flex flex-col items-center rounded-lg border-2 border-blue-200 bg-gradient-to-b from-blue-50 to-white p-6">
        <div className="relative mb-3">
          {/* Outer pulse ring */}
          <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ backgroundColor: account.color === "#FFD100" ? "#1a1a1a" : account.color }} />
          <div
            className="relative flex h-14 w-14 items-center justify-center rounded-full"
            style={{ backgroundColor: account.color === "#FFD100" ? "#1a1a1a" : account.color }}
          >
            <Loader2 className="h-7 w-7 animate-spin text-white" />
          </div>
        </div>
        <p className="font-semibold text-gray-900">RG Pay Activating</p>
        <p className="mt-1 text-center text-sm text-gray-600">
          Loading alternative payment options...
        </p>
        
        {/* Activity indicator dots */}
        <div className="flex gap-1 mt-3">
          <div className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>

      {/* Reassurance */}
      <div className="rounded-lg border border-green-200 bg-green-50 p-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-green-600" />
          <p className="text-sm font-medium text-green-800">
            No redirect. Same session.
          </p>
        </div>
        <p className="text-xs text-green-600 mt-1">
          Your {config.isCarRental ? "rental" : "booking"} details are preserved.
        </p>
      </div>

      {/* Booking Summary */}
      <div className="rounded-lg border border-gray-200 p-3">
        <p className="text-xs text-gray-500">Your {config.isCarRental ? "Rental" : "Booking"}</p>
        <p className="font-medium text-gray-900">{config.itemName}</p>
        {config.itemDetails && <p className="text-xs text-gray-500">{config.itemDetails}</p>}
        <p className="text-sm text-gray-600">{config.dateRange}</p>
        <p className="text-sm font-semibold text-gray-900 mt-2">${config.bookingAmount.toLocaleString()}</p>
      </div>
    </div>
  )
}

function OptionsScreen({ account }: { account: Account }) {
  const config = getAccountConfig(account)
  const effectiveColor = account.color === "#FFD100" ? "#1a1a1a" : account.color
  
  // Despegar - Brazil market checkout
  if (config.isDespegar) {
    return (
      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-900">Choose Payment Method</p>
        
        {/* Pix Section - Recommended */}
        <div className="rounded-lg bg-[#F3EEFF] border border-[#8021FF]/30 p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-[#8021FF]" />
              <span className="text-sm font-semibold text-gray-900">Pix — Instant bank transfer</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#8021FF] text-white font-medium">Recommended</span>
          </div>
          <p className="text-[10px] text-[#8021FF] text-center">Confirmed in seconds</p>
        </div>

        {/* Installments */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Installments</p>
          <OptionButton icon={<Clock className="h-4 w-4" />} title="Parcelamento" subtitle="up to 12x sem juros" color={effectiveColor} />
          <OptionButton icon={<CreditCard className="h-4 w-4" />} title="Cartão Parcelado" subtitle="Split payments" color={effectiveColor} />
        </div>

        {/* Boleto */}
        <OptionButton icon={<Building2 className="h-4 w-4" />} title="Boleto Bancário" subtitle="Pay at any bank" color={effectiveColor} />

        {/* Cards */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Cards</p>
          <OptionButton icon={<CreditCard className="h-4 w-4" />} title="Credit / Debit Card" subtitle="Visa, Mastercard, Elo, Hipercard" logos={["V", "M", "E"]} color={effectiveColor} />
        </div>

        {/* Bank Offer */}
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-medium text-gray-900">{config.bankOffer}</span>
          </div>
          <div className="flex items-center justify-end">
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-200 text-amber-800 font-medium">Valid today only</span>
          </div>
        </div>

        <button className="w-full rounded-lg py-3 text-sm font-medium text-white transition-all hover:opacity-90" style={{ backgroundColor: effectiveColor }}>
          Continue
        </button>
      </div>
    )
  }

  // BA Holidays - China market checkout
  if (config.isBAHolidays) {
    return (
      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-900">Choose Payment Method</p>
        
        {/* Alipay Section - Recommended */}
        <div className="rounded-lg bg-[#F3EEFF] border border-[#8021FF]/30 p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-[#8021FF]" />
              <span className="text-sm font-semibold text-gray-900">Alipay — Instant QR payment</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#8021FF] text-white font-medium">Recommended</span>
          </div>
          <p className="text-[10px] text-[#8021FF] text-center">Instant authorization</p>
        </div>

        {/* WeChat Pay */}
        <OptionButton icon={<Wallet className="h-4 w-4" />} title="WeChat Pay" subtitle="Scan to pay" color={effectiveColor} />

        {/* UnionPay */}
        <div className="space-y-2">
          <OptionButton icon={<CreditCard className="h-4 w-4" />} title="UnionPay" subtitle="Debit or credit" color={effectiveColor} />
          <OptionButton icon={<Clock className="h-4 w-4" />} title="UnionPay Installments" subtitle="Split into payments" color={effectiveColor} />
        </div>

        {/* Cards */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Cards</p>
          <OptionButton icon={<CreditCard className="h-4 w-4" />} title="Credit / Debit Card" subtitle="Visa, Mastercard, UnionPay" logos={["V", "M", "U"]} color={effectiveColor} />
        </div>

        {/* Bank Offer */}
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-medium text-gray-900">{config.bankOffer}</span>
          </div>
          <div className="flex items-center justify-end">
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-200 text-amber-800 font-medium">Valid today only</span>
          </div>
        </div>

        <button className="w-full rounded-lg py-3 text-sm font-medium text-white transition-all hover:opacity-90" style={{ backgroundColor: effectiveColor }}>
          Continue
        </button>
      </div>
    )
  }

  // Marriott - China market checkout
  if (config.isMarriott) {
    return (
      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-900">Choose Payment Method</p>
        
        {/* Alipay Section - Recommended */}
        <div className="rounded-lg bg-[#F3EEFF] border border-[#8021FF]/30 p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-[#8021FF]" />
              <span className="text-sm font-semibold text-gray-900">Alipay — Instant QR payment</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#8021FF] text-white font-medium">Recommended</span>
          </div>
          <p className="text-[10px] text-[#8021FF] text-center">Instant authorization</p>
        </div>

        {/* WeChat Pay */}
        <OptionButton icon={<Wallet className="h-4 w-4" />} title="WeChat Pay" subtitle="Scan to pay" color={effectiveColor} />

        {/* UnionPay */}
        <div className="space-y-2">
          <OptionButton icon={<CreditCard className="h-4 w-4" />} title="UnionPay" subtitle="Debit or credit" color={effectiveColor} />
          <OptionButton icon={<Clock className="h-4 w-4" />} title="UnionPay Installments" subtitle="Split into payments" color={effectiveColor} />
        </div>

        {/* Cards */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Cards</p>
          <OptionButton icon={<CreditCard className="h-4 w-4" />} title="Credit / Debit Card" subtitle="Visa, Mastercard, UnionPay" logos={["V", "M", "U"]} color={effectiveColor} />
        </div>

        {/* Bank Offer */}
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-medium text-gray-900">{config.bankOffer}</span>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-600">{config.bankSaving}</p>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-200 text-amber-800 font-medium">Valid today only</span>
          </div>
        </div>

        <button className="w-full rounded-lg py-3 text-sm font-medium text-white transition-all hover:opacity-90" style={{ backgroundColor: effectiveColor }}>
          Continue
        </button>
      </div>
    )
  }

  // IHG or Hertz - India market checkout
  if (config.isIHG || config.isHertz) {
    return (
      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-900">Choose Payment Method</p>
        
        {/* UPI Section - Recommended */}
        <div className="rounded-lg bg-[#F3EEFF] border border-[#8021FF]/30 p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-[#8021FF]" />
              <span className="text-sm font-semibold text-gray-900">UPI — Instant payment</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#8021FF] text-white font-medium">Recommended</span>
          </div>
          <div className="flex gap-2 mt-2">
            {["Google Pay", "PhonePe", "Paytm", "BHIM"].map((app) => (
              <button key={app} className="flex-1 rounded-lg border border-gray-200 bg-white px-2 py-2 text-[10px] font-medium text-gray-700 hover:border-[#8021FF] hover:bg-[#F3EEFF] transition-all">
                {app}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-[#8021FF] mt-2 text-center">Instant authorization</p>
        </div>

        {/* IHG has EMI options, Hertz skips */}
        {config.isIHG && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">EMI</p>
            <OptionButton icon={<Clock className="h-4 w-4" />} title="HDFC EMI" subtitle="Monthly payments" color={effectiveColor} />
            <OptionButton icon={<Clock className="h-4 w-4" />} title="ICICI EMI" subtitle="Monthly payments" color={effectiveColor} />
          </div>
        )}

        {/* Wallets */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Wallets</p>
          <OptionButton icon={<Wallet className="h-4 w-4" />} title="Paytm" subtitle="Wallet balance" color={effectiveColor} />
          <OptionButton icon={<Wallet className="h-4 w-4" />} title="Amazon Pay India" subtitle="Wallet balance" color={effectiveColor} />
        </div>

        {/* BNPL */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Buy Now, Pay Later</p>
          <OptionButton icon={<Clock className="h-4 w-4" />} title="ZestMoney" subtitle="Pay in EMI" color={effectiveColor} />
          <OptionButton icon={<Clock className="h-4 w-4" />} title="LazyPay" subtitle="Pay later" color={effectiveColor} />
        </div>

        {/* Cards */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Cards</p>
          <OptionButton icon={<CreditCard className="h-4 w-4" />} title="Credit / Debit Card" subtitle="Visa, Mastercard, Rupay" logos={["V", "M", "R"]} color={effectiveColor} />
        </div>

        {/* Bank Offer */}
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-medium text-gray-900">{config.bankOffer}</span>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-600">{config.bankSaving}</p>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-200 text-amber-800 font-medium">Valid today only</span>
          </div>
        </div>

        <button className="w-full rounded-lg py-3 text-sm font-medium text-white transition-all hover:opacity-90" style={{ backgroundColor: effectiveColor }}>
          Continue
        </button>
      </div>
    )
  }
  
  // Wyndham - India market checkout
  if (config.isWyndham) {
    return (
      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-900">Choose Payment Method</p>
        
        {/* UPI Section - Highlighted as top option */}
        <div className="space-y-2">
          <div className="rounded-lg bg-[#F3EEFF] border border-[#8021FF]/30 p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-[#8021FF]" />
                <span className="text-sm font-semibold text-gray-900">UPI — Instant payment</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#8021FF] text-white font-medium">Recommended</span>
            </div>
            <div className="flex gap-2 mt-2">
              {["Google Pay", "PhonePe", "Paytm", "BHIM"].map((app) => (
                <button
                  key={app}
                  className="flex-1 rounded-lg border border-gray-200 bg-white px-2 py-2 text-[10px] font-medium text-gray-700 hover:border-[#8021FF] hover:bg-[#F3EEFF] transition-all"
                >
                  {app}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-[#8021FF] mt-2 text-center">Instant authorization</p>
          </div>
        </div>

        {/* Cards Section */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Cards</p>
          <OptionButton 
            icon={<CreditCard className="h-4 w-4" />}
            title="Credit / Debit Card"
            subtitle="Visa, Mastercard, Rupay"
            logos={["V", "M", "R"]}
            color={effectiveColor}
          />
        </div>

        {/* BNPL Section */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Buy Now, Pay Later</p>
          <OptionButton 
            icon={<Clock className="h-4 w-4" />}
            title="Klarna"
            subtitle="Pay in 4 interest-free payments"
            color={effectiveColor}
          />
          <OptionButton 
            icon={<Clock className="h-4 w-4" />}
            title="Affirm"
            subtitle="Monthly payments"
            color={effectiveColor}
          />
        </div>

        {/* Bank Offers Section */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Bank Offers</p>
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="h-4 w-4 text-amber-600" />
              <span className="text-sm font-medium text-gray-900">{config.bankOffer}</span>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-600">{config.bankSaving}</p>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-200 text-amber-800 font-medium">Valid today only</span>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <button
          className="w-full rounded-lg py-3 text-sm font-medium text-white transition-all hover:opacity-90"
          style={{ backgroundColor: effectiveColor }}
        >
          Continue
        </button>
      </div>
    )
  }
  
  // Default checkout for other accounts
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-gray-900">Choose Payment Method</p>
      
      {/* Recommended highlight */}
      <div className="rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 p-2 text-center">
        <p className="text-xs font-medium text-amber-800">
          Recommended for this guest — highest approval likelihood
        </p>
      </div>

      {/* Cards Section */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Cards</p>
        <OptionButton 
          icon={<CreditCard className="h-4 w-4" />}
          title="Credit / Debit Card"
          subtitle="Visa, Mastercard, Amex"
          logos={["V", "M", "A"]}
          color={effectiveColor}
        />
      </div>

      {/* BNPL Section - Highlighted */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Buy Now, Pay Later</p>
        <OptionButton 
          icon={<Clock className="h-4 w-4" />}
          title="Klarna"
          subtitle="Pay in 4 interest-free payments"
          recommended
          color={effectiveColor}
        />
        <OptionButton 
          icon={<Clock className="h-4 w-4" />}
          title="Affirm"
          subtitle="Monthly payments"
          color={effectiveColor}
        />
        <OptionButton 
          icon={<Clock className="h-4 w-4" />}
          title="Afterpay"
          subtitle="Pay in 4"
          color={effectiveColor}
        />
      </div>

      {/* Global Methods Section */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Global Methods</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { name: "UPI", region: "India" },
            { name: "Alipay", region: "China" },
            { name: "GrabPay", region: "SEA" },
            { name: "iDEAL", region: "NL" },
          ].map((method) => (
            <button
              key={method.name}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-xs font-medium text-gray-700 transition-all hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm"
            >
              <span>{method.name}</span>
              <span className="text-gray-400 text-[10px]">({method.region})</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function OptionButton({ 
  icon, 
  title, 
  subtitle, 
  recommended, 
  logos,
  color 
}: { 
  icon: React.ReactNode
  title: string
  subtitle: string
  recommended?: boolean
  logos?: string[]
  color: string
}) {
  return (
    <button
      className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-all hover:shadow-md ${
        recommended 
          ? "border-green-300 bg-gradient-to-r from-green-50 to-emerald-50 ring-1 ring-green-200" 
          : "border-gray-200 bg-white hover:border-gray-300"
      }`}
    >
      <div
        className="flex h-9 w-9 items-center justify-center rounded-lg"
        style={{ backgroundColor: `${color}15` }}
      >
        <div style={{ color }}>{icon}</div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-gray-900 truncate">{title}</p>
          {recommended && (
            <span className="shrink-0 rounded bg-green-500 px-1.5 py-0.5 text-[10px] font-medium text-white">
              Best
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 truncate">{subtitle}</p>
      </div>
      {logos && (
        <div className="flex -space-x-1">
          {logos.map((logo) => (
            <div key={logo} className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-[10px] font-bold text-gray-600 border border-white">
              {logo}
            </div>
          ))}
        </div>
      )}
    </button>
  )
}

function ProcessingScreen({ account }: { account: Account }) {
  const config = getAccountConfig(account)
  const installment = (config.bookingAmount / 4).toFixed(2)
  const showInstantPayment = config.isWyndham || config.isMarriott || config.isIHG || config.isHertz || config.isDespegar || config.isBAHolidays
  
  // Instant payment for custom accounts (UPI / Alipay / Pix)
  if (showInstantPayment) {
    // Despegar uses Portuguese
    if (config.isDespegar) {
      return (
        <div className="space-y-4">
          {/* Processing Animation */}
          <div className="flex flex-col items-center rounded-lg bg-gradient-to-b from-green-50 to-white p-6 border border-green-100">
            <div className="relative mb-3">
              <div className="absolute inset-0 -m-2 rounded-full bg-green-200 animate-ping opacity-30" />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-green-500">
                <Check className="h-8 w-8 text-white" />
              </div>
            </div>
            <p className="font-semibold text-gray-900">Pagamento Confirmado</p>
            <p className="mt-1 text-sm text-gray-600">Pix — Transferência instantânea</p>
          </div>

          {/* Transaction Details */}
          <div className="space-y-2 rounded-lg border border-gray-200 p-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Amount</span>
              <span className="font-medium text-gray-900">${config.bookingAmount.toLocaleString()}.00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Method</span>
              <span className="font-medium text-gray-900">Pix</span>
            </div>
            <div className="flex justify-between text-sm border-t border-gray-100 pt-2">
              <span className="text-gray-500">Status</span>
              <span className="font-medium text-green-600 flex items-center gap-1">
                <Check className="h-3 w-3" />
                Confirmado
              </span>
            </div>
          </div>
          
          {/* Creating reservation */}
          <div className="flex items-center justify-center gap-2 py-2">
            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
            <p className="text-sm text-gray-500">Criando sua reserva...</p>
          </div>
        </div>
      )
    }
    
    const methodLabel = config.isMarriott || config.isBAHolidays ? "Alipay — QR scan" : "UPI — Instant payment"
    const methodShort = config.isMarriott || config.isBAHolidays ? "Alipay" : "UPI"
    
    return (
      <div className="space-y-4">
        {/* Processing Animation */}
        <div className="flex flex-col items-center rounded-lg bg-gradient-to-b from-green-50 to-white p-6 border border-green-100">
          <div className="relative mb-3">
            {/* Outer ring pulse */}
            <div className="absolute inset-0 -m-2 rounded-full bg-green-200 animate-ping opacity-30" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-green-500">
              <Check className="h-8 w-8 text-white" />
            </div>
          </div>
          <p className="font-semibold text-gray-900">Payment Successful</p>
          <p className="mt-1 text-sm text-gray-600">{methodLabel}</p>
        </div>

        {/* Transaction Details */}
        <div className="space-y-2 rounded-lg border border-gray-200 p-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Amount</span>
            <span className="font-medium text-gray-900">${config.bookingAmount.toLocaleString()}.00</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Method</span>
            <span className="font-medium text-gray-900">{methodShort}</span>
          </div>
          <div className="flex justify-between text-sm border-t border-gray-100 pt-2">
            <span className="text-gray-500">Status</span>
            <span className="font-medium text-green-600 flex items-center gap-1">
              <Check className="h-3 w-3" />
              Confirmed
            </span>
          </div>
        </div>
        
        {/* Creating reservation */}
        <div className="flex items-center justify-center gap-2 py-2">
          <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
          <p className="text-sm text-gray-500">{config.isCarRental ? "Confirming your rental..." : "Preparing your itinerary..."}</p>
        </div>
      </div>
    )
  }
  
  // Default Klarna payment for other accounts
  return (
    <div className="space-y-4">
      {/* Processing Animation */}
      <div className="flex flex-col items-center rounded-lg bg-gradient-to-b from-green-50 to-white p-6 border border-green-100">
        <div className="relative mb-3">
          {/* Outer ring pulse */}
          <div className="absolute inset-0 -m-2 rounded-full bg-green-200 animate-ping opacity-30" />
          <div
            className="relative flex h-16 w-16 items-center justify-center rounded-full"
            style={{ backgroundColor: `${account.color}20` }}
          >
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full"
              style={{ backgroundColor: account.color === "#FFD100" ? "#1a1a1a" : account.color }}
            >
              <Loader2 className="h-6 w-6 animate-spin text-white" />
            </div>
          </div>
        </div>
        <p className="font-semibold text-gray-900">Authorizing Payment</p>
        <p className="mt-1 text-sm text-gray-600">Klarna - Pay in 4</p>
      </div>

      {/* Transaction Details */}
      <div className="space-y-2 rounded-lg border border-gray-200 p-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Amount</span>
          <span className="font-medium text-gray-900">${config.bookingAmount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Method</span>
          <span className="font-medium text-gray-900">Klarna</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Installments</span>
          <span className="font-medium text-gray-900">4 × ${installment}</span>
        </div>
        <div className="flex justify-between text-sm border-t border-gray-100 pt-2">
          <span className="text-gray-500">Status</span>
          <span className="font-medium text-amber-600 flex items-center gap-1">
            <Loader2 className="h-3 w-3 animate-spin" />
            Authorizing...
          </span>
        </div>
      </div>
    </div>
  )
}

function ConfirmedScreen({ account }: { account: Account }) {
  const config = getAccountConfig(account)
  const installment = (config.bookingAmount / 4).toFixed(2)
  const showInstantPayment = config.isWyndham || config.isMarriott || config.isIHG || config.isHertz || config.isDespegar || config.isBAHolidays
  const paymentMethodLabel = config.isMarriott || config.isBAHolidays ? "Alipay — Instant" : config.isDespegar ? "Pix — Pago completo" : "UPI — Instant"
  
  // Despegar uses Portuguese labels
  if (config.isDespegar) {
    return (
      <div className="space-y-4">
        {/* Success State */}
        <div className="flex flex-col items-center rounded-lg bg-gradient-to-b from-green-100 to-green-50 p-6 border border-green-200">
          <div className="relative mb-3">
            <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-20" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-green-500">
              <Check className="h-8 w-8 text-white" />
            </div>
          </div>
          <p className="text-lg font-semibold text-green-800">Reserva Confirmada</p>
          <p className="mt-1 text-center text-sm text-green-600">
            #{config.confirmation}
          </p>
        </div>

        {/* Booking Details */}
        <div className="rounded-lg border border-gray-200 p-3">
          <p className="text-xs text-gray-500">Property</p>
          <p className="font-medium text-gray-900">{config.property}</p>
          <p className="text-xs text-gray-500 mt-1">Room</p>
          <p className="text-sm text-gray-900">{config.itemName}</p>
          <p className="text-sm text-gray-600 mt-1">{config.dateRange}</p>
          <p className="text-xs text-gray-500 mt-1">Guest: {config.guestName}</p>
          <p className="text-xs text-gray-500 mt-1">Payment: Pix — Pago completo</p>
          <p className="text-xs text-green-600 mt-2">Reservado direto · Melhor tarifa garantida</p>
        </div>

        {/* View button */}
        <button className="w-full rounded-lg py-3 text-sm font-medium text-white transition-all hover:opacity-90" style={{ backgroundColor: account.color }}>
          View Reservation
        </button>

        {/* RG Pay Attribution */}
        <div className="rounded-lg bg-gradient-to-r from-gray-900 to-gray-800 p-3 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shimmer" />
          <p className="text-[10px] text-gray-500 mb-1">RECOVERED BY</p>
          <p className="text-sm font-semibold text-white">RG Pay</p>
          <p className="text-xs text-green-400 mt-1">Direct booking secured</p>
        </div>
      </div>
    )
  }

  // BA Holidays
  if (config.isBAHolidays) {
    return (
      <div className="space-y-4">
        {/* Success State */}
        <div className="flex flex-col items-center rounded-lg bg-gradient-to-b from-green-100 to-green-50 p-6 border border-green-200">
          <div className="relative mb-3">
            <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-20" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-green-500">
              <Check className="h-8 w-8 text-white" />
            </div>
          </div>
          <p className="text-lg font-semibold text-green-800">Booking Confirmed</p>
          <p className="mt-1 text-center text-sm text-green-600">
            #{config.confirmation}
          </p>
        </div>

        {/* Booking Details */}
        <div className="rounded-lg border border-gray-200 p-3">
          <p className="text-xs text-gray-500">Package</p>
          <p className="font-medium text-gray-900">{config.property}</p>
          <p className="text-xs text-gray-500 mt-1">Flights + Hotel</p>
          <p className="text-sm text-gray-900">{config.dateRange}</p>
          <p className="text-xs text-gray-500 mt-2">Guest: {config.guestName}</p>
          <p className="text-xs text-gray-500 mt-1">Payment: Alipay · Paid in full</p>
          <p className="text-xs text-green-600 mt-2">Booked direct · Best rate guaranteed</p>
        </div>

        {/* View button */}
        <button className="w-full rounded-lg py-3 text-sm font-medium text-white transition-all hover:opacity-90" style={{ backgroundColor: account.color }}>
          View Itinerary
        </button>

        {/* RG Pay Attribution */}
        <div className="rounded-lg bg-gradient-to-r from-gray-900 to-gray-800 p-3 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shimmer" />
          <p className="text-[10px] text-gray-500 mb-1">RECOVERED BY</p>
          <p className="text-sm font-semibold text-white">RG Pay</p>
          <p className="text-xs text-green-400 mt-1">Direct booking secured</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="space-y-4">
      {/* Success State */}
      <div className="flex flex-col items-center rounded-lg bg-gradient-to-b from-green-100 to-green-50 p-6 border border-green-200">
        <div className="relative mb-3">
          {/* Success pulse */}
          <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-20" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-green-500">
            <Check className="h-8 w-8 text-white" />
          </div>
        </div>
        <p className="text-lg font-semibold text-green-800">{config.isCarRental ? "Rental Confirmed!" : "Booking Confirmed!"}</p>
        <p className="mt-1 text-center text-sm text-green-600">
          Confirmation #{config.confirmation}
        </p>
      </div>

      {/* Booking Details */}
      <div className="rounded-lg border border-gray-200 p-3">
        <p className="text-xs text-gray-500">Your {config.isCarRental ? "Rental" : "Reservation"}</p>
        <p className="font-medium text-gray-900">{config.itemName}</p>
        {config.property && <p className="text-xs text-gray-500">{config.property}</p>}
        {config.itemDetails && <p className="text-xs text-gray-500">{config.itemDetails}</p>}
        <p className="text-sm text-gray-600 whitespace-pre-line">{config.dateRange}</p>
        {showInstantPayment && <p className="text-xs text-gray-500 mt-1">Guest: {config.guestName}</p>}
        <p className="mt-2 text-sm font-medium" style={{ color: account.color === "#FFD100" ? "#1a1a1a" : account.color }}>
          {account.name}
        </p>
      </div>

      {/* Payment Summary */}
      <div className="rounded-lg bg-gray-50 p-3 space-y-2">
        <p className="text-xs font-medium text-gray-500">Payment Summary</p>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Total</span>
          <span className="font-medium text-gray-900">${config.bookingAmount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Method</span>
          <span className="font-medium text-gray-900">{showInstantPayment ? paymentMethodLabel : "Klarna (4 payments)"}</span>
        </div>
        {!showInstantPayment && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">First payment</span>
            <span className="font-medium text-gray-900">${installment} today</span>
          </div>
        )}
      </div>

      {/* RG Pay Attribution */}
      <div className="rounded-lg bg-gradient-to-r from-gray-900 to-gray-800 p-3 text-center relative overflow-hidden">
        {/* Subtle shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shimmer" />
        <p className="text-[10px] text-gray-500 mb-1">RECOVERED BY</p>
        <p className="text-sm font-semibold text-white">RG Pay</p>
        <p className="text-xs text-green-400 mt-1">Direct booking secured</p>
      </div>
    </div>
  )
}
