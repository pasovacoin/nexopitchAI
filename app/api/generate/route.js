import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req) {
  try {
    const { prompt } = await req.json()

    const systemPrompt = `
    You are a professional business proposal writer.
    Write clearly structured proposals with sections like:
    
    TITLE:
    INTRODUCTION:
    OBJECTIVES:
    PROPOSED SOLUTION:
    TIMELINE:
    PRICING:
    TERMS & CONDITIONS:
    CONTACT INFO:
    
    Do NOT use Markdown or asterisks. Just use all-caps headings followed by colons.
    Write in formal, friendly, and clear business language.
    `

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Generate a proposal for: ${prompt}` },
      ],
      temperature: 0.7,
      max_tokens: 800,
    })

    const text = response.choices[0].message.content
    return NextResponse.json({ proposal: text })

  } catch (err) {
    console.error('❌ API Error:', err)
    return NextResponse.json(
      { error: 'Failed to generate proposal' },
      { status: 500 }
    )
  }
}
