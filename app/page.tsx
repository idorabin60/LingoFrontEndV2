import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <div className="mb-8 text-right">
        <h1 className="text-3xl font-bold mb-2">ברוכים הבאים לאסלי</h1>
        <p className="text-muted-foreground">המסע שלכם ללימוד השפה מתחיל כאן</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-right">שיעורי בית</CardTitle>
            <CardDescription className="text-right">השלימו את התרגילים שהוקצו לכם</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-right">יש לכם 2 שיעורי בית ממתינים השבוע.</p>
          </CardContent>
          <CardFooter>
            <Link href="/homework" className="w-full">
              <Button className="w-full">צפו בשיעורי הבית</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-right">צ'אט תמיכה</CardTitle>
            <CardDescription className="text-right">קבלו עזרה מהעוזרים שלנו</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-right">יש שאלות? צוות התמיכה שלנו זמין 24/7.</p>
          </CardContent>
          <CardFooter>
            <Link href="/support" className="w-full">
              <Button className="w-full" variant="outline">
                התחילו צ'אט
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* <Card>
          <CardHeader>
            <CardTitle className="text-right">שיעורים</CardTitle>
            <CardDescription className="text-right">גישה לחומרי הלימוד שלכם</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-right">המשיכו במסע הלימוד עם השיעורים המובנים שלנו.</p>
          </CardContent>
          <CardFooter>
            <Link href="/lessons" className="w-full">
              <Button className="w-full" variant="outline">
                עיינו בשיעורים
              </Button>
            </Link>
          </CardFooter>
        </Card> */}
      </div>
    </div>
  )
}
