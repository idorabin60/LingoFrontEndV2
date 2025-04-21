"use client"

import { cn } from "@/lib/utils"

type Message = {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isBot = message.sender === "bot"

  return (
    <div className={cn("flex gap-3 mb-4", isBot ? "justify-start" : "justify-end")}>
      {isBot && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-900 dark:bg-gray-800 flex items-center justify-center text-white font-semibold text-sm">
          LN
        </div>
      )}

      <div className="flex flex-col max-w-[75%]">
        <div
          className={cn(
            "rounded-lg p-3",
            isBot
              ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-tl-none"
              : "bg-primary text-primary-foreground rounded-tr-none",
          )}
        >
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        </div>
        <span className="text-xs text-gray-500 mt-1">
          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>

      {!isBot && (
        <div className="flex items-end">
          <div className="text-xs text-right mr-2 text-gray-700 dark:text-gray-300 font-medium">You</div>
        </div>
      )}
    </div>
  )
}
