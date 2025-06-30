'use client'

import { useEffect, useState } from 'react'
import { Sparkles, Volume2, RotateCcw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function SmartSuggestionsCard({ remaining }: { remaining: number }) {
  const [suggestion, setSuggestion] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(true)
  const [username, setUsername] = useState<string>('Sir')
  const [gender, setGender] = useState<string>('unspecified')
  const [language, setLanguage] = useState<'en' | 'hi'>('en')

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return language === 'hi' ? 'सुप्रभात' : 'Good Morning'
    if (hour < 17) return language === 'hi' ? 'नमस्कार' : 'Good Afternoon'
    return language === 'hi' ? 'शुभ संध्या' : 'Good Evening'
  }

  const toggleLanguage = () => setLanguage((prev) => (prev === 'en' ? 'hi' : 'en'))

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await fetch('/api/user/profile', {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        setUsername(data?.profile?.name || 'Sir')
        setGender(data?.profile?.gender || 'unspecified')
      } catch {
        setUsername('Sir')
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
      setSuggestion(data.answer)
    } catch {
      setSuggestion(`${username}, FinBot couldn’t generate suggestions right now.`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (username && gender) getSuggestions()
  }, [remaining, username, gender, language])

  const speak = () => {
    if (!suggestion) return
    const utterance = new SpeechSynthesisUtterance(suggestion)
    utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN'
    utterance.rate = 1
    utterance.pitch = 1
    speechSynthesis.speak(utterance)
  }

  return (
    <motion.div
      className="w-full rounded-xl p-4 shadow-lg bg-gradient-to-br from-[#101010] to-[#1c1c1c] border-l-4 border-lime-400/50 text-white flex flex-col transition-all duration-300 ease-in-out"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header: Avatar + Greeting + Language Toggle */}
      <div className="mb-3 flex items-center gap-3">
        <div className="bg-lime-700 text-white rounded-full w-9 h-9 flex items-center justify-center text-xl">
          {username?.charAt(0)?.toUpperCase() || '👤'}
        </div>
        <div className="text-sm text-lime-300 font-medium">
          {getGreeting()}, {username} 👋
        </div>
        <button
          onClick={toggleLanguage}
          className="ml-auto text-xs text-cyan-300 underline hover:text-cyan-100"
        >
          {language === 'en' ? 'हिंदी में देखें 🇮🇳' : 'View in English 🇬🇧'}
        </button>
      </div>

      {/* AI Suggestion Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="text-lime-400 animate-pulse" size={18} />
          <h3 className="text-base font-semibold text-lime-300">
            {language === 'hi' ? 'स्मार्ट AI सुझाव' : 'Smart AI Suggestion'}
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={speak} className="hover:text-lime-400 text-zinc-400 transition">
            <Volume2 size={18} />
          </button>
          <button onClick={getSuggestions} className="hover:text-blue-400 text-zinc-400 transition">
            <RotateCcw size={18} />
          </button>
        </div>
      </div>

      {/* Toggle */}
      <button
        className="text-xs text-cyan-400 underline mb-2 self-end"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded
          ? language === 'hi' ? 'विवरण छुपाएं' : 'Hide Details'
          : language === 'hi' ? 'सुझाव दिखाएं' : 'Show Suggestion'}
      </button>

      {/* Content */}
      <AnimatePresence mode="wait">
        {expanded && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="flex-1 relative max-h-48 overflow-y-auto pr-2 text-[14px] leading-relaxed text-slate-200 whitespace-pre-wrap scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
              {loading ? (
                <p className="italic text-zinc-500">
                  {language === 'hi' ? 'FinBot सोच रहा है...' : 'Thinking like FinBot...'}
                </p>
              ) : (
                <p>{suggestion}</p>
              )}
              <div className="absolute bottom-0 left-0 w-full h-5 bg-gradient-to-t from-[#1c1c1c] to-transparent pointer-events-none" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
