"use client"

// Demo Flow - Interactive 6-step recovery journey
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { PhoneMockup } from "@/components/phone-mockup"
import { ArrowLeft, ArrowRight, AlertTriangle, Loader2, CheckCircle2 } from "lucide-react"
import { Calculator } from "@/components/calculator"

interface Account {
  id: string
  name: string
  color: string
  avgBooking?: number
}

interface DemoFlowProps {
  account: Account
  onBack: () => void
}

// Custom demo accounts - these have tailored experiences
const CUSTOM_DEMO_ACCOUNTS = ["wyndham", "expedia", "despegar", "baholidays", "hertz", "marriott", "ihg"]

// Account-specific configurations with full persona data
const ACCOUNT_DATA: Record<string, {
  guest: string; origin: string; flag: string; property: string; room: string;
  nights: number; baseRate: number; taxes: number; grandTotal: number;
  ancillary: string; ancillaryAmount: number; recovered: number; commissionAvoided: number;
  confirmation: string; paymentRecovered: string; brandColor: string; headerText: string;
  market: string; channelLabel: string; otaName: string; isCarRental?: boolean;
}> = {
  wyndham: {
    guest: "Raj Kumar", origin: "Mumbai, India", flag: "🇮🇳", property: "Wyndham Pittsburgh",
    room: "Deluxe King Room", nights: 3, baseRate: 694, taxes: 153, grandTotal: 847,
    ancillary: "Breakfast Package", ancillaryAmount: 75, recovered: 922, commissionAvoided: 153,
    confirmation: "WYN-2024-32847", paymentRecovered: "UPI — Google Pay", brandColor: "#057AB8",
    headerText: "WYNDHAM", market: "India", channelLabel: "Direct — Wyndham.com", otaName: "MakeMyTrip"
  },
  marriott: {
    guest: "Li Wei", origin: "Shanghai, China", flag: "🇨🇳", property: "Paris Marriott Opera Ambassador",
    room: "Deluxe City View Room", nights: 4, baseRate: 1140, taxes: 182, grandTotal: 1322,
    ancillary: "Breakfast Package", ancillaryAmount: 120, recovered: 1442, commissionAvoided: 238,
    confirmation: "MAR-2024-49371", paymentRecovered: "Alipay", brandColor: "#B42534",
    headerText: "MARRIOTT BONVOY", market: "China", channelLabel: "Direct — Marriott Bonvoy", otaName: "Ctrip"
  },
  ihg: {
    guest: "Amit Patel", origin: "Bengaluru, India", flag: "🇮🇳", property: "InterContinental London Park Lane",
    room: "Classic King Room", nights: 3, baseRate: 1260, taxes: 189, grandTotal: 1449,
    ancillary: "Dining Credit", ancillaryAmount: 85, recovered: 1534, commissionAvoided: 261,
    confirmation: "IHG-2024-88214", paymentRecovered: "UPI — HDFC Bank", brandColor: "#003087",
    headerText: "IHG · INTERCONTINENTAL", market: "India", channelLabel: "Direct — IHG.com", otaName: "MakeMyTrip"
  },
  hertz: {
    guest: "Priya Sharma", origin: "Bengaluru, India", flag: "🇮🇳", property: "LAX Airport",
    room: "Toyota Camry · Full Size", nights: 7, baseRate: 623, taxes: 94, grandTotal: 717,
    ancillary: "Full Coverage Insurance", ancillaryAmount: 98, recovered: 815, commissionAvoided: 129,
    confirmation: "HTZ-2024-61829", paymentRecovered: "UPI — PhonePe", brandColor: "#FFD700",
    headerText: "HERTZ", market: "India", channelLabel: "Direct — Hertz.com", otaName: "competitor platform",
    isCarRental: true
  },
  despegar: {
    guest: "Maria González", origin: "São Paulo, Brazil", flag: "🇧🇷", property: "Hyatt Ziva Cancún",
    room: "Ocean Front Suite", nights: 5, baseRate: 1550, taxes: 232, grandTotal: 1782,
    ancillary: "All-Inclusive Upgrade", ancillaryAmount: 195, recovered: 1977, commissionAvoided: 320,
    confirmation: "DSP-2024-73041", paymentRecovered: "Pix", brandColor: "#0066CC",
    headerText: "DESPEGAR", market: "Brazil", channelLabel: "Direct — Despegar.com", otaName: "competitor"
  },
  baholidays: {
    guest: "Zhang Wei", origin: "Beijing, China", flag: "🇨🇳", property: "Executive Club Dubai Package",
    room: "Return flights + 4 nights hotel", nights: 4, baseRate: 1680, taxes: 252, grandTotal: 1932,
    ancillary: "Business Class Upgrade", ancillaryAmount: 350, recovered: 2282, commissionAvoided: 348,
    confirmation: "BA-2024-52917", paymentRecovered: "Alipay", brandColor: "#075AAA",
    headerText: "BRITISH AIRWAYS HOLIDAYS", market: "China", channelLabel: "Direct — BA Holidays", otaName: "Ctrip"
  }
}

