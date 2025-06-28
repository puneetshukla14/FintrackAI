'use client'

import React, { useEffect, useState } from 'react'
import jsPDF from 'jspdf'
import { FaDownload } from 'react-icons/fa6'
import SalaryCard from '@/components/dashboard/SalaryCard'

interface Expense {
  amount: number
  description: string
  category?: string
  date: string
}

export default function DashboardPage() {
  const [userSalary, setUserSalary] = useState(0)
  const [totalExpenses, setTotalExpenses] = useState(0)
  const [expenses, setExpenses] = useState<Expense[]>([])
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

        const expensesData = await expenseRes.json()
        const total = Array.isArray(expensesData)
          ? expensesData.reduce((sum, item) => sum + (item.amount || 0), 0)
          : 0

        setTotalExpenses(total)
        setExpenses(expensesData || [])
      } catch (error) {
        console.error('Failed to fetch data:', error)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handlePDFDownload = () => {
    const doc = new jsPDF()
    doc.setFontSize(18)
    doc.text('💸 Expense Report', 20, 20)

    let y = 30
    expenses.forEach((exp, i) => {
      doc.setFontSize(12)
      doc.text(
        `${i + 1}. ₹${exp.amount} | ${exp.category || 'Other'} | ${exp.description} | ${exp.date?.slice(0, 10)}`,
        20,
        y
      )
      y += 10
      if (y > 280) {
        doc.addPage()
        y = 20
      }
    })

    doc.save('My_Expense_Report.pdf')
  }

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
          <SalaryCard salary={userSalary} totalExpenses={totalExpenses} />
        </div>
      </section>

      <div className="flex justify-end">
        <button
          onClick={handlePDFDownload}
          className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-lg shadow-md hover:from-blue-700 hover:to-cyan-600 transition-all"
        >
          <FaDownload className="text-lg" />
          Export Your Expenses
        </button>
      </div>
    </main>
  )
}
