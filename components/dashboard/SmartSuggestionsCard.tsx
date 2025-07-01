'use client'

import { useEffect, useState } from 'react'
import { Volume2, RefreshCw, Brain } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
] as const

export default function SmartSuggestionsCard({ remaining }: { remaining: number }) {
  const [suggestion, setSuggestion] = useState('')
  const [displayText, setDisplayText] = useState('')
  const [index, setIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(true)
  const [username, setUsername] = useState('User')
  const [gender, setGender] = useState('unspecified')
  const [language, setLanguage] = useState<'en' | 'hi' | 'es' | 'fr'>('en')

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return language === 'hi' ? 'सुप्रभात' : 'Good Morning'
    if (hour < 17) return language === 'hi' ? 'नमस्कार' : 'Good Afternoon'
    return language === 'hi' ? 'शुभ संध्या' : 'Good Evening'
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await fetch('/api/user/profile', {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        setUsername(data?.profile?.name || 'User')
        setGender(data?.profile?.gender || 'unspecified')
      } catch {
        setUsername('User')
        setGender('unspecified')
      }
    }
    fetchUserData()
  }, [])

  const getSuggestions = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/ai/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ balance: remaining, username, gender, language }),
      })
      const data = await res.json()
      const fullText = data.answer || `${username}, FinBot couldn’t generate suggestions right now.`
      setSuggestion(fullText)
      setDisplayText('')
      setIndex(0)
    } catch {
      const fallback = `${username}, FinBot couldn’t generate suggestions right now.`
      setSuggestion(fallback)
      setDisplayText('')
      setIndex(0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (username && gender) getSuggestions()
  }, [remaining, username, gender, language])

  useEffect(() => {
    if (!suggestion || loading) return
    if (index < suggestion.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + suggestion.charAt(index))
        setIndex(prev => prev + 1)
      }, 15)
      return () => clearTimeout(timeout)
    }
  }, [index, suggestion, loading])

  const speak = () => {
    if (!suggestion) return
    const utterance = new SpeechSynthesisUtterance(suggestion)
    utterance.lang =
      language === 'hi'
        ? 'hi-IN'
        : language === 'es'
        ? 'es-ES'
        : language === 'fr'
        ? 'fr-FR'
        : 'en-IN'
    utterance.rate = 1
    utterance.pitch = 1
    speechSynthesis.speak(utterance)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full rounded-xl p-6 shadow-xl bg-zinc-950 border border-zinc-800 text-white flex flex-col space-y-4"
    >
      {/* Header */}
      <div className="flex items-center gap-4">
<div className="bg-emerald-600 text-white rounded-full w-9 h-9 flex items-center justify-center font-semibold text-sm uppercase">
  {(() => {
    const cleanName = (username || 'User').trim()
    const firstLetter = cleanName.length > 0 ? cleanName.charAt(0).toUpperCase() : 'U'
    return firstLetter
  })()}
</div>

        <div className="flex-1">
          <p className="text-sm font-medium text-emerald-300">
            {getGreeting()}, {username}
          </p>
        </div>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as 'en' | 'hi' | 'es' | 'fr')}
          className="text-xs text-white bg-zinc-800 px-2 py-1 rounded border border-zinc-600"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code} className="bg-zinc-800 text-white">
              {lang.label}
            </option>
          ))}
        </select>
      </div>

      {/* Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain size={18} className="text-emerald-400" />
          <h2 className="text-base font-semibold text-white">Fintech AI Insights</h2>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={speak} className="text-zinc-400 hover:text-emerald-300">
            <Volume2 size={18} />
          </button>
          <button onClick={getSuggestions} className="text-zinc-400 hover:text-blue-400">
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {/* Toggle */}
      <button
        className="text-xs text-cyan-400 hover:underline self-end"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded
          ? language === 'hi'
            ? 'विवरण छुपाएं'
            : 'Hide'
          : language === 'hi'
            ? 'सुझाव दिखाएं'
            : 'Show'}
      </button>

      {/* Output */}
      <AnimatePresence mode="wait">
        {expanded && (
          <motion.div
            key="content"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
            className="overflow-hidden"
          >
            <div className="text-sm text-slate-300 leading-relaxed min-h-[180px] md:min-h-[220px] p-4 rounded-lg border border-emerald-500/20 bg-zinc-900 relative shadow-sm font-mono whitespace-pre-wrap">
              {loading ? (
                <p className="italic text-zinc-500">
                  {language === 'hi' ? 'FinBot सोच रहा है...' : 'Generating insight...'}
                </p>
              ) : (
                <p className="text-emerald-400">{displayText}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
