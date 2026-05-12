"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { signUp, useSession } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"

function AuthSkeleton() {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:block lg:w-5/12 bg-black" />
      <div className="flex-1 flex items-center justify-center bg-[#f3f3f3] px-6 py-12">
        <div className="w-full max-w-md bg-white rounded-xl p-8 space-y-5">
          <Skeleton className="h-7 w-2/5 rounded-full" />
          <Skeleton className="h-4 w-3/5 rounded-full" />
          <Skeleton className="h-11 w-full rounded-xl" />
          <Skeleton className="h-11 w-full rounded-xl" />
          <Skeleton className="h-11 w-full rounded-xl" />
          <Skeleton className="h-11 w-full rounded-xl" />
          <Skeleton className="h-11 w-full rounded-full" />
        </div>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  const router = useRouter()
  const { data: session, isPending } = useSession()
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (session) router.replace("/dashboard")
  }, [session, router])

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")

    if (form.password !== form.confirm) {
      setError("পাসওয়ার্ড মিলছে না")
      return
    }

    setLoading(true)

    const { error: signUpError } = await signUp.email({
      name: form.name,
      email: form.email,
      password: form.password,
      callbackURL: "/dashboard",
    })

    if (signUpError) {
      setError("নিবন্ধন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।")
      setLoading(false)
      return
    }

    router.push("/dashboard")
  }

  if (isPending) return <AuthSkeleton />

  return (
    <div className="min-h-screen flex">
      {/* Left: Black branding panel */}
      <div className="hidden lg:flex lg:w-5/12 flex-col justify-between bg-black px-12 py-14 xl:px-16">
        <span className="text-white text-xl font-bold tracking-tight">TaxFlowBD</span>

        <div>
          <h1 className="text-4xl font-bold text-white leading-tight mb-5">
            কর দেওয়া এখন<br />আর কঠিন নয়
          </h1>
          <p className="text-[#afafaf] text-base leading-relaxed mb-8">
            বিনামূল্যে অ্যাকাউন্ট খুলুন এবং আজই আপনার কর প্রস্তুতি শুরু করুন।
          </p>
          <ul className="space-y-3">
            {[
              "সম্পূর্ণ বিনামূল্যে শুরু করুন",
              "নিরাপদ ও এনক্রিপ্টেড ডেটা",
              "২৪/৭ AI সহায়তা",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-[#afafaf]">
                <span className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-[#5e5e5e] text-xs">
          © {new Date().getFullYear()} TaxFlowBD — বাংলাদেশ আয়কর আইন ২০২৩ অনুযায়ী
        </p>
      </div>

      {/* Right: Form panel */}
      <div className="flex-1 flex items-center justify-center bg-[#f3f3f3] px-6 py-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 text-center">
            <span className="text-2xl font-bold text-black">TaxFlowBD</span>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-[rgba(0,0,0,0.16)_0px_4px_16px_0px]">
            <div className="mb-7">
              <h2 className="text-2xl font-bold text-black">নিবন্ধন করুন</h2>
              <p className="mt-1.5 text-sm text-[#5e5e5e]">নতুন অ্যাকাউন্ট তৈরি করুন</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-black">পুরো নাম</label>
                <Input
                  type="text"
                  required
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="আপনার নাম লিখুন"
                  className="rounded-xl bg-[#f3f3f3] border-0 h-11 text-black placeholder:text-[#afafaf] focus-visible:ring-1 focus-visible:ring-black"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-black">ইমেইল</label>
                <Input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="example@email.com"
                  className="rounded-xl bg-[#f3f3f3] border-0 h-11 text-black placeholder:text-[#afafaf] focus-visible:ring-1 focus-visible:ring-black"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-black">পাসওয়ার্ড</label>
                <Input
                  type="password"
                  required
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="কমপক্ষে ৮ অক্ষর"
                  className="rounded-xl bg-[#f3f3f3] border-0 h-11 text-black placeholder:text-[#afafaf] focus-visible:ring-1 focus-visible:ring-black"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-black">পাসওয়ার্ড নিশ্চিত করুন</label>
                <Input
                  type="password"
                  required
                  value={form.confirm}
                  onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
                  placeholder="পাসওয়ার্ড আবার লিখুন"
                  className="rounded-xl bg-[#f3f3f3] border-0 h-11 text-black placeholder:text-[#afafaf] focus-visible:ring-1 focus-visible:ring-black"
                />
              </div>

              {error && (
                <div className="px-4 py-2.5 rounded-xl bg-red-50 border border-red-100">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-full bg-black text-white hover:bg-[#282828] disabled:bg-[#efefef] disabled:text-[#afafaf] mt-1"
              >
                {loading ? "লোড হচ্ছে..." : "নিবন্ধন করুন"}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-[#5e5e5e]">
              ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
              <Link href="/login" className="text-black font-semibold hover:underline transition">
                লগইন করুন
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
