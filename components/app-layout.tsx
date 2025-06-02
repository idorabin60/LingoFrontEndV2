"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { MainSidebar } from "@/components/main-sidebar"
import { Button } from "@/components/ui/button"
import { PanelLeftClose, PanelLeft, Menu } from "lucide-react"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isSignupPage, setIsSignupPage] = useState(false)
  const pathname = usePathname()

  // Check if we're on a signup page whenever the pathname changes
  useEffect(() => {
    const checkIfSignupPage = () => {
      const currentPath = window.location.pathname
      const isSignup =
        currentPath.includes("signup") || currentPath.includes("sign-up") || currentPath.startsWith("/auth")

      setIsSignupPage(isSignup)
      console.log("Current path:", currentPath, "Is signup page:", isSignup)
    }

    // Check immediately
    checkIfSignupPage()

    // Also set up a listener for navigation events
    window.addEventListener("popstate", checkIfSignupPage)

    return () => {
      window.removeEventListener("popstate", checkIfSignupPage)
    }
  }, [pathname]) // Re-run when pathname changes

  // Close mobile sidebar when route changes
  useEffect(() => {
    setIsMobileSidebarOpen(false)
  }, [pathname])

  // If it's a signup page, return children directly
  if (isSignupPage) {
    return <>{children}</>
  }

  // Otherwise render the full layout
  return (
    <div className="flex h-screen bg-background">
      {/* Main sidebar - visible on all pages */}
      <MainSidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
        currentPath={pathname || ""}
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Page header with menu button for mobile and sidebar toggle for desktop */}
        <header className="border-b p-4 flex items-center justify-between">
          <div className="flex items-center">
            {/* Mobile menu button */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>

            {/* Desktop sidebar toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isSidebarCollapsed ? <PanelLeft className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
            </Button>

            <h1 className="text-xl font-semibold ml-2">Lingo Native</h1>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
