"use client"
import { cn } from "@/lib/utils"

type Message = {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
  questionContext?: any
}

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isBot = message.sender === "bot"

  return (
    <div className={cn("flex gap-3 mb-4", isBot ? "justify-end" : "justify-start")} dir="rtl">
     

      <div className="flex flex-col max-w-[80%]">
        <div
          className={cn(
            "rounded-lg p-3",
            isBot
              ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-tl-none"
              : "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-tr-none",
          )}
          dir="auto"
        >
          <p className="text-sm whitespace-pre-wrap" dir="auto">
            {message.content}
          </p>
        </div>
        <span className={cn("text-xs text-gray-500 mt-1", isBot ? "text-right" : "text-left")}>
          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>

      {isBot && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-900 dark:text-gray-100 font-semibold text-sm">
          LN
        </div>
      )}
    </div>
  )
}
