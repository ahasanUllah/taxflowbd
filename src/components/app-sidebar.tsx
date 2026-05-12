"use client"

import * as React from "react"
import { LayoutDashboard, FileText, FolderOpen, User } from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { Logo } from "@/components/shared/Logo"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

const navMain = [
  {
    title: "ড্যাশবোর্ড",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "ট্যাক্স রিটার্ন",
    url: "#",
    icon: FileText,
    items: [
      { title: "ইন্টারভিউ শুরু করুন", url: "/dashboard/return/interview" },
      { title: "রিটার্নের ইতিহাস", url: "/dashboard/return/history" },
      { title: "পিডিএফ ডাউনলোড", url: "/dashboard/return/download" },
    ],
  },
  {
    title: "ডকুমেন্ট ভল্ট",
    url: "/dashboard/documents",
    icon: FolderOpen,
  },
  {
    title: "আমার প্রোফাইল",
    url: "/dashboard/profile",
    icon: User,
  },
]

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: { name: string; email: string }
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center px-2 py-3">
          <Logo variant="compact" className="text-black group-data-[collapsible=icon]:hidden" />
          <Logo variant="icon" className="text-black hidden group-data-[collapsible=icon]:block" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
