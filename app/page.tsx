import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome to Lingo Native DB</h1>
        <p className="text-muted-foreground">Your language learning journey starts here</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Homework</CardTitle>
            <CardDescription>Complete your assigned language exercises</CardDescription>
          </CardHeader>
          <CardContent>
            <p>You have 2 pending homework assignments due this week.</p>
          </CardContent>
          <CardFooter>
            <Link href="/homework" className="w-full">
              <Button className="w-full">View Homework</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Support Chat</CardTitle>
            <CardDescription>Get help from our language assistants</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Have questions? Our support team is available 24/7.</p>
          </CardContent>
          <CardFooter>
            <Link href="/support" className="w-full">
              <Button className="w-full" variant="outline">
                Start Chat
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lessons</CardTitle>
            <CardDescription>Access your language learning materials</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Continue your learning journey with our structured lessons.</p>
          </CardContent>
          <CardFooter>
            <Link href="/lessons" className="w-full">
              <Button className="w-full" variant="outline">
                Browse Lessons
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
