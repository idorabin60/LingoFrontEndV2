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
export function signup(username: string, password: string, email: string, first_name: string, last_name: string) {
  return axiosClient.post("/signup", {
    username,
    password,
    email,
    first_name,
    last_name,
  });
}

/**
 * LOGIN
 *
 * @param {string} username
 * @param {string} password
 * @returns Promise
 */
export function login(username:string, password: string) {
  return axiosClient.post("/login", {
    username,
    password,
  });
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