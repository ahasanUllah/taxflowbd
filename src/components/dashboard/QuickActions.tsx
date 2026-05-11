import Link from "next/link"

const actions = [
  { label: "রিটার্ন শুরু করুন", href: "/dashboard/return/interview", emoji: "📋" },
  { label: "খসড়া দেখুন", href: "/dashboard/return/interview", emoji: "📝" },
  { label: "বিনিয়োগ অপ্টিমাইজ", href: "/dashboard/coming-soon", emoji: "💰" },
  { label: "ডকুমেন্ট আপলোড", href: "/dashboard/coming-soon", emoji: "📁" },
]

export default function QuickActions() {
  return (
    <section>
      <h2 className="text-base font-semibold text-foreground mb-4">দ্রুত কার্যক্রম</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action) => (
          <Link
            key={action.href + action.label}
            href={action.href}
            className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md hover:border-brand-primary/30 transition text-center flex flex-col items-center gap-2"
          >
            <span className="text-2xl">{action.emoji}</span>
            <span className="text-sm font-medium text-foreground">{action.label}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
