import Link from "next/link";

interface RecentActivityProps {
  latestReturn: { status: "DRAFT" | "COMPLETE" | "SUBMITTED"; updatedAt: Date } | null;
}

const statusMap = {
  DRAFT: "খসড়া",
  COMPLETE: "সম্পন্ন",
  SUBMITTED: "দাখিলকৃত",
} as const;

export default function RecentActivity({ latestReturn }: RecentActivityProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <h2 className="text-base font-semibold text-foreground mb-4">সাম্প্রতিক কার্যক্রম</h2>

      {latestReturn === null ? (
        <>
          <p className="text-sm text-gray-500 mb-4">এখনো কোনো রিটার্ন দাখিল করা হয়নি।</p>
          <Link
            href="/dashboard/return/interview"
            className="inline-flex items-center border border-brand-primary text-brand-primary rounded-xl px-5 py-2.5 text-sm hover:bg-brand-surface transition"
          >
            এখনই শুরু করুন
          </Link>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <span>অবস্থা:</span>
            <span className="font-medium text-brand-primary">{statusMap[latestReturn.status]}</span>
          </div>
          <div className="flex items-center justify-between mt-2 text-sm text-gray-500">
            <span>সর্বশেষ আপডেট:</span>
            <span>{new Date(latestReturn.updatedAt).toLocaleDateString("bn-BD")}</span>
          </div>
        </>
      )}
    </div>
  );
}
