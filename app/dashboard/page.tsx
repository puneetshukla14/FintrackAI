'use client'

import React from 'react'
import SpendingTrendChart from '@/components/dashboard/SpendingTrendChart'
import Methodgraph from '@/components/dashboard/methodgraph'
import IncomeVsExpenseChart from '@/components/dashboard/IncomeVsExpenseChart'
import TopCategoriesChart from '@/components/dashboard/TopCategoriesChart'
import SavingsProgressChart from '@/components/dashboard/SavingsProgressChart'

export default function DashboardPage() {
  return (
    <main className="p-6 space-y-6">
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
        <div className="xl:max-w-[100%]">
          <SpendingTrendChart />
        </div>

        <div className="xl:max-w-[100%]">
          <Methodgraph /> {/* ✅ keep only this one */}
        </div>

        <IncomeVsExpenseChart />
        <TopCategoriesChart />
        <SavingsProgressChart />
      </section>
    </main>
  )
}
