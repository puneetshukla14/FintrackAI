'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { onHeaderUpdate } from '@/lib/events'

type Data = {
  currentBalance: number
  totalSavings: number
  totalExpenses: number
}

export default function Header() {
  const [data, setData] = useState<Data | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      const res = await fetch('/api/summary', {
        credentials: 'include',
      })
      const json = await res.json()
      if (json.success && json.data) {
        setData(json.data)
      }
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()

    const unsubscribe = onHeaderUpdate(() => {
      console.log('[Header] Update triggered')
      fetchData()
    })

    return () => unsubscribe()
  }, [])

  return (
    <div className="w-full h-28 flex items-center justify-center px-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 250, damping: 18 }}
        className="flex items-center justify-center gap-6 bg-white/5 backdrop-blur-lg text-white px-5 py-2 rounded-full shadow-lg border border-white/10"
      >
        {loading || !data ? (
          <p className="text-sm text-gray-300 animate-pulse">Loading...</p>
        ) : (
          <>
            {/* Current Balance */}
            <div className="text-center">
              <p className="text-[10px] text-gray-300 tracking-wide">Current Balance</p>
              <p className="text-sm font-medium text-cyan-400 leading-tight">
                ₹{data.currentBalance.toLocaleString('en-IN')}
              </p>
            </div>

            <div className="w-px h-5 bg-white/15" />

            {/* Total Savings */}
            <div className="text-center">
              <p className="text-[10px] text-gray-300 tracking-wide">Total Savings</p>
              <p className="text-sm font-medium text-green-400 leading-tight">
                ₹{data.totalSavings.toLocaleString('en-IN')}
              </p>
            </div>
          </>
        )}
      </motion.div>
    </div>
  )
}
