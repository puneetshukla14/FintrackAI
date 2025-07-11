'use client'

import React, { useEffect, useState } from 'react'
import {
  format,
  startOfYear,
  endOfYear,
  eachDayOfInterval,
  getMonth,
  getYear,
  parseISO,
} from 'date-fns'
import clsx from 'clsx'
import { motion } from 'framer-motion'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { CalendarDays, Sparkles, X } from 'lucide-react'

// ✅ Modal Component
const Modal = ({ onClose, children }: { onClose: () => void; children: React.ReactNode }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
    <div className="bg-neutral-900 w-full max-w-md rounded-lg p-6 shadow-2xl relative text-white">
      <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-red-500">
        <X size={18} />
      </button>
      {children}
    </div>
  </div>
)

const generateMonthlyInsights = (expenses: { date: string; amount: number }[]) => {
  if (!expenses.length) return 'No expenses found for this year.'
  const totals = Array(12).fill(0)
  expenses.forEach(exp => {
    const date = new Date(exp.date)
    if (!isNaN(date.getTime())) {
      const month = getMonth(date)
      totals[month] += exp.amount || 0
    }
  })
  const maxMonth = totals.indexOf(Math.max(...totals))
  const minMonth = totals.indexOf(Math.min(...totals))
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `Highest in ${months[maxMonth]}, Lowest in ${months[minMonth]}. Maintain balance!`
}

interface Expense {
  date: string
  amount: number
  category?: string
  paymentMethod?: string
  description?: string
}

interface ExpenseMap {
  [key: string]: Expense[]
}

export default function CalendarCard() {
  const [year, setYear] = useState<number>(new Date().getFullYear())
  const [dailyExpenses, setDailyExpenses] = useState<ExpenseMap>({})
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [aiSuggestions, setAiSuggestions] = useState<string>('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [paymentFilter, setPaymentFilter] = useState('')

  useEffect(() => {
    const fetchExpenses = async () => {
      const token = localStorage.getItem('token')
      try {
        const res = await fetch('/api/expenses', {
          headers: { Authorization: `Bearer ${token}` },
        })
        const allExpenses: Expense[] = await res.json()

        const filtered = allExpenses.filter(exp => {
          const date = parseISO(exp.date)
          return getYear(date) === year &&
            (!categoryFilter || exp.category === categoryFilter) &&
            (!paymentFilter || exp.paymentMethod === paymentFilter)
        })

        const map: ExpenseMap = {}
        filtered.forEach(exp => {
          const key = format(new Date(exp.date), 'yyyy-MM-dd')
          if (!map[key]) map[key] = []
          map[key].push(exp)
        })

        setDailyExpenses(map)
        setAiSuggestions(generateMonthlyInsights(filtered))
      } catch (err) {
        console.error('Failed to load expenses', err)
      }
    }

    fetchExpenses()
  }, [year, categoryFilter, paymentFilter])

  const startDate = startOfYear(new Date(year, 0, 1))
  const endDate = endOfYear(new Date(year, 11, 31))
  const allDates = eachDayOfInterval({ start: startDate, end: endDate })

  const getColor = (amount: number) => {
    if (amount === 0) return 'bg-zinc-800'
    if (amount < 100) return 'bg-green-200'
    if (amount < 300) return 'bg-green-400'
    return 'bg-green-600'
  }

  const exportToPDF = async () => {
    const element = document.getElementById('calendar')
    if (!element) return

    const canvas = await html2canvas(element, { scale: 2 })
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [canvas.width, canvas.height],
    })
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height)
    pdf.save(`expenses-${year}.pdf`)
  }

  return (
    <div className="bg-zinc-900 p-5 rounded-2xl shadow-lg h-full space-y-4 w-full overflow-x-auto" id="calendar">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <h2 className="text-white text-xl font-bold flex items-center gap-2">
          <CalendarDays size={20} /> Yearly Expense Calendar
        </h2>
        <div className="flex flex-col sm:flex-row gap-2">
          <select
            className="bg-zinc-800 text-white px-2 py-1 rounded border border-zinc-700"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
          >
            {[year - 2, year - 1, year, year + 1].map(yr => (
              <option key={yr} value={yr}>{yr}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Category"
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="bg-zinc-800 text-white px-2 py-1 rounded border border-zinc-700"
          />
          <input
            type="text"
            placeholder="Payment Method"
            value={paymentFilter}
            onChange={e => setPaymentFilter(e.target.value)}
            className="bg-zinc-800 text-white px-2 py-1 rounded border border-zinc-700"
          />
          <button
            onClick={exportToPDF}
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          >
            Export PDF
          </button>
        </div>
      </div>

      {/* Calendar */}
      <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2">
        {Array.from({ length: 12 }).map((_, month) => {
          const monthDates = allDates.filter(d => getMonth(d) === month)
          return (
            <div key={month} className="flex flex-col items-center">
              <span className="text-xs text-white/60 mb-1">
                {format(new Date(year, month, 1), 'MMM')}
              </span>
              <div className="grid grid-cols-7 gap-[2px]">
                {monthDates.map((date, i) => {
                  const key = format(date, 'yyyy-MM-dd')
                  const total = (dailyExpenses[key] || []).reduce((acc, cur) => acc + cur.amount, 0)
                  return (
                    <motion.div
                      key={key}
                      onClick={() => setSelectedDay(key)}
                      className={clsx(
                        'w-[14px] h-[14px] rounded-sm border border-zinc-700 cursor-pointer hover:scale-125 transition-all duration-300 hover:shadow-md',
                        getColor(total)
                      )}
                      title={`₹${total} on ${key}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.005 }}
                    />
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* AI Suggestion */}
      <div className="mt-4 text-sm text-white/80 bg-zinc-800 p-4 rounded-md">
        <p className="text-white font-semibold mb-2 flex items-center gap-2">
          <Sparkles size={16} /> AI Suggestion:
        </p>
        {aiSuggestions.split('. ').map((line, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.3 }}
          >
            {line.trim().replace('.', '')}.
          </motion.p>
        ))}
      </div>

      {/* Modal */}
      {selectedDay && (
        <Modal onClose={() => setSelectedDay(null)}>
          <h2 className="text-lg font-bold text-white mb-2">Expenses on {selectedDay}</h2>
          <ul className="text-white/90 space-y-2 max-h-60 overflow-y-auto">
            {(dailyExpenses[selectedDay] || []).map((exp, idx) => (
              <li key={idx} className="border-b border-zinc-700 pb-1">
                ₹{exp.amount} — {exp.description || 'No description'}
              </li>
            ))}
          </ul>
        </Modal>
      )}
    </div>
  )
}
