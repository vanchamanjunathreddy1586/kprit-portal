import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'

export function ExaminationHistory({ results }: { results: any[] }) {
  if (results.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center h-48 space-y-4">
          <p className="text-muted-foreground">No examination history available.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Examination History</CardTitle>
        <CardDescription>A complete record of your academic examinations.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Examination Name</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead>Exam Date</TableHead>
                <TableHead>Published Date</TableHead>
                <TableHead className="text-right">Result</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((result) => (
                <TableRow key={result.id}>
                  <TableCell className="font-medium">{result.examinations.name}</TableCell>
                  <TableCell>{result.semesters.name}</TableCell>
                  <TableCell>
                    {result.examinations.examination_date 
                      ? format(new Date(result.examinations.examination_date), 'MMM dd, yyyy') 
                      : '-'}
                  </TableCell>
                  <TableCell>
                    {result.published_date 
                      ? format(new Date(result.published_date), 'MMM dd, yyyy') 
                      : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant={result.result_status === 'PASS' ? 'default' : result.result_status === 'FAIL' ? 'destructive' : 'secondary'}>
                      {result.result_status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
