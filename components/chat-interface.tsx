"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChatMessage } from "@/components/chat-message"
import { Send } from "lucide-react"
import { getChatResponse } from "@/lib/api"

/* ------------------------------------------------------------------
   קבוע: ההנחיות המלאות שה-LLM חייב לקבל בכל קריאה
------------------------------------------------------------------ */
const SYSTEM_INSTRUCTIONS = `
## A. Language & Register
1. Write ALL Arabic in Palestinian Colloquial Arabic only.
2. If a reply includes a single Arabic word (not inside a full Arabic sentence), present it exactly like:
   كلمة ‎(תַעְתִּיק)
   • No other brackets, glyphs, Latin letters or Arabic diacritics may appear inside ( … ).
3. Every transliteration must use our mapping (ب=bּ, ت=ת, ج=ג׳, خ=ח׳ …) and include at least one Hebrew niqqud sign.

### B. Answer Style
4. Keep answers concise and relevant to the learner’s question.
5. If the learner asks “מה התשובה?” / “What’s the correct word?”, DO NOT reveal it directly.
   • Instead, give a hint (e.g., meaning, first/last letter, grammatical gender) or explain the rule needed.
   • Offer to check the learner’s attempt once they try.
6. Always respect the learner’s level: plain explanations, no academic jargon.

### C. Allowed Content & Tone
7. No profanity, no dialect-mixing, no references to politics or religion unless explicitly asked.
8. Stay encouraging and positive; correct errors gently.

### D. Examples (follow exactly)
• “מה זה ‎خيار ‎(כְּיַאר)?”
  → ‎خيار ‎(כְּיַאר) يعني “מלפפון”.
• “למה هنا قلنا البنات ולא البنت?”
  → זו צורת ריבוי נקבה ***ـات***: بنت → بنات.
• “מה ההגייה של كلمة ‎بطيخ ‎(בַּטִיחְ)?”
  → ‎بطيخ ‎(בַּטִיחְ) – הטעם על ההברה השנייה.

3) INTERNAL QA – בדיקות חובה לפני שליחת תגובה
[ ] כל תעתיק עומד במפת-הניקוד, אין אותיות ערביות בסוגריים.
[ ] אין סוגריים אחרים זולת ‎( … ).
[ ] אם רומזים על התשובה, לא לחשוף אותה מפורשות.
[ ] עברית/אנגלית נקייה משגיאות כתיב.
[ ] לא להזכיר את המילה פלסטיני
` as const
/* ------------------------------------------------------------------ */

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

export function ChatInterface({
  currentQuestion,
  questionType,
  currentStep,
  totalSteps,
}: ChatInterfaceProps) {
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

  /* --------------------------------------------------------------
     גלילה אוטומטית לתחתית בכל עדכון הודעות
  -------------------------------------------------------------- */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  /* --------------------------------------------------------------
     יצירת מחרוזת קונטקסט לשאלה הנוכחית (אם קיימת)
  -------------------------------------------------------------- */
  const getQuestionContext = () => {
    if (!currentQuestion) return ""

    let ctx = `[Context: ${
      questionType === "fill-in-blank" ? "Fill in the blank" : "Vocabulary matching"
    } – Step ${currentStep} of ${totalSteps}]\n\n`

    if (questionType === "fill-in-blank") {
      ctx += `Arabic sentence: ${currentQuestion.sentence}\n`
      if (currentQuestion.hebrew_sentence) {
        ctx += `Hebrew sentence: ${currentQuestion.hebrew_sentence}\n`
      }
      ctx += `Options: ${currentQuestion.options.join(", ")}\n`
    } else if (questionType === "vocab-matching") {
      ctx += "Vocabulary matching exercise with the following words:\n"
      if (Array.isArray(currentQuestion)) {
        const sample = currentQuestion.slice(0, 5)
        sample.forEach((item: any) => {
          ctx += `- Arabic: ${item.arabic_word}, Hebrew: ${item.hebrew_word}\n`
        })
        if (currentQuestion.length > 5) {
          ctx += `... and ${currentQuestion.length - 5} more words\n`
        }
      }
    }
    return ctx
  }

  /* --------------------------------------------------------------
     שליחת הודעה (Enter או לחיצה על כפתור)
  -------------------------------------------------------------- */
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const questionContext = getQuestionContext()

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
      /* פרומפט מלא: הנחיות + קונטקסט + שאלה + דרישה לעברית */
      const fullPrompt = `
${SYSTEM_INSTRUCTIONS}

${questionContext}
${inputValue}

תענה תמיד בעברית
`.trim()

      const res = await getChatResponse(fullPrompt)
      const assistantText = res.data.response ?? "מצטער, לא הצלחתי לעבד את הבקשה שלך."
      console.log(assistantText)
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          content: assistantText,
          sender: "bot",
          timestamp: new Date(),
        },
      ])
    } catch (err) {
      console.error("Error in chat:", err)
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          content: "מצטער, אירעה שגיאה בעיבוד הבקשה שלך.",
          sender: "bot",
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsTyping(false)
    }
  }

  /* שליחת הודעה ב-Enter (ללא Shift) */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  /* --------------------------------------------------------------
     JSX
  -------------------------------------------------------------- */
  return (
    <div className="flex flex-col h-full" dir="rtl">
      {/* אזור הודעות */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((m) => (
            <ChatMessage key={m.id} message={m} />
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="text-sm">חושב...</span>
              <div className="flex space-x-1">
                <div
                  className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <div
                  className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <div
                  className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* אזור קלט */}
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