// Account-specific configurations
const getAccountConfig = (account: Account) => {
  const isCarRental = account.id === "hertz" || account.id === "avis" || account.id === "enterprise"
  const isOTA = ["expedia", "despegar", "booking", "agoda"].includes(account.id)
  const isAirline = account.id === "baholidays"
  const isGenericHotel = account.id === "generic-hotel"
  const isWyndham = account.id === "wyndham"
  const isMarriott = account.id === "marriott"
  const isIHG = account.id === "ihg"
  const isHertz = account.id === "hertz"
  const isDespegar = account.id === "despegar"
  const isBAHolidays = account.id === "baholidays"
  const hasCustomDemo = CUSTOM_DEMO_ACCOUNTS.includes(account.id)
  const accountData = ACCOUNT_DATA[account.id]
  
  const bookingAmount = accountData?.grandTotal || account.avgBooking || 450
  const itemType = isCarRental ? "vehicle" : isAirline ? "package" : "room"
  const itemName = accountData?.room || (isCarRental ? "Full-Size SUV" : isAirline ? "London to Barcelona Package" : "Deluxe King Room")
  const dateRange = isCarRental ? "Jul 15 - Jul 22, 2024 (7 days)" : isAirline ? "Jun 30 - Jul 6, 2024 (6 nights)" : "Mar 15 - Mar 18, 2024 (3 nights)"
  const channelType = isOTA ? "platform" : "direct channel"
  
  // Guest persona based on account
  const guestName = accountData?.guest || (isAirline ? "Maria Santos" : "Raj Kumar")
  const guestOrigin = accountData?.origin || (isAirline ? "São Paulo, Brazil" : "Mumbai, India")
  const guestFlag = accountData?.flag || (isAirline ? "🇧🇷" : "🇮🇳")
  const property = accountData?.property || ""
  const channelLabel = accountData?.channelLabel || `Direct — ${account.name}`
  const otaName = accountData?.otaName || "OTA"
  const paymentRecovered = accountData?.paymentRecovered || "Alternative payment"
  const commissionAvoided = accountData?.commissionAvoided || Math.round(bookingAmount * 0.18)
  const market = accountData?.market || "India"
  
  return { 
    isCarRental, isOTA, isAirline, isGenericHotel, isWyndham, isMarriott, isIHG, isHertz, isDespegar, isBAHolidays, hasCustomDemo, 
    bookingAmount, itemType, itemName, dateRange, channelType, guestName, guestOrigin, guestFlag,
    property, channelLabel, otaName, paymentRecovered, commissionAvoided, market, accountData
  }
}

