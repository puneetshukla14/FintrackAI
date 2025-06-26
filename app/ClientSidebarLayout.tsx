'use client'

import { useEffect, useState } from 'react'
import Sidebar from '@/components/Sidebar'

export default function ClientSidebarLayout({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar (always shown on desktop, toggleable on mobile) */}
      <Sidebar />

      {/* Page Content */}
      <main
        className={`flex-1 overflow-y-auto bg-black text-white ${
          isMobile ? '' : 'ml-64'
        }`}
      >
        {children}
      </main>
    </div>
  )
}