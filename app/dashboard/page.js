/* eslint-disable react/no-unescaped-entities */
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
    const fetchUser = async () => {
      const user = await supabase.auth.getUser()
      const email = user.data?.user?.email
      const { data } = await supabase
        .from('users')
        .select('credits')
        .eq('email', email)
        .single()
      setCredits(data?.credits || 0)
    }
    fetchUser()
  }, [])

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
    setLoading(true)
    const user = await supabase.auth.getUser()
    const userEmail = user.data?.user?.email

    if (!userEmail) {
      alert('Please log in to continue.')
      setLoading(false)
      return
    }

    const prompt = `
      Create a business proposal for ${input} for ${clientName}.
      Mention it's from ${yourCompanyName || 'Our Team'}.
      Use a total price of ${customPrice || '$5,000'}.
      
      At the end, include this contact info:
      Name: ${senderName}
      Email: ${senderEmail}
      Phone: ${senderPhone}
      Website: ${senderWebsite || 'N/A'}
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
    <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <h1 className="text-2xl font-bold text-primary-700">Dashboard</h1>
        <div className="flex items-center gap-4 mt-4 sm:mt-0">
          <span className="text-sm text-gray-600">Credits: {credits}</span>
          <button
            onClick={logout}
            className="text-sm text-red-600 hover:underline"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white dark:bg-gray-900 shadow rounded p-6 space-y-4">
        <input
          type="text"
          placeholder="Client / Project Name"
          value={clientName}
          onChange={e => setClientName(e.target.value)}
          className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-800 text-black dark:text-white"
        />
        <input
          type="text"
          placeholder="Your Company Name"
          value={yourCompanyName}
          onChange={e => setYourCompanyName(e.target.value)}
          className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-800 text-black dark:text-white"
        />
        <input
          type="text"
          placeholder="Custom Price (e.g. $5,000)"
          value={customPrice}
          onChange={e => setCustomPrice(e.target.value)}
          className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-800 text-black dark:text-white"
        />
        <input
          type="text"
          placeholder="Your Name"
          value={senderName}
          onChange={e => setSenderName(e.target.value)}
          className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-800 text-black dark:text-white"
        />
        <input
          type="email"
          placeholder="Your Email"
          value={senderEmail}
          onChange={e => setSenderEmail(e.target.value)}
          className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-800 text-black dark:text-white"
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={senderPhone}
          onChange={e => setSenderPhone(e.target.value)}
          className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-800 text-black dark:text-white"
        />
        <input
          type="text"
          placeholder="Website (optional)"
          value={senderWebsite}
          onChange={e => setSenderWebsite(e.target.value)}
          className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-800 text-black dark:text-white"
        />

        <textarea
          placeholder="Describe the project..."
          value={input}
          onChange={e => setInput(e.target.value)}
          className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-800 text-black dark:text-white h-28"
        />

        <button
          onClick={generateProposal}
          disabled={loading}
          className="w-full bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white font-semibold py-3 rounded transition"
        >
          {loading ? 'Generating...' : 'Generate Proposal'}
        </button>
      </div>

      {/* Output */}
      {proposal && (
        <div
          ref={proposalRef}
          className="bg-gray-50 dark:bg-gray-800 p-6 rounded shadow space-y-4 mt-8"
        >
          <pre className="whitespace-pre-wrap font-sans text-black dark:text-white">
            {proposal}
          </pre>

          <button
            onClick={downloadPDF}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded transition"
          >
            Download Proposal as PDF
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className="pt-10 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} NexopitchAI. All rights reserved.
      </footer>
    </main>
  )
}
