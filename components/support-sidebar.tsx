"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Home, MessageCircle, Book, Headphones, Settings, HelpCircle, X } from "lucide-react"

interface SupportSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function SupportSidebar({ isOpen, onClose }: SupportSidebarProps) {
  const [activeItem, setActiveItem] = useState("support")

  const navItems = [
    { id: "home", label: "Home", icon: Home, href: "/" },
    { id: "support", label: "Support Chat", icon: MessageCircle, href: "/support" },
    { id: "lessons", label: "Lessons", icon: Book, href: "/lessons" },
    { id: "tutors", label: "Tutors", icon: Headphones, href: "/tutors" },
    { id: "settings", label: "Settings", icon: Settings, href: "/settings" },
    { id: "help", label: "Help Center", icon: HelpCircle, href: "/help" },
  ]

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground w-8 h-8 rounded-md flex items-center justify-center font-bold">
              LN
            </div>
            <span className="font-bold text-xl">Lingo Native</span>
          </Link>
          <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 px-4 py-6">
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => {
                setActiveItem(item.id)
                if (window.innerWidth < 768) onClose()
              }}
            >
              <div
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  activeItem === item.id ? "bg-muted font-medium" : "hover:bg-muted/50"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </div>
            </Link>
          ))}
        </nav>
      </ScrollArea>

      <div className="p-6 border-t mt-auto">
        <div className="bg-muted rounded-lg p-4">
          <h4 className="font-medium mb-2">Need more help?</h4>
          <p className="text-sm text-muted-foreground mb-3">Contact our support team for personalized assistance.</p>
          <Button size="sm" className="w-full">
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden md:block w-80 border-r h-full">
        <SidebarContent />
      </div>

      {/* Mobile sidebar (sheet) */}
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="left" className="p-0 w-80">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  )
}
