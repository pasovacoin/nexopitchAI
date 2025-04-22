'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login') // Redirect if not logged in
      } else {
        setUser(user)
      }
    }

    getUser()
  }, [])

  if (!user) return <p className="text-center mt-20">Loading...</p>

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Welcome, {user.email}</h1>
      <p className="mt-4">You're logged in and can now access your dashboard features!</p>
    </main>
  )
}
