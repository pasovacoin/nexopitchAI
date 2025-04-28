'use client'

import { useState, useRef, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function Dashboard() {
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
  const proposalRef = useRef(null)

  const logout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
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
    if (!input || !clientName) {
      alert('Please fill in the required fields.')
      return
    }

    setLoading(true)

    const user = await supabase.auth.getUser()
    const userEmail = user.data?.user?.email

    if (!userEmail) {
      alert('No user found, please log in again.')
      setLoading(false)
      return
    }

    const prompt = `
Create a business proposal for ${clientName}.
Project: ${input}
From: ${yourCompanyName || 'NexopitchAI'}
Price: ${customPrice || '$5,000'}
Contact:
- Name: ${senderName}
- Email: ${senderEmail}
- Phone: ${senderPhone}
- Website: ${senderWebsite || 'N/A'}
    `

    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, userEmail }),
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
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-primary-700 dark:text-primary-400">Welcome to NexopitchAI</h1>
          <button onClick={logout} className="text-sm text-red-600 hover:underline">Logout</button>
        </div>

        <p className="text-gray-600 dark:text-gray-400 mb-6">Create smart client proposals with AI. Instantly.</p>

        <div className="grid gap-4 mb-6">
          <input value={clientName} onChange={e => setClientName(e.target.value)} className="input" placeholder="Client / Company Name" />
          <input value={yourCompanyName} onChange={e => setYourCompanyName(e.target.value)} className="input" placeholder="Your Company Name" />
          <input value={customPrice} onChange={e => setCustomPrice(e.target.value)} className="input" placeholder="Custom Price (e.g. $3,000)" />
          <input value={senderName} onChange={e => setSenderName(e.target.value)} className="input" placeholder="Your Name" />
          <input value={senderEmail} onChange={e => setSenderEmail(e.target.value)} className="input" placeholder="Your Email" />
          <input value={senderPhone} onChange={e => setSenderPhone(e.target.value)} className="input" placeholder="Your Phone" />
          <input value={senderWebsite} onChange={e => setSenderWebsite(e.target.value)} className="input" placeholder="Website (optional)" />
          <textarea value={input} onChange={e => setInput(e.target.value)} className="input" placeholder="Project Details..." rows="3" />
        </div>

        <button
          onClick={generateProposal}
          disabled={loading}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded transition"
        >
          {loading ? 'Generating...' : 'Generate Proposal'}
        </button>

        {proposal && (
          <div ref={proposalRef} className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded shadow">
            <pre className="whitespace-pre-wrap text-gray-800 dark:text-white">{proposal}</pre>
            <div className="flex gap-4 mt-4">
              <button onClick={downloadPDF} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded">
                Download PDF
              </button>
            </div>
          </div>
        )}
      </div>

      <footer className="mt-10 text-center text-sm text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} NexopitchAI. All rights reserved.
      </footer>
    </main>
  )
}
