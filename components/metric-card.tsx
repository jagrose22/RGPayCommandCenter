import { Card } from "@/components/ui/card"

interface MetricCardProps {
  label: string
  value: string
  change: string
  accentColor: string
}

export function MetricCard({ label, value, change, accentColor }: MetricCardProps) {
  const isPositive = change.startsWith("+")

  return (
    <Card className="p-6">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
        {value}
      </p>
      <p
        className="mt-1 text-sm font-medium"
        style={{ color: isPositive ? "#16a34a" : "#dc2626" }}
      >
        {change} vs last month
      </p>
    </Card>
  )
}
