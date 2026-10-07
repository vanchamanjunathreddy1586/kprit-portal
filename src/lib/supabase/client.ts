import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bqqzytxbnwrvaqummceb.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxcXp5dHhibndydmFxdW1tY2ViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEzNzkxNDIsImV4cCI6MjEwNjk1NTE0Mn0.2fmbeRyCW-aaTksb0WpICXk-q9jwf0bjSFs1M3Rf5u8'
  )
}
