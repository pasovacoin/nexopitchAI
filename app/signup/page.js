'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      alert(error.message)
    } else {
      // Auto login after signup
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (loginError) {
        alert(loginError.message)
      } else {
        router.push('/dashboard')
      }
    }

    setLoading(false)
  }

  return (
    <main className="max-w-md mx-auto px-6 py-12 w-full">
      <h1 className="text-2xl font-bold mb-6 text-center">Create your NexopitchAI Account</h1>
      <form onSubmit={handleSignup} className="space-y-4">
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required
          className="w-full p-3 border rounded bg-white dark:bg-gray-800 text-black dark:text-white"
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required
          className="w-full p-3 border rounded bg-white dark:bg-gray-800 text-black dark:text-white"
        />
        <button 
          type="submit"
          disabled={loading}
          className="w-full px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded"
        >
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
    </main>
  )
}
