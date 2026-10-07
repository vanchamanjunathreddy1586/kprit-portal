'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const supabase = createClient()

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
    }
    
    setLoading(false)
  }

  return (
    <Card className="w-full shadow-lg border-t-4 border-t-primary">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2 mb-2">
          <Link href="/login" className="text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
        </div>
        <CardDescription>
          Enter your registered email address or Student ID to receive a password reset link.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {success ? (
          <div className="p-4 rounded-md bg-green-50 text-green-700 text-sm font-medium border border-green-200 text-center">
            <p>Password reset instructions have been sent to your email.</p>
            <p className="mt-2 text-xs">Please check your inbox (and spam folder).</p>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Registered Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="student@kprit.ac.in" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            {error && (
              <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm font-medium">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        <Link href="/login" className="text-sm text-primary hover:underline font-medium">
          Back to Login
        </Link>
      </CardFooter>
    </Card>
  )
}
