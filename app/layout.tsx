import './globals.css'
import SidebarWrapper from './SidebarWrapper'
import ClientLoader from '@/components/ClientLoader'
import { UserProvider } from '@/context/UserContext'
import Header from '@/components/Header'

export const metadata = {
  title: 'Fintrack',
  description: 'Smart Expense Manager',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="text-white">
        <UserProvider>
          <ClientLoader>
            <SidebarWrapper>
              <div className="flex flex-col min-h-screen">
                {/* ✅ Sticky Header without background */}
                <div className="sticky top-0 z-50">
                  <Header />
                </div>

                {/* ✅ Main Content */}
                <main className="px-4 sm:px-6 md:px-8 flex-1 overflow-auto">
                  {children}
                </main>
              </div>
            </SidebarWrapper>
          </ClientLoader>
        </UserProvider>
      </body>
    </html>
  )
}
