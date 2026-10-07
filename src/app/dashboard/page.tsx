import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { StudentDashboard } from '@/components/dashboard/student-dashboard'

export const instant = false

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Admin redirect could be here if role === 'admin'
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role === 'admin') {
    redirect('/admin')
  }

  const { data: student } = await supabase
    .from('students')
    .select('*')
    .eq('profile_id', user.id)
    .single()

  if (!student) {
    return (
      <div className="flex items-center justify-center h-full min-h-[50vh]">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">No Student Record Found</h2>
          <p className="text-muted-foreground">Please contact administration.</p>
        </div>
      </div>
    )
  }

  // Fetch semesters (Only Semester 1 and 2 per user requirement)
  const { data: semesters } = await supabase
    .from('semesters')
    .select('*')
    .lte('level', 2)
    .order('level', { ascending: true })

  // Fetch all published results for this student
  const { data: results } = await supabase
    .from('student_results')
    .select(
      '*, examinations(name, examination_date), semesters(name, level)'
    )
    .eq('student_id', student.id)
    .eq('published', true)
    .order('created_at', { ascending: false })

  return (
    <StudentDashboard 
      student={student} 
      semesters={semesters || []} 
      results={results || []}
    />
  )
}
