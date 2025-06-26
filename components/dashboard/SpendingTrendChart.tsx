'use client'

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { useEffect, useState } from 'react'
import clsx from 'clsx'

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip)

const TIME_OPTIONS = ['Day', 'Week', 'Month', 'Year'] as const
type TimeOption = typeof TIME_OPTIONS[number]

const RANGE_COUNT: Record<TimeOption, number> = {
  Day: 24,      // 24 hours
  Week: 7,      // 7 days
  Month: 30,    // 30 days
  Year: 12,     // 12 months
}

type Expense = {
  amount: number
  date: string
}

export default function TrendChartDark() {
  const [selectedRange, setSelectedRange] = useState<TimeOption>('Week')
  const [labels, setLabels] = useState<string[]>([])
  const [dataPoints, setDataPoints] = useState<number[]>([])

const fetchAndProcessData = async () => {
  try {
    const token = localStorage.getItem('token') // ⬅️ get token from local storage
    const res = await fetch('/api/expenses', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!res.ok) {
      console.error('❌ Failed to fetch expenses:', res.status)
      return
    }

    const rawExpenses: Expense[] = await res.json()

    if (!Array.isArray(rawExpenses)) {
      console.error('❌ Invalid response format:', rawExpenses)
      return
    }

    // 👇 rest of your grouping + chart logic here
    const now = new Date()
    const grouped: Record<string, number> = {}

    for (let i = 0; i < RANGE_COUNT[selectedRange]; i++) {
      const date = new Date(now)
      if (selectedRange === 'Day') date.setHours(now.getHours() - (RANGE_COUNT[selectedRange] - i - 1))
      else if (selectedRange === 'Week' || selectedRange === 'Month') date.setDate(now.getDate() - (RANGE_COUNT[selectedRange] - i - 1))
      else if (selectedRange === 'Year') date.setMonth(now.getMonth() - (RANGE_COUNT[selectedRange] - i - 1))

      const key =
        selectedRange === 'Day'
          ? date.getHours().toString()
          : selectedRange === 'Year'
          ? `${date.getFullYear()}-${date.getMonth()}`
          : date.toDateString()

      grouped[key] = 0
    }

    for (const expense of rawExpenses) {
      const d = new Date(expense.date)
      const key =
        selectedRange === 'Day'
          ? d.getHours().toString()
          : selectedRange === 'Year'
          ? `${d.getFullYear()}-${d.getMonth()}`
          : d.toDateString()

      if (key in grouped) {
        grouped[key] += expense.amount
      }
    }

    const newLabels = Object.keys(grouped).map((key) => {
      const parts = key.split('-')

      if (selectedRange === 'Day') return `${key}:00`
      if (selectedRange === 'Year') {
        const month = new Date(Number(parts[0]), Number(parts[1])).toLocaleString('en-US', {
          month: 'short',
          year: '2-digit',
        })
        return month
      }
      return new Date(key).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' })
    })

    const newData = Object.values(grouped)

    setLabels(newLabels)
    setDataPoints(newData)
  } catch (err) {
    console.error('❌ Error loading expenses:', err)
  }
}


  useEffect(() => {
    fetchAndProcessData()
  }, [selectedRange])

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Spending',
        data: dataPoints,
        borderColor: '#3b82f6',
        tension: 0.4,
        fill: false,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#9ca3af' },
      },
      y: {
        grid: { color: '#27272a' },
        ticks: { color: '#9ca3af' },
      },
    },
    plugins: {
      legend: { display: false },
    },
  }






return (
  <div className="w-full max-w-2xl mx-auto bg-[#1f1f1f] rounded-2xl border border-neutral-800 shadow-lg p-6 sm:p-8 h-[450px]">
    {/* Filter Buttons */}
    <div className="flex flex-wrap justify-center md:justify-end gap-2 mb-4">
      {TIME_OPTIONS.map((range) => (
        <button
          key={range}
          onClick={() => setSelectedRange(range)}
          className={clsx(
            'px-4 py-1.5 text-sm font-medium rounded-full border transition-all duration-200',
            selectedRange === range
              ? 'bg-blue-600 text-white border-blue-500 shadow-md'
              : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700'
          )}
        >
          {range}
        </button>
      ))}
    </div>

    {/* Title */}
    <h2 className="text-xl font-semibold text-white mb-2">Spending Trend</h2>

    {/* Chart */}
    <div className="h-[300px]">
      <Line data={chartData} options={chartOptions} />
    </div>
  </div>
)

}