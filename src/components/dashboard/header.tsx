'use client'

import { GraduationCap, LogOut, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { createClient } from '@/lib/supabase-client'
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
  const supabase = createClient()

  const handleLogout = async () => {
    // Standard cookie deletion fallback
    document.cookie = "kprit_auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    // Supabase auth signout
    await supabase.auth.signOut()
    
    router.push('/login')
    router.refresh()
  }

  const initials = student?.full_name ? student.full_name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : 'VM'

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
            <span className="text-sm font-medium">{student?.full_name || 'Student'}</span>
            <span className="text-xs text-muted-foreground">{student?.roll_number || '25RA1A05BV'}</span>
          </div>
          
          <Button variant="outline" size="sm" onClick={handleLogout} className="flex text-destructive border-destructive/20 hover:bg-destructive/10">
            <LogOut className="mr-2 h-4 w-4 hidden sm:block" />
            <span className="hidden sm:inline">Logout</span>
            <LogOut className="h-4 w-4 sm:hidden" />
          </Button>

          <div className="relative h-10 w-10 rounded-full cursor-default select-none">
            <Avatar className="h-10 w-10 border border-primary/20">
              <AvatarFallback className="bg-primary/10 text-primary font-medium">{initials}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  )
}
