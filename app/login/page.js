'use client'

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '@/lib/supabaseClient'

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full space-y-4 p-6 bg-white rounded shadow">
        <img src="/logo.png" alt="Logo" className="h-12 mx-auto" />

        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          theme="default"
          providers={['google']}
          redirectTo="https://nexopitchai.morefestivals.com/dashboard"
        />
      </div>
    </main>
  )
}
