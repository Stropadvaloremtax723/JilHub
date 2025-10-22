import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const isAdminPath = request.nextUrl.pathname.startsWith('/admin')
  const isLoginPath = request.nextUrl.pathname === '/admin/login'

  // Redirect to login if accessing admin without token
  if (isAdminPath && !isLoginPath && !token) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  // Redirect to admin dashboard if already logged in and accessing login page
  if (isLoginPath && token) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  // Check if user is admin
  if (isAdminPath && !isLoginPath && token?.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}
