import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

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
    <SidebarProvider>
      <AppSidebar user={{ name: session.user.name ?? "ব্যবহারকারী", email: session.user.email ?? "" }} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-[#e2e2e2] bg-background px-4 sticky top-0 z-10">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          <span className="text-sm font-medium text-[#5e5e5e]">TaxFlowBD</span>
        </header>
        <main className="flex-1 overflow-y-auto bg-[#f3f3f3]">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
