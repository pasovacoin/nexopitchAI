'use client'
import { supabase } from '@/lib/supabaseClient' // Make sure this is at the top of page.js

import { useState, useRef } from 'react'


export default function Home() {
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

  
  const proposalRef = useRef(null)

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
  
    // ✅ Get the logged-in user's email
    const user = await supabase.auth.getUser()
    const userEmail = user.data?.user?.email
    console.log('Sending userEmail:', userEmail)

    if (!userEmail) {
      alert('You must be signed in to generate a proposal.')
      setLoading(false)
      return
    }
  
    const company = yourCompanyName || 'Our Team'
    const price = customPrice || '$5,000'
  
    const prompt = `
  Create a business proposal for ${input} for ${clientName}.
  Mention it's from ${company}.
  Use a total price of ${price}.
  
  At the end, include this contact info:
  Name: ${senderName}
  Email: ${senderEmail}
  Phone: ${senderPhone}
  Website: ${senderWebsite || 'N/A'}
    `

    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, userEmail }), // ✅ Pass email to backend
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
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">NexopitchAI – Intelligent Proposal Generator</h1>

      <h2 className="text-xl font-semibold mb-2">Choose your plan</h2>

<div className="flex flex-col gap-4 max-w-md">
  <a
    href="https://stratoelevate.lemonsqueezy.com/buy/dbc3b108-9065-4a48-9898-e93dd559bd39"
    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-center"
    target="_blank"
    rel="noopener noreferrer"
  >
    Buy 10 Credits – $2
  </a>

  <a
    href="https://stratoelevate.lemonsqueezy.com/buy/f299e4ec-511c-4a06-9bea-be5764b09a4d"
    className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition text-center"
    target="_blank"
    rel="noopener noreferrer"
  >
    Go Unlimited – $6/Month
  </a>

</div>

      <input
  type="text"
  value={clientName}
  onChange={(e) => setClientName(e.target.value)}
  placeholder="Enter client or company name"
  className="w-full mb-4 p-3 border rounded"
/>
<input
  type="text"
  value={yourCompanyName}
  onChange={(e) => setYourCompanyName(e.target.value)}
  placeholder="Your Company Name"
  className="w-full mb-4 p-3 border rounded"
/>

<input
  type="text"
  value={customPrice}
  onChange={(e) => setCustomPrice(e.target.value)}
  placeholder="Custom Price (e.g. $3,000)"
  className="w-full mb-4 p-3 border rounded"
/>
<div className="mb-4">
  <label className="block text-sm font-medium mb-1">Upload Logo</label>

  <div className="flex items-center space-x-4">
    <label className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer">
      Choose File
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files[0]
          if (file) {
            setLogo(file)
            setLogoPreview(URL.createObjectURL(file))
          }
        }}
      />
    </label>

    <span className="text-sm text-gray-600">
      {logo ? logo.name : 'No file chosen'}
    </span>
  </div>
</div>

{logoPreview && (
  <img
    src={logoPreview}
    alt="Uploaded Logo"
    className="mb-4 h-20 object-contain"
  />
)}
<input
  type="text"
  value={senderName}
  onChange={(e) => setSenderName(e.target.value)}
  placeholder="Your Name"
  className="w-full mb-4 p-3 border rounded"
/>

<input
  type="email"
  value={senderEmail}
  onChange={(e) => setSenderEmail(e.target.value)}
  placeholder="Your Email"
  className="w-full mb-4 p-3 border rounded"
/>

<input
  type="tel"
  value={senderPhone}
  onChange={(e) => setSenderPhone(e.target.value)}
  placeholder="Phone Number"
  className="w-full mb-4 p-3 border rounded"
/>

<input
  type="text"
  value={senderWebsite}
  onChange={(e) => setSenderWebsite(e.target.value)}
  placeholder="Website (optional)"
  className="w-full mb-4 p-3 border rounded"
/>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="e.g. Proposal for social media marketing for a gym in LA"
        className="w-full h-24 p-3 border rounded mb-4"
      />

      <button
        onClick={generateProposal}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        {loading ? 'Generating...' : 'Generate Proposal'}
      </button>

      {proposal && (
  <>
    <div ref={proposalRef} className="...">
  {logoPreview && (
    <img src={logoPreview} alt="Logo" className="h-16 mb-4" />
  )}

<pre className="whitespace-pre-wrap font-sans">{proposal}</pre>

</div>



    <div className="flex space-x-2 mt-4">
      <button
        onClick={downloadPDF}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        Download PDF
      </button>
      <button
        onClick={generateProposal}
        className="px-4 py-2 bg-gray-300 text-black rounded"
      >
        Regenerate
      </button>
    </div>
  </>
)}

    </main>
  )
}
