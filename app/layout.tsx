import './globals.css'
import SidebarWrapper from './SidebarWrapper'
import { UserProvider } from '@/context/UserContext'

export const metadata = {
  title: 'Fintrack',
  description: 'Smart Expense Manager',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="text-white">
        <UserProvider>
          <SidebarWrapper>
            <div className="flex flex-col min-h-screen">
              {/* ✅ Main Content */}
              <main className="px-4 sm:px-6 md:px-8 flex-1 overflow-auto">
                {children}
              </main>
            </div>
          </SidebarWrapper>
        </UserProvider>
      </body>
    </html>
  )
}
