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
    pathname === route || pathname.startsWith(route + '/')
  )

  const isAuthPage = pathname === '/sign-in' || pathname === '/sign-up'

  // ✅ Redirect to login if accessing protected route without token
  if (isProtected && !token) {
    const signInUrl = req.nextUrl.clone()
    signInUrl.pathname = '/sign-in'
    signInUrl.searchParams.set('redirectedFrom', pathname)
    return NextResponse.redirect(signInUrl)
  }

  // ✅ Prevent logged-in users from seeing auth pages
  if (token && isAuthPage) {
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
