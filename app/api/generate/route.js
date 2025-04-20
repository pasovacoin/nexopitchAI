import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import OpenAI from 'openai'

const openai = new OpenAI()

export async function POST(req) {
  try {
    const { prompt, userEmail } = await req.json()

    if (!prompt || !userEmail) {
      return new Response(JSON.stringify({ error: 'Prompt or userEmail missing.' }), { status: 400 })
    }

    // 1. Fetch user and credits
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('credits')
      .eq('email', userEmail)
      .single()

    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'User not found.' }), { status: 404 })
    }

    if (user.credits <= 0) {
      return new Response(JSON.stringify({ error: 'No credits remaining.' }), { status: 403 })
    }

    // 2. Define prompt
    const systemPrompt = `
      You are a professional business proposal writer.
      Write clear, structured business proposals with bolded section titles and persuasive wording.
    `

    // 3. Generate proposal
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      
    })

    const generatedProposal = completion.choices[0].message.content

    // 4. Deduct 1 credit
    await supabase
      .from('users')
      .update({ credits: user.credits - 1 })
      .eq('email', userEmail)

    return new Response(JSON.stringify({ proposal: generatedProposal }), {
      status: 200,
    })

  } catch (err) {
    console.error('POST /api/generate error:', err)
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    })
  }
}

