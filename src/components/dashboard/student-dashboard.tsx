import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SemesterResults } from '@/components/dashboard/semester-results'

interface StudentDashboardProps {
  student: any;
  semesters: any[];
  results: any[];
}

export function StudentDashboard({ student, semesters, results }: StudentDashboardProps) {
  const sortedResults = [...results]
    .filter(r => (r.semesters?.level || 0) <= 2)
    .sort((a, b) => (a.semesters?.level || 0) - (b.semesters?.level || 0))
  
  // Calculate Overall
  const sem1 = sortedResults.find(r => r.semesters?.level === 1);
  const sem2 = sortedResults.find(r => r.semesters?.level === 2);
  
  let totalPoints = 0;
  let totalCr = 0;
  sortedResults.forEach(r => {
    if (r.sgpa && r.total_credits) {
      totalPoints += (r.sgpa * r.total_credits);
      totalCr += r.total_credits;
    }
  });
  
  const currentCgpa = totalCr > 0 ? (totalPoints / totalCr) : 0;
  
  // Overall result is PASS only if all available semesters are PASS
  const overallResult = sortedResults.length > 0 && sortedResults.every(r => r.result_status === 'PASS') ? 'PASS' : 'FAIL';

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-10">
      
      {/* Student Profile Info */}
      <Card className="border-t-4 border-t-primary">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-3xl font-bold uppercase">{student.full_name}</h2>
                <p className="text-xl text-muted-foreground">{student.hall_ticket_number}</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Course</p>
                  <p className="font-semibold">{student.course}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Branch</p>
                  <p className="font-semibold">{student.branch}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Academic Year</p>
                  <p className="font-semibold">{student.academic_year}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Result Summary */}
      <div>
        <h3 className="text-xl font-bold mb-4 uppercase">Result Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground uppercase">Semester 1</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs text-muted-foreground uppercase">SGPA</p>
                  <p className="text-2xl font-bold">{sem1 ? sem1.sgpa.toFixed(2) : '-'}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground uppercase">Result</p>
                  <p className={`text-xl font-bold ${sem1?.result_status === 'PASS' ? 'text-green-600' : 'text-red-600'}`}>{sem1?.result_status || '-'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground uppercase">Semester 2</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs text-muted-foreground uppercase">SGPA</p>
                  <p className="text-2xl font-bold">{sem2 ? sem2.sgpa.toFixed(2) : '-'}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground uppercase">Result</p>
                  <p className={`text-xl font-bold ${sem2?.result_status === 'PASS' ? 'text-green-600' : 'text-red-600'}`}>{sem2?.result_status || '-'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-primary uppercase">Overall</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs text-muted-foreground uppercase">CGPA</p>
                  <p className="text-2xl font-bold text-primary">{currentCgpa.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground uppercase">Overall Result</p>
                  <p className={`text-xl font-bold ${overallResult === 'PASS' ? 'text-green-600' : 'text-red-600'}`}>{overallResult}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Semester Results Detailed View */}
      <div>
        <h3 className="text-xl font-bold mb-4 uppercase">Semester Results</h3>
        <SemesterResults 
          student={student} 
          semesters={semesters} 
          results={sortedResults} 
        />
      </div>
    </div>
  )
}
