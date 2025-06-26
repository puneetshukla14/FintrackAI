'use client'

import { usePathname } from 'next/navigation'
import SidebarWrapper from './SidebarWrapper'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthPage = pathname === '/login' || pathname === '/register'

  return isAuthPage ? children : <SidebarWrapper>{children}</SidebarWrapper>
}
