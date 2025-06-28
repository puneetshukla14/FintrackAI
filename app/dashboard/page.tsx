'use client'

import React, { useEffect, useState } from 'react'
import SalaryCard from '@/components/dashboard/SalaryCard'

export default function DashboardPage() {
  const [userSalary, setUserSalary] = useState(0)
  const [totalExpenses, setTotalExpenses] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ No Authorization header — cookies are used
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
      } catch (error) {
        console.error('Failed to fetch data:', error)
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

  return (
    <main className="p-6 space-y-6">
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div className="w-full aspect-square bg-zinc-900 rounded-2xl p-5 shadow-lg flex flex-col">
          <SalaryCard />
        </div>
      </section>
    </main>
  )
}
