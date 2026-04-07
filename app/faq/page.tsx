"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown } from "lucide-react"
import { useState } from "react"

const faqs = [
  {
    question: "What payment methods does RG Pay support?",
    answer: "RG Pay supports 100+ local payment methods across key international markets including UPI, PhonePe, and Paytm in India; Alipay, WeChat Pay, and UnionPay in China; Pix and Boleto in Brazil; and various local payment methods across Southeast Asia, Latin America, and Europe."
  },
  {
    question: "How does the integration work?",
    answer: "RG Pay requires zero engineering work. We provide a simple button or link that sits alongside your existing checkout. When a customer from a supported market clicks it, they're taken to a localized payment experience. The booking confirmation flows back to your existing systems."
  },
  {
    question: "What's the pricing model?",
    answer: "RG Pay is 100% performance-based. You only pay when we successfully recover a booking. There are no setup fees, monthly minimums, or hidden costs. Our fee is a small percentage of the recovered booking value."
  },
  {
    question: "How long does it take to go live?",
    answer: "Most customers go live within 5-7 business days. Our team handles the entire setup process, including configuration, testing, and optimization for your specific markets."
  },
  {
    question: "Is RG Pay secure?",
    answer: "Yes. RG Pay is PCI DSS Level 1 compliant and SOC 2 Type II certified. We use bank-grade encryption for all transactions and never store sensitive payment credentials. All payment processing happens through licensed, regulated payment partners in each market."
  },
  {
    question: "Which markets does RG Pay cover?",
    answer: "RG Pay currently covers India, China, Brazil, Mexico, Argentina, Colombia, Indonesia, Thailand, Vietnam, Philippines, Malaysia, and Singapore. We're continuously expanding to new markets based on customer demand."
  },
  {
    question: "How do I track recovered bookings?",
    answer: "RG Pay provides a real-time dashboard showing all recovered bookings, conversion rates, and revenue metrics. You can also integrate with your existing analytics tools via our API or receive automated reports."
  },
  {
    question: "What if a customer needs to modify or cancel their booking?",
    answer: "Modifications and cancellations are handled through your existing systems. RG Pay integrates with your booking management workflow, so your team manages recovered bookings exactly like any other direct booking."
  },
  {
    question: "Do you offer refunds in local currency?",
    answer: "Yes. When a refund is needed, customers receive their refund in their original local currency through their original payment method. This provides a seamless experience and reduces chargebacks."
  },
  {
    question: "How does RG Pay compare to adding payment methods myself?",
    answer: "Adding local payment methods directly requires significant engineering work, compliance certifications, and ongoing maintenance for each market. RG Pay handles all of this complexity so you can focus on your core business. Plus, our performance-based model means you only pay for results."
  }
]

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<number[]>([0])

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

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
            <Link href="/why-rg-pay" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Why RG Pay?
            </Link>
            <Link href="/recovery-calculator" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Recovery Calculator
            </Link>
            <Link href="/faq" className="text-sm font-medium text-foreground transition-colors">
              FAQ
            </Link>
            <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Back to Demo
            </Link>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-12">
        {/* Back link */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-foreground mb-3">
            Frequently Asked Questions
          </h1>
          <p className="text-muted-foreground">
            Everything you need to know about RG Pay and how it works.
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <Collapsible 
              key={index} 
              open={openItems.includes(index)}
              onOpenChange={() => toggleItem(index)}
            >
              <div className="rounded-lg border border-border overflow-hidden">
                <CollapsibleTrigger className="flex items-center justify-between w-full p-5 text-left hover:bg-muted/50 transition-colors">
                  <span className="font-medium text-foreground pr-4">{faq.question}</span>
                  <ChevronDown className={`h-5 w-5 text-muted-foreground shrink-0 transition-transform ${openItems.includes(index) ? 'rotate-180' : ''}`} />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="px-5 pb-5 pt-0">
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 rounded-lg border border-border bg-card p-8 text-center">
          <h2 className="text-lg font-semibold text-foreground mb-2">
            Still have questions?
          </h2>
          <p className="text-muted-foreground mb-4">
            Our team is here to help you understand how RG Pay can work for your business.
          </p>
          <Link 
            href="/"
            className="inline-flex items-center justify-center rounded-md bg-[#8021ff] px-6 py-3 text-sm font-medium text-white hover:bg-[#6a1bd6] transition-colors"
          >
            Try the Demo
          </Link>
        </div>
      </div>
    </main>
  )
}
