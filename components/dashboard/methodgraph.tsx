'use client'

import React, { useEffect, useState } from 'react'
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  CartesianGrid,
} from 'recharts'

const colors: Record<string, string> = {
  Cash: '#10B981',
  Card: '#3B82F6',
  UPI: '#F59E0B',
  Wallet: '#EF4444',
  'Bank Transfer': '#6366F1',
  Other: '#8B5CF6',
}

const paymentMethods = ['Cash', 'Card', 'UPI', 'Wallet', 'Bank Transfer', 'Other']

export default function MethodGraph() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/wallet')
        const json = await res.json()

        const formatted = paymentMethods.map((method) => ({
          name: method,
          amount: Number(json.data[method] || 0),
        }))

        setData(formatted)
      } catch (err) {
        console.error('❌ Error loading data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="bg-[#1f1f1f] rounded-2xl border border-neutral-800 shadow-lg p-6 sm:p-8 w-[100%] max-w-[640px] h-[450px] mx-auto flex flex-col justify-between">
      {/* Title */}
      <h3 className="text-white text-xl font-semibold mb-2">
        Spending by Payment Method
      </h3>

      {/* Chart */}
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <defs>
              {paymentMethods.map((method) => (
                <linearGradient id={`color-${method}`} key={method} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors[method]} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={colors[method]} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="name" stroke="#aaa" tickLine={false} />
            <YAxis stroke="#aaa" tickFormatter={(v) => `₹${v / 1000}k`} />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null
                const item = payload[0].payload
                return (
                  <div className="bg-[#1e1e1e] text-white rounded-md p-2 shadow border border-neutral-700">
                    <div className="text-sm font-medium">{item.name}</div>
                    <div className="text-xs">₹{item.amount.toLocaleString()}</div>
                  </div>
                )
              }}
            />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="#3B82F6"
              fill="url(#color-Card)"
              fillOpacity={1}
              isAnimationActive
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-300">
        {paymentMethods.map((method) => (
          <div key={method} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[method] }}></span>
            <span>{method}</span>
          </div>
        ))}
      </div>
    </div>
  )
}