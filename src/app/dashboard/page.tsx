import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { connectToDatabase } from "@/lib/mongodb"
import UserProfile from "@/models/User"
import TaxReturn from "@/models/TaxReturn"
import StatsCard from "@/components/dashboard/StatsCard"
import ProfileAlert from "@/components/dashboard/ProfileAlert"
import QuickActions from "@/components/dashboard/QuickActions"
import RecentActivity from "@/components/dashboard/RecentActivity"

const statusMap = {
  DRAFT: "খসড়া",
  COMPLETE: "সম্পন্ন",
  SUBMITTED: "দাখিলকৃত",
} as const

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  await connectToDatabase()

  const profile = await UserProfile.findOne({
    betterAuthUserId: session?.user.id,
  }).lean()

  const latestReturnDoc = await TaxReturn.findOne({ userId: session?.user.id })
    .sort({ createdAt: -1 })
    .limit(1)
    .lean()

  const profileCompleteness = (profile as any)?.profileCompleteness ?? 0
  const firstName = (session?.user.name ?? "ব্যবহারকারী").split(" ")[0]

  const returnStatus = latestReturnDoc
    ? (statusMap[(latestReturnDoc as any).status as keyof typeof statusMap] ?? "অজানা")
    : "নেই"

  const latestReturn = latestReturnDoc
    ? {
        status: (latestReturnDoc as any).status as "DRAFT" | "COMPLETE" | "SUBMITTED",
        updatedAt: (latestReturnDoc as any).updatedAt as Date,
      }
    : null

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-5xl mx-auto">
      {/* Greeting */}
      <div>
        <h2 className="text-2xl font-bold text-black">
          স্বাগতম, {firstName}
        </h2>
        <p className="text-sm text-[#5e5e5e] mt-1">
          মূল্যায়ন বছর ২০২৫-২৬ এর জন্য আপনার কর রিটার্ন প্রস্তুত করুন।
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard label="প্রোফাইল সম্পন্ন" value={`${profileCompleteness}%`} />
        <StatsCard label="রিটার্নের অবস্থা" value={returnStatus} />
        <StatsCard label="মূল্যায়ন বছর" value="AY 2025-26" />
      </div>

      {/* Profile alert */}
      <ProfileAlert profileCompleteness={profileCompleteness} />

      {/* Main two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <QuickActions />
        </div>
        <div>
          <RecentActivity latestReturn={latestReturn} />
        </div>
      </div>
    </div>
  )
}
