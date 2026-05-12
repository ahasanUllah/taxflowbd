"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

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

  if (alertState === "hidden") return null

  if (alertState === "success") {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-5 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-sm">
          ✓
        </div>
        <p className="text-sm font-medium text-green-700">প্রফাইল সম্পন্ন হয়েছে</p>
      </div>
    )
  }

  return (
    <Card className="rounded-xl border border-[#e2e2e2] shadow-[rgba(0,0,0,0.12)_0px_4px_16px_0px]">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-black">প্রফাইল সম্পন্ন করুন</h3>
          <span className="text-xs font-medium text-black bg-[#efefef] px-3 py-1 rounded-full">
            {profileCompleteness}% সম্পন্ন
          </span>
        </div>
        <div className="w-full bg-[#efefef] rounded-full h-1.5 mb-5">
          <div
            className="bg-black h-1.5 rounded-full transition-all"
            style={{ width: `${profileCompleteness}%` }}
          />
        </div>
        <Button asChild className="rounded-full bg-black text-white hover:bg-[#282828]">
          <Link href="/dashboard/profile">প্রফাইল সম্পন্ন করুন</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
