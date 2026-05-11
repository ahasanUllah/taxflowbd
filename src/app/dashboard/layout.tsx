import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import Sidebar from "@/components/dashboard/Sidebar"
import Header from "@/components/dashboard/Header"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="flex h-screen bg-brand-surface">
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-60 overflow-hidden">
        <Header userName={session.user.name ?? ""} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
