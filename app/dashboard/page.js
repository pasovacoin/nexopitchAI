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
  const [logo, setLogo] = useState(null)
  const [logoPreview, setLogoPreview] = useState('')
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
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Welcome back to NexopitchAI</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Credits: {credits}</span>
          <button onClick={logout} className="text-sm text-red-600 hover:underline">
            Logout
          </button>
        </div>
      </div>

      <p className="text-gray-600 mb-4">
        Generate your next proposal in seconds with AI.
      </p>

      <div className="bg-white dark:bg-gray-900 p-6 rounded shadow space-y-4">
        <input type="text" placeholder="Client / Project" value={clientName} onChange={e => setClientName(e.target.value)} className="w-full p-3 border rounded bg-white dark:bg-gray-800 text-black dark:text-white" />
        <input type="text" placeholder="Your Company Name" value={yourCompanyName} onChange={e => setYourCompanyName(e.target.value)} className="w-full p-3 border rounded bg-white dark:bg-gray-800 text-black dark:text-white" />
        <input type="text" placeholder="Custom Price (e.g. $3,000)" value={customPrice} onChange={e => setCustomPrice(e.target.value)} className="w-full p-3 border rounded bg-white dark:bg-gray-800 text-black dark:text-white" />
        <input type="text" placeholder="Your Name" value={senderName} onChange={e => setSenderName(e.target.value)} className="w-full p-3 border rounded bg-white dark:bg-gray-800 text-black dark:text-white" />
        <input type="email" placeholder="Your Email" value={senderEmail} onChange={e => setSenderEmail(e.target.value)} className="w-full p-3 border rounded bg-white dark:bg-gray-800 text-black dark:text-white" />
        <input type="tel" placeholder="Phone Number" value={senderPhone} onChange={e => setSenderPhone(e.target.value)} className="w-full p-3 border rounded bg-white dark:bg-gray-800 text-black dark:text-white" />
        <input type="text" placeholder="Website (optional)" value={senderWebsite} onChange={e => setSenderWebsite(e.target.value)} className="w-full p-3 border rounded bg-white dark:bg-gray-800 text-black dark:text-white" />
        <textarea placeholder="Proposal details or prompt..." value={input} onChange={e => setInput(e.target.value)} className="w-full p-3 border rounded bg-white dark:bg-gray-800 text-black dark:text-white" />

        <button
          onClick={generateProposal}
          disabled={loading}
          className="w-full px-4 py-2 text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 rounded"
        >
          {loading ? 'Generating...' : 'Generate Proposal'}
        </button>
      </div>

      {proposal && (
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded border border-gray-300 dark:border-gray-700 mt-6" ref={proposalRef}>
          <pre className="whitespace-pre-wrap font-sans text-black dark:text-white">{proposal}</pre>
          <div className="flex gap-4 mt-4">
            <button onClick={downloadPDF} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Download PDF
            </button>
          </div>
        </div>
      )}

      <footer>
        <p className="text-center text-sm text-secondary-600 dark:text-secondary-400 mt-10">
          © {new Date().getFullYear()} NexopitchAI. All rights reserved.
        </p>
      </footer>
    </main>
  )
}
