import Link from "next/link"
import { Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export const metadata = { title: "শীঘ্রই আসছে — TaxFlowBD" }

export default function ComingSoonPage() {
  return (
    <div className="min-h-full flex flex-col items-center justify-center px-6 py-16">
      <Card className="rounded-xl border-0 shadow-[rgba(0,0,0,0.12)_0px_4px_16px_0px] w-full max-w-sm">
        <CardContent className="p-10 flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-xl bg-[#efefef] flex items-center justify-center mb-6">
            <Clock className="w-7 h-7 text-black" />
          </div>
          <h1 className="text-xl font-bold text-black mb-3">শীঘ্রই আসছে</h1>
          <p className="text-sm text-[#5e5e5e] mb-8 leading-relaxed">
            এই ফিচারটি এখনো তৈরি হচ্ছে। শীঘ্রই উপলব্ধ হবে।
          </p>
          <Button asChild className="rounded-full bg-black text-white hover:bg-[#282828] px-6">
            <Link href="/dashboard">ড্যাশবোর্ডে ফিরুন</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
