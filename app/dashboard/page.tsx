'use client'

import React, { useEffect, useState } from 'react'
import SmartSuggestionsCard from '@/components/dashboard/SmartSuggestionsCard'

export default function DashboardPage() {
  const [userSalary, setUserSalary] = useState(0)
  const [totalExpenses, setTotalExpenses] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [username, setUsername] = useState('Sir')

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
        const name = profileData?.profile?.fullName || 'Sir'

        setUserSalary(salary)
        setUsername(name)

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
        console.error('❌ Failed to fetch data:', err)
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
    <main className="p-6 space-y-6 bg-black min-h-screen">
      <section className="w-full max-w-xl mx-auto bg-zinc-900 rounded-2xl p-5 shadow-lg">
        <SmartSuggestionsCard remaining={remaining} username={username} />
      </section>
    </main>
  )
}
