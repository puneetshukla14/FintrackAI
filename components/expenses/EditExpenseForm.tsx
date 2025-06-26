'use client'

import { useState, useEffect } from 'react'
import { FiX } from 'react-icons/fi'

export default function EditExpenseForm({ expense, onClose, onUpdate }: any) {
  const [form, setForm] = useState({
    amount: '',
    category: '',
    paymentMethod: '',
  })

  useEffect(() => {
    if (expense) {
      setForm({
        amount: expense.amount || '',
        category: expense.category || '',
        paymentMethod: expense.paymentMethod || '',
      })
    }
  }, [expense])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const token = localStorage.getItem('token') // Assumes JWT stored after login

    const res = await fetch(`/api/expenses/${expense._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    })

    if (res.ok) {
      onClose()
      onUpdate()
    } else {
      alert('Failed to update expense')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm px-4">
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-md bg-neutral-900 rounded-xl shadow-xl p-6 md:p-8 space-y-6 text-white"
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
        >
          <FiX size={20} />
        </button>

        <h2 className="text-2xl font-bold text-center text-blue-400">Edit Expense</h2>

        <div className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-300">Amount (₹)</label>
            <input
              name="amount"
              type="number"
              value={form.amount}
              onChange={handleChange}
              placeholder="Enter amount"
              className="w-full rounded-md border border-neutral-700 bg-neutral-800 px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-300">Category</label>
            <input
              name="category"
              type="text"
              value={form.category}
              onChange={handleChange}
              placeholder="Enter category"
              className="w-full rounded-md border border-neutral-700 bg-neutral-800 px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-300">Payment Method</label>
            <input
              name="paymentMethod"
              type="text"
              value={form.paymentMethod}
              onChange={handleChange}
              placeholder="e.g., UPI / Card / Cash"
              className="w-full rounded-md border border-neutral-700 bg-neutral-800 px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200"
          >
            Update Expense
          </button>
        </div>
      </form>
    </div>
  )
}
