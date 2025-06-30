'use client'

import React, { useEffect, useState } from 'react'

type Props = {
  remaining: number
  username: string
}

export default function SmartSuggestionsCard({ remaining, username }: Props) {
  const [suggestion, setSuggestion] = useState('Loading suggestions...')

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await fetch('/api/ai/suggestions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            balance: remaining,
            username,
            gender: 'Other', // Optional: Replace with actual value if needed
            language: 'en',   // Change to 'hi' if you want Hindi suggestions
          }),
        })

        const data = await res.json()

        if (data?.answer) {
          setSuggestion(data.answer)
        } else {
          setSuggestion('Could not generate suggestions at the moment.')
        }
      } catch (error) {
        console.error('AI Suggestion Error:', error)
        setSuggestion('Error loading suggestions.')
      }
    }

    fetchSuggestions()
  }, [remaining, username])

  return (
    <div className="text-white">
      <h2 className="text-xl font-semibold mb-3">💡 Smart Suggestions</h2>
      <p className="text-sm leading-relaxed whitespace-pre-line">{suggestion}</p>
    </div>
  )
}
