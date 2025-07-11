'use client'

import { useEffect, useState } from 'react'
import {
  LayoutDashboard, CreditCard, Wallet, Calendar, Bot,
  BarChart, Settings, Lock, X, Menu, LogOut, User, FileText, PlusCircle
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { motion } from 'framer-motion'

type SidebarProps = {
  isMobile: boolean
  sidebarOpen: boolean
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const links = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/expenses', label: 'Add Expenses', icon: CreditCard },
  { href: '/myexpenses', label: 'My Expenses', icon: Wallet },
  { href: '/calendar', label: 'Calendar', icon: Calendar },
  { href: '/ai-assistant', label: 'AI Assistant', icon: Bot },
  { href: '/reports', label: 'Reports', icon: BarChart },
  { href: '/import-bank-statement', label: 'Import Bank Statement', icon: FileText },
  { href: '/add-money', label: 'Add Money', icon: PlusCircle, isAction: true }
]

// Sidebar container animation
const containerVariants = {
  open: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
  closed: {
    transition: {
      staggerChildren: 0.03,
      staggerDirection: -1,
    },
  },
}

// Each link animation
const itemVariants = {
  open: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 30,
    },
  },
  closed: {
    opacity: 0,
    x: -20,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
}

export default function Sidebar({ isMobile, sidebarOpen, setSidebarOpen }: SidebarProps) {
  const pathname = usePathname()
  const [userName, setUserName] = useState('')
  const [gender, setGender] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const res = await fetch('/api/user/profile')
        const data = await res.json()
        if (res.status === 404 || data.error === 'User not found') {
          window.location.href = '/sign-up'
          return
        }
        if (!res.ok) throw new Error(data?.error || 'Failed to fetch profile')
        setUserName(data?.profile?.fullName || 'Guest')
        setGender(data?.profile?.gender || '')
      } catch (err) {
        console.error('Sidebar: Error fetching profile', err)
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
    const handleProfileUpdated = () => fetchUserProfile()
    window.addEventListener('profileUpdated', handleProfileUpdated)
    return () => window.removeEventListener('profileUpdated', handleProfileUpdated)
  }, [])

  const getAvatarSrc = () =>
    gender === 'Male' ? '/avatars/male.png' :
    gender === 'Female' ? '/avatars/female.png' : ''

  useEffect(() => {
    document.body.style.overflow = isMobile && sidebarOpen ? 'hidden' : 'auto'
  }, [isMobile, sidebarOpen])

  const handleLogout = () => {
    document.cookie = 'token=; Max-Age=0; path=/'
    localStorage.removeItem('token')
    window.location.href = '/sign-up'
  }

  return (
    <>
      {isMobile && !sidebarOpen && (
        <button
          className="fixed top-4 left-4 z-50 backdrop-blur-md p-3 rounded-lg border border-white/10 bg-white/10 text-white shadow-md"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu size={20} />
        </button>
      )}

      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

<aside
  className={clsx(
    'fixed top-0 left-0 z-50 h-screen w-72 flex flex-col',

          'bg-white/10 backdrop-blur-xl shadow-[inset_0_0_0.5px_rgba(255,255,255,0.1)] border-r border-white/10',
          'transform transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]',
          sidebarOpen || !isMobile
            ? 'translate-x-0 opacity-100 scale-100'
            : '-translate-x-full opacity-0 scale-90',
          'md:translate-x-0 md:opacity-100 md:scale-100 md:block'
        )}
      >
        <div className="absolute right-0 top-0 h-full w-[2px] bg-gradient-to-b from-blue-400 to-cyan-400 opacity-60" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <h1 className="text-xl font-bold tracking-wide text-white/90">Fintrack</h1>
          {isMobile && (
            <button className="text-white/60 hover:text-white" onClick={() => setSidebarOpen(false)}>
              <X size={20} />
            </button>
          )}
        </div>
{/* Links Section - Scrollable */}
<div className="flex-1 overflow-y-auto px-5 py-4 space-y-2">
  {links.map(({ href, label, icon: Icon, isAction }, index) => {
    const isVisible = sidebarOpen || !isMobile
    return (
      <motion.div
        key={href}
        initial={{ opacity: 0, x: -40 }}
        animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
        transition={{
          delay: isVisible ? 0.05 * index : 0,
          duration: 0.4,
          type: 'spring',
          stiffness: 300,
          damping: 30,
        }}
      >
        {isAction ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (isMobile) setSidebarOpen(false)
              window.location.href = href
            }}
            className="w-full group flex items-center gap-3 px-4 py-2.5 rounded-lg text-green-400 hover:text-white hover:bg-green-600/10 transition-all duration-200 shadow-sm"
          >
            <Icon size={20} className="group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium tracking-wide">{label}</span>
          </motion.button>
        ) : (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href={href}
              onClick={() => isMobile && setSidebarOpen(false)}
              className={clsx(
                'group flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 shadow-sm',
                pathname === href
                  ? 'bg-white/10 text-white font-semibold backdrop-blur-sm'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              )}
            >
              <Icon size={20} className="group-hover:scale-105 transition-transform" />
              <span className="text-sm font-medium tracking-wide">{label}</span>
            </Link>
          </motion.div>
        )}
      </motion.div>
    )
  })}
</div>

{/* Footer - Always at bottom */}
<div className="px-5 pt-3 pb-6 border-t border-white/10 mt-auto">
  <Link
    href="/userprofile"
    className="flex items-center gap-3 px-3 py-3 mb-2 rounded-lg hover:bg-white/10 transition-all duration-200 group"
  >
    <div className="w-10 h-10 rounded-full overflow-hidden bg-white/20 flex items-center justify-center group-hover:scale-105 transition-transform">
      {getAvatarSrc() ? (
        <img src={getAvatarSrc()} alt="User Avatar" className="w-full h-full object-cover" />
      ) : (
        <User className="text-white w-5 h-5" />
      )}
    </div>
    <div className="flex flex-col">
      <span className="text-sm font-medium text-white group-hover:text-blue-300">
        {loading ? 'Loading...' : userName || 'Guest'}
      </span>
      <span className="text-xs text-white/60 group-hover:text-blue-300 transition">
        View Profile
      </span>
    </div>
  </Link>

  <button
    onClick={handleLogout}
    className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-red-400 hover:text-white hover:bg-red-500/10 transition-all duration-200"
  >
    <LogOut size={16} />
    <span className="text-sm tracking-wide">Logout</span>
  </button>

  <div className="mt-4 text-xs text-white/40 flex justify-between px-2">
    <span>v1.0 • Fintrack AI Powered</span>
    <span className="text-[10px] text-blue-400">Puneet Shukla</span>
  </div>
</div>

      </aside>
    </>
  )
}
