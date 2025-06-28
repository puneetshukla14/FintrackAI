'use client'

import React, { useEffect, useState } from 'react'

import SalaryCard from '@/components/dashboard/SalaryCard'


// app/dashboard/page.tsx or wherever your dashboard is



import useAuth from '@/hooks/useAuth'

export default function DashboardPage() {
  const { loading, isLoggedIn } = useAuth()

  const [userSalary, setUserSalary] = useState(0)
  const [totalExpenses, setTotalExpenses] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token')

      try {
        // Get user profile (to get salary)
        const profileRes = await fetch('/api/user/profile', {
          headers: { Authorization: `Bearer ${token}` }
        })
        const profileData = await profileRes.json()
        const salary = profileData?.profile?.monthlySalary || 0
        setUserSalary(salary)

        // Get expenses
        const expenseRes = await fetch('/api/expenses', {
          headers: { Authorization: `Bearer ${token}` }
        })
        const expenses = await expenseRes.json()

        const total = Array.isArray(expenses)
          ? expenses.reduce((sum, item) => sum + (item.amount || 0), 0)
          : 0

        setTotalExpenses(total)
      } catch (error) {
        console.error('Failed to fetch salary/expenses:', error)
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

  if (!isLoggedIn) return null

  return (
    <main className="p-6 space-y-6">
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* 👇 Cards */}
        <div className="w-full aspect-square bg-zinc-900 rounded-2xl p-5 shadow-lg flex flex-col">
          <SalaryCard />
        </div>


      </section>
    </main>
  )
}
