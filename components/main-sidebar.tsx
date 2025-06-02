"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Home, BookOpen, MessageCircle, Headphones, Settings, HelpCircle, X, GraduationCap } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface MainSidebarProps {
  isOpen: boolean
  onClose: () => void
  currentPath: string
  isCollapsed: boolean
}

export function MainSidebar({ isOpen, onClose, currentPath, isCollapsed }: MainSidebarProps) {
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    // Get user role from localStorage
    const userString = localStorage.getItem("user")
    if (userString) {
      try {
        const user = JSON.parse(userString)
        setUserRole(user.role)
      } catch (error) {
        console.error("Error parsing user data:", error)
      }
    }
  }, [])

  // Determine home href based on user role
  const getHomeHref = () => {
    return userRole === "teacher" ? "/teacher-dashboard" : "/"
  }
  let navItems: Array<{ id: string; label: string; icon: any; href: string }> = [];
  if (userRole =="teacher"){
     navItems = [
      { id: "home", label: "Home", icon: Home, href: getHomeHref() },
      { id: "support", label: "Support Chat", icon: MessageCircle, href: "/support" },
      // { id: "lessons", label: "Lessons", icon: GraduationCap, href: "/lessons" },
      // { id: "tutors", label: "Tutors", icon: Headphones, href: "/tutors" },
      // { id: "settings", label: "Settings", icon: Settings, href: "/settings" },
      // { id: "help", label: "Help Center", icon: HelpCircle, href: "/help" },
    ]
  }
  else{
     navItems = [
      { id: "home", label: "Home", icon: Home, href: getHomeHref() },
      { id: "homework", label: "Homework", icon: BookOpen, href: "/homework" },
      { id: "support", label: "Support Chat", icon: MessageCircle, href: "/support" },
      // { id: "lessons", label: "Lessons", icon: GraduationCap, href: "/lessons" },
      // { id: "tutors", label: "Tutors", icon: Headphones, href: "/tutors" },
      // { id: "settings", label: "Settings", icon: Settings, href: "/settings" },
      // { id: "help", label: "Help Center", icon: HelpCircle, href: "/help" },
    ]

  }
  

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className={`p-6  ${isCollapsed ? "p-3" : ""}`}>
        <div className="flex items-center justify-between">
          <Link href={getHomeHref()} className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground w-8 h-8 rounded-md flex items-center justify-center font-bold">
              LN
            </div>
            {!isCollapsed && <span className="font-bold text-xl">Lingo Native</span>}
          </Link>
          <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 px-4 py-6">
        <TooltipProvider delayDuration={0}>
          <nav className="space-y-2">
            {navItems.map((item) => {
              // Update active check for home item based on user role
              const isActive =
                item.id === "home"
                  ? userRole === "teacher"
                    ? currentPath === "/teacher-dashboard"
                    : currentPath === "/"
                  : item.href === "/"
                    ? currentPath === "/"
                    : currentPath.startsWith(item.href)

              const NavItem = () => (
                <div
                  className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                    isActive ? "bg-muted font-medium" : "hover:bg-muted/50"
                  } ${isCollapsed ? "justify-center" : ""}`}
                >
                  <item.icon className="h-5 w-5" />
                  {!isCollapsed && <span>{item.label}</span>}
                </div>
              )

              return isCollapsed ? (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      onClick={() => {
                        if (window.innerWidth < 768) onClose()
                      }}
                    >
                      <NavItem />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
              ) : (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => {
                    if (window.innerWidth < 768) onClose()
                  }}
                >
                  <NavItem />
                </Link>
              )
            })}
          </nav>
        </TooltipProvider>
      </ScrollArea>

      {!isCollapsed && (
        <div className="p-6 border-t mt-auto">
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-medium mb-2">Need more help?</h4>
            <p className="text-sm text-muted-foreground mb-3">Contact our support team for personalized assistance.</p>
            <Button size="sm" className="w-full">
              Contact Support
            </Button>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <>
      {/* Desktop sidebar - always visible on larger screens */}
      <div className={`hidden md:block border-r h-full transition-all duration-300 ${isCollapsed ? "w-16" : "w-80"}`}>
        <SidebarContent />
      </div>

      {/* Mobile sidebar - shown as a sheet/drawer when toggled */}
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="left" className="p-0 w-80">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  )
}
