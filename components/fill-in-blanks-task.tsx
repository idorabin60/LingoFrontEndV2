"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle } from "lucide-react"
import type { FillInBlank } from "@/lib/types"

type FillInBlanksTaskProps = {
  task: FillInBlank
  selectedAnswer: string
  onSelectAnswer: (answer: string) => void
}

export function FillInBlanksTask({ task, selectedAnswer, onSelectAnswer }: FillInBlanksTaskProps) {
  console.log(task)
  const [draggedOption, setDraggedOption] = useState(null)
  const [isChecking, setIsChecking] = useState(false)
  const [isCorrect, setIsCorrect] = useState(null)
  const [feedbackVisible, setFeedbackVisible] = useState(false)

  // Split the sentence by the placeholder
  const sentenceParts = task.sentence.split("___")

  // Split the Hebrew sentence by the placeholder
  const hebrewSentenceParts = task.hebrew_sentence ? task.hebrew_sentence.split("___") : []

  // Function to extract Arabic and Hebrew parts from an option
  const extractParts = (option: string) => {
    if (!option) return { arabic: "", hebrew: "" }

    // Match pattern: "Arabic text ‎(Hebrew text)"
    const match = option.match(/^(.*?)\s*\((.*?)\)$/u)

    if (match) {
      return {
        arabic: match[1].trim(),
        hebrew: match[2].trim(),
      }
    }

    // Fallback if the pattern doesn't match
    return {
      arabic: option,
      hebrew: "",
    }
  }

  // Extract parts from the selected answer
  const selectedParts = extractParts(selectedAnswer)

  // Reset feedback when answer changes
  useEffect(() => {
    setIsCorrect(null)
    setFeedbackVisible(false)
  }, [selectedAnswer])

  const handleDragStart = (option) => {
    setDraggedOption(option)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    if (draggedOption) {
      onSelectAnswer(draggedOption)
      setDraggedOption(null)
    }
  }

  const handleOptionClick = (option) => {
    onSelectAnswer(option)
  }

  const handleCheckAnswer = () => {
    setIsChecking(true)

    // Check if the selected answer is correct
    const correct = selectedAnswer === task.correct_option
    setIsCorrect(correct)
    setFeedbackVisible(true)

    // Hide feedback after a short delay if incorrect
    setTimeout(() => {
      setIsChecking(false)
      // Keep feedback visible if correct
      if (!correct) {
        setFeedbackVisible(false)
      }
    }, 600)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">השלם את המשפט</h2>

      <Card>
        <CardContent className="pt-6">
          {/* Arabic sentence */}
          <div className="text-xl mb-4 text-right" dir="rtl" onDragOver={handleDragOver} onDrop={handleDrop}>
            {sentenceParts[0]}
            <span
              className={`inline-block min-w-20 mx-1 px-2 py-1 border-b-2 text-center ${
                selectedAnswer
                  ? isCorrect === true && feedbackVisible
                    ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                    : isCorrect === false && feedbackVisible
                      ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                      : "border-primary"
                  : "border-dashed border-gray-400"
              }`}
            >
              {selectedParts.arabic || "___"}
            </span>
            {sentenceParts[1]}
          </div>

          {/* Hebrew sentence - now with same styling as Arabic */}
          {task.hebrew_sentence && (
            <div className="text-xl mb-6 text-right" dir="rtl">
              {hebrewSentenceParts[0]}
              <span
                className={`inline-block min-w-20 mx-1 px-2 py-1 border-b-2 text-center ${
                  selectedAnswer
                    ? isCorrect === true && feedbackVisible
                      ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                      : isCorrect === false && feedbackVisible
                        ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                        : "border-primary"
                    : "border-dashed border-gray-400"
                }`}
              >
                {selectedParts.hebrew || "___"}
              </span>
              {hebrewSentenceParts[1]}
            </div>
          )}

          <div className="grid grid-cols-3 gap-4 mt-8">
            {task.options.map((option, index) => (
              <div
                key={index}
                draggable
                onDragStart={() => handleDragStart(option)}
                onClick={() => handleOptionClick(option)}
                className={`
                  p-3 text-center rounded-md cursor-pointer text-right
                  ${
                    selectedAnswer === option
                      ? isCorrect === true && feedbackVisible
                        ? "bg-green-500 text-white"
                        : isCorrect === false && feedbackVisible && option === selectedAnswer
                          ? "bg-red-500 text-white"
                          : "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80"
                  }
                  transition-colors
                `}
                dir="rtl"
              >
                {option}
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-center">
            <Button
              onClick={handleCheckAnswer}
              disabled={!selectedAnswer || isChecking || (isCorrect === true && feedbackVisible)}
              className="w-40"
            >
              {isChecking ? "טוען..." : "בדוק את תשובתך"}
            </Button>
          </div>

          {feedbackVisible && (
            <div
              className={`mt-4 flex items-center justify-center gap-2 ${isCorrect ? "text-green-600" : "text-red-600"}`}
            >
              {isCorrect ? (
                <>
                  <CheckCircle className="h-5 w-5" />
                  <span>Correct!</span>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5" />
                  <span>Incorrect. Try again!</span>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="text-sm text-muted-foreground">
        <p>Drag and drop or click on the correct option to fill in the blank, then click "Check Answer".</p>
      </div>
    </div>
  )
}