// Step 1 descriptions by account
const getStep1Description = (config: ReturnType<typeof getAccountConfig>, account: Account) => {
  if (config.isWyndham) return `Raj Kumar arrives at Wyndham's checkout ready to pay $847. The payment section shows only Visa, Mastercard, and Amex. No UPI. No Indian wallet. No EMI. Raj pays digitally for everything — just not by credit card.`
  if (config.isMarriott) return `Li Wei arrives at Marriott Bonvoy checkout ready to pay $1,322. Payment section shows only Visa, Mastercard, Amex. No Alipay. No WeChat Pay. No UnionPay. Li Wei pays digitally for everything — just not by credit card.`
  if (config.isIHG) return `Amit arrives at IHG.com ready to pay $1,449. Payment section shows only Visa, Mastercard, Amex. No UPI. No Indian wallet. No EMI. Amit uses UPI for everything — it's simply not there.`
  if (config.isHertz) return `Priya arrives at Hertz.com ready to confirm her $717 rental. Payment section shows only Visa, Mastercard, Amex. No UPI. No PhonePe. No Rupay. Priya pays via UPI daily — Hertz doesn't offer it.`
  if (config.isDespegar) return `Maria arrives at Despegar ready to pay $1,782 for her Cancún trip. Payment section shows only Visa, Mastercard, and Amex. No Pix. No Boleto. No parcelamento. Over 140 million Brazilians use Pix — it's not available here.`
  if (config.isBAHolidays) return `Zhang Wei arrives at BA Holidays ready to pay $1,932 for her Dubai package. Payment section shows only Visa, Mastercard, and Amex. No Alipay. No WeChat Pay. No UnionPay. Zhang Wei pays digitally for everything — none of it is here.`
  if (config.isCarRental) return `A customer has selected their vehicle, confirmed pickup dates, and is ready to pay. This rental is about to close — or be lost to a competitor.`
  if (config.isAirline) return `A traveler has selected their flight and hotel package, confirmed dates, and is ready to pay. This booking is about to close — or be lost.`
  if (config.isOTA) return `A guest has selected their ${config.itemType}, confirmed dates, and is ready to pay on ${account.name}. This booking is about to close — or be abandoned.`
  return `A guest has selected their ${config.itemType}, confirmed dates, and is ready to pay. Whether this stays a direct booking or becomes an OTA commission depends entirely on what happens at checkout.`
}

// Step 2 titles by account
const getStep2Title = (config: ReturnType<typeof getAccountConfig>) => {
  if (config.isWyndham) return "No UPI. No wallet. No EMI. Raj closed the tab."
  if (config.isMarriott) return "No Alipay. No WeChat Pay. Li Wei closed the tab."
  if (config.isIHG) return "No UPI. No EMI. Amit closed the tab."
  if (config.isHertz) return "No UPI. No PhonePe. Priya closed the tab."
  if (config.isDespegar) return "No Pix. No Boleto. Maria closed the tab."
  if (config.isBAHolidays) return "No Alipay. No WeChat Pay. Zhang Wei closed the tab."
  return "The checkout has nothing for this guest."
}

// Step 2 descriptions by account
const getStep2Description = (config: ReturnType<typeof getAccountConfig>) => {
  if (config.isWyndham) return `Wyndham's checkout offered three credit card options. Raj uses UPI for everything. There was nothing for him — so he left. Wyndham never saw an error. The booking just disappeared — and Raj is now on MakeMyTrip.`
  if (config.isMarriott) return `Marriott Bonvoy offered three credit card options. Li Wei pays via Alipay for everything. Nothing for her — so she left. Marriott never saw an error. $1,322 simply didn't arrive — and Li Wei is now on Ctrip.`
  if (config.isIHG) return `IHG.com offered three credit card options. Amit uses UPI for everything. Nothing for him — so he left. IHG never saw an error. $1,449 simply didn't arrive — and Amit is now on MakeMyTrip.`
  if (config.isHertz) return `Hertz.com offered three credit card options. Priya uses UPI for everything. Nothing for her — so she left. Hertz never saw an error. $717 simply didn't arrive — and Priya is booking elsewhere.`
  if (config.isDespegar) return `Despegar offered three credit card options. Maria uses Pix for everything — Brazil's default payment method. Nothing for her — so she left. Despegar never saw an error. $1,782 simply didn't arrive — and Maria is now booking through a competitor.`
  if (config.isBAHolidays) return `BA Holidays offered three credit card options. Zhang Wei pays via Alipay for everything. Nothing for her — so she left. BA never saw an error. $1,932 simply didn't arrive — and Zhang Wei is now on Ctrip.`
  if (config.isCarRental) return `Card declined. Insufficient funds, expired card, or bank rejection. Without intervention, this renter abandons or books with a competitor.`
  return `Card declined. Insufficient funds, expired card, or bank rejection. Without intervention, this guest abandons or books elsewhere.`
}

