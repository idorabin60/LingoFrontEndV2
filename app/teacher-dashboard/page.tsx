"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { User } from "lucide-react"
import { students_of_teacher } from "@/lib/api"

export default function TeacherDashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [fullName, setFullName] = useState('');

  


  useEffect(() => {
    // Check if user is logged in
    const loadDashboard = async () => {
      try {
        const storedUser = localStorage.getItem("user")
        console.log(storedUser)
        if (!storedUser) {
          router.push("/auth/sign-in")
          return
        }

        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)

        if (parsedUser.role !== "teacher") {
          router.push("/")
          return
        }

        // Fetch students for this teacher
        const response = await students_of_teacher(parsedUser.id.toString())
        setStudents(response.data)
        console.log(response.data)
      } catch (error) {
        console.error("Error loading dashboard:", error)
        router.push("/auth/sign-in")
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [router])
  useEffect(() => {
    // 1. קרא את המחרוזת השמורה
    const userStr = localStorage.getItem('user');

    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        const first = user.first_name ?? '';
        const last  = user.last_name  ?? '';
        setFullName(`${first} ${last}`.trim());
      } catch (err) {
        console.error('Cannot parse user JSON:', err);
      }
    }
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-screen" dir="rtl">
        <p className="text-xl">טוען...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 text-right" dir="rtl">
      <h1 className="text-3xl font-bold mb-6">דאשבורד </h1>
      <p className="text-muted-foreground mb-8">
        ברוך הבא, {fullName}. כאן תוכל לראות את התלמידים שלך.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {students.map((student) => (
          <Card
            key={student.id}
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => router.push(`/teacher-dashboard/student/${student.id}`)}
          >
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <User className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="font-medium">{student.name}</p>
                  <p className="text-sm text-muted-foreground">
  {`${student.first_name} ${student.last_name}`}
</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
