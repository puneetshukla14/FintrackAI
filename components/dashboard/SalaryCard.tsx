'use client'

import { motion, useAnimation } from 'framer-motion'
import {
  RotateCcw,
  Briefcase,
  Wallet,
  Banknote,
  CreditCard,
  PiggyBank,
} from 'lucide-react'
import { useEffect, useState } from 'react'

export default function SavingsProgressChart() {
  const [baseSalary, setBaseSalary] = useState(0)
  const [credits, setCredits] = useState(0)
  const [expenses, setExpenses] = useState(0)
  const [progress, setProgress] = useState(0)
  const [displayProgress, setDisplayProgress] = useState(0)

  const iconControls = useAnimation()
  const strokeControls = useAnimation()

const fetchData = async () => {
  const token = localStorage.getItem('token') || ''
  try {
    const [profileRes, expenseRes, creditRes] = await Promise.all([
      fetch('/api/user/profile', {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch('/api/expenses', {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch('/api/credits', {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ])

    const profileData = await profileRes.json()
    const expensesData = await expenseRes.json()
    const creditsData = await creditRes.json()

    const expenseList = Array.isArray(expensesData)
      ? expensesData
      : expensesData?.data || []

    const creditList = Array.isArray(creditsData)
      ? creditsData
      : creditsData?.data || []

    const totalExpense = expenseList.reduce(
      (sum: number, item: any) => sum + (item.amount || 0),
      0
    )
    const totalCredit = creditList.reduce(
      (sum: number, item: any) => sum + (item.amount || 0),
      0
    )

    const base = profileData?.profile?.bankBalance || 0
    const totalFunds = base + totalCredit
    const remaining = Math.max(totalFunds - totalExpense, 0)
    const percentage = totalFunds > 0 ? (remaining / totalFunds) * 100 : 0

    setBaseSalary(base)
    setCredits(totalCredit)
    setExpenses(totalExpense)
    setProgress(Math.round(percentage))
  } catch (err) {
    console.error('Failed to fetch data:', err)
  }
}


  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    let start = 0
    const duration = 1000
    const increment = progress / (duration / 20)
    const counter = setInterval(() => {
      start += increment
      if (start >= progress) {
        start = progress
        clearInterval(counter)
      }
      setDisplayProgress(Math.round(start))
    }, 20)

    const offset = 377 - (377 * progress) / 100
    strokeControls.start({
      strokeDashoffset: offset,
      transition: { duration: 1, ease: 'easeInOut' },
    })

    return () => clearInterval(counter)
  }, [progress])

  const handleRefresh = async () => {
    iconControls.start({
      rotate: 360,
      transition: { duration: 0.6, ease: 'easeInOut' },
    })
    await fetchData()
    iconControls.set({ rotate: 0 })
  }

  const totalFunds = baseSalary + credits
  const remaining = totalFunds - expenses

  return (
<motion.div
  className="w-full min-h-screen sm:min-h-[600px] bg-gradient-to-br from-[#0e0e0f] to-[#1a1a1d] rounded-none sm:rounded-3xl px-4 py-6 sm:p-8 shadow-none sm:shadow-[0_0_30px_rgba(0,255,255,0.05)] text-white backdrop-blur-xl border-none sm:border sm:border-zinc-800"
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
<h3 className="text-xl font-bold text-cyan-400 tracking-wide font-sans">
  Savings Overview
</h3>

          <p className="text-sm text-zinc-400">
            Your current financial snapshot
          </p>
        </div>
        <motion.button
          onClick={handleRefresh}
          animate={iconControls}
          whileHover={{ scale: 1.1 }}
          className="text-purple-400 hover:text-purple-300 transition-colors"
        >
          <RotateCcw size={22} />
        </motion.button>
      </div>

      {/* Progress Circle */}
      <div className="flex justify-center items-center mt-6">
        <div className="relative w-44 h-44">
          <div className="absolute inset-0 rounded-full bg-cyan-900/10 blur-2xl z-0 shadow-[0_0_30px_#06b6d4aa]" />
          <svg className="w-full h-full rotate-[-90deg] relative z-10" viewBox="0 0 144 144">
            <circle
              cx="72"
              cy="72"
              r="60"
              className="stroke-zinc-800"
              strokeWidth="10"
              fill="none"
            />
            <motion.circle
              cx="72"
              cy="72"
              r="60"
              stroke="url(#gradient)"
              strokeWidth="10"
              fill="none"
              strokeDasharray="377"
              strokeDashoffset="377"
              strokeLinecap="round"
              animate={strokeControls}
              style={{ filter: 'drop-shadow(0 0 6px #0ea5e9)' }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center z-20 text-center">
            <div className="flex flex-col items-center">
<motion.span
  className="text-[2rem] font-sans font-medium tracking-normal leading-snug text-white"
  animate={{ scale: [1, 1.04, 1] }}
  transition={{ repeat: Infinity, duration: 2 }}
>
  {displayProgress}%
</motion.span>



              <span className="text-sm text-cyan-400 font-medium">Saved</span>
            </div>
          </div>
        </div>
      </div>
{/* Stats */}
<div className="mt-10 space-y-5 text-sm text-slate-300 px-2 sm:px-6">

  <div className="flex justify-between items-center border-b border-zinc-700 pb-1">
    <div className="flex items-center gap-2">
      <Wallet size={16} className="text-zinc-400" />
      <span>Bank Balance</span>
    </div>
<span className="text-white font-sans font-medium text-sm sm:text-base">
  ₹{baseSalary.toLocaleString()}
</span>

  </div>
  <div className="flex justify-between items-center border-b border-zinc-700 pb-1">
    <div className="flex items-center gap-2">
      <PiggyBank size={16} className="text-zinc-400" />
      <span>Added Money</span>
    </div>
    <span className="font-medium text-green-400">+ ₹{credits.toLocaleString()}</span>
  </div>
  <div className="flex justify-between items-center border-b border-zinc-700 pb-1">
    <div className="flex items-center gap-2">
      <Banknote size={16} className="text-zinc-400" />
      <span>Total Funds</span>
    </div>
    <span className="font-medium text-white">₹{totalFunds.toLocaleString()}</span>
  </div>
  <div className="flex justify-between items-center border-b border-zinc-700 pb-1">
    <div className="flex items-center gap-2">
      <CreditCard size={16} className="text-zinc-400" />
      <span>Total Spent</span>
    </div>
    <span className="font-medium text-rose-400">₹{expenses.toLocaleString()}</span>
  </div>
  <div className="flex justify-between items-center">
    <div className="flex items-center gap-2">
      <Briefcase size={16} className="text-zinc-400" />
      <span>Remaining</span>
    </div>
    <span className="font-medium text-emerald-400">₹{remaining.toLocaleString()}</span>
  </div>
</div>


{/* Goal Progress */}
<div className="mt-6 px-2">
  <p className="text-xs text-zinc-400 mb-1">
    Monthly Goal: <span className="text-white font-medium">₹20,000</span>
  </p>
  <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
    <motion.div
      className="h-full bg-gradient-to-r from-green-400 via-yellow-400 to-pink-500"
      initial={{ width: 0 }}
      animate={{ width: `${Math.min((remaining / 20000) * 100, 100)}%` }}
      transition={{ duration: 1 }}
    />
  </div>
  <p className="text-[11px] text-cyan-300 mt-1">
    {Math.round((remaining / 20000) * 100)}% of goal achieved
  </p>
</div>


    </motion.div>
  )
}
