'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, CreditCard, Wallet, Calendar, Bot,
  BarChart, Settings, Lock, X, Menu, LogOut, User, FileText
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { PlusCircle } from 'lucide-react'




const links = [
  
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/expenses', label: ' Add Expenses', icon: CreditCard },
  { href: '/myexpenses', label: 'My Expenses', icon: Wallet },
  { href: '/calendar', label: 'Calendar', icon: Calendar },
  { href: '/ai-assistant', label: 'AI Assistant', icon: Bot },
  { href: '/reports', label: 'Reports', icon: BarChart },
  { href: '/settings', label: 'Settings', icon: Settings },
  { href: '/admin', label: 'Admin', icon: Lock },
  { href: '/import-bank-statement', label: 'Import Bank Statement', icon: FileText },
  { href: '/add-money', label: 'Add Money', icon: PlusCircle, isAction: true } // ✅ Added here
]



export default function Sidebar() {
  const pathname = usePathname()
  const [isMobile, setIsMobile] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [devMode, setDevMode] = useState(false)
  const [userName, setUserName] = useState('')
  const [gender, setGender] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const res = await fetch('/api/user/profile', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })

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
        window.location.href = '/sign-up'
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [])

  const getAvatarSrc = () => {
    if (gender === 'Male') return '/avatars/male.png'
    if (gender === 'Female') return '/avatars/female.png'
    return ''
  }

  useEffect(() => {
    const updateSize = () => setIsMobile(window.innerWidth < 768)
    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  useEffect(() => {
    if (isMobile) {
      document.body.style.overflow = sidebarOpen ? 'hidden' : 'auto'
    }
  }, [isMobile, sidebarOpen])

  useEffect(() => {
    const saved = localStorage.getItem('devMode')
    setDevMode(saved === 'true')
  }, [])

  useEffect(() => {
    localStorage.setItem('devMode', devMode.toString())
  }, [devMode])

  const handleLogout = () => {
    document.cookie = 'token=; Max-Age=0; path=/'
    localStorage.removeItem('token')
    window.location.href = '/sign-up'
  }

  return (
    <>
      {isMobile && !sidebarOpen && (
        <button
          className="fixed top-4 left-4 z-50 bg-zinc-900/90 p-3 rounded-md border border-zinc-700 text-white"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu size={20} />
        </button>
      )}

      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen || !isMobile ? 0 : -300 }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        className={clsx(
          'fixed top-0 left-0 z-50 h-screen w-64 flex flex-col justify-between',
          'bg-zinc-950/90 backdrop-blur-md border-r border-zinc-800',
          'md:block'
        )}
      >
        <div className="absolute right-0 top-0 h-full w-[2px] bg-gradient-to-b from-blue-500 to-cyan-500" />

{/* Header */}
<div className="flex items-center justify-center relative px-5 py-2 border-b border-zinc-800">
  <Link href="/dashboard" className="block w-24 h-24 overflow-hidden">
    <img
      src="/logo.png"
      alt="Logo"
      className="w-full h-full object-contain transform transition-transform duration-300 hover:scale-125"
    />
  </Link>

  {isMobile && (
    <button
      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
      onClick={() => setSidebarOpen(false)}
    >
      <X size={24} />
    </button>
  )}
</div>






        

        {/* Links */}
        <div className="flex-1 overflow-y-auto px-3 py-3">
          <div className="space-y-1">

            
{links.map(({ href, label, icon: Icon, isAction }) => (
  isAction ? (
    <button
      key={href}
      onClick={() => {
        if (isMobile) setSidebarOpen(false)
        window.location.href = href
      }}
      className="w-full group flex items-center gap-3 px-4 py-2.5 rounded-md text-green-400 hover:text-white hover:bg-green-600/10 transition-all duration-200"
    >
      <Icon size={20} className="group-hover:scale-110 transition-transform" />
      <span className="text-sm font-semibold">{label}</span>
    </button>
  ) : (
    <Link
      key={href}
      href={href}
      className={clsx(
        'group flex items-center gap-3 px-4 py-2.5 rounded-md transition-all duration-200',
        pathname === href
          ? 'bg-zinc-800 text-white font-semibold'
          : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
      )}
      onClick={() => isMobile && setSidebarOpen(false)}
    >
      <Icon size={20} className="group-hover:scale-105 transition-transform" />
      <span className="text-sm">{label}</span>
    </Link>
  )
))}

          </div>
        </div>

        {/* Footer */}
        <div
          className={clsx(
            'px-3 pb-4 border-t border-zinc-800',
            'md:absolute md:bottom-0 md:left-0 md:right-0 md:pb-5 md:bg-zinc-950/90'
          )}
        >
          {/* User Info */}
          <div className="flex items-center gap-3 px-4 py-3 mb-1 rounded-md hover:bg-zinc-800 transition-all duration-200 group cursor-pointer">
            <div className="w-9 h-9 rounded-full overflow-hidden bg-zinc-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              {getAvatarSrc() ? (
                <img
                  src={getAvatarSrc()}
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="text-white w-5 h-5" />
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white group-hover:text-blue-400">
                {loading ? 'Loading...' : userName || 'Guest'}
              </span>
              <span className="text-xs text-zinc-400 group-hover:text-zinc-200">View Profile</span>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="mt-3 flex items-center gap-2 w-full px-4 py-2 rounded-md text-red-400 hover:text-white hover:bg-red-500/10 transition-all duration-200 text-left"
          >
            <LogOut size={16} />
            <span className="text-sm">Logout</span>
          </button>

   
{/* Version */}
<div className="mt-3 text-xs text-zinc-500 px-2 flex justify-between items-center">
  <span>V7.25 • Fintrack Premium</span>
  <a
    href="https://puneetshuklaprofile.netlify.app/" // 🧭 Change to your actual domain if needed
    target="_blank"
    rel="noopener noreferrer"
    className="text-[10px] text-blue-600 border border-blue-600 rounded-full px-2 py-[2px] hover:bg-blue-600 hover:text-white transition-all duration-200"
  >
    Puneet Shukla
  </a>
</div>


          {/* Dev Toggle (Mobile Only) */}
          {isMobile && (
            <div className="mt-4 px-2">
              <div className="px-3 py-2 bg-white/10 border border-white/20 rounded-full flex items-center justify-between">
                <span className="text-white text-xs font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-white to-blue-400 animate-pulse">
                  Dev Mode
                </span>
                <button
                  onClick={() => setDevMode(prev => !prev)}
                  className="w-14 h-6 flex items-center bg-white/10 rounded-full p-1 border border-white/30 relative overflow-hidden"
                >
                  <motion.div
                    layout
                    className="w-5 h-5 rounded-full bg-white shadow-md z-10"
                    animate={{ x: devMode ? 28 : 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  />
                  {!devMode && (
                    <motion.div
                      initial={{ x: 6, opacity: 0 }}
                      animate={{ x: 2, opacity: 1 }}
                      transition={{
                        repeat: Infinity,
                        repeatType: 'reverse',
                        duration: 0.8,
                        ease: 'easeInOut',
                      }}
                      className="absolute left-1 text-white text-xs pointer-events-none z-0"
                    >
                      ←
                    </motion.div>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.aside>
    </>
  )
}
