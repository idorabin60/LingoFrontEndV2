
"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, CheckCircle, XCircle } from "lucide-react"
import { student_homework_detail } from "@/lib/api"

export default function HomeworkDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const studentId = searchParams.get("studentId")
  const homeworkId = params?.id

  const [homework, setHomework] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadHomeworkData = async () => {
      try {
        const userString = localStorage.getItem("user")
        if (!userString) {
          router.push("/auth/sign-in")
          return
        }

        if (!studentId || !homeworkId) {
          router.push("/teacher-dashboard")
          return
        }

        const response = await student_homework_detail(studentId, homeworkId)
        setHomework(response.data)
      } catch (error) {
        console.error("Failed to load homework data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadHomeworkData()
  }, [studentId, homeworkId, router])

  const handleBack = () => {
    router.push(studentId ? `/teacher-dashboard/student/${studentId}` : "/teacher-dashboard")
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-screen" dir="rtl">
        <p className="text-xl">טוען...</p>
      </div>
    )
  }

  if (!homework) {
    return (
      <div className="container mx-auto px-4 py-8 text-right" dir="rtl">
        <h1 className="text-2xl font-bold mb-4">שיעורי בית לא נמצאו</h1>
        <Button variant="outline" onClick={handleBack}>
          חזרה <ArrowRight className="mr-2 h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl text-right" dir="rtl">
      <div className="flex items-center mb-8 justify-between">
      <h1 className="text-3xl font-bold">
  שיעורי בית –{" "}
  {new Date(homework.due_date).toLocaleDateString("he-IL", {
    month: "long",
    day: "numeric",
  })}
</h1>

        <Button variant="outline" onClick={handleBack}>
          חזרה <ArrowRight className="mr-2 h-4 w-4" />
        </Button>
      </div>

      <div className="mb-8">
        <div className="text-sm text-muted-foreground mb-2">
          תאריך יעד: {new Date(homework.due_date).toLocaleDateString("he-IL", { year: "numeric", month: "long", day: "numeric" })}
        </div>
      </div>

      {/* Fill in the Blanks Exercises */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">תרגילי מילוי חללים</h2>

        {homework.fill_in_blanks && homework.fill_in_blanks.length > 0 ? (
          <div className="space-y-4">
            {homework.fill_in_blanks.map((ex: any, i: number) => (
              <Card key={ex.id} className="overflow-hidden">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-medium">תרגיל {i + 1}</h3>
                    {/* Assume ex.is_correct provided by backend */}
                   
                  </div>

                  <p className="mb-2 text-lg">{ex.sentence}</p>
                  {ex.hebrew_sentence && <p className="text-muted-foreground mb-4">{ex.hebrew_sentence}</p>}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {ex.options.map((opt: string, idx: number) => {
                      const base = "p-2 rounded-md"
                      return (
                        <div key={idx} className={`${base}}`}>
                          {opt}
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-6 text-center">
              <p>אין תרגילי מילוי חללים בשיעורי בית אלה</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Vocabulary Matching Exercises */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">תרגילי התאמת אוצר מילים</h2>

        {homework.vocab_matches && homework.vocab_matches.length > 0 ? (
          <Card className="overflow-auto">
            <CardContent className="pt-6">
              <table className="min-w-full border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4">ערבית</th>
                    <th className="py-2 px-4">עברית</th>
                  </tr>
                </thead>
                <tbody>
                  {homework.vocab_matches.map((match: any) => (
                    <tr key={match.id} className="border-b">
                      <td className="py-2 px-4">{match.arabic_word}</td>
                      <td className="py-2 px-4">{match.hebrew_word}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-6 text-center">
              <p>אין תרגילי התאמת אוצר מילים בשיעורי בית אלה</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Grammatical Phenomenon */}
      {homework.grammatical_phenomenon && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">תופעה תחבירית</h2>
          <Card>
            <CardContent>
              <p>{homework.grammatical_phenomenon.text}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

