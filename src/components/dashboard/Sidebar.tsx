"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronDown } from "lucide-react"
import LogoutButton from "@/components/shared/LogoutButton"
import { Logo } from "@/components/shared/Logo"

type NavChild = { href: string; label: string }
type NavItem =
  | { href: string; label: string; children?: never }
  | { label: string; children: NavChild[]; href?: never }

const navItems: NavItem[] = [
  { href: "/dashboard", label: "ড্যাশবোর্ড" },
  {
    label: "ট্যাক্স রিটার্ন",
    children: [
      { href: "/dashboard/return/interview", label: "ইন্টারভিউ শুরু করুন" },
      { href: "/dashboard/return/history", label: "রিটার্নের ইতিহাস" },
      { href: "/dashboard/return/download", label: "পিডিএফ ডাউনলোড" },
    ],
  },
  { href: "/dashboard/documents", label: "ডকুমেন্ট ভল্ট" },
  { href: "/dashboard/profile", label: "আমার প্রোফাইল" },
]

const base =
  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition w-full text-left"
const activeClass = "bg-black text-white font-semibold"
const inactiveClass = "text-[#5e5e5e] hover:bg-[#efefef] hover:text-black"

function NavMenu({
  items,
  pathname,
  onNavigate,
}: {
  items: NavItem[]
  pathname: string
  onNavigate?: () => void
}) {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {}
    items.forEach((item) => {
      if (item.children) {
        initial[item.label] = item.children.some((c) =>
          pathname.startsWith(c.href)
        )
      }
    })
    return initial
  })

  return (
    <nav className="flex flex-col gap-1 px-3 py-4">
      {items.map((item) => {
        if (item.children) {
          const isGroupActive = item.children.some((c) =>
            pathname.startsWith(c.href)
          )
          const isOpen = openGroups[item.label] ?? false

          return (
            <div key={item.label}>
              <button
                className={`${base} justify-between ${isGroupActive ? activeClass : inactiveClass}`}
                onClick={() =>
                  setOpenGroups((prev) => ({
                    ...prev,
                    [item.label]: !prev[item.label],
                  }))
                }
              >
                <span>{item.label}</span>
                <ChevronDown
                  className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="ml-4 mt-1 flex flex-col gap-1 border-l border-[#e2e2e2] pl-3">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={onNavigate}
                      className={`${base} py-2 ${
                        pathname === child.href ? activeClass : inactiveClass
                      }`}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`${base} ${
              pathname === item.href ? activeClass : inactiveClass
            }`}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const pathname = usePathname()

  return (
    <>
      {/* Hamburger button — mobile only */}
      <button
        className="md:hidden fixed top-4 left-4 z-40 p-2 bg-white rounded-xl border border-[#e2e2e2] shadow-[rgba(0,0,0,0.08)_0px_2px_8px_0px]"
        onClick={() => setIsOpen(true)}
        aria-label="মেনু খুলুন"
      >
        <span className="block w-5 h-0.5 bg-black mb-1" />
        <span className="block w-5 h-0.5 bg-black mb-1" />
        <span className="block w-5 h-0.5 bg-black" />
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-20 bg-black/40"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-[rgba(15,15,15,0.16)_0px_16px_48px_-8px] flex flex-col">
            <div className="flex items-center justify-between px-4 py-4 border-b border-[#e2e2e2]">
              <Logo variant="compact" className="text-black" />
              <button
                onClick={() => setIsOpen(false)}
                aria-label="মেনু বন্ধ করুন"
                className="text-[#5e5e5e] hover:text-black"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <NavMenu
                items={navItems}
                pathname={pathname}
                onNavigate={() => setIsOpen(false)}
              />
            </div>
            <div className="px-3 pb-6">
              <LogoutButton className="w-full text-left px-4 py-3 rounded-xl text-sm text-[#5e5e5e] hover:bg-red-50 hover:text-red-600 transition" />
            </div>
          </div>
        </>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-60 h-screen bg-white border-r border-[#e2e2e2] fixed top-0 left-0 z-20">
        <div className="px-5 py-4 border-b border-[#e2e2e2]">
          <Logo variant="compact" className="text-black" />
        </div>
        <div className="flex-1 overflow-y-auto">
          <NavMenu items={navItems} pathname={pathname} />
        </div>
        <div className="px-3 pb-6">
          <LogoutButton className="w-full text-left px-4 py-3 rounded-xl text-sm text-[#5e5e5e] hover:bg-red-50 hover:text-red-600 transition" />
        </div>
      </aside>
    </>
  )
}
