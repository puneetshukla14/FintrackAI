'use client'

import { useEffect, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import { Menu } from 'lucide-react'

export default function ClientSidebarLayout({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Detect mobile screen
  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  // Disable body scroll when sidebar is open on mobile
  useEffect(() => {
    document.body.style.overflow = isMobile && sidebarOpen ? 'hidden' : 'auto'
  }, [isMobile, sidebarOpen])

  return (
    <div className="relative flex min-h-screen">
      {/* Sidebar Toggle Button */}
      {isMobile && !sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-4 left-4 z-[70] bg-white/10 text-white p-2 rounded-lg shadow-md backdrop-blur"
        >
          <Menu size={20} />
        </button>
      )}

      {/* Overlay */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
        />
      )}

      {/* Sidebar */}
      <div className={`z-[100] ${isMobile ? 'fixed top-0 left-0 h-full w-64' : 'w-64'}`}>
        <Sidebar isMobile={isMobile} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {children}
      </div>
    </div>
  )
}
