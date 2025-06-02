"use client"
import { HomeworkList } from "@/components/homework-list"
import { useEffect } from "react"
import { useState } from "react"
import { getUserHomeworks } from "@/lib/api"
import type { Homework } from "@/lib/types"

export default function HomeworkPage() {
  const [fullName, setFullName] = useState('');
  const [homeworks, setHomeworks] = useState<Homework[]>([])
  useEffect(() => {
    // 1. קרא את המחרוזת השמורה
    const userStr = localStorage.getItem('user');   // ← "{"id":23, ... }"

    if (userStr) {
      try {
        // 2. פרק JSON → אובייקט
        const user = JSON.parse(userStr);

        // 3. הרכב שם מלא (אפשר להוסיף בדיקות תקינות)
        const first = user.first_name ?? '';
        const last  = user.last_name  ?? '';
        setFullName(`${first} ${last}`.trim());
      } catch (err) {
        console.error('Cannot parse user JSON:', err);
      }
    }
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        console.log(localStorage)
        const response = await getUserHomeworks()
        if (response.data && Array.isArray(response.data)) {
          setHomeworks(response.data) // Update state
        }
        console.log(response.data)
      } catch (error) {
        console.error("Error fetching homeworks:", error)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
 <h1
      className="text-3xl font-bold mb-8 text-right"
      dir="rtl" /* מבטיח כתיבה מימין לשמאל */
    >
      {fullName ? `שיעורי הבית של ${fullName}` : 'שיעורי הבית שלכם'}
    </h1>      <HomeworkList homeworks={homeworks} />
    </div>
  )
}
