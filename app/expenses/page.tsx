'use client'

import { useEffect, useState } from 'react'
import {
  FiRefreshCw, FiCalendar, FiClock, FiTag, FiMapPin,
  FiFileText, FiCreditCard, FiDollarSign, FiSave
} from 'react-icons/fi'

const categoryOptions: Record<string, string[]> = {
  Groceries: ['Vegetables', 'Fruits', 'Snacks', 'Beverages', 'Dairy', 'Bakery'],
  Dining: ['Restaurants', 'Cafes', 'Street Food', 'Fast Food'],
  Rent: ['Home', 'Office', 'PG/Hostel'],
  Travel: ['Flight', 'Train', 'Hotel', 'Taxi', 'Fuel', 'Public Transport'],
  Education: ['Tuition', 'Books', 'Online Courses', 'School Fees'],
  Bills: ['Electricity', 'Internet', 'Phone', 'Water', 'Gas'],
  Entertainment: ['Movies', 'Streaming', 'Games', 'Events'],
  Shopping: ['Clothes', 'Accessories', 'Electronics', 'Home Decor'],
  Health: ['Medicine', 'Doctor Visit', 'Diagnostics', 'Insurance'],
  Fitness: ['Gym', 'Yoga', 'Supplements'],
  Finance: ['Investments', 'Loan Payment', 'Savings', 'EMI'],
  Subscriptions: ['Netflix', 'Spotify', 'AWS', 'Google Workspace'],
  Pets: ['Pet Food', 'Vet', 'Accessories'],
  Kids: ['Toys', 'School Supplies', 'Clothing'],
  PersonalCare: ['Salon', 'Spa', 'Cosmetics'],
  Gifts: ['Birthdays', 'Anniversaries', 'Festivals'],
  Donations: ['Charity', 'Religious', 'NGO'],
  Other: ['Miscellaneous', 'Uncategorized'],
}

