import { Card, CardContent } from "@/components/ui/card"

interface StatsCardProps {
  label: string
  value: string
  subLabel?: string
}

export default function StatsCard({ label, value, subLabel }: StatsCardProps) {
  return (
    <Card className="rounded-xl border border-[#e2e2e2] shadow-[rgba(0,0,0,0.12)_0px_4px_16px_0px]">
      <CardContent className="p-6">
        <p className="text-sm text-[#5e5e5e] mb-2">{label}</p>
        <p className="text-2xl font-bold text-black">{value}</p>
        {subLabel && <p className="text-xs text-[#afafaf] mt-1">{subLabel}</p>}
      </CardContent>
    </Card>
  )
}
