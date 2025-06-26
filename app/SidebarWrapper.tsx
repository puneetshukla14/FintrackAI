'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import ClientSidebarLayout from './ClientSidebarLayout'

const hiddenSidebarRoutes = ['/sign-in', '/sign-up', '/setup-profile']

export default function SidebarWrapper({ children }: { children: React.ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) return null

  const hideSidebar = hiddenSidebarRoutes.includes(pathname)

  if (hideSidebar) {
    return <>{children}</>
  }

  return <ClientSidebarLayout>{children}</ClientSidebarLayout>
}
