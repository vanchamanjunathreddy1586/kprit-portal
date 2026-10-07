import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SemesterResults } from '@/components/dashboard/semester-results'

interface StudentDashboardProps {
  student: any;
  semesters: any[];
}

export function StudentDashboard({ student, semesters }: StudentDashboardProps) {
  
  // Calculate Overall
  const sem1 = semesters.find(r => r.semester_number === 1);
  const sem2 = semesters.find(r => r.semester_number === 2);
  
  let totalPoints = 0;
  let totalCr = 0;
  
  if (sem1) {
    totalPoints += sem1.sgpa * sem1.total_credits;
    totalCr += sem1.total_credits;
  }
  if (sem2) {
    totalPoints += sem2.sgpa * sem2.total_credits;
    totalCr += sem2.total_credits;
  }
  
  const overallCgpa = totalCr > 0 ? (totalPoints / totalCr).toFixed(2) : "0.00";
  const overallResult = semesters.every(s => s.result_status === 'PASS') ? 'PASS' : 'FAIL';

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Academic Year</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{student.academic_year}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Semester</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Semester {student.current_semester}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CGPA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{overallCgpa}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Based on {semesters.length} completed semesters
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${overallResult === 'PASS' ? 'text-green-600' : 'text-red-600'}`}>
              {overallResult}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Semester Results</h3>
        <SemesterResults student={student} semesters={semesters} results={semesters} />
      </div>
    </div>
  )
}