const getSteps = (account: Account) => {
  const config = getAccountConfig(account)
  const amount = `$${config.bookingAmount.toLocaleString()}`
  const customerType = config.isCarRental ? "renter" : config.isAirline ? "traveler" : "guest"
  
  return [
    {
      id: 1,
      label: "Checkout Active",
      title: `High-intent ${customerType}. About to book.`,
      description: getStep1Description(config, account),
      phoneState: "checkout" as const,
      revenueStatus: "at-risk" as const,
    },
    {
      id: 2,
      label: "Payment Friction",
      title: getStep2Title(config),
      description: getStep2Description(config),
      phoneState: "failure" as const,
      revenueStatus: "at-risk" as const,
    },
    {
      id: 3,
      label: "RG Pay Activating",
      title: "RG Pay intervenes instantly — no redirect, no friction.",
      description: config.isWyndham
        ? `RG Pay activates its processing infrastructure for the India market. UPI, EMI, and wallet options surface instantly inside the Wyndham checkout session. When Raj pays, the transaction runs through RG Pay and settles directly to Wyndham. No redirect. No re-entry. No new contracts.`
        : config.isMarriott
        ? `RG Pay activates its processing infrastructure for the China market. Alipay, WeChat Pay, and UnionPay options surface instantly inside the Marriott Bonvoy session. When Li Wei pays, the transaction runs through RG Pay and settles directly to Marriott. No redirect. No re-entry. No new contracts.`
        : config.isIHG
        ? `RG Pay activates its processing infrastructure for the India market. UPI, EMI, and wallet options surface instantly inside the IHG checkout session. When Amit pays, the transaction runs through RG Pay and settles directly to IHG. No redirect. No re-entry. No new contracts.`
        : config.isHertz
        ? `RG Pay activates its processing infrastructure for the India market. UPI and wallet options surface instantly inside the Hertz checkout session. When Priya pays, the transaction runs through RG Pay and settles directly to Hertz. No redirect. No re-entry. No new contracts.`
        : config.isDespegar
        ? `RG Pay activates its processing infrastructure for the Brazil market. Pix, Boleto, and parcelamento options surface instantly inside the Despegar checkout session. When Maria pays, the transaction runs through RG Pay and settles directly to Despegar. No redirect. No re-entry. No new contracts.`
        : config.isBAHolidays
        ? `RG Pay activates its processing infrastructure for the China market. Alipay, WeChat Pay, and UnionPay options surface instantly inside the BA Holidays checkout session. When Zhang Wei pays, the transaction runs through RG Pay and settles directly to British Airways. No redirect. No re-entry. No new contracts.`
        : `RG Pay activates directly inside the ${account.name} checkout session. No redirect. No page reload. The ${customerType}'s booking details are preserved — and they are about to see payment options they didn't know were available.`,
      phoneState: "activating" as const,
      revenueStatus: "recovering" as const,
    },
    {
      id: 4,
      label: "Payment Options",
      title: config.isWyndham ? `12 payment options. One is perfect for ${config.guestName}.` : `The ${customerType} sees options. The booking stays on ${account.name}.`,
      description: config.isWyndham
        ? `RG Pay surfaces every method available to this guest: UPI, Indian wallets, EMI, BNPL, and bank offers — plus standard cards as fallback. The booking stays on Wyndham's direct site.`
        : `RG Pay surfaces cards, digital wallets, BNPL, and regional payment methods — instantly, inside the ${account.name} checkout. No redirect. No re-entry. The ${customerType} never left the page.`,
      phoneState: "options" as const,
      revenueStatus: "recovering" as const,
    },
    {
      id: 5,
      label: "Payment Confirmed",
      title: "Payment authorized. Booking continues.",
      description: config.isWyndham
        ? `${config.guestName} completed his booking via UPI — instant authorization, zero friction. The booking that was a dead end 90 seconds ago is now a confirmed direct reservation.`
        : `Payment authorized. ${amount} captured. The booking that was seconds away from abandonment is now a confirmed reservation — full margin retained.`,
      phoneState: "processing" as const,
      revenueStatus: "recovered" as const,
    },
    {
      id: 6,
      label: "Booking Confirmed",
      title: "Revenue recovered. Guest retained. Margin protected.",
      description: config.isWyndham
        ? `${config.guestName} has a confirmed reservation at Wyndham Pittsburgh. Wyndham keeps 100% of the margin. No MakeMyTrip. No Booking.com. No commission. This is what RG Pay does for every non-NA guest your checkout currently turns away.`
        : `Reservation confirmed on ${account.name}'s ${config.channelType}. No leakage. Full margin retained. ${account.name} owns this ${customerType} relationship.`,
      phoneState: "confirmed" as const,
      revenueStatus: "recovered" as const,
    },
  ]
}

