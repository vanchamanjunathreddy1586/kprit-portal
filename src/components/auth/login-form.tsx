'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { GraduationCap, Loader2 } from 'lucide-react'
import Link from 'next/link'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Simulate network delay
    await new Promise(r => setTimeout(r, 600))

    const id = email.toLowerCase().trim()

    // Accept both 25ra105bv and 25ra1a05bv in case of typos
    if ((id === '25ra1a05bv' || id === '25ra105bv') && password === 'Kanni@1586') {
      // Set a simple client side cookie
      document.cookie = "kprit_auth=25ra1a05bv; path=/; max-age=86400"
      router.push('/dashboard')
      router.refresh()
    } else {
      setError("Invalid login credentials")
      setLoading(false)
    }
  }

  return (
    <Card className="w-full shadow-lg border-t-4 border-t-primary">
      <CardHeader className="space-y-2 text-center">
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
            <GraduationCap className="h-8 w-8 text-primary" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">KPRIT EXAM PORTAL</CardTitle>
        <CardDescription className="text-sm font-medium">
          Kommuri Prathap Reddy Institute of Technology
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Student ID / Hall Ticket Number</Label>
            <Input 
              id="email" 
              type="text" 
              placeholder="e.g. 25ra1a05bv" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                Forgot Password?
              </Link>
            </div>
            <Input 
              id="password" 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          {error && (
            <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm font-medium">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4 text-center text-sm text-muted-foreground">
        <p>Authorized access only. By logging in, you agree to the institution's terms of service.</p>
      </CardFooter>
    </Card>
  )
}
