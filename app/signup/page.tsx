"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { login, signup, getTeachers } from "@/lib/api"

export default function SignupPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Login form state
  const [passwordLogin, setPasswordLogin] = useState("")
  const [emailLogin, setEmailLogin] = useState("")

  // Signup form state
  const [emailSignUp, setEmailSignUp] = useState("")
  const [usernameSignUp, setUsernameSignUp] = useState("")
  const [passwordSignUp, setPasswordSignUp] = useState("")
  const [firstNameSignUp, setFirstNameSignUp] = useState("")
  const [lastNameSignUp, setLastNameSignUp] = useState([])
  const [teachers, setTeachers] = useState([])

  // New state for role and teacher
  const [role, setRole] = useState("teacher") // Default to teacher
  const [selectedTeacher, setSelectedTeacher] = useState("")

  useEffect(() => {
    const loadTeachers = async () => {
      try {
        const response = await getTeachers()
        setTeachers(response.data)
      } catch (error) {
        console.log(error)
      }
    }

    loadTeachers()
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    console.log("try to login")

    try {
      setIsLoading(true)
      console.log(emailLogin)
      console.log(passwordLogin)
      const response = await login(emailLogin, passwordLogin)

      if (response.data) {
        const { token, user } = response.data

        // Store token
        console.log(response.data)
        localStorage.setItem("token", token)

        // Store user object as JSON
        localStorage.setItem("user", JSON.stringify(user))

        console.log("Logged in successfully:", user)
        if (user.role === "teacher") {
          router.push("/teacher-dashboard")
        } else {
          router.push("/")
        }
      }
    } catch (error) {
      console.log("bla")
      console.error("Login error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    try {
      console.log("trying to sign up")
      setIsLoading(true)

      // Include role and teacher in signup data
      const teacherId = role === "student" && selectedTeacher ? Number.parseInt(selectedTeacher, 10) : undefined

      const response = await signup(
        usernameSignUp,
        passwordSignUp,
        emailSignUp,
        firstNameSignUp,
        lastNameSignUp,
        role,
        teacherId,
      )

      if (response.data) {
        console.log("Signup response:", response.data)
        const { token, user } = response.data

        // Store token
        localStorage.setItem("token", token)

        // Store user object as JSON
        localStorage.setItem("user", JSON.stringify(user))

        console.log("Logged in successfully:", user)

        if (user.role === "teacher") {
          router.push("/teacher-dashboard")
        } else {
          router.push("/")
        }
      }
    } catch (error) {
      console.error("Signup error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold text-right">אסלי - אזור אישי</h1>
          </div>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="login" className="text-right">
              התחברות
            </TabsTrigger>
            <TabsTrigger value="register" className="text-right">
              הרשמה
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-center text-right">ברוך הבא</CardTitle>
                <CardDescription className="text-center text-right">המשך את המסע שלך ללימוד ערבית</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin}>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="email" className="text-right">
                        אימייל
                      </Label>
                      <Input
                        id="email"
                        type="text"
                        placeholder="name@example.com"
                        value={emailLogin}
                        onChange={(e) => setEmailLogin(e.target.value)}
                        className="text-right"
                        required
                      />
                    </div>

                    <div className="grid gap-2">
                      <div className="flex items-center justify-between">
                        <Link href="#" className="text-sm hover:underline">
                          שכחת סיסמא?
                        </Link>
                        <Label htmlFor="password" className="text-right">
                          סיסמא
                        </Label>
                      </div>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={passwordLogin}
                          onChange={(e) => setPasswordLogin(e.target.value)}
                          placeholder="••••••••"
                          className="text-right pl-10"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute left-0 top-0 h-full px-3 py-2 text-muted-foreground"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center space-x-reverse space-x-2 justify-start">
                      <Checkbox id="remember" />
                      <label
                        htmlFor="remember"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ml-2 text-right"
                      >
                        זכור אותי
                      </label>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "מתחבר..." : "התחבר"}
                    </Button>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex flex-col">
                <div className="relative my-3 w-full">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t"></span>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">או המשך עם</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 w-full">
                  <Button variant="outline">Google</Button>
                  <Button variant="outline">Facebook</Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-center text-right">צור חשבון</CardTitle>
                <CardDescription className="text-center text-right">
                  התחל את המסע שלך ללימודי ערבית היום
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignUp}>
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="last-name" className="text-right">
                          שם משפחה
                        </Label>
                        <Input
                          id="last-name"
                          type="text"
                          placeholder="ישראלי"
                          value={lastNameSignUp}
                          onChange={(e) => setLastNameSignUp(e.target.value)}
                          className="text-right"
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="first-name" className="text-right">
                          שם פרטי
                        </Label>
                        <Input
                          id="first-name"
                          type="text"
                          placeholder="ישראל"
                          value={firstNameSignUp}
                          onChange={(e) => setFirstNameSignUp(e.target.value)}
                          className="text-right"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="username" className="text-right">
                        שם משתמש
                      </Label>
                      <Input
                        id="username"
                        type="text"
                        placeholder="israel123"
                        value={usernameSignUp}
                        onChange={(e) => setUsernameSignUp(e.target.value)}
                        className="text-right"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="register-email" className="text-right">
                        אימייל
                      </Label>
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="name@example.com"
                        value={emailSignUp}
                        onChange={(e) => setEmailSignUp(e.target.value)}
                        className="text-right"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="register-password" className="text-right">
                        סיסמא
                      </Label>
                      <div className="relative">
                        <Input
                          id="register-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={passwordSignUp}
                          onChange={(e) => setPasswordSignUp(e.target.value)}
                          className="text-right pl-10"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute left-0 top-0 h-full px-3 py-2 text-muted-foreground"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                        </Button>
                      </div>
                    </div>

                    {/* Role selection */}
                    <div className="grid gap-2">
                      <Label className="text-right">סוג משתמש</Label>
                      <div className="flex gap-2 justify-end">
                        <Button
                          type="button"
                          variant={role === "student" ? "default" : "outline"}
                          onClick={() => setRole("student")}
                        >
                          תלמיד
                        </Button>
                        <Button
                          type="button"
                          variant={role === "teacher" ? "default" : "outline"}
                          onClick={() => setRole("teacher")}
                        >
                          מורה
                        </Button>
                      </div>
                    </div>

                    {/* Teacher selection dropdown (only visible for students) */}
                    {role === "student" && (
                      <div className="grid gap-2">
                        <Label htmlFor="teacher" className="text-right">
                          בחר מורה
                        </Label>
                        <Select value={selectedTeacher} onValueChange={setSelectedTeacher} required>
                          <SelectTrigger className="text-right">
                            <SelectValue placeholder="בחר את המורה שלך" />
                          </SelectTrigger>
                          <SelectContent>
                            {teachers.map((teacher) => (
                              <SelectItem key={teacher.id} value={teacher.id.toString()} className="text-right">
                                {teacher.username}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading || (role === "student" && !selectedTeacher)}
                    >
                      {isLoading ? "מתבצעת הרשמה..." : "הירשם"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
