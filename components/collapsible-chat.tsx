"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChatInterface } from "@/components/chat-interface"
import { MessageCircle, X, Minimize2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface CollapsibleChatProps {
  currentQuestion?: any
  questionType?: "fill-in-blank" | "vocab-matching"
  currentStep?: number
  totalSteps?: number
}

export function CollapsibleChat({ currentQuestion, questionType, currentStep, totalSteps }: CollapsibleChatProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Prevent scrolling of the background when chat is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  return (
    <>
      {/* Full-screen chat overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex flex-col justify-end"
          onClick={(e) => {
            // Close when clicking the overlay background
            if (e.target === e.currentTarget) {
              setIsOpen(false)
            }
          }}
        >
          <div
            className="bg-background rounded-t-xl w-full max-h-[80vh] flex flex-col shadow-2xl"
            dir="rtl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Chat header */}
            <div className="flex items-center justify-between border-b p-4 sticky top-0 bg-background rounded-t-xl">
              <h3 className="font-medium text-lg">צ'אט תמיכה</h3>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <Minimize2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Chat content */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden">
              <ChatInterface
                currentQuestion={currentQuestion}
                questionType={questionType}
                currentStep={currentStep}
                totalSteps={totalSteps}
              />
            </div>
          </div>
        </div>
      )}

      {/* Chat button */}
      <div className="fixed bottom-4 right-4 z-40">
        <Button
          onClick={() => setIsOpen(true)}
          className={cn(
            "rounded-full w-12 h-12 shadow-lg flex items-center justify-center",
            "bg-emerald-600 hover:bg-emerald-700 transition-all",
          )}
        >
          <MessageCircle className="h-5 w-5 text-white" />
        </Button>
      </div>
    </>
  )
}
