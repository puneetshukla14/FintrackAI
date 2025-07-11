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
<div className="min-h-screen flex flex-col">
  <main className="flex-1 flex flex-col">


                {children}
              </main>
            </div>
          </SidebarWrapper>
        </UserProvider>
      </body>
    </html>
  )
}
