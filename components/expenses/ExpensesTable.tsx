'use client'

import { useEffect, useState } from 'react'
import { FiEdit, FiTrash2 } from 'react-icons/fi'
import EditExpenseForm from './EditExpenseForm'

export default function ExpensesTable() {
  const [expenses, setExpenses] = useState<any[]>([])
  const [editingExpense, setEditingExpense] = useState<any | null>(null)

  useEffect(() => {
    fetchExpenses()
  }, [])

  const fetchExpenses = async () => {
    const token = localStorage.getItem('token') || ''
    try {
      const res = await fetch('/api/expenses', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      const data = await res.json()

      if (!res.ok || !Array.isArray(data)) {
        console.error('API error or invalid response:', data)
        return
      }

      setExpenses(data)
    } catch (error) {
      console.error('Failed to fetch expenses:', error)
    }
  }

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm('Are you sure you want to delete this expense?')
    if (!confirmDelete) return

    const token = localStorage.getItem('token') || ''
    try {
      const res = await fetch(`/api/expenses/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (res.ok) {
        setExpenses((prev) => prev.filter((e) => e._id !== id))
      } else {
        alert('Error deleting expense')
      }
    } catch (err) {
      console.error('Delete failed:', err)
    }
  }

  const handleEdit = (exp: any) => {
    setEditingExpense(exp)
  }

  return (
    <>
      <div className="relative mt-6 rounded-xl border border-neutral-700 bg-neutral-900 shadow-md overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-[2px] bg-gradient-to-b from-blue-500 to-cyan-500" />

        {/* Table for large screens */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm md:text-base text-white">
            <thead className="bg-neutral-800 text-blue-400 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-4 py-3 text-left border-b border-neutral-700">Date</th>
                <th className="px-4 py-3 text-left border-b border-neutral-700">Amount</th>
                <th className="px-4 py-3 text-left border-b border-neutral-700">Category</th>
                <th className="px-4 py-3 text-left border-b border-neutral-700">Payment</th>
                <th className="px-4 py-3 text-center border-b border-neutral-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp) => (
                <tr key={exp._id} className="hover:bg-neutral-800 transition">
                  <td className="px-4 py-3 border-b border-neutral-800">{new Date(exp.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3 border-b border-neutral-800">₹{exp.amount}</td>
                  <td className="px-4 py-3 border-b border-neutral-800 capitalize">{exp.category}</td>
                  <td className="px-4 py-3 border-b border-neutral-800 capitalize">{exp.paymentMethod}</td>
                  <td className="px-4 py-3 border-b border-neutral-800">
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => handleEdit(exp)}
                        className="text-blue-400 hover:text-blue-500 transition"
                        title="Edit"
                      >
                        <FiEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(exp._id)}
                        className="text-red-500 hover:text-red-600 transition"
                        title="Delete"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {expenses.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-gray-400 py-6">
                    No expenses found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Card view for small screens */}
        <div className="md:hidden divide-y divide-neutral-800">
          {expenses.length === 0 ? (
            <p className="text-center text-gray-400 py-6">No expenses found.</p>
          ) : (
            expenses.map((exp) => (
              <div key={exp._id} className="p-4 flex flex-col gap-2">
                <div className="flex justify-between text-sm text-gray-300">
                  <span>{new Date(exp.date).toLocaleDateString()}</span>
                  <span className="text-blue-400 font-semibold">₹{exp.amount}</span>
                </div>
                <div className="text-sm text-gray-400 capitalize">Category: {exp.category}</div>
                <div className="text-sm text-gray-400 capitalize">Payment: {exp.paymentMethod}</div>
                <div className="flex justify-end gap-4 mt-2">
                  <button
                    onClick={() => handleEdit(exp)}
                    className="text-blue-400 hover:text-blue-500"
                    title="Edit"
                  >
                    <FiEdit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(exp._id)}
                    className="text-red-500 hover:text-red-600"
                    title="Delete"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Edit Form Modal */}
      {editingExpense && (
        <EditExpenseForm
          expense={editingExpense}
          onClose={() => setEditingExpense(null)}
          onUpdate={fetchExpenses}
        />
      )}
    </>
  )
}
