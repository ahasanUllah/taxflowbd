import Link from "next/link"
import { FileText, Zap, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Logo } from "@/components/shared/Logo"

const features = [
  {
    icon: Zap,
    title: "মাত্র ১৫ মিনিট",
    desc: "AI-সহায়তায় দ্রুত ও নির্ভুল রিটার্ন প্রস্তুত করুন।",
  },
  {
    icon: FileText,
    title: "তাৎক্ষণিক PDF",
    desc: "রিটার্ন সম্পন্ন হলেই ডাউনলোডযোগ্য PDF পান।",
  },
  {
    icon: ShieldCheck,
    title: "সম্পূর্ণ নিরাপদ",
    desc: "এনক্রিপ্টেড ডেটা সংরক্ষণ, আপনার তথ্য সুরক্ষিত।",
  },
]

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-[#e2e2e2]">
        <Logo variant="compact" className="text-black" />
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" className="rounded-full text-black hover:bg-[#efefef]">
            <Link href="/login">লগইন করুন</Link>
          </Button>
          <Button asChild className="rounded-full bg-black text-white hover:bg-[#282828]">
            <Link href="/register">নিবন্ধন করুন</Link>
          </Button>
        </div>
      </nav>

      {/* Hero band */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-24 bg-white flex-1">
        <p className="text-sm font-medium text-[#5e5e5e] uppercase tracking-widest mb-6">
          বাংলাদেশ আয়কর আইন ২০২৩
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-black leading-tight max-w-2xl mb-6">
          আয়কর রিটার্ন দাখিল এখন অনেক সহজ
        </h1>
        <p className="text-lg text-[#5e5e5e] max-w-xl mb-10 leading-relaxed">
          AI-সহায়তায় মাত্র ১৫ মিনিটে নির্ভুল আয়কর রিটার্ন প্রস্তুত করুন। তাৎক্ষণিক PDF ডাউনলোড করুন।
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-12">
          <Button asChild size="lg" className="rounded-full bg-black text-white hover:bg-[#282828] px-8">
            <Link href="/register">বিনামূল্যে শুরু করুন</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full border-[#e2e2e2] text-black hover:bg-[#efefef] px-8">
            <Link href="/login">লগইন করুন</Link>
          </Button>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {["এআই-চালিত গণনা", "বিনিয়োগ অপ্টিমাইজার", "তাৎক্ষণিক PDF"].map((tag) => (
            <span key={tag} className="text-sm font-medium text-[#5e5e5e] bg-[#efefef] px-4 py-1.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </section>

      {/* Dark promo band */}
      <section className="bg-black text-white px-8 py-20 flex flex-col items-center text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 max-w-xl">
          কর দেওয়া এখন আর কঠিন নয়
        </h2>
        <p className="text-[#afafaf] text-base mb-8 max-w-md leading-relaxed">
          বিনামূল্যে অ্যাকাউন্ট খুলুন এবং আজই আপনার কর প্রস্তুতি শুরু করুন।
        </p>
        <Button asChild size="lg" className="rounded-full bg-white text-black hover:bg-[#efefef] px-8">
          <Link href="/register">এখনই শুরু করুন</Link>
        </Button>
      </section>

      {/* Features section */}
      <section className="bg-[#f3f3f3] px-8 py-20">
        <h2 className="text-2xl font-bold text-black text-center mb-12">
          কেন TaxFlowBD বেছে নেবেন?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {features.map(({ icon: Icon, title, desc }) => (
            <Card key={title} className="rounded-xl border-0 shadow-[rgba(0,0,0,0.12)_0px_4px_16px_0px] bg-white">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-[#efefef] flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-base font-semibold text-black mb-2">{title}</h3>
                <p className="text-sm text-[#5e5e5e] leading-relaxed">{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Logo variant="compact" className="text-white" />
        <p className="text-sm text-[#afafaf]">
          © {new Date().getFullYear()} TaxFlowBD — বাংলাদেশ আয়কর আইন ২০২৩ অনুযায়ী
        </p>
      </footer>
    </div>
  )
}
