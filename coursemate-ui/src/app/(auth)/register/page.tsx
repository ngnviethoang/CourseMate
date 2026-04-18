'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GraduationCap, ArrowRight, Loader2, Lock, User, Mail, BookOpen, Briefcase, Info } from 'lucide-react'
import { authService } from '@/lib/auth-service'
import { toast } from 'sonner'
import type { RegisterCommand } from '@/lib/types'

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [role, setRole] = useState<'Student' | 'Instructor'>('Student')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const payload: RegisterCommand = {
      userName: formData.get('userName') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      role
    }

    if (!payload.userName || !payload.email || !payload.password) {
      toast.error('Please fill in all required fields.')
      setIsLoading(false)
      return
    }

    try {
      await authService.register(payload)
      if (payload.role === 'Instructor') {
        toast.success('Instructor registration successful! Your account is pending admin approval.')
      } else {
        toast.success('Registration successful! You can now sign in.')
      }

      // For now, redirect to the admin login page or home page until generic login is implemented
      router.push('/management/login')
    } catch (err: unknown) {
      console.error('Registration error:', err)
      // apiClient already displays toast.error
    } finally {
      setIsLoading(false)
    }
  }

  const RegisterFields = () => (
    <div className="space-y-4 pt-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="space-y-2">
        <Label htmlFor="userName">Username</Label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="userName"
            name="userName"
            placeholder="johndoe"
            className="pl-9 bg-background/50 focus-visible:ring-primary/30"
            required
            disabled={isLoading}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email address</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="hello@example.com"
            className="pl-9 bg-background/50 focus-visible:ring-primary/30"
            required
            disabled={isLoading}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            className="pl-9 bg-background/50 focus-visible:ring-primary/30"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <Button type="submit" className="w-full h-11 relative group overflow-hidden mt-6" disabled={isLoading}>
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] transition-all" />
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <>
            {role === 'Instructor' ? 'Apply to Teach' : 'Create Account'}
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </Button>

      {role === 'Instructor' && (
        <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/30 p-3 rounded-md mt-4">
          <Info className="w-4 h-4 shrink-0 text-primary" />
          <p>
            Instructor accounts require admin approval before you can start creating courses. You will be notified once
            approved.
          </p>
        </div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4 relative overflow-hidden font-sans">
      {/* Ambient backgrounds */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="flex flex-col items-center mb-8 gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/30 ring-1 ring-primary/20">
            <GraduationCap className="h-7 w-7" />
          </div>
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Join CourseMate</h1>
            <p className="text-sm text-muted-foreground font-medium">Start learning or teaching today</p>
          </div>
        </div>

        <Card className="border-border/50 shadow-2xl shadow-black/5 dark:shadow-black/20 bg-background/60 backdrop-blur-xl">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl font-semibold">Create an account</CardTitle>
            <CardDescription className="text-sm">Choose your role and enter your details to register.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              defaultValue="Student"
              className="w-full"
              onValueChange={val => setRole(val as 'Student' | 'Instructor')}
            >
              <TabsList className="grid w-full grid-cols-2 p-1 bg-muted/50 rounded-lg">
                <TabsTrigger value="Student" className="rounded-md transition-all data-[state=active]:shadow-sm">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Student
                </TabsTrigger>
                <TabsTrigger value="Instructor" className="rounded-md transition-all data-[state=active]:shadow-sm">
                  <Briefcase className="w-4 h-4 mr-2" />
                  Instructor
                </TabsTrigger>
              </TabsList>

              <form onSubmit={handleSubmit}>
                <RegisterFields />
              </form>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col items-center border-t border-border/10 pt-6 pb-6">
            <div className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link
                href="/management/login"
                className="font-semibold text-primary hover:text-primary/80 transition-colors"
              >
                Sign in here
              </Link>
            </div>
          </CardFooter>
        </Card>

        <p className="text-center text-xs text-muted-foreground/60 mt-8">
          By signing up, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  )
}
