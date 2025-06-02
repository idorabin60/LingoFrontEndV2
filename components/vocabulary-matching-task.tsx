"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"

export function VocabularyMatchingTask({ vocabItems, matches, onMatch }) {
  const [arabicItems, setArabicItems] = useState([])
  const [hebrewItems, setHebrewItems] = useState([])
  const [selectedArabicId, setSelectedArabicId] = useState(null)
  const [selectedHebrewId, setSelectedHebrewId] = useState(null)
  const [incorrectMatch, setIncorrectMatch] = useState({
    arabicId: null,
    hebrewId: null,
  })

  useEffect(() => {
    // Create shuffled copies of the vocab items for both columns
    const shuffledArabic = [...vocabItems].sort(() => Math.random() - 0.5)
    const shuffledHebrew = [...vocabItems].sort(() => Math.random() - 0.5)

    setArabicItems(shuffledArabic)
    setHebrewItems(shuffledHebrew)
  }, [vocabItems])

  // Check for a match whenever both selections are made
  useEffect(() => {
    if (selectedArabicId !== null && selectedHebrewId !== null) {
      checkForMatch(selectedArabicId, selectedHebrewId)
    }
  }, [selectedArabicId, selectedHebrewId])

  const handleArabicClick = (id) => {
    if (!isArabicMatched(id)) {
      setSelectedArabicId(id)
    }
  }

  const handleHebrewClick = (id) => {
    if (!isHebrewMatched(id)) {
      setSelectedHebrewId(id)
    }
  }

  const checkForMatch = (arabicId, hebrewId) => {
    // Find the selected items
    const arabicItem = arabicItems.find((item) => item.id === arabicId)
    const hebrewItem = hebrewItems.find((item) => item.id === hebrewId)

    // Check if the match is correct (words match)
    const isCorrectMatch =
      arabicItem &&
      hebrewItem &&
      arabicItem.arabic_word === hebrewItem.arabic_word &&
      arabicItem.hebrew_word === hebrewItem.hebrew_word

    if (isCorrectMatch) {
      // If correct, add to matches
      onMatch(arabicId, hebrewId)
    } else {
      // If incorrect, show feedback briefly
      setIncorrectMatch({ arabicId, hebrewId })

      // Clear the incorrect match after a short delay
      setTimeout(() => {
        setIncorrectMatch({ arabicId: null, hebrewId: null })
      }, 800)
    }

    // Clear the selections
    setSelectedArabicId(null)
    setSelectedHebrewId(null)
  }

  const isArabicSelected = (id) => selectedArabicId === id
  const isHebrewSelected = (id) => selectedHebrewId === id
  const isArabicMatched = (id) => id in matches
  const isHebrewMatched = (id) => Object.values(matches).includes(id)
  const isArabicIncorrect = (id) => incorrectMatch.arabicId === id
  const isHebrewIncorrect = (id) => incorrectMatch.hebrewId === id

  return (
    <div className="space-y-6" dir="rtl">
      <h2 className="text-2xl font-bold text-right">התאמת מילים</h2>

      <Card>
        <CardContent className="pt-6 text-right">
          <p className="mb-4">
            תתאים בין המילה בעברית לערבית
          </p>

          <div className="grid grid-cols-2 gap-8">
            {/* Hebrew column (renders on the left in RTL) */}
            <div className="space-y-2">
              <h3 className="font-medium mb-2 text-center">עברית</h3>
              <div className="space-y-2">
                {hebrewItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => !isHebrewMatched(item.id) && handleHebrewClick(item.id)}
                    className={`
                      p-3 text-right rounded-md cursor-pointer transition-colors
                      ${isHebrewSelected(item.id) ? "bg-primary text-primary-foreground" : ""}
                      ${isHebrewMatched(item.id) ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100" : ""}
                      ${isHebrewIncorrect(item.id) ? "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100" : ""}
                      ${!isHebrewSelected(item.id) && !isHebrewMatched(item.id) && !isHebrewIncorrect(item.id) ? "bg-muted hover:bg-muted/80" : ""}
                      ${isHebrewMatched(item.id) ? "cursor-default" : ""}
                    `}
                    dir="rtl"
                  >
                    {item.hebrew_word}
                  </div>
                ))}
              </div>
            </div>

            {/* Arabic column (renders on the right in RTL) */}
            <div className="space-y-2">
              <h3 className="font-medium mb-2 text-center">العربية</h3>
              <div className="space-y-2">
                {arabicItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => !isArabicMatched(item.id) && handleArabicClick(item.id)}
                    className={`
                      p-3 text-right rounded-md cursor-pointer transition-colors
                      ${isArabicSelected(item.id) ? "bg-primary text-primary-foreground" : ""}
                      ${isArabicMatched(item.id) ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100" : ""}
                      ${isArabicIncorrect(item.id) ? "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100" : ""}
                      ${!isArabicSelected(item.id) && !isArabicMatched(item.id) && !isArabicIncorrect(item.id) ? "bg-muted hover:bg-muted/80" : ""}
                      ${isArabicMatched(item.id) ? "cursor-default" : ""}
                    `}
                    dir="rtl"
                  >
                    {item.arabic_word}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 text-sm text-muted-foreground text-right">
  <p>
    זוגות תואמים: {Object.keys(matches).length} מתוך {vocabItems.length}
  </p>
</div>

        </CardContent>
      </Card>

      <div className="text-sm text-muted-foreground text-right">
        <p>Select a word from either column, then select its matching word from the other column.</p>
        <p>Correct matches will stay highlighted in green. Incorrect matches will flash red briefly.</p>
      </div>
    </div>
  )
}
