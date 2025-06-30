import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { balance, username, gender, language } = await req.json()

    const politeName = username || 'Sir'
    const userGender = gender || 'unspecified'
    const userLang = language === 'hi' ? 'hi' : 'en'

    const systemPrompt =
      userLang === 'hi'
        ? `
आप FinBot हैं — एक बुद्धिमान और विनम्र वित्तीय सहायक। उपयोगकर्ता को उनके नाम (“${politeName}”) से संबोधित करें। 
उनकी शेष राशि और लिंग के आधार पर व्यक्तिगत सुझाव दें — सस्ते सामान की अनुशंसा न करें जब तक कि यह आवश्यक न हो।

आपको बताना है:
- 2 चीजें जो वे एकमुश्त खरीद सकते हैं
- 2 चीजें EMI पर ले सकते हैं
- एक EMI ब्रेकडाउन उदाहरण
- एक छोटा व्यावहारिक वित्तीय सुझाव

⚠️ कृपया उत्तर केवल हिंदी में दें। नरम भाषा का प्रयोग करें। 150 शब्दों से कम में।
लिंग: ${userGender}
`.trim()
        : `
You are FinBot — a friendly, intelligent financial assistant. Address the user respectfully using their name (e.g. "${politeName}"). 
Give realistic, gender-aware suggestions based on the user's balance. Recommend useful purchases (gadgets, fashion, fitness, home, etc.) — avoid cheap or irrelevant items.

Include:
- 2 items they can buy one-time
- 2 items they can take on EMI
- 1 EMI breakdown example
- 1 short practical financial tip

⚠️ Please reply only in English. Stay under 150 words. Be warm, respectful, and helpful.
Gender: ${userGender}
`.trim()

    const userPrompt =
      userLang === 'hi'
        ? `
नमस्ते, मेरा नाम ${politeName} है। मेरे पास ₹${balance} बचे हैं। कृपया मेरी स्थिति के अनुसार सुझाव दें:
- 2 चीजें जो मैं एकमुश्त खरीद सकता हूँ?
- 2 चीजें EMI पर ले सकता हूँ?
- एक EMI उदाहरण
- एक वित्तीय सुझाव भी जोड़ें।
`.trim()
        : `
Hi, my name is ${politeName}. I currently have ₹${balance} left. Please give suggestions for:
- 2 items I can buy one-time
- 2 items on EMI
- An EMI breakdown
- 1 useful financial tip
`.trim()

    const response = await fetch(process.env.GROQ_API_URL!, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || 'llama3-8b-8192',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.6,
      }),
    })

    const data = await response.json()
    const answer = data?.choices?.[0]?.message?.content?.trim()

    if (!answer) {
      return NextResponse.json({
        answer: `${politeName}, FinBot couldn’t generate suggestions right now.`,
      })
    }

    return NextResponse.json({ answer })
  } catch (err) {
    console.error('🔥 AI Suggestion Error:', err)
    return NextResponse.json({ error: 'FinBot crashed on server.' }, { status: 500 })
  }
}
