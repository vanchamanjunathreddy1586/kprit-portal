import { DashboardHeader } from '@/components/dashboard/header'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
  
  // Fallback to demo data if no Supabase data found (for seamless transition)
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
