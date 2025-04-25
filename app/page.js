'use client'
import { useEffect, useState, useRef } from 'react'
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
  const currentYear = new Date().getFullYear()

  const proposalRef = useRef(null)

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/service-worker.js')
          .then((registration) => {
            console.log('✅ Service Worker registered:', registration);
          })
          .catch((err) => {
            console.log('❌ Service Worker registration failed:', err);
          });
      });
    }
  }, []);
  useEffect(() => {
    setClientName("Example Corp");
    setInput("Proposal for website redesign and marketing strategy");
    setYourCompanyName("NexopitchAI Team");
    setCustomPrice("$3,000");
    setSenderName("Ibrahim Ruyembe");
    setSenderEmail("ibrahim@example.com");
    setSenderPhone("+255 123 456 789");
    setSenderWebsite("https://nexopitchai.morefestivals.com");
  }, []);
  
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
    <>
      <main className="p-6 max-w-3xl mx-auto text-black dark:text-white bg-white dark:bg-gray-900">
        <h1 className="text-2xl font-bold mb-4">nexopitchAI – Intelligent Proposal Generator</h1>
        <h2 className="text-xl font-semibold mb-2">Choose your Plan</h2>

        <div className="flex flex-col gap-4 max-w-md">
          <a
  href="https://stratoelevate.lemonsqueezy.com/buy/dbc3b108-9065-4a48-9898-e93dd559bd39"
  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white rounded text-center"
  target="_blank"
  rel="noopener noreferrer"
>
  Buy 10 Credits – $2
</a>
<a
  href="https://stratoelevate.lemonsqueezy.com/buy/f299e4ec-511c-4a06-9bea-be5764b09a4d"
  className="px-4 py-2 bg-secondary-600 hover:bg-secondary-700 dark:bg-secondary-500 dark:hover:bg-secondary-600 text-white rounded text-center"
  target="_blank"
  rel="noopener noreferrer"
>
  Go Unlimited – $6/Month
</a>
        </div>

        <div className="mt-6 space-y-4">
          <input type="text" value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Enter client or company name" className="w-full p-3 border rounded bg-white dark:bg-gray-800 text-black dark:text-white" />
          <input type="text" value={yourCompanyName} onChange={e => setYourCompanyName(e.target.value)} placeholder="Your Company Name" className="w-full p-3 border rounded bg-white dark:bg-gray-800 text-black dark:text-white" />
          <input type="text" value={customPrice} onChange={e => setCustomPrice(e.target.value)} placeholder="Custom Price (e.g. $3,000)" className="w-full p-3 border rounded bg-white dark:bg-gray-800 text-black dark:text-white" />

          <div>
            <label className="block text-sm font-medium mb-1">Upload Logo</label>
            <div className="flex items-center space-x-4">
              <label className="px-4 py-2 bg-primary-600 text-white rounded cursor-pointer">
                Choose File
                <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                  const file = e.target.files[0]
                  if (file) {
                    setLogo(file)
                    setLogoPreview(URL.createObjectURL(file))
                  }
                }} />
              </label>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {logo ? logo.name : 'No file chosen'}
              </span>
            </div>
          </div>

          {logoPreview && (
            <img src={logoPreview} alt="Uploaded Logo" className="mb-4 h-20 object-contain" />
          )}

          <input type="text" value={senderName} onChange={e => setSenderName(e.target.value)} placeholder="Your Name" className="w-full p-3 border rounded bg-white dark:bg-gray-800 text-black dark:text-white" />
          <input type="email" value={senderEmail} onChange={e => setSenderEmail(e.target.value)} placeholder="Your Email" className="w-full p-3 border rounded bg-white dark:bg-gray-800 text-black dark:text-white" />
          <input type="tel" value={senderPhone} onChange={e => setSenderPhone(e.target.value)} placeholder="Phone Number" className="w-full p-3 border rounded bg-white dark:bg-gray-800 text-black dark:text-white" />
          <input type="text" value={senderWebsite} onChange={e => setSenderWebsite(e.target.value)} placeholder="Website (optional)" className="w-full p-3 border rounded bg-white dark:bg-gray-800 text-black dark:text-white" />
          <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="e.g. Proposal for social media marketing for a gym in LA" className="w-full h-24 p-3 border rounded bg-white dark:bg-gray-800 text-black dark:text-white" />

          <button onClick={generateProposal} disabled={loading} className="w-full px-4 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded hover:bg-primary-700 dark:hover:bg-primary-600">
            {loading ? 'Generating...' : 'Generate Proposal'}
          </button>
        </div>

        {proposal && (
          <div className="mt-6 bg-gray-50 dark:bg-gray-800 p-4 rounded border border-gray-300 dark:border-gray-600" ref={proposalRef}>
            {logoPreview && (
              <img src={logoPreview} alt="Logo" className="h-16 mb-4" />
            )}
            <pre className="whitespace-pre-wrap font-sans text-black dark:text-white">{proposal}</pre>

            <div className="flex gap-4 mt-4">
            <button
  onClick={downloadPDF}
  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded dark:bg-green-500 dark:hover:bg-green-600"
>
  Download PDF
</button>
<button
  onClick={generateProposal}
  className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
>
  Regenerate
</button>
            </div>
          </div>
        )}
      </main>

      <footer>
        <p className="text-sm text-secondary-600 dark:text-secondary-400 text-center mt-10">
          © {currentYear} nexopitchAI. All rights reserved.
        </p>
      </footer>
    </>
  )
}
