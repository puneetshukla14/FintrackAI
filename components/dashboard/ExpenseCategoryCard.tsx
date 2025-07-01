'use client'

import React, { useEffect, useState, useRef } from 'react'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { motion, useInView } from 'framer-motion'
import {
  FiDownload,
  FiDollarSign,
  FiHome,
  FiShoppingBag,
  FiActivity,
  FiHeart,
  FiBookOpen,
  FiGift,
  FiBox,
  FiCloud,
  FiBriefcase,
  FiSmile,
  FiUsers
} from 'react-icons/fi'
import { saveAs } from 'file-saver'
// @ts-expect-error: react-csv has no types
import { CSVLink } from 'react-csv'
import clsx from 'clsx'

ChartJS.register(ArcElement, Tooltip, Legend)

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Groceries: <FiShoppingBag />, Dining: <FiSmile />,
  Rent: <FiHome />, Travel: <FiActivity />,
  Education: <FiBookOpen />, Bills: <FiDollarSign />,
  Entertainment: <FiGift />, Shopping: <FiBox />,
  Health: <FiHeart />, Fitness: <FiActivity />,
  Finance: <FiBriefcase />, Subscriptions: <FiCloud />,
  Pets: <FiUsers />, Kids: <FiSmile />,
  PersonalCare: <FiHeart />, Gifts: <FiGift />,
  Donations: <FiDollarSign />, Other: <FiBox />,
}

export default function ExpenseCategoryCard() {
  const [expenses, setExpenses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true })

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await fetch('/api/expenses', {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        if (Array.isArray(data)) setExpenses(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchExpenses()
  }, [])

  useEffect(() => {
    setDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches)
  }, [])

  const categorize = (desc: string) => {
    return 'Other'
  }

  const totals: Record<string, number> = {}
  expenses.forEach(exp => {
    const cat = exp.category || categorize(exp.description)
    totals[cat] = (totals[cat] || 0) + (exp.amount || 0)
  })

  const rows = Object.entries(totals).sort((a, b) => b[1] - a[1])
  const totalSpent = rows.reduce((sum, [, a]) => sum + a, 0)

  const chartData = {
    labels: rows.map(([name]) => name),
    datasets: [
      {
        data: rows.map(([, value]) => value),
        backgroundColor: [
          '#38bdf8', '#a78bfa', '#fb923c',
          '#34d399', '#f472b6', '#60a5fa',
        ],
        borderColor: darkMode ? '#1f2937' : '#f9fafb',
        borderWidth: 2
      }
    ]
  }

  const csvData = [['Category', 'Amount'], ...rows.map(([c, a]) => [c, a])]

return (
  <section
    ref={sectionRef}
    className={clsx(
      'p-6 md:p-10 rounded-3xl shadow-2xl border backdrop-blur-2xl transition-all',
      darkMode
        ? 'bg-zinc-900/60 border-zinc-800 text-white'
        : 'bg-white/80 border-zinc-200 text-black'
    )}
  >
    <motion.h2
      initial={{ opacity: 0, y: -10 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      className="text-3xl font-semibold tracking-tight mb-8"
    >
      Expense Overview
    </motion.h2>

    {loading ? (
      <p className="text-center text-gray-400">Fetching data...</p>
    ) : rows.length === 0 ? (
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        className="text-center p-8 rounded-xl border border-dashed bg-white/10"
      >
        <p className="text-xl font-semibold">Welcome!</p>
        <p className="text-gray-500 mt-2">Add your expenses to begin.</p>
      </motion.div>
    ) : (
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Chart Section */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative w-full md:w-1/2 flex items-center justify-center"
        >
          <div className={clsx(
            "relative w-full max-w-[340px] aspect-square p-6 rounded-[2rem]",
            "shadow-[0_4px_30px_rgba(0,0,0,0.15)] backdrop-blur-lg border border-white/10",
            darkMode ? "bg-zinc-800" : "bg-white/5"
          )}>
            <Doughnut
              data={chartData}
              options={{
                cutout: '70%',
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    callbacks: {
                      label: (ctx) => `₹ ${ctx.parsed.toLocaleString('en-IN')}`,
                    },
                    backgroundColor: '#111',
                    titleColor: '#fff',
                    bodyColor: '#ccc',
                  },
                },
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xs text-gray-400 tracking-wide uppercase">
                Total Spent
              </span>
              <span className="text-3xl font-semibold tracking-tight text-emerald-400">
                ₹{totalSpent.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Category Cards */}
        <motion.ul
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="w-full md:w-1/2 max-h-[320px] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-600 space-y-4"
        >
          {rows.map(([cat, amt]) => (
            <li
              key={cat}
              className={clsx(
                "flex items-center justify-between p-4 rounded-xl transition-all backdrop-blur border border-white/10",
                darkMode ? "bg-zinc-800 hover:bg-zinc-700" : "bg-white/5 hover:bg-white/10"
              )}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{CATEGORY_ICONS[cat] || <FiBox />}</span>
                <span className="text-base font-medium">{cat}</span>
              </div>
              <span className="text-emerald-400 font-semibold tracking-tight">
                ₹{amt.toFixed(2)}
              </span>
            </li>
          ))}
        </motion.ul>
      </div>
    )}

    {/* Export Buttons */}
    <div className="mt-10 flex flex-wrap justify-end gap-4">
      <CSVLink
        data={csvData}
        filename="expenses.csv"
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border border-gray-400 hover:border-gray-600 backdrop-blur bg-white/10 transition"
      >
        <FiDownload /> Export CSV
      </CSVLink>
      <button
        onClick={() => {
          const content = csvData.map(row => row.join(',')).join('\n')
          const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
          saveAs(blob, 'expenses.csv')
        }}
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border border-gray-400 hover:border-gray-600 backdrop-blur bg-white/10 transition"
      >
        <FiDownload /> Save CSV
      </button>
    </div>
  </section>
)

}
