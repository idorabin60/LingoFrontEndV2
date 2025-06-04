"use client";

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useState , useEffect } from "react"
import Link from "next/link"
import { getUserHomeworksLastTwoWeeks } from "@/lib/api"

export default function HomePage() {
  const [numberOfHomeWork,setNumberOfHomeWork] = useState('')
  useEffect(()=>{
    
    const getHwTwoWeek = async () =>{
      const resp = await getUserHomeworksLastTwoWeeks()
      console.log(resp.data)
      setNumberOfHomeWork(resp.data.length)
    }
    getHwTwoWeek()
  },[])
  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <div className="mb-8 text-right">
        <h1 className="text-3xl font-bold mb-2">ברוכים הבאים לאסלי</h1>
        <p className="text-muted-foreground">המסע שלכם ללימוד השפה מתחיל כאן</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-right">פלטפורמת תרגול</CardTitle>
            <CardDescription className="text-right">השלימו את התרגילים שהוקצו לכם</CardDescription>
          </CardHeader>
          <CardContent>
          {Number(numberOfHomeWork)> 0 ? (
              <p className="text-right">
              יש לך חומרי לימוד פעילים במערכת
              </p>
            ) : (
              <p className="text-right">אין לך חומרי לימוד עדכניים כרגע.</p>
            )}
                  </CardContent>
          <CardFooter>
            <Link href="/homework" className="w-full">
              <Button className="w-full">צפו בשיעורי הבית</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
          <CardTitle className="text-right">
  שאל את אלפרד <span role="img" aria-label="smile">😊</span>
</CardTitle>            <CardDescription className="text-right">שאלו אותי כל שאלה</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-right">אשף הערבית AI שלנו זמין לכל שאלה.</p>
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
