import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://althboljbntlpqquhnwy.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsdGhib2xqYm50bHBxcXVobnd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkzMTgzNDgsImV4cCI6MjEwNDg5NDM0OH0.vB3UR_Bferm-gQhLm_WjEs75jLT7ecSga0q9a_Z-3IE";

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