function RevenueBadge({ status, amount = "$847" }: { status: "at-risk" | "recovering" | "recovered"; amount?: string }) {
  const configs = {
    "at-risk": { bg: "bg-[#B91C1C]", text: "text-white", icon: AlertTriangle, label: "Revenue at Risk" },
    "recovering": { bg: "bg-amber-500", text: "text-white", icon: Loader2, label: "Recovery in Progress" },
    "recovered": { bg: "bg-green-500", text: "text-white", icon: CheckCircle2, label: "Revenue Recovered" },
  }
  const config = configs[status]
  const Icon = config.icon
  return (
    <div className={`flex items-center gap-2 rounded-full px-4 py-2 ${config.bg} ${config.text}`}>
      <Icon className={`h-4 w-4 ${status === "recovering" ? "animate-spin" : ""}`} />
      <span className="text-sm font-medium">{config.label}:</span>
      <span className="text-sm font-bold">{amount}</span>
    </div>
  )
}

function StepOneContent({ account }: { account: Account }) {
  const config = getAccountConfig(account)
  
  // Show fact row for custom demo accounts (including Despegar and BA Holidays)
  if (!config.hasCustomDemo) return null
  
  const valueLabel = config.isCarRental ? "Rental value" : config.isDespegar || config.isBAHolidays ? "Package value" : "Booking value"
  
  return (
    <div className="mb-8">
      <div className="flex items-center gap-4 rounded-lg border border-[#E5E7EB] bg-white p-4 flex-wrap">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-lg">{config.guestFlag}</span>
          <span className="text-[#6B7280]">Guest origin:</span>
          <span className="font-medium text-[#111827]">{config.guestOrigin}</span>
        </div>
        <div className="h-4 w-px bg-gray-200" />
        <div className="flex items-center gap-2 text-sm">
          <span className="text-[#6B7280]">{valueLabel}:</span>
          <span className="font-medium text-[#111827]">${config.bookingAmount.toLocaleString()}.00</span>
        </div>
        <div className="h-4 w-px bg-gray-200" />
        <div className="flex items-center gap-2 text-sm">
          <span className="text-[#6B7280]">Channel:</span>
          <span className="font-medium text-[#059669]">{config.channelLabel}</span>
        </div>
      </div>
    </div>
  )
}

