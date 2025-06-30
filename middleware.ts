import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const token =
    req.cookies.get('token')?.value ||
    req.headers.get('cookie')?.match(/token=([^;]+)/)?.[1] || null

  const isProtectedRoute = [
    '/dashboard',
    '/expenses',
    '/wallets',
    '/calendar',
    '/ai-assistant',
    '/reports',
    '/settings',
    '/admin',
  ].some((route) => req.nextUrl.pathname.startsWith(route))

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/sign-in', req.url))
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
    '/admin/:path*',
  ],
}
