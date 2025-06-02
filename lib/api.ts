/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import axiosClient from "./axiosClient";
import type { Homework } from "./types"
import { mockHomeworkData } from "./mock-data"
// Simulate API call to fetch homework data
export async function fetchHomework(id: number): Promise<Homework> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  const homework = mockHomeworkData.find((hw) => hw.id === id)

  if (!homework) {
    throw new Error(`Homework with ID ${id} not found`)
  }

  return homework
}

// Simulate API call to submit homework answers
export async function submitHomework(
  homeworkId: number,
  fillInBlankAnswers: Record<number, string>,
  vocabMatchAnswers: Record<number, number>,
): Promise<{ success: boolean; score: number }> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // In a real application, this would send the answers to a server
  // and return the results
  return {
    success: true,
    score: Math.floor(Math.random() * 100),
  }
}



/**
 * SIGNUP
 *
 * @param {string} username
 * @param {string} password
 * @param {string} email
 * @returns Promise
 */
export function signup(
  username: string,
  password: string,
  email: string,
  first_name: string,
  last_name: string,
  role: string,
  teacherId?: number
) {
  // build payload
  const payload: Record<string, any> = {
    username,
    password,
    email,
    first_name,
    last_name,
    role,
  };

  // only send teacher if role === 'student'
  if (role === 'student' && teacherId != null) {
    payload.teacher = teacherId;
  }

  return axiosClient.post("/signup", payload);
}


/**
 * LOGIN
 *
 * @param {string} username
 * @param {string} password
 * @returns Promise
 */
export function login(email:string, password: string) {
  return axiosClient.post("/login", {
    email,
    password,
  });
}
export function students_of_teacher(teacherId:string){
  return axiosClient.get(`/students_of_teacher/${teacherId}`)
}
export function student_homeworks(studentId: string) {
  return axiosClient.get(`/students/${studentId}/homeworks/`)
}
export function student_homework_detail(studentId: string, homeworkId: string) {
  return axiosClient.get(
    `/students/${studentId}/homeworks/${homeworkId}/`
  )
}
export function getUserById(userId: string) {
  return axiosClient.get(`/users/${userId}/`)
}
export function getChatResponse(prompt: string) {
  return axiosClient.post("chatbot/", { prompt })
}
/**
 * GET USER HOMEWORKS
 *
 * The interceptor in axiosClient.js will attach the token automatically
 * (if it exists in localStorage).
 *
 * @returns Promise
 */
export function getUserHomeworks() {
  return axiosClient.get("/user_homeworks");
}
export function getUserHomeWorkByid(id:string){
  return axiosClient.get(`/homeworks/${id}`)
}

export function getTeachers() {
  return axiosClient.get("/get_teachers");
}






