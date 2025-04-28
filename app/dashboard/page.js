'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

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
      const user = await supabase.auth.getUser()
      const email = user.data?.user?.email
      if (!email) router.push('/login')

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
    if (!input || !clientName) {
      alert('Please fill project details.')
      return
    }
    setLoading(true)
    const user = await supabase.auth.getUser()
    const userEmail = user.data?.user?.email

    const prompt = `
      Create a business proposal for ${input} for ${clientName}.
      Mention it's from ${yourCompanyName || 'Our Team'}.
      Price: ${customPrice || '$5,000'}.
      
      Contact Info:
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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-300">Credits: {credits}</span>
            <button onClick={logout} className="text-sm text-red-600 hover:underline">Logout</button>
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-400">Generate professional proposals in seconds.</p>

        <div className="space-y-4">
          <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Client or Company" className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-700 text-black dark:text-white" />
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Project Description" className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-700 text-black dark:text-white" />
          <input type="text" value={yourCompanyName} onChange={(e) => setYourCompanyName(e.target.value)} placeholder="Your Company Name" className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-700 text-black dark:text-white" />
          <input type="text" value={customPrice} onChange={(e) => setCustomPrice(e.target.value)} placeholder="Custom Price" className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-700 text-black dark:text-white" />
          <input type="text" value={senderName} onChange={(e) => setSenderName(e.target.value)} placeholder="Your Name" className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-700 text-black dark:text-white" />
          <input type="email" value={senderEmail} onChange={(e) => setSenderEmail(e.target.value)} placeholder="Your Email" className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-700 text-black dark:text-white" />
          <input type="tel" value={senderPhone} onChange={(e) => setSenderPhone(e.target.value)} placeholder="Your Phone" className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-700 text-black dark:text-white" />
          <input type="text" value={senderWebsite} onChange={(e) => setSenderWebsite(e.target.value)} placeholder="Your Website" className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-700 text-black dark:text-white" />

          <button
            onClick={generateProposal}
            disabled={loading}
            className="w-full px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded"
          >
            {loading ? 'Generating...' : 'Generate Proposal'}
          </button>
        </div>

        {proposal && (
          <div ref={proposalRef} className="mt-8 bg-gray-50 dark:bg-gray-700 p-6 rounded border border-gray-300 dark:border-gray-600">
            <pre className="whitespace-pre-wrap text-black dark:text-white">{proposal}</pre>
            <div className="flex mt-4">
              <button onClick={downloadPDF} className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded">
                Download PDF
              </button>
            </div>
          </div>
        )}
      </div>

      <p className="text-center text-sm text-secondary-600 dark:text-secondary-400 mt-6">
        © {new Date().getFullYear()} NexopitchAI. All rights reserved.
      </p>
    </div>
  )
}
