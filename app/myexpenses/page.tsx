'use client'

import ExpensesTable from '@/components/expenses/ExpensesTable'

export default function MyExpensesPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white px-4 py-6 sm:px-6 lg:px-8">
      <div className="w-full max-w-5xl mx-auto bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-lg mt-12">
        <h1 className="text-3xl font-bold mb-6 text-center text-cyan-400">My Expense History</h1>
        <ExpensesTable />
      </div>
    </div>
  )
}
