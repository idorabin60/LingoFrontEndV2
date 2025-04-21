import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function LessonsPage() {
  const lessons = [
    {
      id: 1,
      title: "Basic Vocabulary",
      description: "Learn essential everyday words",
      level: "Beginner",
      duration: "30 minutes",
    },
    {
      id: 2,
      title: "Conversation Basics",
      description: "Simple dialogues for beginners",
      level: "Beginner",
      duration: "45 minutes",
    },
    {
      id: 3,
      title: "Grammar Fundamentals",
      description: "Essential grammar structures",
      level: "Intermediate",
      duration: "60 minutes",
    },
    {
      id: 4,
      title: "Advanced Expressions",
      description: "Idiomatic expressions and slang",
      level: "Advanced",
      duration: "90 minutes",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Lessons</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lessons.map((lesson) => (
          <Card key={lesson.id}>
            <CardHeader>
              <CardTitle>{lesson.title}</CardTitle>
              <CardDescription>{lesson.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between text-sm">
                <div>
                  <span className="text-muted-foreground">Level: </span>
                  <span className="font-medium">{lesson.level}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Duration: </span>
                  <span className="font-medium">{lesson.duration}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Start Lesson</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
