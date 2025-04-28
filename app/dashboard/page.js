'use client'

import { useState, useRef, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const router = useRouter()

  const [input, setInput] = useState('')
  const [proposal, setProposal] = useState('')
  const [loading, setLoading] = useState(false)
  const [clientName, setClientName] = useState('')
  const [yourCompanyName, setYourCompanyName] = useState('')
  const [customPrice, setCustomPrice] = useState('')
  const [senderName, setSenderName] = useState('')
  const [senderEmail, setSenderEmail] = useState('')
  const [senderPhone, setSenderPhone] = useState('')
  const [senderWebsite, setSenderWebsite] = useState('')
  const [credits, setCredits] = useState(0)

  const proposalRef = useRef(null)

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
      } else {
        const { data } = await supabase
          .from('users')
          .select('credits')
          .eq('email', user.email)
          .single()
        setCredits(data?.credits || 0)
        setSenderEmail(user.email)
      }
    }
    fetchUser()
  }, [router])

  const logout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const downloadPDF = async () => {
    const element = proposalRef.current
    const html2pdf = (await import('html2pdf.js')).default
    html2pdf().from(element).set({
      margin: 0.5,
      filename: 'NexopitchAI-Proposal.pdf',
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    }).save()
  }

  const generateProposal = async () => {
    if (!input || !senderEmail) {
      alert('Missing project details or user.')
      return
    }
    setLoading(true)

    const prompt = `
    Create a business proposal for ${input} for ${clientName}.
    Mention it's from ${yourCompanyName || 'Our Team'}.
    Use a total price of ${customPrice || '$5,000'}.

    Contact info:
    Name: ${senderName}
    Email: ${senderEmail}
    Phone: ${senderPhone}
    Website: ${senderWebsite || 'N/A'}
    `

    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, userEmail: senderEmail }),
    })

    const data = await res.json()
    if (res.ok) {
      setProposal(data.proposal)
    } else {
      alert(data.error || 'Something went wrong.')
    }
    setLoading(false)
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Welcome to NexopitchAI</h1>
        <div className="flex gap-4 items-center">
          <span className="text-gray-600 text-sm">Credits: {credits}</span>
          <button onClick={logout} className="text-red-500 text-sm hover:underline">
            Logout
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 p-6 rounded shadow-md space-y-4">
        <input className="w-full p-3 border rounded" value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Client Name" />
        <input className="w-full p-3 border rounded" value={yourCompanyName} onChange={e => setYourCompanyName(e.target.value)} placeholder="Your Company" />
        <input className="w-full p-3 border rounded" value={customPrice} onChange={e => setCustomPrice(e.target.value)} placeholder="Custom Price ($)" />
        <input className="w-full p-3 border rounded" value={senderName} onChange={e => setSenderName(e.target.value)} placeholder="Your Name" />
        <input className="w-full p-3 border rounded" value={senderPhone} onChange={e => setSenderPhone(e.target.value)} placeholder="Phone" />
        <input className="w-full p-3 border rounded" value={senderWebsite} onChange={e => setSenderWebsite(e.target.value)} placeholder="Website (optional)" />
        <textarea className="w-full h-24 p-3 border rounded" value={input} onChange={e => setInput(e.target.value)} placeholder="Describe the project..." />

        <button
          onClick={generateProposal}
          disabled={loading}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded"
        >
          {loading ? 'Generating...' : 'Generate Proposal'}
        </button>
      </div>

      {proposal && (
        <div ref={proposalRef} className="bg-gray-100 dark:bg-gray-800 p-6 rounded shadow-md mt-8">
          <pre className="whitespace-pre-wrap">{proposal}</pre>
          <button
            onClick={downloadPDF}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 mt-4 rounded"
          >
            Download Proposal
          </button>
        </div>
      )}
    </main>
  )
}
