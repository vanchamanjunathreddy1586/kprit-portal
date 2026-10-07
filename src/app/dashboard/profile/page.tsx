import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
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

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Student Profile</h1>
        <p className="text-muted-foreground">Manage your account information and preferences.</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Your official student details as registered in the system.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-muted-foreground">Full Name</Label>
              <p className="font-medium">{student.full_name}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Hall Ticket Number</Label>
              <p className="font-medium">{student.hall_ticket_number}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Email Address</Label>
              <p className="font-medium">{student.email || user.email}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Course & Branch</Label>
              <p className="font-medium">{student.course} - {student.branch}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Academic Year</Label>
              <p className="font-medium">{student.academic_year}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
