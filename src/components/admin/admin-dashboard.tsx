'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FileSpreadsheet, Users, BookOpen, CalendarDays, ClipboardList } from 'lucide-react'

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage examination results, students, and academic data.</p>
      </div>

      <Tabs defaultValue="import" className="space-y-4">
        <TabsList className="w-full flex-wrap justify-start h-auto p-1 bg-muted/50">
          <TabsTrigger value="import" className="flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            Import Data
          </TabsTrigger>
          <TabsTrigger value="results" className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            Results
          </TabsTrigger>
          <TabsTrigger value="students" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Students
          </TabsTrigger>
          <TabsTrigger value="examinations" className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            Examinations
          </TabsTrigger>
          <TabsTrigger value="subjects" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Subjects
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="import">
          <Card>
            <CardHeader>
              <CardTitle>Bulk Import</CardTitle>
              <CardDescription>Upload CSV or Excel files to import results and student data.</CardDescription>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center border-2 border-dashed rounded-md mx-6 mb-6 bg-muted/20">
              <div className="text-center space-y-4">
                <FileSpreadsheet className="h-12 w-12 mx-auto text-muted-foreground/50" />
                <p className="text-muted-foreground">Drag & drop your CSV file here or click to browse</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Other tabs would contain their respective data tables */}
        <TabsContent value="results">
          <Card>
            <CardHeader>
              <CardTitle>Manage Results</CardTitle>
              <CardDescription>Publish, unpublish, and update student examination results.</CardDescription>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center">
              <p className="text-muted-foreground">Results management interface goes here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students">
          <Card>
            <CardHeader>
              <CardTitle>Manage Students</CardTitle>
              <CardDescription>View and manage student records.</CardDescription>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center">
              <p className="text-muted-foreground">Student management interface goes here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="examinations">
          <Card>
            <CardHeader>
              <CardTitle>Examinations & Semesters</CardTitle>
              <CardDescription>Configure academic semesters and examinations.</CardDescription>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center">
              <p className="text-muted-foreground">Examinations management interface goes here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subjects">
          <Card>
            <CardHeader>
              <CardTitle>Manage Subjects</CardTitle>
              <CardDescription>Configure subjects and credits.</CardDescription>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center">
              <p className="text-muted-foreground">Subjects management interface goes here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