export default function ExpensesPage() {
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0])
  const [time, setTime] = useState(() => new Date().toTimeString().slice(0, 5))
  const [includeTime, setIncludeTime] = useState(true)
  const [mainCategory, setMainCategory] = useState('Groceries')
  const [subCategory, setSubCategory] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('Cash')
  const [tags, setTags] = useState('')
  const [notes, setNotes] = useState('')
  const [location, setLocation] = useState('')
  const [recurring, setRecurring] = useState(false)
  const [multiEntry, setMultiEntry] = useState(false)
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([])

  useEffect(() => {
    fetchDeviceLocation()
  }, [])

  const fetchDeviceLocation = async () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async ({ coords }) => {
          const { latitude, longitude } = coords
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)
            const data = await res.json()
            const city = data.address.city || data.address.town || data.address.village || ''
            const state = data.address.state || ''
            const country = data.address.country || ''
            if (country.toLowerCase() === 'india') {
              setLocation(`${city}, ${state}, ${country}`)
            }
          } catch (err) {
            console.error('Reverse geocoding failed:', err)
          }
        },
        async () => {
          try {
            const res = await fetch('https://ipapi.co/json/')
            const d = await res.json()
            if (d.country_name === 'India') {
              setLocation(`${d.city}, ${d.region}, ${d.country_name}`)
            }
          } catch (err) {
            console.error('IP location fetch error:', err)
          }
        }
      )
    }
  }

  const handleLocationInput = (q: string) => {
    setLocation(q)
    if (q.length > 2) {
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}`)
        .then(r => r.json())
        .then(data => {
          const suggestions = data.map((item: any) => item.display_name)
          setLocationSuggestions(suggestions)
        })
        .catch(err => console.error('Location autocomplete error:', err))
    } else {
      setLocationSuggestions([])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const data = {
      amount: Number(amount),
      date,
      time: includeTime ? time : '',
      includeTime,
      category: `${mainCategory} - ${subCategory}`,
      paymentMethod,
      tags,
      notes,
      location,
      recurring,
      multiEntry,
    }

    try {
      const token = localStorage.getItem('token') || ''

      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })

      const result = await res.json()

      if (res.ok) {
        alert('Expense saved successfully!')
        setAmount('')
        setNotes('')
        setTags('')
        setSubCategory('')
      } else {
        alert(`Error: ${result.error || 'Unknown error occurred'}`)
      }
    } catch (err) {
      alert('Network error. Please try again.')
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white px-4 py-6 sm:px-6 lg:px-8 overflow-auto">
      {/* --- Expense Form --- */}
      <div className="w-full max-w-2xl mx-auto bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-lg mb-12">
        <h1 className="text-3xl font-bold text-center mb-6">Add New Expense</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField label="Amount" icon={<FiDollarSign />} value={amount} onChange={setAmount} placeholder="Enter amount" type="number" required />

          <div className="grid sm:grid-cols-2 gap-4">
            <InputField label="Date" icon={<FiCalendar />} value={date} onChange={setDate} type="date" required />
            {includeTime && <InputField label="Time" icon={<FiClock />} value={time} onChange={setTime} type="time" />}
          </div>

          <label className="flex items-center gap-2 text-sm text-zinc-300">
            <input type="checkbox" checked={includeTime} onChange={e => setIncludeTime(e.target.checked)} />
            Show Time Field
          </label>

          <div className="grid sm:grid-cols-2 gap-4">
            <SelectField label="Main Category" icon={<FiTag />} value={mainCategory} onChange={(e: string) => { setMainCategory(e); setSubCategory('') }} options={Object.keys(categoryOptions)} />
            <SelectField label="Subcategory" icon={<FiTag />} value={subCategory} onChange={setSubCategory} options={categoryOptions[mainCategory]} placeholder="Select subcategory" />
          </div>

          <SelectField label="Payment Method" icon={<FiCreditCard />} value={paymentMethod} onChange={setPaymentMethod} options={['Cash', 'Card', 'UPI', 'Wallet', 'Bank Transfer', 'Other']} />

          <TextAreaField label="Notes" icon={<FiFileText />} value={notes} onChange={setNotes} placeholder="Additional details (optional)" />
          <InputField label="Tags" icon={<FiTag />} value={tags} onChange={setTags} placeholder="e.g. groceries, weekend" />

          <div className="relative">
            <label className="text-sm font-medium text-zinc-300 block mb-1">Location</label>
            <div className="relative">
              <FiMapPin className="absolute top-3 left-3 text-zinc-500" size={20} />
              <input
                type="text"
                placeholder="City, State"
                value={location}
                onChange={e => handleLocationInput(e.target.value)}
                className="bg-neutral-800 pl-10 pr-10 py-3 w-full rounded-md border border-neutral-700 placeholder:text-zinc-500 focus:outline focus:outline-blue-500"
              />
              <button type="button" onClick={fetchDeviceLocation} className="absolute right-3 top-[10px] text-blue-400 hover:text-blue-600" title="Refresh location">
                <FiRefreshCw size={18} />
              </button>
              {locationSuggestions.length > 0 && (
                <ul className="absolute z-50 mt-1 bg-neutral-800 border border-neutral-700 w-full rounded-md max-h-40 overflow-auto text-sm">
                  {locationSuggestions.map((loc, index) => (
                    <li key={`${loc}-${index}`} onClick={() => { setLocation(loc); setLocationSuggestions([]); }} className="p-2 hover:bg-neutral-700 cursor-pointer">
                      {loc}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="flex flex-wrap justify-between items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-zinc-300">
              <input type="checkbox" checked={recurring} onChange={e => setRecurring(e.target.checked)} />
              Recurring Expense
            </label>
            <label className="flex items-center gap-2 text-sm text-zinc-300">
              <input type="checkbox" checked={multiEntry} onChange={e => setMultiEntry(e.target.checked)} />
              Multi-entry Mode
            </label>
          </div>

          <button type="submit" className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl py-3 text-lg transition-all duration-200">
            <FiSave size={20} />
            Save Expense
          </button>
        </form>
      </div>
    </div>
  )
}

// ---------------------
// Helper Components
// ---------------------

function InputField({ label, icon, value, onChange, ...rest }: any) {
  return (
    <div>
      <label className="text-sm font-medium text-zinc-300 block mb-1">{label}</label>
      <div className="relative">
        <span className="absolute top-3 left-3 text-zinc-500">{icon}</span>
        <input
          {...rest}
          value={value}
          onChange={e => onChange(e.target.value)}
          className="bg-neutral-800 pl-10 pr-4 py-3 w-full rounded-md border border-neutral-700 placeholder:text-zinc-500 focus:outline focus:outline-blue-500"
        />
      </div>
    </div>
  )
}

function TextAreaField({ label, icon, value, onChange, ...rest }: any) {
  return (
    <div>
      <label className="text-sm font-medium text-zinc-300 block mb-1">{label}</label>
      <div className="relative">
        <span className="absolute top-3 left-3 text-zinc-500">{icon}</span>
        <textarea
          {...rest}
          value={value}
          onChange={e => onChange(e.target.value)}
          rows={2}
          className="bg-neutral-800 pl-10 pr-4 py-3 w-full rounded-md border border-neutral-700 resize-none placeholder:text-zinc-500 focus:outline focus:outline-blue-500"
        />
      </div>
    </div>
  )
}

function SelectField({ label, icon, value, onChange, options, placeholder = '' }: any) {
  return (
    <div>
      <label className="text-sm font-medium text-zinc-300 block mb-1">{label}</label>
      <div className="relative">
        <span className="absolute top-3 left-3 text-zinc-500">{icon}</span>
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className="bg-neutral-800 pl-10 pr-4 py-3 w-full rounded-md border border-neutral-700 text-white focus:outline focus:outline-blue-500"
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt: string) => (
            <option key={opt}>{opt}</option>
          ))}
        </select>
      </div>
    </div>
  )
}
