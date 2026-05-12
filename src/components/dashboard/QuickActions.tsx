import Link from "next/link"
import { FileText, FilePen, TrendingUp, FolderOpen } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const actions = [
  { label: "রিটার্ন শুরু করুন", href: "/dashboard/return/interview", icon: FileText },
  { label: "খসড়া দেখুন", href: "/dashboard/return/interview", icon: FilePen },
  { label: "বিনিয়োগ অপ্টিমাইজ", href: "/dashboard/coming-soon", icon: TrendingUp },
  { label: "ডকুমেন্ট আপলোড", href: "/dashboard/coming-soon", icon: FolderOpen },
]

export default function QuickActions() {
  return (
    <section>
      <h2 className="text-base font-bold text-black mb-4">দ্রুত কার্যক্রম</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action) => (
          <Link key={action.href + action.label} href={action.href}>
            <Card className="rounded-xl border border-[#e2e2e2] hover:shadow-[rgba(0,0,0,0.12)_0px_4px_16px_0px] hover:border-black/20 transition-all cursor-pointer h-full">
              <CardContent className="p-5 flex flex-col items-center gap-3 text-center">
                <div className="w-10 h-10 rounded-xl bg-[#efefef] flex items-center justify-center">
                  <action.icon className="w-5 h-5 text-black" />
                </div>
                <span className="text-sm font-medium text-black">{action.label}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}
