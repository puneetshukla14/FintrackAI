'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaMale, FaFemale } from 'react-icons/fa'

export default function SetupProfilePage() {
  const [form, setForm] = useState({
    fullName: '',
    monthlySalary: '',
    gender: '',
  })
  const [error, setError] = useState('')
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleGenderSelect = (gender: string) => {
    setForm((prev) => ({ ...prev, gender }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!form.fullName || !form.monthlySalary || !form.gender) {
      return setError('All fields are required.')
    }

    try {
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          monthlySalary: Number(form.monthlySalary),
          gender: form.gender,
        }),
        credentials: 'include', // ✅ sends HttpOnly cookie
      })

      const data = await res.json()
      if (!res.ok) return setError(data?.error || 'Profile update failed')

      router.replace('/dashboard') // ✅ Redirect on success
    } catch (err) {
      console.error('Profile setup error:', err)
      setError('Something went wrong. Please try again.')
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-zinc-800 px-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl p-8 backdrop-blur-md">
        <h1 className="text-3xl font-extrabold text-white text-center mb-6">Setup Your Profile</h1>

        {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-sm text-zinc-400 block mb-1">Full Name</label>
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Your Name"
              className="w-full px-4 py-3 bg-zinc-800 text-white border border-zinc-600 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="text-sm text-zinc-400 block mb-1">Monthly Salary</label>
            <input
              name="monthlySalary"
              type="number"
              value={form.monthlySalary}
              onChange={handleChange}
              placeholder="₹100000"
              className="w-full px-4 py-3 bg-zinc-800 text-white border border-zinc-600 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="text-sm text-zinc-400 block mb-2">Select Gender</label>
            <div className="flex justify-between gap-4">
              {['Male', 'Female'].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => handleGenderSelect(g)}
                  className={`flex-1 py-4 rounded-xl border flex flex-col items-center ${
                    form.gender === g
                      ? g === 'Male'
                        ? 'bg-blue-600 border-blue-500 text-white'
                        : 'bg-pink-500 border-pink-400 text-white'
                      : 'bg-zinc-800 text-zinc-300 border-zinc-600'
                  }`}
                >
                  {g === 'Male' ? <FaMale size={36} /> : <FaFemale size={36} />}
                  <span className="mt-1 text-sm font-medium">{g}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={!form.fullName || !form.monthlySalary || !form.gender}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold"
          >
            Save & Continue
          </button>
        </form>
      </div>
    </main>
  )
}
