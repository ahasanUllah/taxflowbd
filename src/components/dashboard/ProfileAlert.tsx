"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

interface ProfileAlertProps {
  profileCompleteness: number
}

export default function ProfileAlert({ profileCompleteness }: ProfileAlertProps) {
  const [alertState, setAlertState] = useState<"incomplete" | "success" | "hidden">(
    profileCompleteness >= 100 ? "success" : "incomplete"
  )

  useEffect(() => {
    if (profileCompleteness >= 100) {
      setAlertState("success")
      setTimeout(() => setAlertState("hidden"), 1500)
    }
  }, [profileCompleteness])

  if (alertState === "hidden") {
    return null
  }

  if (alertState === "success") {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-6 flex items-center gap-3 transition-opacity duration-500">
        <span className="text-lg">✅</span>
        <p className="text-sm font-medium text-green-800">প্রফাইল সম্পন্ন</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-foreground">প্রফাইল সম্পন্ন করুন</h3>
        <span className="text-sm font-medium text-brand-primary">{profileCompleteness}% সম্পন্ন</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div
          className="bg-brand-primary h-2 rounded-full transition-all"
          style={{ width: `${profileCompleteness}%` }}
        />
      </div>
      <Link
        href="/dashboard/profile"
        className="inline-flex items-center bg-brand-primary text-white rounded-xl px-5 py-2.5 text-sm font-semibold hover:bg-brand-primary/90 transition"
      >
        প্রফাইল সম্পন্ন করুন
      </Link>
    </div>
  )
}
