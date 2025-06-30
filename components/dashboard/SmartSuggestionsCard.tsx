'use client'
import { useEffect, useState } from 'react'
import { Sparkles, Volume2, RotateCcw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function SmartSuggestionsCard({ remaining }) {
  const [suggestion, setSuggestion] = useState<string>('Loading smart suggestions...')
  const [loading, setLoading] = useState(true)
  const [language, setLanguage] = useState<'en'|'hi'>('en')

  const getSuggestions = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/ai/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          balance: remaining,
          username: 'Sir',
          gender: 'unspecified',
          language,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Unknown error')
      setSuggestion(data.answer)
    } catch (err) {
      console.error('AI error:', err)
      setSuggestion('Sorry, I couldn’t load suggestions right now.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getSuggestions()
  }, [remaining, language])

  return (
    <motion.div className="p-4 bg-zinc-900 rounded-lg shadow-lg text-white">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-cyan-400" />
          <h3 className="font-semibold text-cyan-300">AI Suggestion</h3>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}>
            {language === 'en' ? 'हिंदी' : 'EN'}
          </button>
          <button onClick={getSuggestions}><RotateCcw size={18} /></button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={suggestion}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-sm leading-relaxed"
        >
          {loading ? <em>Thinking…</em> : suggestion}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}
