import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const authCookie = request.cookies.get('kprit_auth')?.value
  const isAuthenticated = authCookie === '25ra1a05bv'

  const isAuthRoute = request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/forgot-password'
  
  if (request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  if (!isAuthenticated && !isAuthRoute && !request.nextUrl.pathname.startsWith('/api') && request.nextUrl.pathname !== '/') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
