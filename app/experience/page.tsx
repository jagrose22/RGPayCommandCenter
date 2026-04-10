"use client"

import { useState } from "react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GuestJourney } from "@/components/guest-journey"
import { 
  Users, 
  Shield, 
  Calculator, 
  HelpCircle, 
  Play 
} from "lucide-react"

export default function ExperiencePage() {
  const [activeTab, setActiveTab] = useState("journey")

  const handleNavigateToCalculator = () => {
    setActiveTab("calculator")
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Link href="/">
              <img 
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-RGPay-m5hG72JyKrnR7f5nymMLWHpu3b5ShX.png" 
                alt="RG Pay"
                className="h-9 w-auto"
              />
            </Link>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/why-rg-pay" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Why RG Pay?
            </Link>
            <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Demo Hub
            </Link>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-5 h-12 p-1 bg-muted/80 border border-border shadow-sm mb-8">
            <TabsTrigger 
              value="journey" 
              className="flex items-center gap-2 h-10 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:border data-[state=active]:border-[#8021FF]/30 data-[state=active]:text-[#8021FF] font-medium transition-all text-xs sm:text-sm"
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Guest Journey</span>
              <span className="sm:hidden">Journey</span>
            </TabsTrigger>
            <TabsTrigger 
              value="confidence" 
              className="flex items-center gap-2 h-10 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:border data-[state=active]:border-[#8021FF]/30 data-[state=active]:text-[#8021FF] font-medium transition-all text-xs sm:text-sm"
            >
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Recovery Confidence</span>
              <span className="sm:hidden">Confidence</span>
            </TabsTrigger>
            <TabsTrigger 
              value="calculator" 
              className="flex items-center gap-2 h-10 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:border data-[state=active]:border-[#8021FF]/30 data-[state=active]:text-[#8021FF] font-medium transition-all text-xs sm:text-sm"
            >
              <Calculator className="w-4 h-4" />
              <span className="hidden sm:inline">Revenue Calculator</span>
              <span className="sm:hidden">Calculator</span>
            </TabsTrigger>
            <TabsTrigger 
              value="faq" 
              className="flex items-center gap-2 h-10 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:border data-[state=active]:border-[#8021FF]/30 data-[state=active]:text-[#8021FF] font-medium transition-all text-xs sm:text-sm"
            >
              <HelpCircle className="w-4 h-4" />
              <span>FAQ</span>
            </TabsTrigger>
            <TabsTrigger 
              value="demo" 
              className="flex items-center gap-2 h-10 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:border data-[state=active]:border-[#8021FF]/30 data-[state=active]:text-[#8021FF] font-medium transition-all text-xs sm:text-sm"
            >
              <Play className="w-4 h-4" />
              <span>Demo</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Guest Journey */}
          <TabsContent value="journey" className="mt-0">
            <GuestJourney onNavigateToCalculator={handleNavigateToCalculator} />
          </TabsContent>

          {/* Tab 2: Recovery Confidence */}
          <TabsContent value="confidence" className="mt-0">
            <div className="text-center py-20">
              <Shield className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">Recovery Confidence</h2>
              <p className="text-muted-foreground">Coming soon — Trust metrics and verification</p>
            </div>
          </TabsContent>

          {/* Tab 3: Revenue Calculator */}
          <TabsContent value="calculator" className="mt-0">
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">Full calculator experience</p>
              <Link 
                href="/recovery-calculator"
                className="inline-flex items-center justify-center rounded-md bg-[#8021FF] px-6 py-3 text-sm font-medium text-white hover:bg-[#6B1AD6] transition-colors"
              >
                Open Full Calculator
              </Link>
            </div>
          </TabsContent>

          {/* Tab 4: FAQ */}
          <TabsContent value="faq" className="mt-0">
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">Frequently asked questions</p>
              <Link 
                href="/faq"
                className="inline-flex items-center justify-center rounded-md bg-[#8021FF] px-6 py-3 text-sm font-medium text-white hover:bg-[#6B1AD6] transition-colors"
              >
                Open FAQ Page
              </Link>
            </div>
          </TabsContent>

          {/* Tab 5: Demo */}
          <TabsContent value="demo" className="mt-0">
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">Interactive product demos</p>
              <Link 
                href="/"
                className="inline-flex items-center justify-center rounded-md bg-[#8021FF] px-6 py-3 text-sm font-medium text-white hover:bg-[#6B1AD6] transition-colors"
              >
                Open Demo Hub
              </Link>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
