
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { balance, items, username } = await req.json()
    const politeName = username || 'Sir'

    const messages = [
      {
        role: 'system',
        content: `
You are FinBot — a friendly, intelligent financial assistant. Address the user respectfully using their name (e.g. "${politeName}"). 
Give realistic suggestions based on income. Avoid cheap items if the user can afford better. Be clear, concise, and helpful.
Include:
- What to buy one-time
- EMI suggestions
- 1 EMI breakdown
- 1 short financial tip
Keep it under 150 words.
        `.trim(),
      },
      {
        role: 'user',
        content: `
Hi, my name is ${politeName}. I currently have ₹${balance} left.

Here are the items I'm considering:

${items.map((item: any, i: number) => `${i + 1}. ${item.name} – ₹${item.price}`).join('\n')}

Please advise:
- Which items can I buy one-time?
- What can I take on EMI?
- Give a short EMI example.
- Add one financial tip.
        `.trim(),
      },
    ]

    const response = await fetch(process.env.GROQ_API_URL!, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || 'llama3-8b-8192',
        messages,
        temperature: 0.7,
      }),
    })

    const data = await response.json()
    const answer = data?.choices?.[0]?.message?.content?.trim()

    return NextResponse.json({
      answer: answer || `${politeName}, FinBot couldn’t generate suggestions right now.`,
    })
  } catch (err) {
    console.error('🔥 AI Suggestion Error:', err)
    return NextResponse.json({ error: 'FinBot crashed on server.' }, { status: 500 })
  }
}
