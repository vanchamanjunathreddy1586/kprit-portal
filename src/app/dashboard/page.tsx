import { StudentDashboard } from '@/components/dashboard/student-dashboard'

export const instant = false // Next 15

export default async function DashboardPage() {
  
  // HARDCODED DEMO DATA
  const student = {
    id: "25ra1a05bv",
    user_id: "demo-user",
    student_name: "Demo Student",
    hall_ticket_number: "25RA1A05BV",
    course: "B.Tech",
    branch: "Computer Science and Engineering",
    academic_year: "2025-2026",
    current_semester: 2,
    created_at: "2025-01-01T00:00:00.000Z",
    updated_at: "2025-01-01T00:00:00.000Z"
  }

  const semesters = [
    {
      id: "sem1",
      student_id: "25ra1a05bv",
      semester_number: 1,
      total_credits: 20,
      credits_earned: 20,
      sgpa: 7.00,
      result_status: "PASS",
      created_at: "2025-01-01T00:00:00.000Z",
      updated_at: "2025-01-01T00:00:00.000Z",
      subjects: [
        { subject_code: "MAT101", subject_name: "Matrices and Calculus", internal_marks: 24, external_marks: 46, total_marks: 70, grade: "B+", credits: 4, result_status: "PASS" },
        { subject_code: "CHE102", subject_name: "Engineering Chemistry", internal_marks: 22, external_marks: 40, total_marks: 62, grade: "B", credits: 4, result_status: "PASS" },
        { subject_code: "PPS103", subject_name: "Programming for Problem Solving (PPS)", internal_marks: 25, external_marks: 52, total_marks: 77, grade: "A", credits: 4, result_status: "PASS" },
        { subject_code: "ENG104", subject_name: "English", internal_marks: 26, external_marks: 42, total_marks: 68, grade: "B+", credits: 3, result_status: "PASS" },
        { subject_code: "EDC105", subject_name: "Electronic Devices and Circuits (EDC)", internal_marks: 24, external_marks: 44, total_marks: 68, grade: "B+", credits: 3, result_status: "PASS" },
        { subject_code: "EWS106", subject_name: "EWS Lab", internal_marks: 20, external_marks: 40, total_marks: 60, grade: "B", credits: 2, result_status: "PASS" }
      ]
    },
    {
      id: "sem2",
      student_id: "25ra1a05bv",
      semester_number: 2,
      total_credits: 19,
      credits_earned: 19,
      sgpa: 7.20,
      result_status: "PASS",
      created_at: "2025-01-01T00:00:00.000Z",
      updated_at: "2025-01-01T00:00:00.000Z",
      subjects: [
        { subject_code: "ODE201", subject_name: "ODEAVC", internal_marks: 25, external_marks: 48, total_marks: 73, grade: "B+", credits: 4, result_status: "PASS" },
        { subject_code: "PHY202", subject_name: "Advanced Physics", internal_marks: 23, external_marks: 41, total_marks: 64, grade: "B", credits: 4, result_status: "PASS" },
        { subject_code: "EGD203", subject_name: "Engineering Drawing", internal_marks: 27, external_marks: 55, total_marks: 82, grade: "A", credits: 3, result_status: "PASS" },
        { subject_code: "BEE204", subject_name: "BEE", internal_marks: 24, external_marks: 45, total_marks: 69, grade: "B+", credits: 3, result_status: "PASS" },
        { subject_code: "DS205", subject_name: "Data Structures (DS)", internal_marks: 28, external_marks: 65, total_marks: 93, grade: "A+", credits: 3, result_status: "PASS" },
        { subject_code: "PYL206", subject_name: "Python Lab", internal_marks: 22, external_marks: 43, total_marks: 65, grade: "B+", credits: 1, result_status: "PASS" },
        { subject_code: "ITW207", subject_name: "IT Workshop", internal_marks: 21, external_marks: 40, total_marks: 61, grade: "B", credits: 1, result_status: "PASS" }
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
