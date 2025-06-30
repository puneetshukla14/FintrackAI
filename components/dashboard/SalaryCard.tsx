'use client'

import { motion, useAnimation } from 'framer-motion'
import { RotateCcw } from 'lucide-react'
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
      const [salaryRes, expenseRes, creditRes] = await Promise.all([
        fetch('/api/user/salary', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('/api/expenses', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('/api/credits', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])

      const salaryData = await salaryRes.json()
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

      const base = salaryData?.data?.salary || 0
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
      className="w-full bg-gradient-to-br from-zinc-900 to-black p-6 rounded-2xl shadow-2xl text-white"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-bold text-cyan-400">Savings Overview</h3>
          <p className="text-xs text-zinc-400">Real-time savings insights</p>
        </div>

        <motion.button
          onClick={handleRefresh}
          animate={iconControls}
          whileHover={{ scale: 1.1 }}
          className="text-purple-400 hover:text-purple-300 transition-colors"
        >
          <RotateCcw size={20} />
        </motion.button>
      </div>

      {/* Circular Progress */}
  
        <div className="flex justify-center items-center mt-6">
  <div className="relative w-36 h-36">
    {/* Background glow */}
    <div className="absolute inset-0 rounded-full bg-black/40 blur-2xl z-0" />

    {/* SVG circle with viewBox for proper centering */}
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
        style={{
          transition: 'stroke-dashoffset 1s ease-in-out',
          filter: 'drop-shadow(0 0 6px #0ea5e9)',
        }}
      />
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
    </svg>

    {/* Centered text container */}
    <div className="absolute inset-0 flex items-center justify-center z-20 text-center">
      <div className="flex flex-col items-center">
        <span className="text-white text-[1.8rem] font-mono font-extrabold leading-tight">
          {displayProgress}%
        </span>
        <span className="text-xs text-cyan-400 mt-[-7] font-medium opacity-90">
          <span className="text-base font-bold">₹</span> Saved
        </span>
      </div>
    </div>
  </div>
</div>


      {/* Stats Breakdown */}
      <div className="mt-6 space-y-2 text-sm text-slate-300 px-2">
        <div className="flex justify-between">
          <span>Base Salary</span>
          <span className="font-medium text-sky-400">
            ₹{baseSalary.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Added Money</span>
          <span className="font-medium text-green-400">
            + ₹{credits.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Total Funds</span>
          <span className="font-medium text-white">
            ₹{totalFunds.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Total Spent</span>
          <span className="font-medium text-rose-400">
            ₹{expenses.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Remaining</span>
          <span className="font-medium text-emerald-400">
            ₹{remaining.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Saving Tip */}
      {progress < 30 && (
        <p className="mt-4 text-xs text-amber-400 text-center italic">
          Tip: Try to save at least 50% of your funds this month!
        </p>
      )}
    </motion.div>
  )
}
