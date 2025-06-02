"use client"

import { useEffect, useState } from "react"
import { useRouter,useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { FillInBlanksTask } from "@/components/fill-in-blanks-task"
import { VocabularyMatchingTask } from "@/components/vocabulary-matching-task"
import { CollapsibleChat } from "@/components/collapsible-chat"
import type { Homework } from "@/lib/types"
import { getUserHomeWorkByid } from "@/lib/api"

// Function to format the date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString("he-IL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export default function HomeworkWizard({ params }: { params: { id: string } }) {
  const { id } = useParams() 
  const router = useRouter()
  const [homework, setHomework] = useState<Homework | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(0)
  const [fillInBlankAnswers, setFillInBlankAnswers] = useState<Record<number, string>>({})
  const [vocabMatchAnswers, setVocabMatchAnswers] = useState<Record<number, number>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    const loadHomework = async () => {
      try {
        const response = await getUserHomeWorkByid(id)
        setHomework(response.data)
        console.log(response.data)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    loadHomework()
  }, [id])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center" dir="rtl">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">טוען שיעורי בית...</h2>
        </div>
      </div>
    )
  }

  if (!homework) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center" dir="rtl">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">שיעורי בית לא נמצאו</h2>
          <Button onClick={() => router.push("/")}>דף הבית</Button>
        </div>
      </div>
    )
  }

  const totalSteps = homework.fill_in_blanks.length + 1 // All fill-in-blanks + vocabulary matching
  const progress = Math.round((currentStep / totalSteps) * 100)
  const isLastStep = currentStep === totalSteps - 1

  // Determine the current question and its type
  const getCurrentQuestionData = () => {
    if (currentStep === 0) {
      // show vocab first
      return {
        questionData: homework.vocab_matches,
        questionType: "vocab-matching" as const,
      };
    }
    // afterwards show the (currentStep-1)-th fill-in-blank
    return {
      questionData: homework.fill_in_blanks[currentStep - 1],
      questionType: "fill-in-blank" as const,
    };
  };

  const { questionData, questionType } = getCurrentQuestionData()

  const handleFillInBlankAnswer = (id: number, answer: string) => {
    setFillInBlankAnswers((prev) => ({ ...prev, [id]: answer }))
  }

  const handleVocabMatchAnswer = (arabicId: number, hebrewId: number) => {
    setVocabMatchAnswers((prev) => ({ ...prev, [arabicId]: hebrewId }))
  }

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }

  const handleSubmit = () => {
    setIsSubmitting(true)
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setShowResults(true)
    }, 1500)
  }

  const calculateScore = () => {
    let correctFillInBlanks = 0
    let correctVocabMatches = 0

    // Check fill in blanks
    homework.fill_in_blanks.forEach((item) => {
      if (fillInBlankAnswers[item.id] === item.correct_option) {
        correctFillInBlanks++
      }
    })

    // Check vocabulary matches
    homework.vocab_matches.forEach((arabicItem) => {
      const matchedHebrewId = vocabMatchAnswers[arabicItem.id]
      const correctHebrewItem = homework.vocab_matches.find(
        (item) => item.arabic_word === arabicItem.arabic_word && item.hebrew_word === arabicItem.hebrew_word,
      )

      if (matchedHebrewId && correctHebrewItem && matchedHebrewId === correctHebrewItem.id) {
        correctVocabMatches++
      }
    })

    return {
      fillInBlanks: {
        correct: correctFillInBlanks,
        total: homework.fill_in_blanks.length,
      },
      vocabMatches: {
        correct: correctVocabMatches,
        total: homework.vocab_matches.length,
      },
      total: {
        correct: correctFillInBlanks + correctVocabMatches,
        total: homework.fill_in_blanks.length + homework.vocab_matches.length,
      },
    }
  }

  const renderCurrentStep = () => {
    if (showResults) {
      const score = calculateScore()
      return (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-right">תוצאות</h2>
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div>
                <h3 className="font-medium mb-2 text-right">מילוי חללים</h3>
                <p className="text-right">
                  {score.fillInBlanks.correct} נכונים מתוך {score.fillInBlanks.total} (
                  {Math.round((score.fillInBlanks.correct / score.fillInBlanks.total) * 100)}
                  %)
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2 text-right">התאמת אוצר מילים</h3>
                <p className="text-right">
                  {score.vocabMatches.correct} נכונים מתוך {score.vocabMatches.total} (
                  {Math.round((score.vocabMatches.correct / score.vocabMatches.total) * 100)}
                  %)
                </p>
              </div>
              <div className="pt-4 border-t">
                <h3 className="font-bold mb-2 text-right">ציון כולל</h3>
                <p className="text-xl text-right">
                  {score.total.correct} נכונים מתוך {score.total.total} (
                  {Math.round((score.total.correct / score.total.total) * 100)}
                  %)
                </p>
              </div>
            </CardContent>
          </Card>
          <div className="flex justify-between">
            <Button
              onClick={() => {
                setShowResults(false)
                setCurrentStep(0)
                setFillInBlankAnswers({})
                setVocabMatchAnswers({})
              }}
            >
              נסה שוב
            </Button>
            <Button variant="outline" onClick={() => router.push("/")}>
              דף הבית
            </Button>
          </div>
        </div>
      )
    }

    if (currentStep === 0) {
      /* vocabulary matching comes FIRST */
      return (
        <VocabularyMatchingTask
          vocabItems={homework.vocab_matches}
          matches={vocabMatchAnswers}
          onMatch={handleVocabMatchAnswer}
        />
      );
    }
  
    /* fill-in-the-blank tasks follow */
    const currentTask = homework.fill_in_blanks[currentStep - 1];
    return (
      <FillInBlanksTask
        task={currentTask}
        selectedAnswer={fillInBlankAnswers[currentTask.id] || ""}
        onSelectAnswer={(answer) =>
          handleFillInBlankAnswer(currentTask.id, answer)
        }
      />
    );
  };


  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl" dir="rtl">
      <div className="mb-8">
        <Button variant="outline" onClick={() => router.push("/")} className="mb-4">
          דף הבית →
        </Button>
        <h1 className="text-3xl font-bold mb-2 text-right">שיעורי בית {homework.id}</h1>
        <p className="text-muted-foreground mb-4 text-right">תאריך שיעור: {formatDate(homework.due_date)}</p>

        {/* Grammatical phenomenon */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <h2 className="text-lg font-medium mb-2">תופעה תחבירית</h2>
            <p className="text-right" dir="rtl">
              {homework.grammatical_phenomenon.text}
            </p>
          </CardContent>
        </Card>

        {/* Progress bar */}
        <div className="space-y-2 mb-6">
          <div className="flex justify-between text-sm">
            <span>{progress}%</span>
            <span>התקדמות</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Current task */}
      <div className="mb-8">{renderCurrentStep()}</div>

      {/* Navigation buttons */}
      {!showResults && (
        <div className="flex justify-between">
          {isLastStep ? (
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "שולח..." : "הגש שיעורי בית"}
            </Button>
          ) : (
            <Button onClick={handleNext}>הבא</Button>
          )}
          <Button variant="outline" onClick={handleBack} disabled={currentStep === 0}>
            הקודם
          </Button>
        </div>
      )}

      
      <CollapsibleChat
        currentQuestion={questionData}
        questionType={questionType}
        currentStep={currentStep + 1}
        totalSteps={totalSteps}
      />
    </div>
  )
}