// Warning box text by account
const getWarningText = (config: ReturnType<typeof getAccountConfig>) => {
  if (config.isWyndham) return "This abandonment is invisible to Wyndham. No error logged. No alert triggered. The revenue simply didn't arrive — and Raj is now booking through MakeMyTrip at 15–25% commission."
  if (config.isMarriott) return "Abandonment invisible to Marriott. No error logged. No alert triggered. Li Wei is now booking through Ctrip at 15–25% commission."
  if (config.isIHG) return "Abandonment invisible to IHG. No error logged. No alert triggered. Amit is now booking through MakeMyTrip at 15–25% commission."
  if (config.isHertz) return "Abandonment invisible to Hertz. No error logged. No alert triggered. Priya is now booking through a competitor platform."
  if (config.isDespegar) return "Abandonment invisible to Despegar. No error logged. No alert triggered. Maria is now booking through a competitor platform."
  if (config.isBAHolidays) return "Abandonment invisible to BA. No error logged. No alert triggered. Zhang Wei is now booking through Ctrip at 15–25% commission."
  return null
}

function StepTwoContent({ account }: { account: Account }) {
  const config = getAccountConfig(account)
  const customerType = config.isCarRental ? "renter" : config.isAirline ? "traveler" : "guest"
  const warningText = getWarningText(config)
  
  return (
    <div className="mb-8 space-y-4">
      <div className="rounded-lg border-l-[3px] border-l-[#B91C1C] bg-white border border-gray-200 p-4">
        <p className="text-sm text-[#111827]">
          {warningText ? warningText : (
            <>
              <span className="flex items-center gap-2 font-semibold mb-2">
                <AlertTriangle className="h-5 w-5 text-[#B91C1C]" />
                This is where most {config.isCarRental ? "rentals" : "bookings"} are lost
              </span>
              <span className="text-[#6B7280]">Without intervention, this {customerType} abandons — or worse, completes their {config.isCarRental ? "rental" : "booking"} with a competitor.</span>
            </>
          )}
        </p>
      </div>
      <div className="rounded-lg bg-white border border-[#E5E7EB] p-4 text-center">
        <p className="text-xs text-[#6B7280] mb-1">Revenue at Immediate Risk</p>
        <p className="text-3xl font-bold text-[#B91C1C]">${config.bookingAmount.toLocaleString()}.00</p>
      </div>
    </div>
  )
}

