'use client'

import Link from 'next/link'
import { User, LogOut, ShieldAlert } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
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

export function AdminHeader({ user }: { user: any }) {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-slate-900 text-white supports-[backdrop-filter]:bg-slate-900/90 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-6 w-6 text-red-500" />
          <div className="hidden md:block">
            <h2 className="text-lg font-bold leading-none">KPRIT ADMIN</h2>
            <p className="text-xs text-slate-400">Examination Portal Management</p>
          </div>
          <div className="block md:hidden">
            <h2 className="text-lg font-bold leading-none">ADMIN</h2>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end mr-2">
            <span className="text-sm font-medium">Administrator</span>
            <span className="text-xs text-slate-400">{user.email}</span>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-slate-800">
                <Avatar className="h-10 w-10 border border-slate-700">
                  <AvatarFallback className="bg-slate-800 text-white">AD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Administrator</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
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
