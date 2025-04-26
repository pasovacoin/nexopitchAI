'use client';

import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function Dashboard() {
  const [input, setInput] = useState('');
  const [proposal, setProposal] = useState('');
  const [loading, setLoading] = useState(false);
  const [clientName, setClientName] = useState('');
  const [yourCompanyName, setYourCompanyName] = useState('');
  const [customPrice, setCustomPrice] = useState('');
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [senderWebsite, setSenderWebsite] = useState('');
  const proposalRef = useRef(null);

  // Auto-fill for Lemon Squeezy demo
  useEffect(() => {
    setClientName('Example Corp');
    setInput('Proposal for website redesign and marketing strategy');
    setYourCompanyName('NexopitchAI Team');
    setCustomPrice('$3,000');
    setSenderName('Ibrahim Ruyembe');
    setSenderEmail('ibrahim@example.com');
    setSenderPhone('+255 123 456 789');
    setSenderWebsite('https://nexopitchai.morefestivals.com');
  }, []);

  const generateProposal = async () => {
    setLoading(true);
    const prompt = `
Create a business proposal for ${input} for ${clientName}.
Mention it's from ${yourCompanyName || 'Our Team'}.
Use a total price of ${customPrice || '$5,000'}.
Contact info:
Name: ${senderName}
Email: ${senderEmail}
Phone: ${senderPhone}
Website: ${senderWebsite || 'N/A'}
    `;
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();
    if (res.ok) setProposal(data.proposal);
    else alert(data.error || 'Something went wrong.');
    setLoading(false);
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2 text-center">Welcome to NexopitchAI</h1>
      <p className="text-center text-gray-500 mb-6">Create stunning proposals instantly.</p>

      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow space-y-4">
        <input
          type="text"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          placeholder="Client / Company Name"
          className="w-full p-3 border rounded bg-white dark:bg-gray-800"
        />
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Project Description"
          className="w-full p-3 border rounded bg-white dark:bg-gray-800"
        />
        <input
          type="text"
          value={yourCompanyName}
          onChange={(e) => setYourCompanyName(e.target.value)}
          placeholder="Your Company Name"
          className="w-full p-3 border rounded bg-white dark:bg-gray-800"
        />
        <input
          type="text"
          value={customPrice}
          onChange={(e) => setCustomPrice(e.target.value)}
          placeholder="Custom Price"
          className="w-full p-3 border rounded bg-white dark:bg-gray-800"
        />
        <button
          onClick={generateProposal}
          disabled={loading}
          className="w-full p-3 text-white bg-primary-600 hover:bg-primary-700 rounded transition"
        >
          {loading ? 'Generating...' : 'Generate Proposal'}
        </button>
      </div>

      {proposal && (
        <div className="mt-8 bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border dark:border-gray-700">
          <h2 className="text-xl font-bold mb-2">Generated Proposal</h2>
          <pre className="whitespace-pre-wrap font-sans">{proposal}</pre>
        </div>
      )}

      <footer className="mt-10 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} NexopitchAI. All rights reserved.
      </footer>
    </main>
  );
}
