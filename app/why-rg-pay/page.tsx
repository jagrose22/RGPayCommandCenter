"use client"

import Link from "next/link"
import { ArrowLeft, Zap, Shield, Clock, Globe, CreditCard, TrendingUp } from "lucide-react"

export default function WhyRGPayPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <img 
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-RGPay-m5hG72JyKrnR7f5nymMLWHpu3b5ShX.png" 
              alt="RG Pay"
              className="h-9 w-auto"
            />
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/why-rg-pay" className="text-sm font-medium text-foreground transition-colors">
              Why RG Pay?
            </Link>
            <Link href="/recovery-calculator" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Recovery Calculator
            </Link>
            <Link href="/faq" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              FAQ
            </Link>
            <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Back to Demo
            </Link>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* Back link */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-foreground mb-3">
            Why RG Pay?
          </h1>
          <p className="text-muted-foreground max-w-2xl text-lg">
            Recover abandoned international bookings by enabling the local payment methods your customers actually use.
          </p>
        </div>

        {/* The Problem */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-foreground mb-4">The Problem</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <p className="text-foreground mb-4">
              Every day, international travelers abandon hotel bookings because they can&apos;t pay with their preferred local payment method.
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-[#8021ff] font-bold">•</span>
                In India, 70% of digital payments are via UPI — not credit cards
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#8021ff] font-bold">•</span>
                In China, Alipay and WeChat Pay dominate with 90% market share
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#8021ff] font-bold">•</span>
                In Brazil, Pix processes more transactions than credit and debit combined
              </li>
            </ul>
          </div>
        </section>

        {/* Features Grid */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-foreground mb-6">How RG Pay Helps</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-border p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#8021ff]/10">
                  <Globe className="h-5 w-5 text-[#8021ff]" />
                </div>
                <h3 className="font-semibold text-foreground">Local Payment Methods</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                UPI, Alipay, WeChat Pay, Pix, and 100+ local payment methods across India, China, Latin America, and Southeast Asia.
              </p>
            </div>

            <div className="rounded-lg border border-border p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#8021ff]/10">
                  <Zap className="h-5 w-5 text-[#8021ff]" />
                </div>
                <h3 className="font-semibold text-foreground">Zero Integration</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                No engineering work required. RG Pay works alongside your existing checkout — just add a button.
              </p>
            </div>

            <div className="rounded-lg border border-border p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#8021ff]/10">
                  <TrendingUp className="h-5 w-5 text-[#8021ff]" />
                </div>
                <h3 className="font-semibold text-foreground">Performance-Based</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Only pay when we recover a booking. No setup fees, no monthly minimums, no risk.
              </p>
            </div>

            <div className="rounded-lg border border-border p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#8021ff]/10">
                  <Shield className="h-5 w-5 text-[#8021ff]" />
                </div>
                <h3 className="font-semibold text-foreground">Enterprise Security</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                PCI DSS Level 1 compliant. SOC 2 Type II certified. Bank-grade security for every transaction.
              </p>
            </div>

            <div className="rounded-lg border border-border p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#8021ff]/10">
                  <CreditCard className="h-5 w-5 text-[#8021ff]" />
                </div>
                <h3 className="font-semibold text-foreground">Direct Bookings</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Keep bookings direct instead of losing them to OTAs. Save 15-25% in commission fees on every recovered booking.
              </p>
            </div>

            <div className="rounded-lg border border-border p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#8021ff]/10">
                  <Clock className="h-5 w-5 text-[#8021ff]" />
                </div>
                <h3 className="font-semibold text-foreground">Live in Days</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Go live in days, not months. Our team handles everything from setup to optimization.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-lg border border-[#8021ff] bg-[#8021ff]/5 p-8 text-center">
          <h2 className="text-xl font-semibold text-foreground mb-3">
            Ready to see your recovery opportunity?
          </h2>
          <p className="text-muted-foreground mb-6">
            Use our calculator to see how much revenue you could recover.
          </p>
          <Link 
            href="/recovery-calculator"
            className="inline-flex items-center justify-center rounded-md bg-[#8021ff] px-6 py-3 text-sm font-medium text-white hover:bg-[#6a1bd6] transition-colors"
          >
            Try the Calculator
          </Link>
        </section>
      </div>
    </main>
  )
}
