"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Logo } from "@/components/shared/Logo"
import { signIn, useSession } from "@/lib/auth-client"
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
          <Skeleton className="h-11 w-full rounded-full" />
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  const router = useRouter()
  const { data: session, isPending } = useSession()
  const [form, setForm] = useState({ email: "", password: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (session) router.replace("/dashboard")
  }, [session, router])

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setLoading(true)

    const { error: signInError } = await signIn.email({
      email: form.email,
      password: form.password,
      callbackURL: "/dashboard",
    })

    if (signInError) {
      setError("ইমেইল বা পাসওয়ার্ড সঠিক নয়")
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
        <Logo variant="compact" className="text-white" />

        <div>
          <h1 className="text-4xl font-bold text-white leading-tight mb-5">
            আয়কর রিটার্ন দাখিল<br />এখন অনেক সহজ
          </h1>
          <p className="text-[#afafaf] text-base leading-relaxed mb-8">
            মাত্র ১৫ মিনিটে AI-সহায়তায় নির্ভুল আয়কর রিটার্ন প্রস্তুত করুন।
          </p>
          <ul className="space-y-3">
            {[
              "এআই-চালিত আয়কর গণনা",
              "বিনিয়োগ রিবেট অপ্টিমাইজার",
              "তাৎক্ষণিক PDF ডাউনলোড",
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
          <div className="lg:hidden mb-8 flex justify-start">
            <Logo variant="compact" className="text-black" />
          </div>

          <div className="bg-white rounded-xl p-8 shadow-[rgba(0,0,0,0.16)_0px_4px_16px_0px]">
            <div className="mb-7">
              <h2 className="text-2xl font-bold text-black">লগইন করুন</h2>
              <p className="mt-1.5 text-sm text-[#5e5e5e]">আপনার অ্যাকাউন্টে প্রবেশ করুন</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
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
                  placeholder="আপনার পাসওয়ার্ড লিখুন"
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
                {loading ? "লোড হচ্ছে..." : "লগইন করুন"}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-[#5e5e5e]">
              অ্যাকাউন্ট নেই?{" "}
              <Link href="/register" className="text-black font-semibold hover:underline transition">
                নিবন্ধন করুন
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
