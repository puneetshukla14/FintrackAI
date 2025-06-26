'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FaMale, FaFemale } from 'react-icons/fa'

export default function SetupProfilePage() {
  const [form, setForm] = useState({
    fullName: '',
    monthlySalary: '',
    gender: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      try {
        router.replace('/sign-in')
      } catch {
        window.location.href = '/sign-in'
      }
    } else {
      setLoading(false)
    }
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleGenderSelect = (gender: string) => {
    setForm({ ...form, gender })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const token = localStorage.getItem('token')
    if (!token) return setError('Unauthorized request')

    try {
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: form.fullName,
          monthlySalary: Number(form.monthlySalary),
          gender: form.gender,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        localStorage.setItem(
          'user',
          JSON.stringify({
            profile: {
              fullName: form.fullName,
              salary: Number(form.monthlySalary),
              gender: form.gender,
            },
          })
        )
        router.replace('/dashboard')
      } else {
        setError(data.error || 'Error updating profile')
      }
    } catch (err) {
      console.error('Profile setup error:', err)
      setError('Something went wrong')
    }
  }

  if (loading) return null

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-zinc-800 px-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl p-8 backdrop-blur-md">
        <h1 className="text-3xl font-extrabold text-white text-center mb-6">Setup Your Profile</h1>

        {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div>
            <label className="text-sm text-zinc-400 block mb-1">Full Name</label>
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Your Name"
              className="w-full px-4 py-3 bg-zinc-800 text-white border border-zinc-600 rounded-lg placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          {/* Monthly Salary */}
          <div>
            <label className="text-sm text-zinc-400 block mb-1">Monthly Salary</label>
            <input
              name="monthlySalary"
              type="number"
              value={form.monthlySalary}
              onChange={handleChange}
              placeholder="₹100000"
              className="w-full px-4 py-3 bg-zinc-800 text-white border border-zinc-600 rounded-lg placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          {/* Gender Selection */}
          <div>
            <label className="text-sm text-zinc-400 block mb-2">Select Gender</label>
            <div className="flex justify-between gap-4">
              <button
                type="button"
                onClick={() => handleGenderSelect('Male')}
                className={`flex-1 flex flex-col items-center justify-center px-4 py-4 rounded-xl border 
                  ${
                    form.gender === 'Male'
                      ? 'bg-blue-600 text-white border-blue-500 shadow-lg'
                      : 'bg-zinc-800 text-zinc-300 border-zinc-600'
                  } transition-all duration-200`}
              >
                <FaMale size={36} />
                <span className="mt-1 text-sm font-medium">Male</span>
              </button>

              <button
                type="button"
                onClick={() => handleGenderSelect('Female')}
                className={`flex-1 flex flex-col items-center justify-center px-4 py-4 rounded-xl border 
                  ${
                    form.gender === 'Female'
                      ? 'bg-pink-500 text-white border-pink-400 shadow-lg'
                      : 'bg-zinc-800 text-zinc-300 border-zinc-600'
                  } transition-all duration-200`}
              >
                <FaFemale size={36} />
                <span className="mt-1 text-sm font-medium">Female</span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={!form.fullName || !form.monthlySalary || !form.gender}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold shadow-md transition duration-200 disabled:opacity-50"
          >
            Save & Continue
          </button>
        </form>
      </div>
    </main>
  )
}
