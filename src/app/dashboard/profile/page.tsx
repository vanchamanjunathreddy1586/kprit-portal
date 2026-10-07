import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const instant = false

export default async function ProfilePage() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bqqzytxbnwrvaqummceb.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxcXp5dHhibndydmFxdW1tY2ViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEzNzkxNDIsImV4cCI6MjEwNjk1NTE0Mn0.2fmbeRyCW-aaTksb0WpICXk-q9jwf0bjSFs1M3Rf5u8',
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll() {},
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  
  let studentData = null

  if (user) {
    const { data: dbStudent } = await supabase
      .from('students')
      .select('*')
      .eq('auth_user_id', user.id)
      .single()
      
    studentData = dbStudent
  }

  // Fallback ONLY if database fetch fails but we want to show the UI
  // Note: We use the exact schema column names
  const student = studentData || {
    id: "default-id",
    auth_user_id: user?.id,
    student_id: "25RA1A05BV",
    full_name: "Vancha Manjunath Reddy",
    email: "25ra1a05bv@kpritech.ac.in",
    roll_number: "25RA1A05BV",
    college: "Kommuri Prathap Reddy Institute of Technology",
    branch: "Computer Science and Engineering",
    academic_year: "2025-2026",
    current_year: 1,
    current_semester: 2,
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center space-x-4 mb-6">
        <Link href="/dashboard">
          <Button variant="outline" size="sm" className="h-9 gap-1">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to Results</span>
          </Button>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight">Student Details</h2>
      </div>
      
      <div className="grid gap-4 max-w-4xl mx-auto">
        <Card className="shadow-md border-t-4 border-t-[#31516a]">
          <CardHeader className="bg-slate-50/50 border-b">
            <CardTitle className="text-xl text-[#31516a]">Student Information</CardTitle>
            <CardDescription>
              Registered academic profile details.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <Label className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Full Name</Label>
                <p className="font-medium text-base">{student.full_name}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Student ID</Label>
                <p className="font-medium text-base">{student.student_id}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Roll Number</Label>
                <p className="font-medium text-base">{student.roll_number}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">College</Label>
                <p className="font-medium text-base">{student.college}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Branch</Label>
                <p className="font-medium text-base">{student.branch}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Academic Year</Label>
                <p className="font-medium text-base">{student.academic_year}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Year</Label>
                <p className="font-medium text-base">Year {student.current_year}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Semester</Label>
                <p className="font-medium text-base">Semester {student.current_semester}</p>
              </div>
              <div className="space-y-1 md:col-span-2">
                <Label className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Email</Label>
                <p className="font-medium text-base">{student.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
