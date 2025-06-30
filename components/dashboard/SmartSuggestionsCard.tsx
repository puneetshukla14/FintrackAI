// components/dashboard/SmartSuggestionsCard.tsx
'use client'

import React, { useEffect, useState } from 'react'

type Props = {
  remaining: number
  username: string
  items: any // You can replace 'any' with a specific type like Item[] if needed
}

export default function SmartSuggestionsCard({ remaining, username, items }: Props) {
  const [suggestions, setSuggestions] = useState<string>('Loading suggestions...')

  useEffect(() => {
    const getSuggestions = async () => {
      try {
        const res = await fetch('/api/ai/suggestions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            balance: remaining,
            username,
            gender: 'unspecified', // optional: fetch from profile
            language: 'en',
          }),
        })

        const data = await res.json()
        setSuggestions(data.answer || 'No suggestions found.')
      } catch (err) {
        console.error('AI Suggestion Error:', err)
        setSuggestions('Something went wrong while fetching suggestions.')
      }
    }

    getSuggestions()
  }, [remaining, username])

  return (
    <div className="text-white">
      <h2 className="text-xl font-semibold mb-3">🤖 FinBot Suggestions</h2>
      <p className="text-gray-300 whitespace-pre-line">{suggestions}</p>
    </div>
  )
}
