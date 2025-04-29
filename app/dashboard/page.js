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
  const [credits, setCredits] = useState(0)

  const proposalRef = useRef(null)

  useEffect(() => {
    const fetchCredits = async () => {
      const { data: user } = await supabase.auth.getUser()
      const email = user?.user?.email
      if (email) {
        const { data } = await supabase.from('users').select('credits').eq('email', email).single()
        setCredits(data?.credits || 0)
      }
    }
    fetchCredits()
  }, [])

  const logout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  const generateProposal = async () => {
    setLoading(true)
    const { data: user } = await supabase.auth.getUser()
    const userEmail = user?.user?.email

    if (!userEmail) {
      alert('Please log in to continue.')
      setLoading(false)
      return
    }

    const prompt = `
Create a business proposal for ${input} for ${clientName}.
Mention it's from ${yourCompanyName || 'Our Team'}.
Use a total price of ${customPrice || '$5,000'}.
Include contact info:
Name: ${senderName}, Email: ${senderEmail}, Phone: ${senderPhone}, Website: ${senderWebsite || 'N/A'}
    `

    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, userEmail }),
    })

    const data = await res.json()
    if (res.ok) setProposal(data.proposal)
    else alert(data.error || 'Something went wrong.')

    setLoading(false)
  }

  const downloadPDF = async () => {
    const element = proposalRef.current
    const html2pdf = (await import('html2pdf.js')).default
    html2pdf()
      .from(element)
      .set({
        margin: 0.5,
        filename: 'NexopitchAI-Proposal.pdf',
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
      })
      .save()
  }

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 text-black dark:text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-primary-700">Welcome to NexopitchAI</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">Credits: {credits}</span>
          <button onClick={logout} className="text-sm text-red-500 hover:underline">Logout</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <a href="https://stratoelevate.lemonsqueezy.com/buy/dbc3b108-9065-4a48-9898-e93dd559bd39" target="_blank" rel="noreferrer"
          className="block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-5 rounded-lg text-center transition">
          Buy 10 Credits – $2
        </a>
        <a href="https://stratoelevate.lemonsqueezy.com/buy/f299e4ec-511c-4a06-9bea-be5764b09a4d" target="_blank" rel="noreferrer"
          className="block bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-5 rounded-lg text-center transition">
          Go Unlimited – $6/Month
        </a>
      </div>

      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow space-y-4">
        <input className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-800" placeholder="Client or Project Name" value={clientName} onChange={e => setClientName(e.target.value)} />
        <input className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-800" placeholder="Your Company Name" value={yourCompanyName} onChange={e => setYourCompanyName(e.target.value)} />
        <input className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-800" placeholder="Custom Price (e.g. $3,000)" value={customPrice} onChange={e => setCustomPrice(e.target.value)} />
        <input className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-800" placeholder="Your Name" value={senderName} onChange={e => setSenderName(e.target.value)} />
        <input className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-800" placeholder="Your Email" value={senderEmail} onChange={e => setSenderEmail(e.target.value)} />
        <input className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-800" placeholder="Phone Number" value={senderPhone} onChange={e => setSenderPhone(e.target.value)} />
        <input className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-800" placeholder="Website (optional)" value={senderWebsite} onChange={e => setSenderWebsite(e.target.value)} />
        <textarea className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-800 h-28" placeholder="Proposal Details" value={input} onChange={e => setInput(e.target.value)} />

        <button onClick={generateProposal} disabled={loading}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded transition">
          {loading ? 'Generating...' : 'Generate Proposal'}
        </button>
      </div>

      {proposal && (
        <div ref={proposalRef} className="mt-6 bg-gray-100 dark:bg-gray-800 p-6 rounded shadow">
          <pre className="whitespace-pre-wrap font-sans">{proposal}</pre>
          <button onClick={downloadPDF}
            className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded font-semibold transition">
            Download PDF
          </button>
        </div>
      )}

      <footer className="text-center text-sm text-gray-400 mt-10">
        © {new Date().getFullYear()} NexopitchAI. All rights reserved.
      </footer>
    </main>
  )
}
