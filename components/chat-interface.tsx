"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChatMessage } from "@/components/chat-message"
import { Send } from "lucide-react"
import { getChatResponse } from "@/lib/api"

type Message = {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
  questionContext?: any
}

interface ChatInterfaceProps {
  currentQuestion?: any
  questionType?: "fill-in-blank" | "vocab-matching"
  currentStep?: number
  totalSteps?: number
}

export function ChatInterface({ currentQuestion, questionType, currentStep, totalSteps }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "👋 צריך עזרה עם שיעורי הבית? אני כאן לעזור!",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Create a formatted context string based on the current question
  const getQuestionContext = () => {
    if (!currentQuestion) return ""

    let contextString = `[Context: ${questionType === "fill-in-blank" ? "Fill in the blank" : "Vocabulary matching"} - Step ${currentStep} of ${totalSteps}]\n\n`

    if (questionType === "fill-in-blank") {
      contextString += `Arabic sentence: ${currentQuestion.sentence}\n`
      if (currentQuestion.hebrew_sentence) {
        contextString += `Hebrew sentence: ${currentQuestion.hebrew_sentence}\n`
      }
      contextString += `Options: ${currentQuestion.options.join(", ")}\n`
    } else if (questionType === "vocab-matching") {
      contextString += "Vocabulary matching exercise with the following words:\n"
      // Assuming currentQuestion is an array of vocab items in this case
      if (Array.isArray(currentQuestion)) {
        const sampleItems = currentQuestion.slice(0, 5) // Take first 5 items to avoid too much context
        sampleItems.forEach((item) => {
          contextString += `- Arabic: ${item.arabic_word}, Hebrew: ${item.hebrew_word}\n`
        })
        if (currentQuestion.length > 5) {
          contextString += `... and ${currentQuestion.length - 5} more words\n`
        }
      }
    }

    return contextString
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    // Get context about the current question
    const questionContext = getQuestionContext()

    // Add user message (visible to user)
    const userVisibleMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
      questionContext: currentQuestion,
    }

    setMessages((prev) => [...prev, userVisibleMessage])
    setInputValue("")
    setIsTyping(true)

    try {
      // Create the actual message to send to the AI with context
      const messageWithContext = questionContext + inputValue +  "תענה תמיד בעברית"

      const res = await getChatResponse(messageWithContext)
      const assistantText = res.data.response
      const botMessage: Message = {
        id: Date.now().toString(),
        content: assistantText ?? "מצטער, לא הצלחתי לעבד את הבקשה שלך.",
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error("Error in chat:", error)
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "מצטער, אירעה שגיאה בעיבוד הבקשה שלך.",
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex flex-col h-full" dir="rtl">
      {/* Messages area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="text-sm">חושב...</span>
              <div className="flex space-x-1">
                <div
                  className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input area */}
      <div className="border-t p-4">
        <div className="flex gap-2">
          <Button onClick={handleSendMessage} disabled={!inputValue.trim() || isTyping}>
            <Send className="h-4 w-4" />
          </Button>
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="שאל על שיעורי הבית שלך..."
            className="flex-1 text-right"
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-right">לחץ Enter לשליחה</p>
      </div>
    </div>
  )
}
