import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export const instant = false // Next 15

export default async function ProfilePage() {
  const student = {
    id: "25ra1a05bv",
    user_id: "demo-user",
    student_name: "Demo Student",
    hall_ticket_number: "25RA1A05BV",
    course: "B.Tech",
    branch: "Computer Science and Engineering",
    academic_year: "2025-2026",
    current_semester: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
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
