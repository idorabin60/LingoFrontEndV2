"use client"
import { HomeworkList } from "@/components/homework-list"
import { mockHomeworkData } from "@/lib/mock-data"
import { useEffect } from "react";
import { useState } from "react";
import { getUserHomeworks } from "@/lib/api";
import type { Homework } from "@/lib/types"
export default function HomeworkPage() {
  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  useEffect(() => {
    async function fetchData() {
        try {
            console.log(localStorage)
            const response = await getUserHomeworks();
            if (response.data && Array.isArray(response.data)) {
                setHomeworks(response.data); // Update state
            }
            console.log(response.data)
        } catch (error) {
            console.error("Error fetching homeworks:", error);
        }
    }
    fetchData();
  }, []);
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Homework</h1>
      <HomeworkList homeworks={homeworks} />
    </div>
  )
}
