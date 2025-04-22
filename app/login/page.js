'use client'

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '@/lib/supabaseClient'

export default function LoginPage() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="max-w-md w-full p-6 bg-white shadow-md rounded">
        <h1 className="text-2xl font-bold mb-4 text-center">Welcome to NexopitchAI</h1>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          theme="light"
          providers={['google']}
          redirectTo="https://nexopitchai.morefestivals.com/dashboard"
        />
      </div>
    </div>
  )
}
