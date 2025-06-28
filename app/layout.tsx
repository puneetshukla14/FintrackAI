'use client'

import './globals.css'
import { useEffect, useState } from 'react'
import SidebarWrapper from './SidebarWrapper'
import Loading from '@/components/loading'

export const metadata = {
  title: 'ExpenseX Pro',
  description: 'Smart Expense Manager',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [showLoader, setShowLoader] = useState(true)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Loader should appear every refresh
      sessionStorage.removeItem('hasReloaded') // 👈 clear previous flag

      sessionStorage.setItem('hasReloaded', 'true')
      setShowLoader(true)
      const timer = setTimeout(() => {
        setShowLoader(false)
        sessionStorage.removeItem('hasReloaded') // 👈 clear again after showing
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [])

  return (
    <html lang="en">
      <body className="bg-black text-white">
        {showLoader ? <Loading /> : <SidebarWrapper>{children}</SidebarWrapper>}
      </body>
    </html>
  )
}
