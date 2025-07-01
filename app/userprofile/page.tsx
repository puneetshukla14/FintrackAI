'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Pencil } from 'lucide-react'

export default function UserProfilePage() {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    monthlySalary: '',
    gender: 'unspecified',
    profileImage: null,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [editingField, setEditingField] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token')
      try {
        const res = await fetch('/api/user/profile', {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        setProfile({
          name: data?.profile?.fullName || '',
          email: data?.profile?.email || '',
          monthlySalary: data?.profile?.monthlySalary || '',
          gender: data?.profile?.gender || 'unspecified',
          profileImage: data?.profile?.avatar || null,
        })
      } catch (err) {
        console.error('Error fetching profile:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setMessage('')
    const token = localStorage.getItem('token')
    try {
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: profile.name,
          email: profile.email,
          monthlySalary: profile.monthlySalary,
          gender: profile.gender,
        }),
      })
      if (res.ok) {
        window.dispatchEvent(new Event('profileUpdated'))
        setMessage('✅ Profile updated successfully.')
        setEditingField(null)
      } else {
        setMessage('❌ Failed to update profile.')
      }
    } catch (err) {
      console.error('Error saving profile:', err)
      setMessage('❌ Error occurred while saving.')
    } finally {
      setSaving(false)
    }
  }

  const getInitials = () => profile.name?.split(' ').map(n => n[0]).join('').toUpperCase()

  const renderEditCard = (field: string, type: 'text' | 'number' | 'select') => (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className="absolute z-50 w-full left-0 top-0 bg-zinc-950 p-4 rounded-xl border border-zinc-800 shadow-xl"
    >
      <div className="space-y-3">
        {type === 'select' ? (
          <select
            value={profile.gender}
            onChange={e => setProfile({ ...profile, gender: e.target.value })}
            className="w-full p-2 rounded bg-zinc-800 border border-zinc-700"
          >
            <option value="unspecified">Prefer not to say</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        ) : (
          <input
            type={type}
            value={profile[field as keyof typeof profile] as string}
            onChange={e => setProfile({ ...profile, [field]: e.target.value })}
            className="w-full p-2 rounded bg-zinc-800 border border-zinc-700"
          />
        )}
        <div className="flex justify-end gap-2">
          <button onClick={() => setEditingField(null)} className="text-sm text-zinc-400 hover:text-zinc-200">Cancel</button>
          <button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded text-white text-sm">
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </motion.div>
  )

  if (loading) {
    return <div className="min-h-screen flex justify-center items-center text-white">Loading...</div>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-zinc-950 to-zinc-900 text-white py-12 px-6"
    >
      <div className="max-w-xl mx-auto bg-zinc-900/80 backdrop-blur-md rounded-2xl p-6 border border-zinc-800 shadow-xl relative">
        <div className="flex flex-col items-center gap-4">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-600 to-cyan-500 text-white flex items-center justify-center text-2xl font-bold ring-4 ring-emerald-500 shadow-xl">
            {getInitials()}
          </div>

          {/* Fields */}
          {['name', 'email', 'monthlySalary', 'gender'].map(field => (
            <div key={field} className="w-full relative mt-6">
              <label className="block text-sm text-zinc-400 mb-1 capitalize">{field === 'monthlySalary' ? 'Monthly Salary' : field}</label>
              <div className="flex items-center justify-between bg-zinc-800 border border-zinc-700 p-3 rounded-lg">
                <span className="truncate">
                  {field === 'gender'
                    ? profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1)
                    : profile[field as keyof typeof profile] || 'N/A'}
                </span>
                <button onClick={() => setEditingField(field)}>
                  <Pencil size={16} className="text-zinc-400 hover:text-white" />
                </button>
              </div>
              <AnimatePresence>
                {editingField === field && renderEditCard(
                  field,
                  field === 'monthlySalary' ? 'number' : field === 'gender' ? 'select' : 'text'
                )}
              </AnimatePresence>
            </div>
          ))}

          {/* Message */}
          {message && <p className="text-sm mt-4 text-center text-cyan-400">{message}</p>}
        </div>
      </div>
    </motion.div>
  )
}
