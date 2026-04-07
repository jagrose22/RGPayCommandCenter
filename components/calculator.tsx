// DEMO TALK TRACK — Step 6 calculator
// Say: "These are suggested numbers 
// based on similar enterprise accounts.
// But let's use your numbers — what does
// your non-NA checkout volume look like?"
// Then hand them the keyboard.
// The number that appears is their number.
// That's the close.

"use client"

import { useState, useEffect } from "react"

interface CalculatorProps {
  placeholders: {
    sessions: string
    avgValue: string
    conversion: string
  }
}

export function Calculator({ placeholders }: CalculatorProps) {
  const [sessions, setSessions] = useState("")
  const [avgValue, setAvgValue] = useState("")
  const [conversion, setConversion] = useState("")
  
  // Animated counter states
  const [displayMonthly, setDisplayMonthly] = useState(0)
  const [displayAnnual, setDisplayAnnual] = useState(0)
  const [displayCommission, setDisplayCommission] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  
  // Parse inputs
  const sessionsNum = parseFloat(sessions.replace(/,/g, "")) || 0
  const avgValueNum = parseFloat(avgValue.replace(/[$,]/g, "")) || 0
  const conversionNum = parseFloat(conversion.replace(/%/g, "")) || 0
  
  // Check if all inputs have values
  const hasAllInputs = sessionsNum > 0 && avgValueNum > 0 && conversionNum > 0
  
  // Calculate outputs
  const abandonedSessions = sessionsNum * (1 - conversionNum / 100)
  const recoverableSessions = abandonedSessions * 0.40
  const monthlyRecoveryOpportunity = recoverableSessions * avgValueNum
  const annualRecoveryOpportunity = monthlyRecoveryOpportunity * 12
  const annualOTACommissionAvoided = monthlyRecoveryOpportunity * 12 * 0.18
  
  // Animate count-up when outputs first appear
  useEffect(() => {
    if (hasAllInputs && !hasAnimated) {
      setHasAnimated(true)
      const duration = 1500
      const steps = 60
      const stepDuration = duration / steps
      
      let currentStep = 0
      const interval = setInterval(() => {
        currentStep++
        const progress = currentStep / steps
        const easeOut = 1 - Math.pow(1 - progress, 3)
        
        setDisplayMonthly(Math.round(monthlyRecoveryOpportunity * easeOut))
        setDisplayAnnual(Math.round(annualRecoveryOpportunity * easeOut))
        setDisplayCommission(Math.round(annualOTACommissionAvoided * easeOut))
        
        if (currentStep >= steps) {
          clearInterval(interval)
          setDisplayMonthly(Math.round(monthlyRecoveryOpportunity))
          setDisplayAnnual(Math.round(annualRecoveryOpportunity))
          setDisplayCommission(Math.round(annualOTACommissionAvoided))
        }
      }, stepDuration)
      
      return () => clearInterval(interval)
    } else if (hasAllInputs && hasAnimated) {
      // Update immediately after initial animation
      setDisplayMonthly(Math.round(monthlyRecoveryOpportunity))
      setDisplayAnnual(Math.round(annualRecoveryOpportunity))
      setDisplayCommission(Math.round(annualOTACommissionAvoided))
    }
  }, [hasAllInputs, hasAnimated, monthlyRecoveryOpportunity, annualRecoveryOpportunity, annualOTACommissionAvoided])
  
  // Reset animation flag when inputs are cleared
  useEffect(() => {
    if (!hasAllInputs) {
      setHasAnimated(false)
      setDisplayMonthly(0)
      setDisplayAnnual(0)
      setDisplayCommission(0)
    }
  }, [hasAllInputs])
  
  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`
    }
    return `$${value.toLocaleString()}`
  }
  
  return (
    <div className="rounded-lg border-[1.5px] border-[#E5E7EB] bg-white p-6 shadow-sm">
      {/* Header */}
      <p className="text-sm font-bold text-[#1A1A2E] mb-1">
        What does this look like at your scale?
      </p>
      <p className="text-xs text-[#6B7280] mb-5">
        Enter your checkout data below
      </p>
      
      {/* Input Fields */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* Sessions Input */}
        <div>
          <label className="block text-xs font-semibold text-[#6B7280] mb-1.5">
            Monthly non-NA checkout sessions
          </label>
          <input
            type="text"
            value={sessions}
            onChange={(e) => setSessions(e.target.value)}
            placeholder={placeholders.sessions}
            className="w-full rounded-md border border-[#E5E7EB] bg-white px-3.5 py-2.5 text-[13px] text-[#111827] placeholder:text-[#9CA3AF] focus:border-[#8021FF] focus:outline-none focus:ring-1 focus:ring-[#8021FF]"
          />
          <p className="text-[10px] text-[#9CA3AF] mt-1">
            Total sessions from India, China, LATAM, and SE Asia markets
          </p>
        </div>
        
        {/* Avg Value Input */}
        <div>
          <label className="block text-xs font-semibold text-[#6B7280] mb-1.5">
            Average booking value
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[13px] text-[#6B7280]">$</span>
            <input
              type="text"
              value={avgValue}
              onChange={(e) => setAvgValue(e.target.value)}
              placeholder={placeholders.avgValue.replace("$", "")}
              className="w-full rounded-md border border-[#E5E7EB] bg-white pl-7 pr-3.5 py-2.5 text-[13px] text-[#111827] placeholder:text-[#9CA3AF] focus:border-[#8021FF] focus:outline-none focus:ring-1 focus:ring-[#8021FF]"
            />
          </div>
          <p className="text-[10px] text-[#9CA3AF] mt-1">
            Your average direct booking value in USD
          </p>
        </div>
        
        {/* Conversion Input */}
        <div>
          <label className="block text-xs font-semibold text-[#6B7280] mb-1.5">
            Current direct conversion rate
          </label>
          <div className="relative">
            <input
              type="text"
              value={conversion}
              onChange={(e) => setConversion(e.target.value)}
              placeholder={placeholders.conversion.replace("%", "")}
              className="w-full rounded-md border border-[#E5E7EB] bg-white px-3.5 pr-7 py-2.5 text-[13px] text-[#111827] placeholder:text-[#9CA3AF] focus:border-[#8021FF] focus:outline-none focus:ring-1 focus:ring-[#8021FF]"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[13px] text-[#6B7280]">%</span>
          </div>
          <p className="text-[10px] text-[#9CA3AF] mt-1">
            What % of checkout sessions currently complete
          </p>
        </div>
      </div>
      
      {/* Output Cards */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {/* Monthly Recovery - Hero Card */}
        <div className="rounded-md border-[1.5px] border-[#8021FF] bg-[#F3EEFF] p-4">
          <p className="text-[10px] font-medium text-[#6B7280] uppercase tracking-wider mb-1.5">
            Monthly Recovery Opportunity
          </p>
          <p className="text-[28px] font-black text-[#8021FF]">
            {hasAllInputs ? formatCurrency(displayMonthly) : "—"}
          </p>
        </div>
        
        {/* Annual Recovery */}
        <div className="rounded-md border-[1.5px] border-[#E5E7EB] bg-white p-4">
          <p className="text-[10px] font-medium text-[#6B7280] uppercase tracking-wider mb-1.5">
            Annual Recovery Opportunity
          </p>
          <p className="text-[28px] font-black text-[#8021FF]">
            {hasAllInputs ? formatCurrency(displayAnnual) : "—"}
          </p>
        </div>
        
        {/* OTA Commission Avoided */}
        <div className="rounded-md border-[1.5px] border-[#E5E7EB] bg-white p-4">
          <p className="text-[10px] font-medium text-[#6B7280] uppercase tracking-wider mb-1.5">
            Annual OTA Commission Avoided
          </p>
          <p className="text-[28px] font-black text-[#00C896]">
            {hasAllInputs ? formatCurrency(displayCommission) : "—"}
          </p>
        </div>
      </div>
      
      {/* Footer note */}
      <p className="text-[10px] text-[#9CA3AF] text-center italic">
        Based on 40% abandonment from missing payment methods and 18% OTA commission rate
      </p>
    </div>
  )
}
