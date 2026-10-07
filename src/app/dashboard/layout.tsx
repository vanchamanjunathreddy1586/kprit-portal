import { DashboardHeader } from '@/components/dashboard/header'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const instant = false

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
      
  // Use fallback demo data if DB is empty, as requested to avoid DB seeding
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
    <div className="flex min-h-screen flex-col">
      <DashboardHeader student={student} />
      <div className="flex flex-1">
        <main className="flex-1 w-full bg-slate-50/50">
          {children}
        </main>
      </div>
    </div>
  )
}
