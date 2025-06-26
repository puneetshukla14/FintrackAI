'use client'

import { useEffect, useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts'
import { motion } from 'framer-motion'


const MAIN_COLOR = '#0ea5e9'
const GRADIENT_ID = 'mainBarGradient'

export default function CategoryChart() {
  const [data, setData] = useState<{ name: string; value: number }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await fetch('/api/categories', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const result = await res.json()
        if (res.ok) {
          const sortedData = result.data.sort((a: any, b: any) => a.value - b.value)
          setData(sortedData)
        } else {
          console.error(result.error)
        }
      } catch (err) {
        console.error('Error fetching category chart:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <p className="text-center text-slate-400">Loading insights...</p>
  if (!data.length) return <p className="text-center text-slate-400">No data found</p>

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="bg-gradient-to-br from-zinc-900 to-black p-6 rounded-2xl shadow-2xl text-white"
    >
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-sky-400 to-cyan-500 bg-clip-text text-transparent">
          Spending by Category
        </h2>
        <p className="text-sm text-slate-400 mt-1">Visualize where your money goes</p>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 10, right: 20, left: 50, bottom: 10 }}
          barCategoryGap="3%"
          barGap={0}
        >
          {/* Gradient Definition */}
          <defs>
            <linearGradient id={GRADIENT_ID} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#0ea5e9" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>

          <XAxis type="number" stroke="#94a3b8" fontSize={12} />
          <YAxis
            dataKey="name"
            type="category"
            stroke="#94a3b8"
            width={120}
            fontSize={13}
          />

          <Tooltip
            cursor={{ fill: 'transparent' }}
            contentStyle={{
              backgroundColor: '#1e293b',
              borderRadius: 8,
              border: 'none',
              color: '#fff',
            }}
            formatter={(value: number) => [`₹${value}`, 'Spent']}
          />

          <Bar dataKey="value" barSize={18} radius={[6, 6, 6, 6]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={`url(#${GRADIENT_ID})`}
                style={{
                  transition: 'all 0.3s ease',
                  outline: 'none',
                }}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Custom legend */}
      <div className="mt-6 px-2 space-y-2">
        {data.map((item, idx) => (
          <div key={idx} className="flex justify-between text-sm text-slate-300">
            <span>{item.name}</span>
            <span className="text-sky-400 font-semibold">₹{item.value}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
