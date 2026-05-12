import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

interface RecentActivityProps {
  latestReturn: { status: "DRAFT" | "COMPLETE" | "SUBMITTED"; updatedAt: Date } | null
}

const statusMap = {
  DRAFT: "খসড়া",
  COMPLETE: "সম্পন্ন",
  SUBMITTED: "দাখিলকৃত",
} as const

const statusColors: Record<string, string> = {
  DRAFT: "bg-[#efefef] text-[#5e5e5e]",
  COMPLETE: "bg-green-100 text-green-700",
  SUBMITTED: "bg-black/8 text-black",
}

export default function RecentActivity({ latestReturn }: RecentActivityProps) {
  return (
    <Card className="rounded-xl border border-[#e2e2e2] shadow-[rgba(0,0,0,0.12)_0px_4px_16px_0px]">
      <CardHeader className="px-6 pt-6 pb-0">
        <h2 className="text-base font-bold text-black">সাম্প্রতিক কার্যক্রম</h2>
      </CardHeader>
      <CardContent className="p-6 pt-4">
        {latestReturn === null ? (
          <div>
            <p className="text-sm text-[#5e5e5e] mb-4 leading-relaxed">
              এখনো কোনো রিটার্ন দাখিল করা হয়নি।
            </p>
            <Button asChild className="rounded-full bg-black text-white hover:bg-[#282828]">
              <Link href="/dashboard/return/interview">এখনই শুরু করুন</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#5e5e5e]">অবস্থা</span>
              <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusColors[latestReturn.status]}`}>
                {statusMap[latestReturn.status]}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#5e5e5e]">সর্বশেষ আপডেট</span>
              <span className="text-sm font-medium text-black">
                {new Date(latestReturn.updatedAt).toLocaleDateString("bn-BD")}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
