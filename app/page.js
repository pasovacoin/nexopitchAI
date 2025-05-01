'use client'

import { useState, useRef, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

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
  const currentYear = new Date().getFullYear()

  useEffect(() => {
    setClientName("Example Corp")
    setInput("Proposal for website redesign and marketing strategy")
    setYourCompanyName("NexopitchAI Team")
    setCustomPrice("$3,000")
    setSenderName("Ibrahim Ruyembe")
    setSenderEmail("ibrahim@example.com")
    setSenderPhone("+255 123 456 789")
    setSenderWebsite("https://nexopitchai.morefestivals.com")
  }, [])

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
      alert('You must be signed in to generate a proposal.')
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

  return (
    <>
      <main className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-10 text-black dark:text-white">
        <h1 className="text-2xl font-bold mb-4">NexopitchAI – Smart Proposal Generator</h1>
        <h2 className="text-lg font-semibold mb-4 text-gray-600 dark:text-gray-300">Choose your plan:</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <a href="https://stratoelevate.lemonsqueezy.com/buy/dbc3b108-9065-4a48-9898-e93dd559bd39" target="_blank" rel="noreferrer"
            className="bg-blue-600 hover:bg-blue-700 text-white text-center py-3 px-5 rounded-lg font-semibold transition">
            Buy 10 Credits – $2
          </a>
          <a href="https://stratoelevate.lemonsqueezy.com/buy/f299e4ec-511c-4a06-9bea-be5764b09a4d" target="_blank" rel="noreferrer"
            className="bg-green-600 hover:bg-green-700 text-white text-center py-3 px-5 rounded-lg font-semibold transition">
            Go Unlimited – $6/Month
          </a>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow space-y-4">
          <input type="text" placeholder="Client or Project Name" value={clientName} onChange={e => setClientName(e.target.value)} className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-800" />
          <input type="text" placeholder="Your Company Name" value={yourCompanyName} onChange={e => setYourCompanyName(e.target.value)} className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-800" />
          <input type="text" placeholder="Custom Price" value={customPrice} onChange={e => setCustomPrice(e.target.value)} className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-800" />

          <div>
            <label className="block text-sm font-medium mb-1">Upload Logo</label>
            <div className="flex items-center gap-3">
              <label className="bg-primary-600 text-white py-2 px-4 rounded cursor-pointer">
                Choose File
                <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                  const file = e.target.files[0]
                  if (file) {
                    setLogo(file)
                    setLogoPreview(URL.createObjectURL(file))
                  }
                }} />
              </label>
              <span className="text-sm">{logo ? logo.name : 'No file chosen'}</span>
            </div>
          </div>

          {logoPreview && <img src={logoPreview} alt="Uploaded Logo" className="h-16 mb-2 object-contain" />}

          <input type="text" placeholder="Your Name" value={senderName} onChange={e => setSenderName(e.target.value)} className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-800" />
          <input type="email" placeholder="Your Email" value={senderEmail} onChange={e => setSenderEmail(e.target.value)} className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-800" />
          <input type="tel" placeholder="Phone Number" value={senderPhone} onChange={e => setSenderPhone(e.target.value)} className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-800" />
          <input type="text" placeholder="Website (optional)" value={senderWebsite} onChange={e => setSenderWebsite(e.target.value)} className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-800" />
          <textarea placeholder="Proposal details..." value={input} onChange={e => setInput(e.target.value)} className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-800 h-28" />

          <button
            onClick={generateProposal}
            disabled={loading}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-5 rounded-lg transition"
          >
            {loading ? 'Generating...' : 'Generate Proposal'}
          </button>
        </div>

        {proposal && (
          <div className="mt-8 bg-gray-50 dark:bg-gray-800 p-6 rounded shadow" ref={proposalRef}>
            {logoPreview && <img src={logoPreview} alt="Logo" className="h-16 mb-4" />}
            <pre className="whitespace-pre-wrap font-sans text-black dark:text-white">{proposal}</pre>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <button onClick={downloadPDF} className="bg-green-600 hover:bg-green-700 text-white py-3 px-5 rounded transition font-semibold">
                Download PDF
              </button>
              <button onClick={generateProposal} className="bg-gray-300 hover:bg-gray-400 text-black py-3 px-5 rounded transition font-semibold dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white">
                Regenerate
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="text-sm text-center text-secondary-600 dark:text-secondary-400 mt-10">
        © {currentYear} NexopitchAI. All rights reserved.
      </footer>
    </>
  )
}
