'use client';

import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [input, setInput] = useState('');
  const [proposal, setProposal] = useState('');
  const [loading, setLoading] = useState(false);
  const [credits, setCredits] = useState(0);
  const proposalRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      const { data } = await supabase
        .from('users')
        .select('credits')
        .eq('email', user.email)
        .single();
      setCredits(data?.credits || 0);
    };
    fetchUser();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const generateProposal = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert('User not found.');
      setLoading(false);
      return;
    }
    const prompt = input.trim();
    if (!prompt) {
      alert('Please enter some details first.');
      setLoading(false);
      return;
    }
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, userEmail: user.email }),
    });
    const data = await res.json();
    if (res.ok) {
      setProposal(data.proposal);
    } else {
      alert(data.error || 'Something went wrong.');
    }
    setLoading(false);
  };

  const downloadPDF = async () => {
    const element = proposalRef.current;
    const html2pdf = (await import('html2pdf.js')).default;
    html2pdf().from(element).set({
      margin: 0.5,
      filename: 'NexopitchAI-Proposal.pdf',
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    }).save();
  };

  return (
    <main className="max-w-3xl mx-auto p-6">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-primary-700">NexopitchAI Dashboard</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">Credits: {credits}</span>
          <button
            onClick={logout}
            className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded"
          >
            Logout
          </button>
        </div>
      </header>

      <section className="bg-white dark:bg-gray-900 shadow rounded p-6 space-y-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe the project or proposal details here..."
          className="w-full p-3 rounded border bg-gray-50 dark:bg-gray-800 text-black dark:text-white"
          rows="4"
        />
        <button
          onClick={generateProposal}
          disabled={loading}
          className="w-full bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white py-2 rounded text-lg font-semibold"
        >
          {loading ? 'Generating...' : 'Generate Proposal'}
        </button>
      </section>

      {proposal && (
        <section className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 mt-8 rounded p-6" ref={proposalRef}>
          <h2 className="text-xl font-bold mb-4">Generated Proposal</h2>
          <pre className="whitespace-pre-wrap font-sans text-black dark:text-white">{proposal}</pre>
          <div className="flex space-x-4 mt-6">
            <button
              onClick={downloadPDF}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded text-center"
            >
              Download PDF
            </button>
            <button
              onClick={generateProposal}
              className="flex-1 bg-gray-400 hover:bg-gray-500 text-black dark:text-white dark:bg-gray-700 dark:hover:bg-gray-600 py-2 rounded text-center"
            >
              Regenerate
            </button>
          </div>
        </section>
      )}

      <footer className="text-center mt-10 text-sm text-gray-500">
        © {new Date().getFullYear()} NexopitchAI. All rights reserved.
      </footer>
    </main>
  );
}
