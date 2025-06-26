'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function useAuth() {
  const [loading, setLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const timeout = setTimeout(() => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

      if (token) {
        setIsLoggedIn(true)
      } else {
        router.replace('/sign-in')
      }

      setLoading(false)
    }, 200) // 🔐 Delay ensures localStorage loads on mobile

    return () => clearTimeout(timeout)
  }, [router])

  return { loading, isLoggedIn }
}
