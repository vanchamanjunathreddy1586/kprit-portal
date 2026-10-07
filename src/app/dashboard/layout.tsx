import { DashboardHeader } from '@/components/dashboard/header'



export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  
  const student = {
    id: "25ra1a05bv",
    user_id: "demo-user",
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
