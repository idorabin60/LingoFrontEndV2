"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Calendar } from "lucide-react"
import { student_homeworks } from '@/lib/api'
import { getUserById } from "@/lib/api"

export default function StudentHomeworkPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [student, setStudent] = useState<any>(null)
  const [homeworks, setHomeworks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [studentName, setStudentName] = useState("")
  const [studentEmail,setStudentEmail] = useState("")
  const studentId = Number.parseInt(params.id, 10)

  useEffect(() => {
    const loadStudentData = async () => {
      try {
        const userString = localStorage.getItem("user")
        if (!userString) {
          router.push("/auth/sign-in")
          return
        }

        const parsedUser = JSON.parse(userString)
        if (parsedUser.role !== "teacher") {
          router.push("/")
          return
        }

        // Fetch this student's homeworks
        const response = await student_homeworks(studentId.toString())
        
        const data = response.data
        console.log(data)
        // Set the student info (use studentId, and optionally fetch details separately)
        setStudent({ id: studentId, name: parsedUser.firstname || '', email: '', grade: '' })
        console.log(student)

        // Map API fields to component state
        setHomeworks(
          data.map(hw => ({
            id: hw.id,
            title:
    hw.title ||
    `שיעורי בית – ${new Date(hw.due_date).toLocaleDateString("he-IL", {
      month: "long",
      day: "numeric",
    })}`,
            description: hw.description || '',
            dueDate: hw.due_date || hw.dueDate,
          }))
        )
      } catch (error) {
        console.error("Failed to load student data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadStudentData()
  }, [params.id, router])
  useEffect(()=>{
    
    const get_user_data = async () =>{
      try{
          const user_data = await getUserById(params.id)
          const fullName = `${user_data.data.first_name} ${user_data.data.last_name}`;
          setStudentName(fullName)
          setStudentEmail(user_data.data.email)


      }catch(err){
        console.log(err)

      }
    }
    get_user_data()
  },[])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("he-IL", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-screen" dir="rtl">
        <p className="text-xl">טוען...</p>
      </div>
    )
  }

  if (!student) {
    return (
      <div className="container mx-auto px-4 py-8" dir="rtl">
        <h1 className="text-2xl font-bold mb-4">תלמיד לא נמצא</h1>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <h1 className="text-3xl font-bold mb-6">שיעורי הבית של {studentName}</h1>

      <div className="bg-muted p-6 rounded-lg mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">{student.name}</h2>
            <div className="text-muted-foreground">
              {studentEmail}
            </div>
          </div>
          <div className="text-sm">סה"כ שיעורי בית: {homeworks.length}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {homeworks.map((homework) => (
          <Link
            key={homework.id}
            href={`/teacher-dashboard/homework/${homework.id}?studentId=${studentId}`}
            className="border rounded-lg overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-emerald-500 hover:-translate-y-1"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">{homework.title} 📝</h3>
              </div>
              <p className="mb-4">{homework.description}</p>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 ml-1" />
                תאריך יעד: {formatDate(homework.dueDate)}
              </div>
            </div>
            <div className="bg-emerald-600 text-white p-3 text-center">צפה בפרטים</div>
          </Link>
        ))}
      </div>

      {homeworks.length === 0 && (
        <div className="text-center py-12 bg-muted rounded-lg">
          <h3 className="text-xl font-medium mb-2">אין שיעורי בית לתלמיד זה</h3>
          <p className="text-muted-foreground">התלמיד טרם קיבל שיעורי בית</p>
        </div>
      )}
    </div>
  )
}
