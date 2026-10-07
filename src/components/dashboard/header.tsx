'use client'

import { GraduationCap, LogOut, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface DashboardHeaderProps {
  user?: any;
  student?: any;
}

export function DashboardHeader({ user, student }: DashboardHeaderProps) {
  const router = useRouter()

  const handleLogout = async () => {
    document.cookie = "kprit_auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push('/login')
    router.refresh()
  }

  const initials = student?.student_name ? student.student_name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : 'ST'

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-primary" />
          <div className="hidden md:block">
            <h2 className="text-lg font-bold leading-none">KPRIT EXAM PORTAL</h2>
            <p className="text-xs text-muted-foreground">Kommuri Prathap Reddy Institute of Technology</p>
          </div>
          <div className="block md:hidden">
            <h2 className="text-lg font-bold leading-none">KPRIT</h2>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end mr-2">
            <span className="text-sm font-medium">{student?.student_name || 'Student'}</span>
            <span className="text-xs text-muted-foreground">{student?.hall_ticket_number || '25RA1A05BV'}</span>
          </div>
          
          <Button variant="outline" size="sm" onClick={handleLogout} className="hidden md:flex text-destructive border-destructive/20 hover:bg-destructive/10">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger className="relative h-10 w-10 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              <Avatar className="h-10 w-10 border border-primary/20">
                <AvatarFallback className="bg-primary/10 text-primary">{initials}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="end">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-2">
                  <div>
                    <p className="text-sm font-medium leading-none">{student?.student_name || 'Student'}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {student?.hall_ticket_number || '25RA1A05BV'}
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground border-t pt-2">
                    <p>{student?.course} - {student?.branch}</p>
                    <p>Semester {student?.current_semester}</p>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/dashboard/profile')} className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
