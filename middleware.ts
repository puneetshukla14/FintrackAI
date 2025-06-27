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

  // Check if current path is protected
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )

  if (isProtected && !token) {
    // Redirect unauthenticated user to sign-in
    const signInUrl = req.nextUrl.clone()
    signInUrl.pathname = '/sign-in'
    signInUrl.searchParams.set('redirectedFrom', pathname) // Optional: Track original route
    return NextResponse.redirect(signInUrl)
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
