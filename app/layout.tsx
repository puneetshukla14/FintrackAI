import './globals.css'

import SidebarWrapper from './SidebarWrapper'

export const metadata = {
  title: 'ExpenseX Pro',
  description: 'Smart Expense Manager',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <SidebarWrapper>{children}</SidebarWrapper>
      </body>
    </html>
  )
}