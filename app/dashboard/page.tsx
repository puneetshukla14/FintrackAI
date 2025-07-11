'use client'

import React, { useEffect, useState } from 'react'
import SmartSuggestionsCard from '@/components/dashboard/suggestioncard/SmartSuggestionsCard'
import SalaryCard from '@/components/dashboard/SalaryCard'
import CalendarCard from '@/components/dashboard/CalendarCard'
import ExpenseCategoryCard from '@/components/dashboard/ExpenseCategoryCard'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

export default function DashboardPage() {
  const [userSalary, setUserSalary] = useState(0)
  const [totalExpenses, setTotalExpenses] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchData = async () => {  
      try {
        const profileRes = await fetch('/api/user/profile', {
          method: 'GET',
          credentials: 'include',
        })

        if (profileRes.status === 401) {
          window.location.href = '/sign-in'
          return
        }

        const profileData = await profileRes.json()
        const salary = profileData?.profile?.monthlySalary || 0
        setUserSalary(salary)
 
        const expenseRes = await fetch('/api/expenses', {
          method: 'GET',
          credentials: 'include',
        })

        const expenses = await expenseRes.json()
        const total = Array.isArray(expenses)
          ? expenses.reduce((sum, item) => sum + (item.amount || 0), 0)
          : 0

        setTotalExpenses(total)
      } catch (err) {
        console.error('❌ Failed to fetch dashboard data:', err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col gap-2 justify-center items-center bg-zinc-950 text-white">
        <Loader2 className="animate-spin w-6 h-6 text-emerald-400" />
        <span className="text-sm text-zinc-400">Loading dashboard...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center text-red-400 bg-zinc-950">
        <p className="text-lg font-medium">Something went wrong. Try refreshing the page.</p>
      </div>
    )
  }

  const remaining = userSalary - totalExpenses

  return (
    <main className="min-h-screen px-4 sm:px-6 space-y-6 xl:pl-[5.5rem] bg-gradient-to-br from-zinc-950 to-zinc-900 text-white">

<motion.section
  initial={{ opacity: 0, y: 15 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4, ease: 'easeOut' }}
  className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-y-6 gap-x-4"
>


        {/* Salary Card */}
        <div className="w-full bg-zinc-900 rounded-3xl p-6 shadow-[0_0_30px_rgba(0,255,255,0.03)] border border-zinc-800 backdrop-blur-md">

          <SalaryCard />
        </div>

        {/* AI Suggestions */}
        <div className="w-full bg-zinc-900 rounded-3xl p-6 shadow-[0_0_30px_rgba(0,255,255,0.03)] border border-zinc-800 backdrop-blur-md">
          <SmartSuggestionsCard remaining={remaining} />
        </div>

        {/* Calendar */}
        <div className="w-full bg-zinc-900 rounded-2xl p-5 shadow-lg xl:col-span-3 h-full">
          <CalendarCard />
        </div>

        {/* Expense Category Breakdown */}
        <div className="w-full bg-zinc-900 rounded-2xl p-5 shadow-lg xl:col-span-3">
          <ExpenseCategoryCard />
        </div>
      </motion.section>
    </main>
  )
}
