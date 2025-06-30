'use client'

import React from 'react'
import SalaryCard from '@/components/dashboard/SalaryCard'

export default function DashboardPage() {
  return (
    <main className="min-h-screen p-6 bg-black flex justify-center items-center">
      <div className="w-full max-w-md bg-zinc-900 rounded-2xl p-5 shadow-lg">
        <SalaryCard />
      </div>
    </main>
  )
}
