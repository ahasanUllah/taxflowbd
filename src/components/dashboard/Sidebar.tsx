"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import LogoutButton from "@/components/shared/LogoutButton"

const navLinks = [
  { href: "/dashboard", label: "ড্যাশবোর্ড" },
  { href: "/dashboard/return/interview", label: "ট্যাক্স রিটার্ন" },
  { href: "/dashboard/profile", label: "আমার প্রোফাইল" },
]

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const pathname = usePathname()

  function getLinkClass(href: string): string {
    const base = "flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition"
    const active = "bg-brand-surface text-brand-primary font-semibold"
    const inactive = "text-gray-600 hover:bg-gray-50"
    return `${base} ${pathname === href ? active : inactive}`
  }

  return (
    <>
      {/* Hamburger button — mobile only */}
      <button
        className="md:hidden fixed top-4 left-4 z-40 p-2 bg-white rounded-lg border border-gray-100 shadow-sm"
        onClick={() => setIsOpen(true)}
        aria-label="মেনু খুলুন"
      >
        <span className="block w-5 h-0.5 bg-gray-700 mb-1" />
        <span className="block w-5 h-0.5 bg-gray-700 mb-1" />
        <span className="block w-5 h-0.5 bg-gray-700" />
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-20 bg-black/40"
            onClick={() => setIsOpen(false)}
          />
          {/* Sliding panel */}
          <div className="fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
              <span className="font-semibold text-brand-primary text-sm">TaxFlowBD</span>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="মেনু বন্ধ করুন"
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <nav className="flex flex-col gap-1 px-3 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={getLinkClass(link.href)}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="mt-auto px-3 pb-6">
              <LogoutButton className="w-full text-left px-4 py-3 rounded-xl text-sm text-gray-600 hover:bg-red-50 hover:text-brand-accent transition" />
            </div>
          </div>
        </>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-60 h-screen bg-white border-r border-gray-100 fixed top-0 left-0 z-20">
        <div className="px-6 py-5 border-b border-gray-100">
          <span className="font-semibold text-brand-primary text-sm">TaxFlowBD</span>
        </div>
        <nav className="flex flex-col gap-1 px-3 py-4">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className={getLinkClass(link.href)}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto px-3 pb-6">
          <LogoutButton className="w-full text-left px-4 py-3 rounded-xl text-sm text-gray-600 hover:bg-red-50 hover:text-brand-accent transition" />
        </div>
      </aside>
    </>
  )
}
