"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signOut } from "@/lib/auth-client"

interface LogoutButtonProps {
  className?: string
}

export default function LogoutButton({ className }: LogoutButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleSignOut() {
    setLoading(true)
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login")
          router.refresh()
        },
        onError: () => {
          setLoading(false)
        },
      },
    })
  }

  return (
    <button
      onClick={handleSignOut}
      disabled={loading}
      className={className}
    >
      {loading ? "লোড হচ্ছে..." : "লগআউট করুন"}
    </button>
  )
}
