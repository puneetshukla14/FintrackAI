import { NextRequest, NextResponse } from 'next/server'

const protectedRoutes = [
  '/dashboard',
  '/expenses',
  '/wallets',
  '/calendar',
  '/ai-assistant',
  '/reports',
  '/settings',
  '/admin'
]

export function middleware(req: NextRequest) {
  const token =
    req.cookies.get('token')?.value ||
    req.headers.get('authorization')?.replace('Bearer ', '')

  const { pathname } = req.nextUrl

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )

  // ✅ Redirect to login if trying to access protected page without auth
  if (isProtected && !token) {
    const signInUrl = req.nextUrl.clone()
    signInUrl.pathname = '/sign-in'
    signInUrl.searchParams.set('redirectedFrom', pathname)
    return NextResponse.redirect(signInUrl)
  }

  // ✅ If already logged in, block access to /sign-in and /sign-up
  if (!isProtected && token && (pathname === '/sign-in' || pathname === '/sign-up')) {
    const dashboardUrl = req.nextUrl.clone()
    dashboardUrl.pathname = '/dashboard'
    return NextResponse.redirect(dashboardUrl)
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
    '/sign-in',
    '/sign-up'
  ]
}
