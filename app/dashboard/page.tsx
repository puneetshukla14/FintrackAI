'use client'

import React, { useEffect, useState } from 'react'
import SmartSuggestionsCard from '@/components/dashboard/SmartSuggestionsCard'

import SalaryCard from '@/components/dashboard/SalaryCard'
import CalendarCard from '@/components/dashboard/CalendarCard'
import ExpenseCategoryCard from '@/components/dashboard/ExpenseCategoryCard'


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
      <div className="min-h-screen flex justify-center items-center text-white bg-black">
        Loading...
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center text-red-400 bg-black">
        Failed to load dashboard.
      </div>
    )
  }

  const remaining = userSalary - totalExpenses

  return (
<main className="p-6 space-y-6 xl:pl-[5.5rem]">

<section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
    {/* 👇 Salary Card - Normal width */}
    <div className="w-full bg-zinc-900 rounded-2xl p-5 shadow-lg h-full">
      <SalaryCard />
    </div>

{/* 👇 AI Suggestions Card - Wider on desktop, content-height based */} 
<div className="w-full bg-zinc-900 rounded-2xl p-5 shadow-lg xl:col-span-2">
  <SmartSuggestionsCard remaining={remaining} />
</div>



        <div className="w-full bg-zinc-900 rounded-2xl p-5 shadow-lg xl:col-span-3 h-full">
      <CalendarCard />
    </div>


{/* 👇 Expense Breakdown Card - Full width */}
<div className="w-full bg-zinc-900 rounded-2xl p-5 shadow-lg xl:col-span-3">
  <ExpenseCategoryCard />
</div>



    
  </section>
</main>
  )
}
