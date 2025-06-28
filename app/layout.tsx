import './globals.css'
import SidebarWrapper from './SidebarWrapper'
import ClientLoader from '@/components/ClientLoader' // 👈 client component wrapper

export const metadata = {
  title: 'Fintrack',
  description: 'Smart Expense Manager',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <ClientLoader>
          <SidebarWrapper>{children}</SidebarWrapper>
        </ClientLoader>
      </body>
    </html>
  )
}
