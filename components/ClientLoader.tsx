'use client'

import { useEffect, useState } from 'react'
import Loading from './loading'

export default function ClientLoader({ children }: { children: React.ReactNode }) {
  const [show, setShow] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  if (show) return <Loading />
  return <>{children}</>
}
