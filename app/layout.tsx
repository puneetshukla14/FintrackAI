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
    // Force loader on every hard reload
    if (typeof window !== 'undefined') {
      const hasReloaded = sessionStorage.getItem('hasReloaded')

      if (!hasReloaded) {
        sessionStorage.setItem('hasReloaded', 'true')
        setShowLoader(true)
        setTimeout(() => {
          setShowLoader(false)
        }, 3000)
      } else {
        setShowLoader(false)
      }
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
