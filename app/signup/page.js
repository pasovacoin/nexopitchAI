'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
  
    if (error) {
      alert(error.message);
    } else {
      alert('✅ Account created successfully! You can now log in.');
      window.location.href = '/login'; // 👈 redirect to login
    }
  
    setLoading(false);
  };
  

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <form onSubmit={handleSignup}  // CORRECT ✅

        className="bg-white dark:bg-gray-800 p-8 rounded shadow-md w-full max-w-md space-y-6"
      >
        <h1 className="text-2xl font-bold text-center">Create your NexopitchAI account</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 border rounded bg-white dark:bg-gray-700 text-black dark:text-white"
        />
        <input
          type="password"
          placeholder="Password (min. 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-3 border rounded bg-white dark:bg-gray-700 text-black dark:text-white"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white py-3 rounded"
        >
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>

        <p className="text-center text-sm text-gray-600">
          Already have an account? <a href="/login" className="text-primary-600 hover:underline">Login</a>
        </p>
      </form>
    </main>
  )
}
