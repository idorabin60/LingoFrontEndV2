"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff } from "lucide-react"
import { login } from "@/lib/api"
import { signup } from "@/lib/api"

export default function SignupPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [passwordLogin, setPasswordLogin] = useState("")
  const [emailLogin, setEmailemailLogin] = useState("")
  const [emailSignUp, setemailSignUp] = useState("")
  const [usernameSignUp, setusernameSignUp] = useState("")
  const [passwordSignUp, setpasswordSignUp] = useState("")
  const [firstNameSignUp, setFirstNameSignUp] = useState("")
  const [lastNameSignUp, setLastNameSignUp] = useState("")
  console.log(localStorage)

  const handleLogin = async (e) => {
    e.preventDefault()
    console.log("try to login")

    try {
      setIsLoading(true)
      const response = await login(emailLogin, passwordLogin)

      if (response.data) {
        const { token, user } = response.data // Assuming the API returns a user object

        // Store token
        console.log(response.data)
        localStorage.setItem("token", token)

        // Store user object as JSON
        localStorage.setItem("user", JSON.stringify(user))

        console.log("Logged in successfully:", user)

        router.push("/")
    }
    } catch (error) {
      console.log("bla")
      toast({
        description: "אימייל או סיסמא לא נכונים נסה שנית שוב",
      });
      console.error("Login error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    try {
      console.log("trying to sign up")
      console.log(firstNameSignUp)
      console.log(lastNameSignUp)
      setIsLoading(true)
      const response = await signup(usernameSignUp, passwordSignUp, emailSignUp, firstNameSignUp, lastNameSignUp)

      if (response.data) {
        console.log("LOOK ONLY HERE IDO",response.data)
        console.log(response.data)
        const { token, user } = response.data // Assuming the API returns a user object

        // Store token
        localStorage.setItem("token", token)

        // Store user object as JSON
        localStorage.setItem("user", JSON.stringify(user))

        console.log("Logged in successfully:", user)

        router.push("/")
    }
    } catch (error) {
      console.error("Login error:", error)
    } finally {
      setIsLoading(false)
    }
  }
  const handleEmailChangeLogin = (newEmailValue) => {
    setEmailemailLogin(newEmailValue)
  }
  const handlePasswordChangeLogin = (newPasswordValue) => {
    setPasswordLogin(newPasswordValue)
  }
  const handleEmailChangeSignUp = (newEmailValue) => {
    setemailSignUp(newEmailValue)
  }
  const handlePasswordChangeSignUp = (newPasswordValue) => {
    setpasswordSignUp(newPasswordValue)
  }
  const handleUserChangeSignUp = (newUserNameValue) => {
    setusernameSignUp(newUserNameValue)
  }
  const handleFirstNameChangeSignUp = (newFirstNameValue) => {
    setFirstNameSignUp(newFirstNameValue)
  }

  const handleLastNameChangeSignUp = (newLastNameValue) => {
    setLastNameSignUp(newLastNameValue)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-emerald-50 to-white p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold text-emerald-700">אסלי-אזור אישי</h1>
          </div>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="login">התחברות</TabsTrigger>
            <TabsTrigger value="register">הרשמה</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-center">ברוך הבא</CardTitle>
                <CardDescription className="text-center">תמשיך את המסע שלך ללימוד ערבית</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin}>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="email">אימייל</Label>
                      <Input
                        id="email"
                        type="text"
                        placeholder="name@example.com"
                        value={emailLogin}
                        onChange={(e) => handleEmailChangeLogin(e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid gap-2">
                      <div className="flex items-center justify-between">
                      <a href="#" className="text-sm text-emerald-600 hover:text-emerald-700">
                          ?שכחת סיסמא
                        </a>
                        <Label htmlFor="password">סיסמא</Label>
                        
                      </div>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={passwordLogin}
                          onChange={(e) => handlePasswordChangeLogin(e.target.value)}
                          placeholder="••••••••"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox id="remember" />
                      <label
                        htmlFor="remember"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        זכור אותי
                      </label>
                    </div>

                    <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isLoading}>
                      {isLoading ? "Logging in..." : "התחבר"}
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
                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
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
                <CardTitle className="text-2xl text-center">צור חשבון</CardTitle>
                <CardDescription className="text-center">תתחיל את המסע שלך ללימודי ערבית היום</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignUp}>
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="first-name">שם פרטי</Label>
                        <Input
                          id="first-name"
                          type="text"
                          placeholder="John"
                          value={firstNameSignUp}
                          onChange={(e) => handleFirstNameChangeSignUp(e.target.value)}
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="last-name">שם משפחה</Label>
                        <Input
                          id="last-name"
                          type="text"
                          placeholder="Doe"
                          value={lastNameSignUp}
                          onChange={(e) => handleLastNameChangeSignUp(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="username">יוזר ניים</Label>
                      <Input
                        id="username"
                        type="text"
                        placeholder="johndoe123"
                        value={usernameSignUp}
                        onChange={(e) => handleUserChangeSignUp(e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="register-email">אימייל</Label>
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="name@example.com"
                        value={emailSignUp}
                        onChange={(e) => handleEmailChangeSignUp(e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="register-password">סיסמא</Label>
                      <div className="relative">
                        <Input
                          id="register-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={passwordSignUp}
                          onChange={(e) => handlePasswordChangeSignUp(e.target.value)}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="terms" />
                      <label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        I agree to the{" "}
                        <a href="#" className="text-emerald-600 hover:text-emerald-700">
                          terms and conditions
                        </a>
                      </label>
                    </div>
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700">תרשם</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <p className="text-center text-sm text-muted-foreground mt-4">
          By using Asli, you agree to our{" "}
          <a href="#" className="underline underline-offset-4 hover:text-primary">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="underline underline-offset-4 hover:text-primary">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  )
}
