'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'

import { createClient } from '@/lib/supabase-client'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const id = email.toLowerCase().trim()
    const pass = password.trim()
    
    // Convert Hall Ticket to Email format for Supabase Auth if needed
    const authEmail = id.includes('@') ? id : `${id}@kpritech.ac.in`

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: authEmail,
      password: pass,
    })

    if (authError) {
      setError(authError.message === 'Invalid login credentials' ? 'Invalid login credentials' : authError.message)
      setLoading(false)
    } else {
      router.replace('/dashboard')
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleLogin} className="w-full flex flex-col space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-white text-sm font-semibold ml-1">User Name</Label>
        <div className="relative">
          <Input 
            id="email" 
            type="text" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 bg-[#8fa7b7] border-white/30 text-white placeholder:text-white/60 focus-visible:ring-white/50 focus-visible:border-transparent rounded-lg px-4"
          />
        </div>
      </div>
      
      <div className="space-y-1.5">
        <Label htmlFor="password" className="text-white text-sm font-semibold ml-1">Password</Label>
        <div className="relative">
          <Input 
            id="password" 
            type={showPassword ? "text" : "password"} 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 bg-[#8fa7b7] border-white/30 text-white placeholder:text-white/60 focus-visible:ring-white/50 focus-visible:border-transparent rounded-lg pl-4 pr-10"
          />
          <button 
            type="button" 
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#31516a] hover:text-[#213749]"
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
            )}
          </button>
        </div>
      </div>
      
      <div className="flex items-center space-x-3 pt-1 pb-4">
        <button 
          type="button"
          onClick={() => setRememberMe(!rememberMe)}
          className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors ${rememberMe ? 'bg-[#007bff]' : 'bg-gray-400'}`}
        >
          <span className={`absolute text-[10px] font-bold text-white transition-all ${rememberMe ? 'left-2 opacity-100' : 'left-2 opacity-0'}`}>
            ON
          </span>
          <span 
            className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${rememberMe ? 'translate-x-6' : 'translate-x-1'}`}
          />
        </button>
        <span className="text-white text-sm">Remember Me</span>
      </div>

      {error && (
        <div className="p-3 rounded-md bg-red-500/20 text-white border border-red-500/50 text-sm font-medium text-center">
          {error}
        </div>
      )}

      <Button 
        type="submit" 
        className="w-full h-12 bg-[#31516a] hover:bg-[#253f54] text-white font-bold tracking-wider text-base rounded-lg transition-colors" 
        disabled={loading}
      >
        {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : (
          <svg className="mr-2" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" x2="3" y1="12" y2="12"/></svg>
        )}
        LOGIN
      </Button>

      <div className="pt-6 flex justify-center">
        <Link href="/forgot-password" className="text-sm text-white/90 hover:text-white flex items-center gap-1.5 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
          Forgot Password?
        </Link>
      </div>
    </form>
  )
}
