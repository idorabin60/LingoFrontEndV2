"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

const publicRoutes = ["/signup", "/login"]

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const token = localStorage.getItem("token")
    const isPublic = publicRoutes.includes(pathname)

    if (!token && !isPublic) {
      router.push("/signup")
    }
  }, [pathname, router])

  return <>{children}</>
}
