'use client'

import React from 'react'

interface SalaryCardProps {
  salary: number
  totalExpenses: number
}

const SalaryCard = ({ salary, totalExpenses }: SalaryCardProps) => {
  return (
    <div className="text-white">
      <h2 className="text-lg font-semibold mb-2 text-cyan-400">Monthly Salary</h2>
      <p className="text-2xl font-bold text-green-400">₹{salary.toLocaleString()}</p>

      <h2 className="text-lg font-semibold mt-6 mb-2 text-cyan-400">Total Expenses</h2>
      <p className="text-2xl font-bold text-red-400">₹{totalExpenses.toLocaleString()}</p>
    </div>
  )
}

export default SalaryCard
