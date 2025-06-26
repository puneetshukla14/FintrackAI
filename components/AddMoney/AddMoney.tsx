'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Wallet, IndianRupee, SendHorizonal } from 'lucide-react'

export default function AddMoney() {
  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState('UPI')
  const [wallet, setWallet] = useState('Main Wallet')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setLoading(true)

  try {
    const token = localStorage.getItem('token')
    const res = await fetch('/api/credits', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ amount: Number(amount), method, wallet }),
    })

    if (!res.ok) throw new Error('Failed to add money')

    setSuccess(true)
    setAmount('')
    setTimeout(() => setSuccess(false), 3000)
  } catch (err) {
    console.error('Add Money Error:', err)
  } finally {
    setLoading(false)
  }
}


  return (
    <motion.div
      className="w-full max-w-md mx-auto mt-10 p-6 bg-zinc-900/90 border border-zinc-800 rounded-2xl shadow-xl backdrop-blur-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Wallet className="text-blue-400" /> Add Money
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Amount */}
        <div>
          <label className="text-sm text-zinc-400 mb-1 block">Amount</label>
          <div className="flex items-center bg-zinc-800 rounded-md overflow-hidden px-3 py-2">
            <IndianRupee className="text-zinc-400 w-4 h-4 mr-1" />
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="bg-transparent outline-none text-white w-full text-sm"
              required
              min={1}
            />
          </div>
        </div>

        {/* Wallet Selection */}
        <div>
          <label className="text-sm text-zinc-400 mb-1 block">Wallet</label>
          <select
            value={wallet}
            onChange={(e) => setWallet(e.target.value)}
            className="w-full bg-zinc-800 text-white rounded-md px-3 py-2 text-sm outline-none"
          >
            <option>Main Wallet</option>
            <option>Travel Wallet</option>
            <option>Emergency Wallet</option>
          </select>
        </div>

        {/* Method Selection */}
        <div>
          <label className="text-sm text-zinc-400 mb-1 block">Method</label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="w-full bg-zinc-800 text-white rounded-md px-3 py-2 text-sm outline-none"
          >
            <option>UPI</option>
            <option>Cash</option>
            <option>Bank Transfer</option>
          </select>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold py-2.5 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="animate-pulse">Processing...</span>
          ) : (
            <>
              <SendHorizonal size={16} />
              Add ₹{amount || '0'}
            </>
          )}
        </motion.button>

        {/* Success Message */}
        {success && (
          <motion.div
            className="text-green-400 text-sm text-center mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            ✅ Money added successfully!
          </motion.div>
        )}
      </form>
    </motion.div>
  )
}
