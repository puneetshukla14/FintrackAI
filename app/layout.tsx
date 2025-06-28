'use client' // ⭐️ Make it a Client Component

import './globals.css'
import { useEffect, useState } from 'react'
import SidebarWrapper from './SidebarWrapper'
import Loading from '@/components/loading' // 🧠 Your animation component

export const metadata = {
  title: 'ExpenseX Pro',
  description: 'Smart Expense Manager',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [showLoader, setShowLoader] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <html lang="en">
      <body className="bg-black text-white">
        {showLoader ? <Loading /> : <SidebarWrapper>{children}</SidebarWrapper>}
      </body>
    </html>
  )
}
