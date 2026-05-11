import Link from "next/link"

export const metadata = { title: "শীঘ্রই আসছে — TaxFlowBD" }

export default function ComingSoonPage() {
  return (
    <div className="min-h-full flex flex-col items-center justify-center px-6 py-16 text-center">
      <p className="text-5xl mb-6">🚀</p>
      <h1 className="text-2xl font-bold text-brand-primary mb-3">শীঘ্রই আসছে</h1>
      <p className="text-sm text-gray-500 max-w-xs mb-8">
        এই ফিচারটি এখনো তৈরি হচ্ছে। শীঘ্রই উপলব্ধ হবে।
      </p>
      <Link
        href="/dashboard"
        className="inline-flex items-center border border-brand-primary text-brand-primary rounded-xl px-5 py-2.5 text-sm hover:bg-brand-surface transition"
      >
        ড্যাশবোর্ডে ফিরুন
      </Link>
    </div>
  )
}
