import { StudentDashboard } from '@/components/dashboard/student-dashboard'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const instant = false

export default async function DashboardPage() {
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
  let semestersData = null

  if (user) {
    const { data: dbStudent } = await supabase
      .from('students')
      .select('*')
      .eq('auth_user_id', user.id)
      .single()
      
    studentData = dbStudent

    if (dbStudent) {
      // Fetch semesters and results
      const { data: results } = await supabase
        .from('results')
        .select(`
          *,
          subjects (*),
          semesters (*)
        `)
        .eq('student_id', dbStudent.id)
        
      if (results && results.length > 0) {
        // Group by semester
        const semsMap = new Map()
        
        results.forEach((r: any) => {
          if (!semsMap.has(r.semesters.id)) {
            semsMap.set(r.semesters.id, {
              id: r.semesters.id,
              semester_number: r.semesters.semester_number,
              student_id: dbStudent.id,
              total_credits: 0,
              credits_earned: 0,
              total_points: 0,
              subjects: []
            })
          }
          
          const sem = semsMap.get(r.semesters.id)
          sem.total_credits += r.subjects.credits
          if (r.result_status === 'PASS') {
            sem.credits_earned += r.subjects.credits
            sem.total_points += (r.grade_point * r.subjects.credits)
          }
          
          sem.subjects.push({
            subject_code: r.subjects.subject_code,
            subject_name: r.subjects.subject_name,
            subject_type: r.subjects.subject_type,
            internal_marks: r.internal_marks,
            external_marks: r.external_marks,
            total_marks: r.total_marks,
            grade: r.grade,
            grade_point: r.grade_point,
            credits: r.subjects.credits,
            result_status: r.result_status
          })
        })
        
        semestersData = Array.from(semsMap.values()).map(sem => ({
          ...sem,
          sgpa: sem.total_credits > 0 ? (sem.total_points / sem.total_credits).toFixed(2) : 0,
          result_status: sem.credits_earned === sem.total_credits ? 'PASS' : 'FAIL'
        })).sort((a, b) => a.semester_number - b.semester_number)
      }
    }
  }

  // HARDCODED DEMO DATA FALLBACK
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

  const semesters = semestersData || [
    {
      id: "sem1",
      student_id: "25ra1a05bv",
      semester_number: 1,
      total_credits: 20,
      credits_earned: 20,
      total_points: 140, // 140 / 20 = 7.00
      sgpa: 7.00,
      result_status: "PASS",
      created_at: "2025-01-01T00:00:00.000Z",
      updated_at: "2025-01-01T00:00:00.000Z",
      subjects: [
        { subject_code: "MAT101", subject_name: "Matrices and Calculus", subject_type: "Theory", internal_marks: 24, external_marks: 46, total_marks: 70, grade: "B+", grade_point: 7, credits: 4, result_status: "PASS" },
        { subject_code: "CHE102", subject_name: "Engineering Chemistry", subject_type: "Theory", internal_marks: 22, external_marks: 40, total_marks: 62, grade: "B", grade_point: 6, credits: 4, result_status: "PASS" },
        { subject_code: "PPS103", subject_name: "Programming for Problem Solving", subject_type: "Theory", internal_marks: 25, external_marks: 52, total_marks: 77, grade: "A", grade_point: 8, credits: 4, result_status: "PASS" },
        { subject_code: "ENG104", subject_name: "English", subject_type: "Theory", internal_marks: 26, external_marks: 42, total_marks: 68, grade: "B+", grade_point: 7, credits: 3, result_status: "PASS" },
        { subject_code: "EDC105", subject_name: "Electronic Devices and Circuits", subject_type: "Theory", internal_marks: 24, external_marks: 44, total_marks: 68, grade: "B+", grade_point: 7, credits: 3, result_status: "PASS" },
        { subject_code: "EWS106", subject_name: "Engineering Workshop Lab", subject_type: "Laboratory", internal_marks: 20, external_marks: 40, total_marks: 60, grade: "B+", grade_point: 7, credits: 2, result_status: "PASS" }
      ]
    },
    {
      id: "sem2",
      student_id: "25ra1a05bv",
      semester_number: 2,
      total_credits: 20,
      credits_earned: 20,
      total_points: 144, // 144 / 20 = 7.20
      sgpa: 7.20,
      result_status: "PASS",
      created_at: "2025-01-01T00:00:00.000Z",
      updated_at: "2025-01-01T00:00:00.000Z",
      subjects: [
        { subject_code: "ODE201", subject_name: "Ordinary Differential Equations", subject_type: "Theory", internal_marks: 25, external_marks: 48, total_marks: 73, grade: "B+", grade_point: 7, credits: 4, result_status: "PASS" },
        { subject_code: "PHY202", subject_name: "Advanced Physics", subject_type: "Theory", internal_marks: 25, external_marks: 45, total_marks: 70, grade: "B+", grade_point: 7, credits: 4, result_status: "PASS" },
        { subject_code: "EGD203", subject_name: "Engineering Drawing", subject_type: "Theory", internal_marks: 27, external_marks: 55, total_marks: 82, grade: "A", grade_point: 8, credits: 3, result_status: "PASS" },
        { subject_code: "BEE204", subject_name: "Basic Electrical Engineering", subject_type: "Theory", internal_marks: 24, external_marks: 45, total_marks: 69, grade: "B+", grade_point: 7, credits: 3, result_status: "PASS" },
        { subject_code: "DS205", subject_name: "Data Structures", subject_type: "Theory", internal_marks: 26, external_marks: 54, total_marks: 80, grade: "A", grade_point: 8, credits: 3, result_status: "PASS" },
        { subject_code: "PYL206", subject_name: "Python Lab", subject_type: "Laboratory", internal_marks: 23, external_marks: 57, total_marks: 80, grade: "A+", grade_point: 9, credits: 1, result_status: "PASS" },
        { subject_code: "ITW207", subject_name: "IT Workshop", subject_type: "Laboratory", internal_marks: 22, external_marks: 28, total_marks: 50, grade: "C", grade_point: 5, credits: 2, result_status: "PASS" }
      ]
    }
  ]

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Exam Results Dashboard</h2>
      </div>
      <StudentDashboard student={student} semesters={semesters} />
    </div>
  )
}
