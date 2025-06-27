import { NextRequest, NextResponse } from 'next/server'

const protectedRoutes = [
  '/dashboard',
  '/expenses',
  '/wallets',
  // '/calendar',
  // '/ai-assistant',
  // '/reports',
  // '/settings',
  // '/admin',
  // '/import-bank-statement'
]

export function middleware(req: NextRequest) {
  const token =
    req.cookies.get('token')?.value || req.headers.get('authorization')?.replace('Bearer ', '')

  const isProtected = protectedRoutes.some(path => req.nextUrl.pathname.startsWith(path))

  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/sign-in', req.url))
 // or /login if you prefer
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/expenses/:path*',
    '/wallets/:path*',
    '/calendar/:path*',
    '/ai-assistant/:path*',
    '/reports/:path*',
    '/settings/:path*',
    '/admin/:path*'
  ]
}
