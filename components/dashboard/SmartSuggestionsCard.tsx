'use client'

import { useEffect, useState } from 'react'
import { Brain, Volume2, RefreshCw } from 'lucide-react'
import { motion } from 'framer-motion'
import GradientLoader from './GradientLoader'
import NeonAvatar from './ProfileGlowAvatar'

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
] as const

export default function SmartSuggestionsCard({ remaining }: { remaining: number }) {
  const [username, setUsername] = useState('User')
  const [gender, setGender] = useState('unspecified')
  const [language, setLanguage] = useState<'en' | 'hi' | 'es' | 'fr'>('en')
  const [loading, setLoading] = useState(true)
  const [typed, setTyped] = useState('')
  const [fullText, setFullText] = useState('')
  const [index, setIndex] = useState(0)

  const speak = () => {
    if (!fullText) return
    const utter = new SpeechSynthesisUtterance(fullText)
    utter.lang = language === 'hi' ? 'hi-IN' : language === 'es' ? 'es-ES' : language === 'fr' ? 'fr-FR' : 'en-IN'
    speechSynthesis.speak(utter)
  }

  const fetchUser = async () => {
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

  const fetchSuggestion = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/ai/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ balance: remaining, username, gender, language }),
      })
      const data = await res.json()
      const suggestion = data?.answer || `${username}, FinBot is currently offline.`
      setFullText(suggestion)
      setTyped('')
      setIndex(0)
    } catch {
      setFullText(`${username}, FinBot is currently offline.`)
      setTyped('')
      setIndex(0)
    } finally {
      setLoading(false)
    }
  }

  const getGreeting = () => {
    const h = new Date().getHours()
    const map = {
      en: ['Good morning', 'Good afternoon', 'Good evening'],
      hi: ['सुप्रभात', 'शुभ अपराह्न', 'शुभ संध्या'],
      es: ['Buenos días', 'Buenas tardes', 'Buenas noches'],
      fr: ['Bonjour', 'Bon après-midi', 'Bonsoir'],
    }
    const t = h < 12 ? 0 : h < 17 ? 1 : 2
    return map[language][t]
  }

  useEffect(() => { fetchUser() }, [])
  useEffect(() => { if (username) fetchSuggestion() }, [remaining, username, language])
  useEffect(() => {
    if (!loading && fullText && index < fullText.length) {
      const timer = setTimeout(() => {
        setTyped((prev) => prev + fullText.charAt(index))
        setIndex((i) => i + 1)
      }, 14)
      return () => clearTimeout(timer)
    }
  }, [index, fullText, loading])

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl mx-auto rounded-2xl p-6 bg-[#0b0d10]/60 border border-white/10 backdrop-blur-lg shadow-[0_0_50px_#00FFF0]/10"
    >
      {/* Header */}
      <div className="flex justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <NeonAvatar initial={username[0] || 'U'} />
          <div>
            <p className="text-sm text-neutral-300">
              {getGreeting()}, <span className="font-semibold text-white">{username}</span> 👋
            </p>
            <h2 className="text-sm font-medium text-cyan-300 flex items-center gap-2 mt-1">
              <Brain size={16} /> AI Suggestion
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={speak} className="text-zinc-400 hover:text-cyan-400"><Volume2 size={18} /></button>
          <button onClick={fetchSuggestion} className="text-zinc-400 hover:text-blue-400"><RefreshCw size={18} /></button>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as any)}
            className="bg-zinc-800 border border-zinc-700 text-white text-xs px-2 py-1 rounded-md"
          >
            {LANGUAGES.map(lang => (
              <option key={lang.code} value={lang.code}>{lang.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Body */}
      <div className="mt-5">
        <div className="rounded-lg p-4 bg-black/40 border border-white/10 shadow-inner shadow-cyan-400/10 min-h-[80px] text-[15px] text-neutral-200 leading-relaxed font-light">
          {loading ? <GradientLoader /> : typed}
        </div>
      </div>
    </motion.div>
  )
}
