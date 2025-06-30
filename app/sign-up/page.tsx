'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'

export default function SignUpPage() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
        credentials: 'include' // ✅ critical for cookies on Vercel
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data?.error || 'Signup failed')
        return
      }

      // ✅ Redirect manually after token is set
      if (data?.redirectTo) {
        window.location.href = data.redirectTo
      }
    } catch (err) {
      console.error('Signup Error:', err)
      setError('Something went wrong. Please try again.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-zinc-800 p-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-xl p-6 shadow-xl">
        <h1 className="text-3xl font-bold text-center text-white mb-6">Create Account</h1>
        {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Username</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="yourusername"
              className="w-full px-4 py-2.5 bg-zinc-800 text-white border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 pr-12 bg-zinc-800 text-white border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3"
              >
                {showPassword ? <EyeOff size={20} stroke="white" /> : <Eye size={20} stroke="white" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold rounded-lg shadow-lg transition duration-200"
          >
            Sign Up
          </button>
        </form>

        <p className="text-sm text-center text-gray-400 mt-6">
          Already have an account?{' '}
          <Link href="/sign-in" className="text-blue-400 hover:underline hover:text-blue-300">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}
