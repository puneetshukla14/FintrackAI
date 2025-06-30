import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { balance, username, gender, language } = await req.json()
    const politeName = username || 'Sir'
    const userLang = language === 'hi' ? 'hi' : 'en'
    const userGender = gender || 'unspecified'

    const systemPrompt = userLang === 'hi'
      ? `आप FinBot हैं — ...`  // your full Hindi prompt
      : `You are FinBot — a friendly financial assistant. ...`

    const userPrompt = userLang === 'hi'
      ? `नमस्ते, मेरा नाम ${politeName} है। मेरे पास ₹${balance} बचे हैं। ...`
      : `Hi, my name is ${politeName}. I currently have ₹${balance} left. ...`

    const res = await fetch(process.env.GROQ_API_URL!, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.6,
      }),
    })

    if (!res.ok) {
      console.error('AI API error:', await res.text())
      return NextResponse.json({ error: 'AI suggestion failed' }, { status: 500 })
    }

    const data = await res.json()
    const answer = data.choices?.[0]?.message?.content?.trim()
    if (!answer) throw new Error('Empty AI response')

    return NextResponse.json({ answer })
  } catch (err) {
    console.error('🔥 AI Suggestion Error:', err)
    return NextResponse.json({ error: 'FinBot crashed on server.' }, { status: 500 })
  }
}
