"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DemoFlow } from "@/components/demo-flow"
import { ArrowRight, Zap, Shield, Clock, ChevronDown } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import Link from "next/link"

// Demo experiences - Complete account structure with images
const demoExperiences = {
  "Enterprise Hotels": [
    { id: "wyndham", name: "Wyndham", descriptor: "Global portfolio, 9,000+ properties", color: "#0066B2", status: "available", avgBooking: 847, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=250&fit=crop", countryTag: "India", flag: "🇮🇳", paymentMethods: "UPI · EMI · Bank Offers", avgRecovery: "$847", isCustom: true },
    { id: "marriott", name: "Marriott", descriptor: "Luxury and select-service brands", color: "#B4975A", status: "available", avgBooking: 1322, image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=250&fit=crop", countryTag: "China", flag: "🇨🇳", paymentMethods: "Alipay · WeChat Pay · UnionPay", avgRecovery: "$1,322", isCustom: true },
    { id: "hilton", name: "Hilton", descriptor: "Full-service and focused-service", color: "#003B5C", status: "available", avgBooking: 863, image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&h=250&fit=crop", countryTag: null, flag: null, paymentMethods: null, avgRecovery: "$863", isCustom: false },
    { id: "hyatt", name: "Hyatt", descriptor: "Premium and lifestyle brands", color: "#8B4513", status: "available", avgBooking: 970, image: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=400&h=250&fit=crop", countryTag: null, flag: null, paymentMethods: null, avgRecovery: "$970", isCustom: false },
    { id: "ihg", name: "IHG", descriptor: "Midscale to luxury segments", color: "#6B3A3A", status: "available", avgBooking: 1449, image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=250&fit=crop", countryTag: "India", flag: "🇮🇳", paymentMethods: "UPI · HDFC EMI · Bank Offers", avgRecovery: "$1,449", isCustom: true },
    { id: "bestwestern", name: "Best Western", descriptor: "Independent hotel network", color: "#003366", status: "available", avgBooking: 452, image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=250&fit=crop", countryTag: null, flag: null, paymentMethods: null, avgRecovery: "$452", isCustom: false },
    { id: "choice", name: "Choice Hotels", descriptor: "Economy to upscale segments", color: "#0072CE", status: "available", avgBooking: 385, image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&h=250&fit=crop", countryTag: null, flag: null, paymentMethods: null, avgRecovery: "$385", isCustom: false },
    { id: "omni", name: "Omni Hotels", descriptor: "Luxury collection properties", color: "#1C1C1C", status: "available", avgBooking: 1200, image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&h=250&fit=crop", countryTag: null, flag: null, paymentMethods: null, avgRecovery: "$1,200", isCustom: false },
  ],
  "Demand Ecosystem": {
    "Tier 1": [
      { id: "booking", name: "Booking.com", color: "#003580", status: "available", logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-Booking-62tOsrkfuEfWPKtmicSM1pDOMUPDdJ.png", descriptor: "Global OTA platform", avgBooking: 1200, countryTag: null, flag: null, paymentMethods: null, avgRecovery: "$1,200", isCustom: false },
      { id: "agoda", name: "Agoda", color: "#5C2D91", status: "available", logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-Agoda-200x200-NwhduzLbzOvlJO4WuaKOw4SDeoreJ0.png", descriptor: "Asia-Pacific OTA", avgBooking: 890, countryTag: null, flag: null, paymentMethods: null, avgRecovery: "$890", isCustom: false },
      { id: "expedia", name: "Expedia", color: "#00355F", status: "available", logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-Expedia-lfzAxRlxM4spcn7zDhEBHA7dQlOecL.png", descriptor: "Global OTA platform", avgBooking: 2413, countryTag: null, flag: null, paymentMethods: null, avgRecovery: "$2,413", isCustom: false },
      { id: "capitalone", name: "CapitalOne Travel", color: "#004977", status: "available", logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-CapitalOne-nW3w2u7bu5hQ9r2rMmUrTY1oIQNMqH.png", descriptor: "Rewards travel booking", avgBooking: 1100, countryTag: null, flag: null, paymentMethods: null, avgRecovery: "$1,100", isCustom: false },
      { id: "hopper", name: "Hopper", color: "#FF6B6B", status: "available", logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-Hopper-IKRarqnX4brr0t806xOQJi0NPSgQsP.png", descriptor: "Mobile-first booking", avgBooking: 750, countryTag: null, flag: null, paymentMethods: null, avgRecovery: "$750", isCustom: false },
      { id: "airbnb", name: "Airbnb / HotelTonight", color: "#FF5A5F", status: "available", logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-Airbnb-HotelTonight-VCDUtXdM9V8hlgQ2zysGI9RagRcquX.png", descriptor: "Alternative accommodations", avgBooking: 980, countryTag: null, flag: null, paymentMethods: null, avgRecovery: "$980", isCustom: false },
      { id: "mmt", name: "MakeMyTrip", color: "#E74C3C", status: "available", logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-MakeMyTrip-x4Za5tOlka93kt4Ia8YOpEC6rs1kU4.png", descriptor: "India travel leader", avgBooking: 650, countryTag: null, flag: null, paymentMethods: null, avgRecovery: "$650", isCustom: false },
      { id: "despegar", name: "Despegar", color: "#0066CC", status: "available", logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-Despegar-200x200-JeE1PhdRUEiXcZBuspijQEzt6pL34t.png", descriptor: "Latin America OTA leader", avgBooking: 1782, countryTag: "Brazil", flag: "🇧🇷", paymentMethods: "Pix · Boleto · Parcelamento", avgRecovery: "$1,782", isCustom: true },
      { id: "tripcom", name: "Trip.com", color: "#287DFA", status: "available", logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-Trip-com-IxW93LeVRVzHn9CDgkSHyadUCoqhOS.png", descriptor: "China travel platform", avgBooking: 1400, countryTag: null, flag: null, paymentMethods: null, avgRecovery: "$1,400", isCustom: false },
      { id: "traveloka", name: "Traveloka", color: "#0064D2", status: "available", logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-Traveloka-GblXzwO5m65nJY1rfLNlmNxG2p5tjv.png", descriptor: "Southeast Asia OTA", avgBooking: 720, countryTag: null, flag: null, paymentMethods: null, avgRecovery: "$720", isCustom: false },
    ],
    "Tier 2": [
      { id: "deltavacations", name: "Delta Vacations", color: "#003366", status: "available", logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-DeltaVacations-zmydWGPL1qnk26Ilb1GV97YrGsJjtz.png", descriptor: "Airline vacation packages", avgBooking: 2200, countryTag: null, flag: null, paymentMethods: null, avgRecovery: "$2,200", isCustom: false },
      { id: "trisept-alg", name: "Trisept Solutions (ALG)", color: "#2E8B57", status: "available", logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-TriseptSolutions-Z6GwSEWonnyXNd8xbOFzpb4uZy2bTL.png", descriptor: "Vacation package tech", avgBooking: 1800, countryTag: null, flag: null, paymentMethods: null, avgRecovery: "$1,800", isCustom: false },
      { id: "trisept-nonalg", name: "Trisept Partners (Non ALG)", color: "#3CB371", status: "available", logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-TriseptPartners-JwIaR1Zl1JHzh7UFbdqrLS0q9e3iqD.png", descriptor: "Travel tech platform", avgBooking: 1500, countryTag: null, flag: null, paymentMethods: null, avgRecovery: "$1,500", isCustom: false },
      { id: "b2breservas", name: "B2B Reservas", color: "#4682B4", status: "available", logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-B2BReservas-KZfzOES0dxIXT0K9tVmu6txvKTXzjf.png", descriptor: "B2B travel distribution", avgBooking: 950, countryTag: null, flag: null, paymentMethods: null, avgRecovery: "$950", isCustom: false },
      { id: "derhotel", name: "DERhotel", color: "#CD853F", status: "available", logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-DerHotel-TN76EG6YNHPijLVl5Z7kcr9YN838WV.png", descriptor: "European hotel platform", avgBooking: 1100, countryTag: null, flag: null, paymentMethods: null, avgRecovery: "$1,100", isCustom: false },
      { id: "inntel", name: "Inntel", color: "#708090", status: "available", logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-Inntel-nrg9UiXhpC3mfRjtXLhj9m6DMAv5LY.png", descriptor: "Hotel technology provider", avgBooking: 880, countryTag: null, flag: null, paymentMethods: null, avgRecovery: "$880", isCustom: false },
      { id: "tourismarketing", name: "Touris Marketing", color: "#9370DB", status: "available", descriptor: "Tourism marketing platform", avgBooking: 650, countryTag: null, flag: null, paymentMethods: null, avgRecovery: "$650", isCustom: false },
      { id: "baholidays", name: "BA Holidays", color: "#075AAA", status: "available", logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-British-Airways-Holidays-q1XK8MPPeEqguJ7gJ1ghLWnmrYaPKr.png", descriptor: "Flight + Hotel packages", avgBooking: 1932, countryTag: "China", flag: "🇨🇳", paymentMethods: "Alipay · WeChat Pay · UnionPay", avgRecovery: "$1,932", isCustom: true },
      { id: "mikitravel", name: "Miki Travel", color: "#DC143C", status: "available", logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-MikiTravel-q0cw5dIDhLnPqeeDzIP7ydb07su1LJ.png", descriptor: "Inbound tour operator", avgBooking: 1300, countryTag: null, flag: null, paymentMethods: null, avgRecovery: "$1,300", isCustom: false },
      { id: "tektravel", name: "Tek Travel", color: "#20B2AA", status: "available", logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-TekTravel-idhnuBieHX3LoPV0d8sLnOVy1paoR6.png", descriptor: "Travel tech solutions", avgBooking: 780, countryTag: null, flag: null, paymentMethods: null, avgRecovery: "$780", isCustom: false },
    ],
  },
  "Car Rental": [
    { id: "hertz", name: "Hertz", color: "#FFD100", status: "available", image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400&h=250&fit=crop", descriptor: "Global car rental", avgBooking: 717, countryTag: "India", flag: "🇮🇳", paymentMethods: "UPI · PhonePe · Rupay", avgRecovery: "$717", isCustom: true },
    { id: "avis", name: "Avis", color: "#D4002A", status: "available", image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=400&h=250&fit=crop", descriptor: "Premium car rental", avgBooking: 580, countryTag: null, flag: null, paymentMethods: null, avgRecovery: "$580", isCustom: false },
    { id: "ace", name: "Ace", color: "#FF6600", status: "available", image: "https://images.unsplash.com/photo-1550355291-bbee04a92027?w=400&h=250&fit=crop", descriptor: "Value car rental", avgBooking: 320, countryTag: null, flag: null, paymentMethods: null, avgRecovery: "$320", isCustom: false },
    { id: "budgettruck", name: "Budget Truck", color: "#F37021", status: "available", image: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=400&h=250&fit=crop", descriptor: "Truck rental services", avgBooking: 450, countryTag: null, flag: null, paymentMethods: null, avgRecovery: "$450", isCustom: false },
    { id: "enterprise", name: "Enterprise", color: "#007A33", status: "available", image: "https://images.unsplash.com/photo-1485291571150-772bcfc10da5?w=400&h=250&fit=crop", descriptor: "Local car rental", avgBooking: 520, countryTag: null, flag: null, paymentMethods: null, avgRecovery: "$520", isCustom: false },
  ],
}

// Accounts with custom tailored demos
const CUSTOM_DEMO_ACCOUNTS = ["wyndham", "marriott", "ihg", "expedia", "despegar", "baholidays", "hertz"]

// Flatten for dropdown (only available experiences)
const flattenExperiences = () => {
  const flat: Array<{ id: string; name: string; descriptor?: string; color: string; status: string; avgBooking?: number; logo?: string; image?: string }> = []
  // Add generic Hotel first
  flat.push({ id: "generic-hotel", name: "Hotel", descriptor: "Generic hotel demo", color: "#6B7280", status: "available", avgBooking: 450 })
  // Add Enterprise Hotels
  flat.push(...demoExperiences["Enterprise Hotels"])
  // Add available Demand Partners
  const tier1Available = demoExperiences["Demand Ecosystem"]["Tier 1"].filter(e => e.status === "available")
  const tier2Available = demoExperiences["Demand Ecosystem"]["Tier 2"].filter(e => e.status === "available")
  flat.push(...tier1Available as any, ...tier2Available as any)
  // Add available Car Rentals
  const carAvailable = demoExperiences["Car Rental"].filter(e => e.status === "available")
  flat.push(...carAvailable)
  return flat
}

const allExperiences = flattenExperiences()

export default function Home() {
  const [selectedExperience, setSelectedExperience] = useState(allExperiences[0])
  const [showDemo, setShowDemo] = useState(false)
  const [viewMode, setViewMode] = useState<"demo" | "accounts">("demo")
  const [hotelsOpen, setHotelsOpen] = useState(true)
  const [demandOpen, setDemandOpen] = useState(true)
  const [carOpen, setCarOpen] = useState(true)

  const handleExperienceChange = (experienceId: string) => {
    const experience = allExperiences.find((e) => e.id === experienceId)
    if (experience && experience.status === "available") {
      setSelectedExperience(experience)
    }
  }

  if (showDemo) {
    return (
      <DemoFlow
        account={selectedExperience}
        onBack={() => setShowDemo(false)}
      />
    )
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header - Clean, minimal */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <img 
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-RGPay-m5hG72JyKrnR7f5nymMLWHpu3b5ShX.png" 
              alt="RG Pay"
              className="h-9 w-auto"
            />
          </div>

{/* Right side - Navigation */}
  <nav className="flex items-center gap-6">
    <Link href="/experience" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
      Guest Journey
    </Link>
    <Link href="/why-rg-pay" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
      Why RG Pay?
    </Link>
    <Link href="/recovery-calculator" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
      Recovery Calculator
    </Link>
    <Link href="/faq" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
      FAQ
    </Link>
    <button
      onClick={() => setViewMode(viewMode === "demo" ? "accounts" : "demo")}
      className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
    >
      {viewMode === "demo" ? "All Accounts" : "Back to Demo"}
    </button>
  </nav>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6">
        {viewMode === "accounts" ? (
          /* Accounts View */
          <div className="py-8">
            {/* Header */}
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-semibold text-foreground mb-3">
                All Accounts Dashboard
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Click any account to run a demo. Accounts with country tags have personalized 6-step demos.
              </p>
            </div>

            {/* Enterprise Hotels - Collapsible */}
            <Collapsible open={hotelsOpen} onOpenChange={setHotelsOpen} className="mb-10">
              <CollapsibleTrigger className="flex items-center gap-2 w-full text-left mb-5 group">
                <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${hotelsOpen ? '' : '-rotate-90'}`} />
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider group-hover:text-foreground transition-colors">
                  Enterprise Hotels
                </h3>
                <span className="text-xs text-muted-foreground ml-2">(8)</span>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {demoExperiences["Enterprise Hotels"].map((experience) => {
                    const exp = experience as any
                    return (
                      <Card
                        key={experience.id}
                        className="group relative overflow-hidden transition-all cursor-pointer hover:shadow-lg hover:border-gray-300"
                        onClick={() => {
                          setSelectedExperience(experience)
                          setShowDemo(true)
                        }}
                      >
                        {/* Hotel Image */}
                        <div className="relative h-36 overflow-hidden">
                          <img
                            src={experience.image}
                            alt={experience.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                          <div 
                            className="absolute bottom-3 left-3 px-2 py-1 rounded text-white text-xs font-bold"
                            style={{ backgroundColor: experience.color }}
                          >
                            {experience.name}
                          </div>
                        </div>
                        <div className="p-4">
                          {/* Line 1: Name + Country Tag */}
                          <div className="mb-2">
                            <span className="font-semibold text-[#1A1A2E]">{experience.name}</span>
                            {exp.isCustom && (
                              <span className="text-[#8021ff]"> · {exp.countryTag} {exp.flag}</span>
                            )}
                          </div>
                          {/* Line 2: Payment methods or descriptor */}
                          <p className="text-xs text-[#6B7280] mb-2">
                            {exp.isCustom ? exp.paymentMethods : experience.descriptor}
                          </p>
                          {/* Line 3: Avg recovery */}
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-[#8021ff]">
                              {exp.isCustom ? `Avg recovery: ${exp.avgRecovery}` : `Avg: $${experience.avgBooking}`}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-[#8021ff] group-hover:translate-x-1 transition-all">
                              Run Demo <ArrowRight className="h-3 w-3" />
                            </span>
                          </div>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Demand Ecosystem - Collapsible */}
            <Collapsible open={demandOpen} onOpenChange={setDemandOpen} className="mb-10">
              <CollapsibleTrigger className="flex items-center gap-2 w-full text-left mb-5 group">
                <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${demandOpen ? '' : '-rotate-90'}`} />
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider group-hover:text-foreground transition-colors">
                  Demand Ecosystem
                </h3>
                <span className="text-xs text-muted-foreground ml-2">(20)</span>
              </CollapsibleTrigger>
              <CollapsibleContent>
                {/* Tier 1 */}
                <div className="mb-6">
                  <div className="rounded-xl bg-blue-50/50 border border-blue-100 p-5">
                    <p className="text-xs font-medium text-blue-700 uppercase tracking-wider mb-4">
                      Tier 1 Demand Partners
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                      {demoExperiences["Demand Ecosystem"]["Tier 1"].map((experience) => {
                        const exp = experience as any
                        return (
                          <Card
                            key={experience.id}
                            className="group relative overflow-hidden transition-all bg-white cursor-pointer hover:shadow-lg hover:border-gray-300"
                            onClick={() => {
                              setSelectedExperience(experience as any)
                              setShowDemo(true)
                            }}
                          >
                            <div className="p-4">
                              <div className="flex items-center gap-3 mb-2">
                                {experience.logo ? (
                                  <img
                                    src={experience.logo}
                                    alt={experience.name}
                                    className="h-10 w-10 object-contain rounded-lg"
                                  />
                                ) : (
                                  <div
                                    className="flex h-10 w-10 items-center justify-center rounded-lg text-white font-bold text-xs"
                                    style={{ backgroundColor: experience.color }}
                                  >
                                    {experience.name.slice(0, 2).toUpperCase()}
                                  </div>
                                )}
                                <div className="flex flex-col">
                                  <span className="font-semibold text-sm text-[#1A1A2E]">
                                    {experience.name}
                                    {exp.isCustom && <span className="text-[#8021ff]"> · {exp.countryTag} {exp.flag}</span>}
                                  </span>
                                  {exp.isCustom && <span className="text-[10px] text-[#6B7280]">{exp.paymentMethods}</span>}
                                </div>
                              </div>
                              {exp.isCustom ? (
                                <span className="text-xs font-bold text-[#8021ff]">Avg recovery: {exp.avgRecovery}</span>
                              ) : (
                                <span className="text-xs text-[#6B7280]">{exp.descriptor}</span>
                              )}
                              <div className="mt-2">
                                <span className="inline-flex items-center text-xs font-medium text-[#8021ff]">
                                  Run Demo <ArrowRight className="h-3 w-3 ml-1" />
                                </span>
                              </div>
                            </div>
                          </Card>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* Tier 2 */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4 px-1">
                    Tier 2 Demand Partners
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                    {demoExperiences["Demand Ecosystem"]["Tier 2"].map((experience) => {
                      const exp = experience as any
                      return (
                        <Card
                          key={experience.id}
                          className="group relative overflow-hidden transition-all cursor-pointer hover:shadow-lg hover:border-gray-300"
                          onClick={() => {
                            setSelectedExperience(experience as any)
                            setShowDemo(true)
                          }}
                        >
                          <div className="p-4">
                            <div className="flex items-center gap-3 mb-2">
                              {experience.logo ? (
                                <img
                                  src={experience.logo}
                                  alt={experience.name}
                                  className="h-10 w-10 object-contain rounded-lg"
                                />
                              ) : (
                                <div
                                  className="flex h-10 w-10 items-center justify-center rounded-lg text-white font-bold text-xs"
                                  style={{ backgroundColor: experience.color }}
                                >
                                  {experience.name.slice(0, 2).toUpperCase()}
                                </div>
                              )}
                              <div className="flex flex-col">
                                <span className="font-semibold text-sm text-[#1A1A2E]">
                                  {experience.name}
                                  {exp.isCustom && <span className="text-[#8021ff]"> · {exp.countryTag} {exp.flag}</span>}
                                </span>
                                {exp.isCustom && <span className="text-[10px] text-[#6B7280]">{exp.paymentMethods}</span>}
                              </div>
                            </div>
                            {exp.isCustom ? (
                              <span className="text-xs font-bold text-[#8021ff]">Avg recovery: {exp.avgRecovery}</span>
                            ) : (
                              <span className="text-xs text-[#6B7280]">{exp.descriptor}</span>
                            )}
                            <div className="mt-2">
                              <span className="inline-flex items-center text-xs font-medium text-[#8021ff]">
                                Run Demo <ArrowRight className="h-3 w-3 ml-1" />
                              </span>
                            </div>
                          </div>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Car Rental - Collapsible */}
            <Collapsible open={carOpen} onOpenChange={setCarOpen}>
              <CollapsibleTrigger className="flex items-center gap-2 w-full text-left mb-5 group">
                <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${carOpen ? '' : '-rotate-90'}`} />
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider group-hover:text-foreground transition-colors">
                  Car Rental
                </h3>
                <span className="text-xs text-muted-foreground ml-2">(5)</span>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <p className="text-xs text-muted-foreground mb-4">
                  Cross-vertical checkout recovery use cases
                </p>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                  {demoExperiences["Car Rental"].map((experience) => {
                    const exp = experience as any
                    return (
                      <Card
                        key={experience.id}
                        className="group relative overflow-hidden transition-all cursor-pointer hover:shadow-lg hover:border-gray-300"
                        onClick={() => {
                          setSelectedExperience(experience as any)
                          setShowDemo(true)
                        }}
                      >
                        {/* Car Image */}
                        <div className="relative h-28 overflow-hidden">
                          <img
                            src={experience.image}
                            alt={experience.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                          <div 
                            className="absolute bottom-2 left-2 px-2 py-1 rounded text-xs font-bold"
                            style={{ 
                              backgroundColor: experience.color,
                              color: experience.color === "#FFD100" ? "#1a1a1a" : "white"
                            }}
                          >
                            {experience.name}
                          </div>
                        </div>
                        <div className="p-3">
                          {/* Line 1: Name + Country Tag */}
                          <div className="mb-1">
                            <span className="font-semibold text-sm text-[#1A1A2E]">{experience.name}</span>
                            {exp.isCustom && (
                              <span className="text-[#8021ff]"> · {exp.countryTag} {exp.flag}</span>
                            )}
                          </div>
                          {/* Line 2: Payment methods or descriptor */}
                          <p className="text-[10px] text-[#6B7280] mb-2">
                            {exp.isCustom ? exp.paymentMethods : experience.descriptor}
                          </p>
                          {/* Line 3: Avg recovery / CTA */}
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[#8021ff]">
                              {exp.isCustom ? `Avg recovery: ${exp.avgRecovery}` : `Avg: $${experience.avgBooking}`}
                            </span>
                            <span className="inline-flex items-center text-xs font-medium text-[#8021ff]">
                              Run Demo <ArrowRight className="h-3 w-3 ml-1" />
                            </span>
                          </div>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        ) : (
          /* DEMO VIEW - The "Holy Sh*t" Experience */
          <div className="py-12">
            {/* Hero Section - Split Layout */}
            <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
              {/* LEFT: Headline + CTA */}
              <div>
                <p className="text-sm font-semibold text-[#8021ff] uppercase tracking-wider mb-4">
                  Checkout Intelligence
                </p>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                  A guest wants to book.<br />
                  Their payment fails.
                </h1>
                <p className="text-base text-muted-foreground mb-8 leading-relaxed max-w-lg">
                  RG Pay recovers bookings from non-NA travelers who abandon because their preferred payment method isn&apos;t available — keeping revenue on your direct channel and out of OTA commission loops.
                </p>
                
                {/* Narrative Demo Entry */}
                <div className="mb-8">
                  <p className="text-sm text-muted-foreground mb-3">
                    Simulate a real booking at
                  </p>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <Select value={selectedExperience.id} onValueChange={handleExperienceChange}>
                      <SelectTrigger className="w-[240px] h-12 text-base font-medium">
                        <SelectValue placeholder="Choose brand" />
                      </SelectTrigger>
                      <SelectContent>
                        {allExperiences.filter(e => e.status === "available").map((experience) => {
                          const exp = experience as any
                          return (
                            <SelectItem key={experience.id} value={experience.id}>
                              <div className="flex items-center gap-2">
                                <div
                                  className="h-2 w-2 rounded-full"
                                  style={{ backgroundColor: experience.color }}
                                />
                                <span>{exp.isCustom ? `${experience.name} · ${exp.countryTag}` : experience.name}</span>
                              </div>
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                    <Button
                      size="lg"
                      onClick={() => setShowDemo(true)}
                      className="bg-[#8021ff] hover:bg-[#6a1bd6] text-white h-12 px-6"
                    >
                      Start the recovery
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* RIGHT: Aspirational Hospitality Image with Stats Overlay */}
              <div className="relative">
                {/* Beautiful hospitality image - resort pool */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop"
                    alt="Luxury resort pool"
                    className="w-full h-[400px] object-cover"
                  />
                  {/* Gradient overlay for readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  
                  {/* Transaction Story Overlay - Bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-center justify-center gap-6">
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3 border border-white/20">
                        <p className="text-white/70 text-xs font-medium mb-1">Revenue at Risk</p>
                        <p className="text-white text-3xl font-bold">$847</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-px w-8 bg-gradient-to-r from-white/40 to-green-400" />
                        <Zap className="h-5 w-5 text-green-400" />
                        <div className="h-px w-8 bg-green-400" />
                      </div>
                      <div className="bg-green-500/90 backdrop-blur-sm rounded-xl px-5 py-3 border border-green-400/30">
                        <p className="text-white/90 text-xs font-medium mb-1">Recovered</p>
                        <p className="text-white text-3xl font-bold">$847</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stat Strip */}
            <div className="mb-16 rounded-xl bg-gray-50 border border-gray-200 p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-[#8021ff]">80–84%</p>
                  <p className="text-sm text-muted-foreground mt-1">Hotel booking abandonment rate</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-[#8021ff]">40%</p>
                  <p className="text-sm text-muted-foreground mt-1">Abandon when preferred payment method is missing</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-[#8021ff]">88%</p>
                  <p className="text-sm text-muted-foreground mt-1">Asian travelers need local payment options</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-[#8021ff]">15–25%</p>
                  <p className="text-sm text-muted-foreground mt-1">OTA commission on every lost booking</p>
                </div>
              </div>
            </div>

            {/* Value Strip - 3 Benefits */}
            <div className="grid md:grid-cols-3 gap-6 mb-20">
              <div className="flex items-start gap-4 p-6 rounded-xl bg-purple-50/50 border border-purple-100">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#8021ff]">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Recover lost bookings</h3>
                  <p className="text-sm text-muted-foreground">Turn failed payments into completed stays.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-6 rounded-xl bg-green-50/50 border border-green-100">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-600">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Protect direct revenue</h3>
                  <p className="text-sm text-muted-foreground">Stop losing guests to OTAs at checkout.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-6 rounded-xl bg-blue-50/50 border border-blue-100">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">No friction, no redirects</h3>
                  <p className="text-sm text-muted-foreground">Recovery happens instantly in-session.</p>
                </div>
              </div>
            </div>

            {/* How It Works - Simple 3 Step */}
            <div className="mb-20">
              <h2 className="text-2xl font-semibold text-foreground text-center mb-10">
                Why RG Pay
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="relative inline-flex mb-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                      <span className="text-2xl font-bold text-slate-400">01</span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Detect & Intercept</h3>
                  <p className="text-sm text-muted-foreground">RG Pay monitors every checkout session globally. The moment a non-NA traveler hits a checkout with no local payment options — we catch it before they leave.</p>
                </div>
                <div className="text-center">
                  <div className="relative inline-flex mb-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#8021ff]/10">
                      <span className="text-2xl font-bold text-[#8021ff]">02</span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Process & Recover</h3>
                  <p className="text-sm text-muted-foreground">RG Pay processes the payment through licensed local infrastructure in 20+ markets. UPI, Alipay, Pix, and local bank offers surface instantly inside the existing checkout session. No redirect. No re-entry.</p>
                </div>
                <div className="text-center">
                  <div className="relative inline-flex mb-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100">
                      <span className="text-2xl font-bold text-green-600">03</span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Retain & Report</h3>
                  <p className="text-sm text-muted-foreground">Settlement goes directly to you. Booking confirmed on your direct channel. Full margin. Zero OTA commission. Every recovery tracked with full attribution by market and method.</p>
                </div>
              </div>
            </div>

            {/* CTA Footer */}
            <div className="rounded-2xl bg-slate-900 p-10 text-center">
              <h2 className="text-2xl font-semibold text-white mb-3">
                Ready to see what RG Pay recovers from your non-NA checkout traffic?
              </h2>
              <p className="text-white/70 mb-6 max-w-2xl mx-auto">
                Enterprise hospitality teams use RG Pay to capture revenue from the markets their checkout currently can&apos;t serve.
              </p>
              <Link href="/lets-talk">
                <Button
                  size="lg"
                  className="bg-[#8021ff] hover:bg-[#6a1bd6] text-white px-8"
                >
                  Let&apos;s Talk
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
