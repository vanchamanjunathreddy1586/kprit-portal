'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Download, Printer } from 'lucide-react'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

interface SemesterResultsProps {
  student: any;
  semesters: any[];
  results?: any[]; // Keep prop signature
}

const getGradePoint = (grade: string) => {
  switch(grade) {
    case 'O': return 10;
    case 'A+': return 9;
    case 'A': return 8;
    case 'B+': return 7;
    case 'B': return 6;
    case 'C': return 5;
    case 'F': return 0;
    default: return 0;
  }
}

export function SemesterResults({ student, semesters }: SemesterResultsProps) {
  const [activeSem, setActiveSem] = useState<number>(1)
  
  // Find active semester data from the passed in array
  const activeSemesterData = semesters.find(s => s.semester_number === activeSem)
  const currentSubjects = activeSemesterData?.subjects || []
  const currentSgpa = activeSemesterData?.sgpa || 0
  const currentCredits = activeSemesterData?.total_credits || 0
  const currentEarned = activeSemesterData?.credits_earned || 0
  const currentResultStatus = activeSemesterData?.result_status || 'N/A'
  
  // Available semesters tabs
  const availableSemesters = [1, 2]

  const getResultColor = (status: string) => {
    switch(status.toUpperCase()) {
      case 'PASS': return 'bg-green-100 text-green-800 border-green-200'
      case 'FAIL': return 'bg-red-100 text-red-800 border-red-200'
      case 'ABSENT': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default: return 'bg-slate-100 text-slate-800 border-slate-200'
    }
  }

  const exportPDF = () => {
    const doc = new jsPDF()
    
    // Header
    doc.setFontSize(16)
    doc.setFont("helvetica", "bold")
    doc.text('KPRIT EXAM PORTAL', 105, 15, { align: 'center' })
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.text('Kommuri Prathap Reddy Institute of Technology', 105, 22, { align: 'center' })
    
    // Student Info
    doc.setFontSize(11)
    doc.text(`Student Name: ${student.full_name}`, 14, 35)
    doc.text(`Roll Number: ${student.roll_number}`, 14, 42)
    doc.text(`Branch: ${student.branch}`, 14, 49)
    doc.text(`Semester: ${activeSem}`, 120, 35)
    doc.text(`SGPA: ${currentSgpa.toFixed(2)}`, 120, 42)
    doc.text(`Result: ${currentResultStatus}`, 120, 49)

    // Table Data
    const tableColumn = ["S.No", "Subject Code", "Subject Name", "Type", "Credits", "Internal Marks", "External Marks", "Total Marks", "Grade", "Grade Point", "Result"]
    const tableRows: any[] = []

    currentSubjects.forEach((sub: any, index: number) => {
      const subjectType = sub.subject_type || (sub.subject_name.toLowerCase().includes('lab') ? 'Laboratory' : 'Theory')
      const subjectData = [
        index + 1,
        sub.subject_code,
        sub.subject_name,
        subjectType,
        sub.credits,
        sub.internal_marks,
        sub.external_marks,
        sub.total_marks,
        sub.grade,
        getGradePoint(sub.grade),
        sub.result_status
      ]
      tableRows.push(subjectData)
    })

    // @ts-ignore - jspdf-autotable injects autoTable into jsPDF
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 60,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 }
    })

    doc.save(`${student.roll_number}_Sem${activeSem}_Results.pdf`)
  }

  return (
    <div className="space-y-6">
      {/* Semester Selector */}
      <div className="flex flex-wrap gap-2">
        {availableSemesters.map(num => (
          <Button 
            key={num}
            variant={activeSem === num ? 'default' : 'outline'}
            onClick={() => setActiveSem(num)}
            className="w-28"
          >
            Semester {num}
          </Button>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <CardTitle>Semester {activeSem} Results</CardTitle>
              <CardDescription>Official examination results for the selected semester</CardDescription>
            </div>
            
            {currentSubjects.length > 0 && (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => window.print()} className="hidden md:flex">
                  <Printer className="mr-2 h-4 w-4" />
                  Print
                </Button>
                <Button size="sm" onClick={exportPDF}>
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
              </div>
            )}
          </div>
        </CardHeader>

        {currentSubjects.length === 0 ? (
          <CardContent className="h-48 flex items-center justify-center">
            <p className="text-muted-foreground">No results published for this semester yet.</p>
          </CardContent>
        ) : (
          <CardContent>
            {/* Semester Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-slate-50 rounded-lg border">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold">SGPA</p>
                <p className="text-xl font-bold">{currentSgpa.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold">Credits Earned</p>
                <p className="text-xl font-bold">{currentEarned} / {currentCredits}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold">Total Subjects</p>
                <p className="text-xl font-bold">{currentSubjects.length}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold">Result Status</p>
                <Badge variant="outline" className={`mt-1 font-bold ${getResultColor(currentResultStatus)}`}>
                  {currentResultStatus}
                </Badge>
              </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block rounded-md border">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="w-[50px] text-center">S.No</TableHead>
                    <TableHead className="w-[120px]">Subject Code</TableHead>
                    <TableHead>Subject Name</TableHead>
                    <TableHead className="w-[100px]">Type</TableHead>
                    <TableHead className="text-center w-[80px]">Credits</TableHead>
                    <TableHead className="text-center w-[120px]">Internal Marks</TableHead>
                    <TableHead className="text-center w-[120px]">External Marks</TableHead>
                    <TableHead className="text-center w-[120px]">Total Marks</TableHead>
                    <TableHead className="text-center w-[80px]">Grade</TableHead>
                    <TableHead className="text-center w-[110px]">Grade Point</TableHead>
                    <TableHead className="text-right w-[100px]">Result</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentSubjects.map((sub: any, index: number) => (
                    <TableRow key={sub.subject_code}>
                      <TableCell className="text-center font-medium text-muted-foreground">{index + 1}</TableCell>
                      <TableCell className="font-medium">{sub.subject_code}</TableCell>
                      <TableCell>{sub.subject_name}</TableCell>
                      <TableCell className="text-muted-foreground text-xs">{sub.subject_type || (sub.subject_name.toLowerCase().includes('lab') ? 'Laboratory' : 'Theory')}</TableCell>
                      <TableCell className="text-center">{sub.credits}</TableCell>
                      <TableCell className="text-center">{sub.internal_marks}</TableCell>
                      <TableCell className="text-center">{sub.external_marks}</TableCell>
                      <TableCell className="text-center font-semibold">{sub.total_marks}</TableCell>
                      <TableCell className="text-center font-bold">{sub.grade}</TableCell>
                      <TableCell className="text-center">{getGradePoint(sub.grade)}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline" className={getResultColor(sub.result_status)}>
                          {sub.result_status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Card View */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {currentSubjects.map((sub: any) => (
                <Card key={sub.subject_code} className="border shadow-sm">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs text-muted-foreground font-mono">{sub.subject_code}</p>
                        <CardTitle className="text-base mt-1 leading-tight">{sub.subject_name}</CardTitle>
                      </div>
                      <Badge variant="outline" className={getResultColor(sub.result_status)}>
                        {sub.result_status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="grid grid-cols-3 gap-2 mt-3 text-sm">
                      <div className="flex flex-col bg-slate-50 p-2 rounded items-center">
                        <span className="text-[10px] text-muted-foreground uppercase font-bold">Int</span>
                        <span className="font-semibold">{sub.internal_marks}</span>
                      </div>
                      <div className="flex flex-col bg-slate-50 p-2 rounded items-center">
                        <span className="text-[10px] text-muted-foreground uppercase font-bold">Ext</span>
                        <span className="font-semibold">{sub.external_marks}</span>
                      </div>
                      <div className="flex flex-col bg-slate-50 p-2 rounded items-center border border-slate-200">
                        <span className="text-[10px] text-muted-foreground uppercase font-bold">Total</span>
                        <span className="font-bold">{sub.total_marks}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 mt-2 text-sm">
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] text-muted-foreground uppercase font-bold">Grade</span>
                        <span className="font-bold">{sub.grade}</span>
                      </div>
                      <div className="flex flex-col items-center border-l">
                        <span className="text-[10px] text-muted-foreground uppercase font-bold">GP</span>
                        <span className="font-semibold">{getGradePoint(sub.grade)}</span>
                      </div>
                      <div className="flex flex-col items-center border-l">
                        <span className="text-[10px] text-muted-foreground uppercase font-bold">Credits</span>
                        <span className="font-semibold">{sub.credits}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

          </CardContent>
        )}
      </Card>
    </div>
  )
}
