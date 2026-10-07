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

  const student = studentData || {
    id: "25ra1a05bv",
    user_id: user?.id || "demo-user",
    student_name: "Vancha Manjunath Reddy",
    hall_ticket_number: "25RA1A05BV",
    course: "B.Tech",
    branch: "Computer Science and Engineering",
    academic_year: "2025-2026",
    current_semester: 2,
    created_at: "2025-01-01T00:00:00.000Z",
    updated_at: "2025-01-01T00:00:00.000Z"
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center space-x-4 mb-4">
        <Link href="/dashboard">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h2 className="text-3xl font-bold tracking-tight">Student Profile</h2>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Your registered academic details. Please contact administration if any information is incorrect.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue={student.student_name} readOnly className="bg-slate-50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hallTicket">Hall Ticket Number</Label>
                <Input id="hallTicket" defaultValue={student.hall_ticket_number} readOnly className="bg-slate-50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="course">Course</Label>
                <Input id="course" defaultValue={student.course} readOnly className="bg-slate-50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="branch">Branch</Label>
                <Input id="branch" defaultValue={student.branch} readOnly className="bg-slate-50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="academicYear">Academic Year</Label>
                <Input id="academicYear" defaultValue={student.academic_year} readOnly className="bg-slate-50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="semester">Current Semester</Label>
                <Input id="semester" defaultValue={`Semester ${student.current_semester}`} readOnly className="bg-slate-50" />
              </div>
            </div>
            
            <div className="pt-4 flex justify-end">
              <Button disabled>Request Details Update</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
