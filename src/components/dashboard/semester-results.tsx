'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Download, Printer, Loader2 } from 'lucide-react'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

interface SemesterResultsProps {
  student: any;
  semesters: any[];
  results: any[];
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

export function SemesterResults({ student, semesters, results }: SemesterResultsProps) {
  const [selectedResultId, setSelectedResultId] = useState<string>(results[0]?.id || '')
  const [subjects, setSubjects] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const selectedResult = results.find(r => r.id === selectedResultId)

  useEffect(() => {
    async function fetchSubjects() {
      if (!selectedResultId) return
      
      setLoading(true)
      const { data, error } = await supabase
        .from('result_subjects')
        .select('*, subjects(code, name)')
        .eq('result_id', selectedResultId)
        
      if (data) {
        setSubjects(data)
      }
      setLoading(false)
    }
    
    fetchSubjects()
  }, [selectedResultId, supabase])

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadPdf = () => {
    if (!selectedResult || subjects.length === 0) return;
    
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(18);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.text('KPRIT EXAM PORTAL', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text('Kommuri Prathap Reddy Institute of Technology', 105, 28, { align: 'center' });
    doc.setFontSize(14);
    doc.text('Student Examination Result', 105, 38, { align: 'center' });
    
    // Student Info
    doc.setFontSize(10);
    doc.text(`Name: ${student.full_name}`, 14, 50);
    doc.text(`Hall Ticket No: ${student.hall_ticket_number}`, 120, 50);
    doc.text(`Course: ${student.course} - ${student.branch}`, 14, 58);
    doc.text(`Academic Year: ${student.academic_year}`, 120, 58);
    doc.text(`Semester: ${selectedResult.semesters.name}`, 14, 66);
    doc.text(`Examination: ${selectedResult.examinations.name}`, 120, 66);
    
    // Table
    const tableData = subjects.map((sub, index) => [
      sub.subjects.code,
      sub.subjects.name,
      sub.internal_marks.toString(),
      sub.external_marks.toString(),
      sub.total_marks.toString(),
      sub.grade,
      getGradePoint(sub.grade).toString(),
      sub.credits.toString(),
      sub.result_status
    ]);
    
    (doc as any).autoTable({
      startY: 75,
      head: [['Subject Code', 'Subject Name', 'Internal', 'External', 'Total', 'Grade', 'Grade Point', 'Credits', 'Result']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [15, 23, 42] },
      didParseCell: function(data: any) {
        if (data.section === 'body' && data.column.index === 8) {
          if (data.cell.raw === 'PASS') {
            data.cell.styles.textColor = [22, 163, 74];
          } else if (data.cell.raw === 'FAIL') {
            data.cell.styles.textColor = [220, 38, 38];
          }
        }
      }
    });
    
    // Summary
    const finalY = (doc as any).lastAutoTable.finalY || 150;
    doc.text(`SGPA: ${selectedResult.sgpa.toFixed(2)}`, 14, finalY + 15);
    
    const statusColor = selectedResult.result_status === 'PASS' ? [22, 163, 74] : [220, 38, 38];
    doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
    doc.setFontSize(12);
    doc.text(`Result: ${selectedResult.result_status}`, 14, finalY + 23);
    
    doc.save(`${student.hall_ticket_number}_${selectedResult.semesters.name.replace(/\s+/g, '_')}_Result.pdf`);
  }

  if (results.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center h-48 space-y-4">
          <p className="text-muted-foreground">No results have been published for you yet.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <div className="w-full sm:w-auto">
          <div className="flex space-x-2">
            {results.map((result) => (
              <Button 
                key={result.id} 
                variant={selectedResultId === result.id ? "default" : "outline"}
                onClick={() => setSelectedResultId(result.id)}
                className="font-medium"
              >
                {result.semesters.name}
              </Button>
            ))}
          </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" onClick={handlePrint} className="flex-1 sm:flex-none">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button onClick={handleDownloadPdf} className="flex-1 sm:flex-none">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>

      {selectedResult && (
        <Card className="print:shadow-none print:border-none">
          <CardHeader className="print:hidden">
            <CardTitle>{selectedResult.semesters.name} Result</CardTitle>
            <CardDescription>{selectedResult.examinations.name}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 print:p-0">
            {/* Result Summary Grid */}
            <div className="flex gap-12 bg-muted/50 p-4 rounded-lg print:bg-transparent print:p-0">
              <div>
                <p className="text-sm text-muted-foreground uppercase font-semibold">SGPA</p>
                <p className="text-2xl font-bold">{selectedResult.sgpa.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground uppercase font-semibold">Result</p>
                <p className={`text-2xl font-bold ${selectedResult.result_status === 'PASS' ? 'text-green-600' : 'text-red-600'}`}>
                  {selectedResult.result_status}
                </p>
              </div>
            </div>

            {/* Subjects - Desktop Table & Mobile Cards */}
            <div className="mt-6">
              {loading ? (
                <div className="h-32 flex items-center justify-center border rounded-md">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : subjects.length === 0 ? (
                <div className="h-32 flex items-center justify-center border rounded-md text-muted-foreground">
                  No subjects found for this result.
                </div>
              ) : (
                <>
                  {/* Mobile Cards */}
                  <div className="grid grid-cols-1 gap-4 md:hidden">
                    {subjects.map((sub) => {
                      const gp = getGradePoint(sub.grade);
                      const isPass = sub.result_status === 'PASS';
                      return (
                        <Card key={sub.id} className="overflow-hidden">
                          <CardHeader className="pb-2 bg-muted/30">
                            <CardTitle className="text-base">{sub.subjects.name}</CardTitle>
                            <CardDescription className="font-mono text-xs">{sub.subjects.code}</CardDescription>
                          </CardHeader>
                          <CardContent className="pt-4 space-y-4">
                            <div className="grid grid-cols-3 gap-2 text-sm text-center">
                              <div className="space-y-1">
                                <p className="text-muted-foreground text-xs">Internal</p>
                                <p className="font-medium">{sub.internal_marks}</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-muted-foreground text-xs">External</p>
                                <p className="font-medium">{sub.external_marks}</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-muted-foreground text-xs font-bold">Total</p>
                                <p className="font-bold">{sub.total_marks}</p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-2 text-sm text-center pt-2 border-t">
                              <div className="space-y-1">
                                <p className="text-muted-foreground text-xs">Grade</p>
                                <Badge variant="outline" className="font-mono">{sub.grade}</Badge>
                              </div>
                              <div className="space-y-1">
                                <p className="text-muted-foreground text-xs">Grade Point</p>
                                <p className="font-medium">{gp}</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-muted-foreground text-xs">Credits</p>
                                <p className="font-medium">{sub.credits}</p>
                              </div>
                            </div>
                            
                            <div className={`text-center font-bold text-lg pt-2 border-t ${isPass ? 'text-green-600' : 'text-red-600'}`}>
                              {sub.result_status}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>

                  {/* Desktop Table */}
                  <div className="hidden md:block rounded-md border">
                    <Table>
                      <TableHeader className="bg-muted/50">
                        <TableRow>
                          <TableHead>Subject Code</TableHead>
                          <TableHead>Subject Name</TableHead>
                          <TableHead className="text-right">Internal</TableHead>
                          <TableHead className="text-right">External</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                          <TableHead className="text-center">Grade</TableHead>
                          <TableHead className="text-center">Grade Point</TableHead>
                          <TableHead className="text-center">Credits</TableHead>
                          <TableHead className="text-right">Result</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {subjects.map((sub) => {
                          const gp = getGradePoint(sub.grade);
                          const isPass = sub.result_status === 'PASS';
                          return (
                            <TableRow key={sub.id}>
                              <TableCell className="font-medium">{sub.subjects.code}</TableCell>
                              <TableCell>{sub.subjects.name}</TableCell>
                              <TableCell className="text-right">{sub.internal_marks}</TableCell>
                              <TableCell className="text-right">{sub.external_marks}</TableCell>
                              <TableCell className="text-right font-bold">{sub.total_marks}</TableCell>
                              <TableCell className="text-center">
                                <Badge variant="outline" className="font-mono">{sub.grade}</Badge>
                              </TableCell>
                              <TableCell className="text-center">{gp}</TableCell>
                              <TableCell className="text-center">{sub.credits}</TableCell>
                              <TableCell className="text-right">
                                <span className={isPass ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                                  {sub.result_status}
                                </span>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
