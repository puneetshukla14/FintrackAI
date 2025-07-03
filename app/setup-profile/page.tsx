'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  FaUser,
  FaUserTie,
  FaUserNurse,
  FaUserSecret,
  FaMale,
  FaFemale,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaPhone,
} from 'react-icons/fa'
import { MdAccountBalanceWallet } from 'react-icons/md'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const avatarOptions = [FaUser, FaUserTie, FaUserNurse, FaUserSecret]

export default function SetupProfilePage() {
  const router = useRouter()

  const [form, setForm] = useState({
    fullName: '',
    gender: '',
    avatar: '',
    bankBalance: '',
    monthlySalary: '',
    salaryDate: null as Date | null,
    phone: '',
    dob: null as Date | null,
    location: '',
  })

  const [error, setError] = useState('')

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          )
          const data = await res.json()
          const loc =
            data?.address?.city || data?.address?.town || data?.display_name
          setForm((prev) => ({ ...prev, location: loc }))
        } catch {
          setForm((prev) => ({ ...prev, location: 'Unavailable' }))
        }
      })
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleAvatarSelect = (avatar: string) => {
    setForm((prev) => ({ ...prev, avatar }))
  }

  const handleGenderSelect = (gender: string) => {
    setForm((prev) => ({ ...prev, gender }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const { fullName, gender, avatar } = form
    if (!fullName || !gender || !avatar) {
      return setError('Full name, gender, and avatar are required.')
    }

    try {
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...form,
          salaryDate: form.salaryDate?.toISOString().split('T')[0],
          dob: form.dob?.toISOString().split('T')[0],
          bankBalance: Number(form.bankBalance || 0),
          monthlySalary: Number(form.monthlySalary || 0),
        }),
      })

      const data = await res.json()
      if (!res.ok) return setError(data?.error || 'Profile update failed')
      router.replace('/dashboard')
    } catch (err) {
      console.error(err)
      setError('Something went wrong. Please try again.')
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-zinc-800 px-4 py-10 font-sans">
      <div className="w-full max-w-3xl bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl p-10 text-white animate-fade-in">
        <h1 className="text-4xl font-bold text-center mb-10">Set Up Your Profile</h1>

        <div className="flex flex-wrap justify-center gap-6 mb-8">
          {avatarOptions.map((Icon, index) => (
            <div
              key={index}
              onClick={() => handleAvatarSelect(`icon-${index}`)}
              className={`w-16 h-16 flex items-center justify-center rounded-full border-4 cursor-pointer transition-all duration-200 shadow-lg ${
                form.avatar === `icon-${index}`
                  ? 'border-cyan-400 scale-110 bg-zinc-700'
                  : 'border-transparent opacity-70 hover:scale-105'
              }`}
            >
              <Icon size={28} />
            </div>
          ))}
        </div>

        {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input label="Full Name" name="fullName" value={form.fullName} onChange={handleChange} />

          <Input
            label="Current Bank Balance"
            name="bankBalance"
            type="number"
            value={form.bankBalance}
            onChange={handleChange}
            icon={<MdAccountBalanceWallet />}
          />

          <div>
            <label className="text-sm text-zinc-400 block mb-2">Gender</label>
            <div className="flex gap-4">
              {['Male', 'Female'].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => handleGenderSelect(g)}
                  className={`flex-1 py-3 rounded-xl border flex flex-col items-center shadow-md transition ${
                    form.gender === g
                      ? g === 'Male'
                        ? 'bg-blue-600 border-blue-500 text-white'
                        : 'bg-pink-600 border-pink-500 text-white'
                      : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                  }`}
                >
                  {g === 'Male' ? <FaMale size={26} /> : <FaFemale size={26} />}
                  <span className="mt-1 text-sm">{g}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-zinc-800 pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Phone Number (Optional)"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              icon={<FaPhone />}
            />
            <DateInput
              label="Date of Birth (Optional)"
              selected={form.dob}
              onChange={(date) => setForm((prev) => ({ ...prev, dob: date }))}
            />
            <Input
              label="Monthly Salary (Optional)"
              name="monthlySalary"
              type="number"
              value={form.monthlySalary}
              onChange={handleChange}
              icon={<FaMoneyBillWave />}
            />
            <DateInput
              label="Salary Credit Date (Optional)"
              selected={form.salaryDate}
              onChange={(date) => setForm((prev) => ({ ...prev, salaryDate: date }))}
            />
            <div>
              <label className="text-sm text-zinc-400 block mb-1 flex items-center gap-2">
                <FaMapMarkerAlt /> Location
              </label>
              <input
                type="text"
                name="location"
                value={form.location}
                disabled
                className="w-full px-4 py-3 bg-zinc-800 text-white border border-zinc-700 rounded-lg transition-all duration-[6000ms]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-500 text-white font-semibold text-lg shadow-md hover:from-cyan-700 hover:to-blue-600 transition"
          >
            Save & Continue
          </button>
        </form>
      </div>
    </main>
  )
}

function Input({ label, icon, ...props }: any) {
  return (
    <div>
      <label className="text-sm text-zinc-400 block mb-1 flex items-center gap-2">
        {icon} {label}
      </label>
      <input
        {...props}
        className="w-full px-4 py-3 bg-zinc-800 text-white border border-zinc-700 rounded-lg"
      />
    </div>
  )
}

function DateInput({
  label,
  selected,
  onChange,
}: {
  label: string
  selected: Date | null
  onChange: (date: Date | null) => void
}) {
  return (
    <div>
      <label className="text-sm text-zinc-400 block mb-1 flex items-center gap-2">
        <FaCalendarAlt /> {label}
      </label>
      <DatePicker
        selected={selected}
        onChange={onChange}
        placeholderText="Choose date"
        dateFormat="yyyy-MM-dd"
        className="w-full px-4 py-3 bg-zinc-800 text-white border border-zinc-700 rounded-lg"
      />
    </div>
  )
}
