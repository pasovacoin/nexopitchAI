'use client'
import { useEffect, useState, useRef } from 'react'
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
    if (res.ok) setProposal(data.proposal)
    else alert(data.error || 'Something went wrong.')

    setLoading(false)
  }

  return (
    <main className="max-w-2xl mx-auto p-6 text-black dark:text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">NexopitchAI Dashboard</h1>
        <div className="text-sm text-gray-600">Credits: {credits}</div>
        <button onClick={logout} className="text-sm text-red-500 hover:underline">Logout</button>
      </div>

      <div className="flex justify-between gap-4 text-sm mb-6">
        <a href="https://stratoelevate.lemonsqueezy.com/buy/dbc3b108-9065-4a48-9898-e93dd559bd39" className="text-blue-600 hover:underline" target="_blank">Buy 10 Credits – $2</a>
        <a href="https://stratoelevate.lemonsqueezy.com/buy/f299e4ec-511c-4a06-9bea-be5764b09a4d" className="text-blue-600 hover:underline" target="_blank">Go Unlimited – $6/Month</a>
      </div>

      <div className="space-y-4 bg-white dark:bg-gray-800 p-4 rounded shadow">
        {[
          { label: 'Client / Project', value: clientName, setter: setClientName },
          { label: 'Your Company Name', value: yourCompanyName, setter: setYourCompanyName },
          { label: 'Custom Price (e.g. $3,000)', value: customPrice, setter: setCustomPrice },
          { label: 'Your Name', value: senderName, setter: setSenderName },
          { label: 'Your Email', value: senderEmail, setter: setSenderEmail },
          { label: 'Phone Number', value: senderPhone, setter: setSenderPhone },
          { label: 'Website (optional)', value: senderWebsite, setter: setSenderWebsite },
        ].map((item, index) => (
          <input
            key={index}
            type="text"
            placeholder={item.label}
            value={item.value}
            onChange={e => item.setter(e.target.value)}
            className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-black dark:text-white"
          />
        ))}

        <textarea
          placeholder="Proposal prompt or service details..."
          value={input}
          onChange={e => setInput(e.target.value)}
          className="w-full p-2 border rounded h-24 bg-white dark:bg-gray-700 text-black dark:text-white"
        />

        <button
          onClick={generateProposal}
          disabled={loading}
          className="w-full py-2 rounded bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white"
        >
          {loading ? 'Generating...' : 'Generate Proposal'}
        </button>
      </div>

      {proposal && (
        <div className="mt-6 bg-gray-50 dark:bg-gray-800 p-4 rounded border" ref={proposalRef}>
          <pre className="whitespace-pre-wrap text-black dark:text-white">{proposal}</pre>
          <button onClick={downloadPDF} className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded">
            Download PDF
          </button>
        </div>
      )}

      <footer className="mt-10 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} NexopitchAI. All rights reserved.
      </footer>
    </main>
  )
}
