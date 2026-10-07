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
  
  let totalPassedSubjects = 0;
  let totalPassedLabs = 0;
  let totalFailedSubjects = 0;
  
  semesters.forEach(sem => {
    if (sem.subjects) {
      sem.subjects.forEach((sub: any) => {
        const isLab = sub.subject_type === 'Laboratory' || sub.subject_name.toLowerCase().includes('lab');
        if (sub.result_status === 'PASS') {
          if (isLab) totalPassedLabs++;
          else totalPassedSubjects++;
        } else {
          totalFailedSubjects++;
        }
      });
    }
  });
  
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
  const totalBacklogs = totalFailedSubjects;

  return (
    <div className="space-y-6">
      {/* Student Profile Info Header */}
      <Card className="bg-slate-50 border-slate-200">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Student Name</p>
              <p className="text-lg font-bold">{student.full_name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Student ID / Roll Number</p>
              <p className="text-lg font-bold">{student.roll_number}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">College</p>
              <p className="text-lg font-bold">{student.college || 'KPRIT'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Branch</p>
              <p className="text-lg font-bold">{student.branch}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overall Academic Summary */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CGPA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{overallCgpa}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Overall Cumulative Grade
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${overallResult === 'PASS' ? 'text-green-600' : 'text-red-600'}`}>
              {overallResult}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Based on {semesters.length} semesters
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Credits & Subjects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex flex-col">
                <span className="text-muted-foreground">Total Credits:</span>
                <span className="font-semibold">{totalCr}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground">Passed Theory:</span>
                <span className="font-semibold">{totalPassedSubjects}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground">Passed Labs:</span>
                <span className="font-semibold">{totalPassedLabs}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Backlogs & Failed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex flex-col">
                <span className="text-muted-foreground">Failed Subjects:</span>
                <span className={`font-semibold ${totalFailedSubjects > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {totalFailedSubjects}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground">Total Backlogs:</span>
                <span className={`font-semibold ${totalBacklogs > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {totalBacklogs}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h3 className="text-2xl font-bold mb-4 tracking-tight">Semester Results</h3>
        <SemesterResults student={student} semesters={semesters} results={semesters} overallCgpa={overallCgpa} />
      </div>
    </div>
  )
}
