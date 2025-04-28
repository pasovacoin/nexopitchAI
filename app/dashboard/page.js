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
      const { data } = await supabase.from('users').select('credits').eq('email', email).single()
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
      At the end, include contact info: ${senderName}, ${senderEmail}, ${senderPhone}, ${senderWebsite || 'N/A'}
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
    <main className="max-w-4xl mx-auto p-6 sm:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-primary-700">Welcome, NexopitchAI User</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Credits: {credits}</span>
          <button onClick={logout} className="text-sm text-red-500 hover:underline">
            Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <a
          href="https://stratoelevate.lemonsqueezy.com/buy/dbc3b108-9065-4a48-9898-e93dd559bd39"
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-5 rounded-lg text-center"
        >
          Buy 10 Credits – $2
        </a>
        <a
          href="https://stratoelevate.lemonsqueezy.com/buy/f299e4ec-511c-4a06-9bea-be5764b09a4d"
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-5 rounded-lg text-center"
        >
          Go Unlimited – $6/Month
        </a>
      </div>

      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg space-y-4">
        <input type="text" value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Client or Project Name" className="w-full p-3 border rounded-lg bg-gray-50" />
        <input type="text" value={yourCompanyName} onChange={e => setYourCompanyName(e.target.value)} placeholder="Your Company Name" className="w-full p-3 border rounded-lg bg-gray-50" />
        <input type="text" value={customPrice} onChange={e => setCustomPrice(e.target.value)} placeholder="Price (e.g. $5,000)" className="w-full p-3 border rounded-lg bg-gray-50" />
        <input type="text" value={senderName} onChange={e => setSenderName(e.target.value)} placeholder="Your Name" className="w-full p-3 border rounded-lg bg-gray-50" />
        <input type="email" value={senderEmail} onChange={e => setSenderEmail(e.target.value)} placeholder="Your Email" className="w-full p-3 border rounded-lg bg-gray-50" />
        <input type="tel" value={senderPhone} onChange={e => setSenderPhone(e.target.value)} placeholder="Phone Number" className="w-full p-3 border rounded-lg bg-gray-50" />
        <input type="text" value={senderWebsite} onChange={e => setSenderWebsite(e.target.value)} placeholder="Website (optional)" className="w-full p-3 border rounded-lg bg-gray-50" />
        <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Proposal details..." className="w-full p-3 border rounded-lg bg-gray-50 h-32" />

        <button
          onClick={generateProposal}
          disabled={loading}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-5 rounded-lg"
        >
          {loading ? 'Generating...' : 'Generate Proposal'}
        </button>
      </div>

      {proposal && (
        <div ref={proposalRef} className="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl shadow-lg mt-8">
          <pre className="whitespace-pre-wrap font-sans text-black dark:text-white">{proposal}</pre>
          <div className="mt-4">
            <button
              onClick={downloadPDF}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-5 rounded-lg"
            >
              Download PDF
            </button>
          </div>
        </div>
      )}

      <footer className="text-center text-sm text-gray-400 mt-12">
        © {new Date().getFullYear()} NexopitchAI. All rights reserved.
      </footer>
    </main>
  )
}