function StepThreeContent() {
  return (
    <div className="mb-8">
      <div className="relative rounded-lg border border-[#8021FF]/30 bg-[#F3EEFF] p-4">
        <div className="absolute -top-1 -right-1 h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#8021FF] opacity-75"></span>
          <span className="relative inline-flex h-3 w-3 rounded-full bg-[#8021FF]"></span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#8021FF] animate-pulse">
            <Loader2 className="h-5 w-5 text-white animate-spin" />
          </div>
          <div>
            <p className="font-semibold text-[#111827]">RG Pay is now active</p>
            <p className="text-sm text-[#6B7280]">Loading payment alternatives in real-time</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Step 5 payment details by account
const getStep5Details = (config: ReturnType<typeof getAccountConfig>) => {
  if (config.isWyndham) return { method: "UPI — Instant payment", time: "< 2 seconds", channel: "Direct — no MakeMyTrip", commission: "Up to 25%" }
  if (config.isMarriott) return { method: "Alipay — QR payment", time: "< 3 seconds", channel: "Direct — no Ctrip", commission: "Up to 25%" }
  if (config.isIHG) return { method: "UPI — HDFC Bank", time: "< 2 seconds", channel: "Direct — no MakeMyTrip", commission: "Up to 25%" }
  if (config.isHertz) return { method: "UPI — PhonePe", time: "< 2 seconds", channel: "Direct — Hertz.com", commission: "Up to 18%" }
  if (config.isDespegar) return { method: "Pix — Instant transfer", time: "< 10 seconds", channel: "Direct — Despegar.com", commission: "Retained in full" }
  if (config.isBAHolidays) return { method: "Alipay — QR payment", time: "< 3 seconds", channel: "Direct — no Ctrip", commission: "Up to 25%" }
  return { method: "Klarna — Pay in 4", time: "< 3 seconds", channel: "Direct — no OTA", commission: "Up to 25%" }
}

function StepFiveContent({ account }: { account: Account }) {
  const config = getAccountConfig(account)
  const details = getStep5Details(config)
  
  return (
    <div className="mb-8">
      <div className="rounded-lg border border-[#E5E7EB] bg-white p-4">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-[#6B7280]">Payment method</span>
            <span className="text-sm font-medium text-[#111827]">{details.method}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-[#6B7280]">Authorization time</span>
            <span className="text-sm font-medium text-[#111827]">{details.time}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-[#6B7280]">Channel</span>
            <span className="text-sm font-medium text-[#059669]">{details.channel}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-[#6B7280]">Commission avoided</span>
            <span className="text-sm font-medium text-[#059669]">{details.commission}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Step 6 closing subtext by account
const getStep6Subtext = (config: ReturnType<typeof getAccountConfig>) => {
  if (config.isMarriott) return "Revenue recovered. Guest retained. Margin protected. No Ctrip. No commission. This is what RG Pay does for every Chinese traveler your checkout currently turns away."
  if (config.isIHG) return "Revenue recovered. Guest retained. Margin protected. No MakeMyTrip. No commission. This is what RG Pay does for every Indian traveler your checkout currently turns away."
  if (config.isHertz) return "Revenue recovered. Guest retained. Margin protected. No competitor platform. This is what RG Pay does for every non-NA traveler your checkout currently turns away."
  if (config.isDespegar) return "Revenue recovered. Guest retained. Margin protected. This is what RG Pay does for every Brazilian traveler your checkout currently turns away."
  if (config.isBAHolidays) return "Revenue recovered. Guest retained. Margin protected. No Ctrip. No commission. This is what RG Pay does for every Chinese traveler your checkout currently turns away."
  return "Revenue recovered. Guest retained. Margin protected. No MakeMyTrip. No Booking.com. No commission. This is what RG Pay does for every non-NA guest your checkout currently turns away."
}

// Calculator placeholder values by account
const getCalculatorPlaceholders = (config: ReturnType<typeof getAccountConfig>) => {
  if (config.isWyndham) return { sessions: "8,500", avgValue: "$847", conversion: "3" }
  if (config.isMarriott) return { sessions: "12,000", avgValue: "$1,322", conversion: "2.5" }
  if (config.isIHG) return { sessions: "10,500", avgValue: "$1,449", conversion: "2.8" }
  if (config.isHertz) return { sessions: "6,000", avgValue: "$717", conversion: "4" }
  if (config.isDespegar) return { sessions: "9,000", avgValue: "$1,782", conversion: "3.2" }
  if (config.isBAHolidays) return { sessions: "7,500", avgValue: "$1,932", conversion: "2.5" }
  // Default for non-custom accounts
  return { sessions: "10,000", avgValue: "$500", conversion: "3" }
}

function StepSixContent({ account, onRunAnother }: { account: Account; onRunAnother: () => void }) {
  const config = getAccountConfig(account)
  const commissionAvoided = config.commissionAvoided.toFixed(2)
  const subtext = getStep6Subtext(config)
  const placeholders = getCalculatorPlaceholders(config)
  
  return (
    <div className="mb-8 space-y-4">
      {/* Business Impact Card */}
      <div className="rounded-lg border border-green-200 bg-green-50 p-5">
        <p className="font-semibold text-green-800 mb-4 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5" />
          Business Impact
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-green-600 mb-1">Revenue Recovered</p>
            <p className="text-xl font-bold text-green-800">${config.bookingAmount.toLocaleString()}.00</p>
          </div>
          <div>
            <p className="text-xs text-green-600 mb-1">OTA Commission Avoided</p>
            <p className="text-xl font-bold text-green-800">${commissionAvoided}</p>
          </div>
          <div>
            <p className="text-xs text-green-600 mb-1">Direct Booking Retained</p>
            <p className="text-xl font-bold text-green-800">Yes</p>
          </div>
          <div>
            <p className="text-xs text-green-600 mb-1">Guest Retained</p>
            <p className="text-xl font-bold text-green-800">Yes</p>
          </div>
        </div>
      </div>
      
      {/* Subtext */}
      <p className="text-xs text-[#6B7280] leading-relaxed">{subtext}</p>

      {/* Interactive Calculator - only for custom demo accounts */}
      {config.hasCustomDemo && (
        <Calculator placeholders={placeholders} />
      )}

      {/* CTA Buttons */}
      <div className="flex gap-3 pt-2">
        <Button 
          className="flex-1 bg-[#8021FF] hover:bg-[#6a1bd6] text-white"
          onClick={() => window.open('/lets-talk', '_blank')}
        >
          Let&apos;s Talk
        </Button>
        <Button 
          variant="outline"
          className="flex-1 border-[#8021FF] text-[#8021FF] hover:bg-[#8021FF]/10"
          onClick={onRunAnother}
        >
          Run Another Simulation
        </Button>
      </div>
    </div>
  )
}

export function DemoFlow({ account, onBack }: DemoFlowProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const steps = getSteps(account)
  const step = steps[currentStep]
  const config = getAccountConfig(account)
  const amount = `$${config.bookingAmount.toLocaleString()}`

  const goNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1)
  }
  const goPrev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1)
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <button onClick={onBack} className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>
          <RevenueBadge status={step.revenueStatus} amount={amount} />
          <div className="flex items-center gap-2 text-sm">
            {config.hasCustomDemo ? (
              <>
                <span className="text-lg">{config.guestFlag}</span>
                <span className="text-muted-foreground">{config.guestName} · {config.guestOrigin.split(',')[0]}</span>
                <span className="text-muted-foreground">|</span>
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: account.color }} />
                <span className="font-medium text-foreground">
                  {account.id === "baholidays" ? "BA Holidays" : account.name} · {config.market}
                </span>
              </>
            ) : (
              <>
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: account.color }} />
                <span className="font-medium text-foreground">{account.name}</span>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {steps.map((s, index) => (
              <div key={s.id} className="flex flex-1 items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-all ${
                      index < currentStep ? "bg-green-500 text-white" : index === currentStep ? "text-white" : "bg-muted text-muted-foreground"
                    }`}
                    style={index === currentStep ? { backgroundColor: "#8021FF" } : {}}
                  >
                    {index < currentStep ? "✓" : s.id}
                  </div>
                  <span className={`mt-2 text-xs font-medium text-center max-w-[80px] ${index === currentStep ? "text-foreground" : "text-muted-foreground"}`}>
                    {s.label}
                  </span>
                </div>
                {index < steps.length - 1 && <div className={`mx-2 h-0.5 flex-1 transition-all ${index < currentStep ? "bg-[#8021FF]" : "bg-gray-300"}`} />}
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          <div className="flex flex-col justify-center">
            <div
              className="mb-4 inline-flex w-fit rounded-full px-3 py-1 text-xs font-medium"
              style={{ 
                backgroundColor: step.id === 2 ? "#B91C1C" : "#8021FF",
                color: "white"
              }}
            >
              Step {step.id} of 6 · {step.label}
            </div>
            <h2 className="mb-4 text-3xl font-semibold tracking-tight text-[#111827]">
              {step.title}
            </h2>
            <p className="mb-8 text-lg leading-relaxed text-muted-foreground">{step.description}</p>

            {step.id === 1 && <StepOneContent account={account} />}
            {step.id === 2 && <StepTwoContent account={account} />}
            {step.id === 3 && <StepThreeContent />}
            {step.id === 5 && <StepFiveContent account={account} />}
            {step.id === 6 && <StepSixContent account={account} onRunAnother={onBack} />}

            {step.id !== 6 && (
              <div className="flex gap-3">
                <Button variant="outline" onClick={goPrev} disabled={currentStep === 0}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                <Button onClick={goNext} className="text-white" style={{ backgroundColor: "#8021FF" }}>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-center justify-center">
            <PhoneMockup state={step.phoneState} account={account} step={step.id} />
          </div>
        </div>
      </div>
    </main>
  )
}
