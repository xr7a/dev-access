import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token
        const path = req.nextUrl.pathname

        // Admin routes - require ADMIN role
        if (path.startsWith('/admin')) {
            if (token?.role !== 'ADMIN') {
                return NextResponse.redirect(new URL('/dashboard', req.url))
            }
        }

        // Locale Middleware (Cookie based)
        // If cookie is missing, set default to RU (or detect from header if we want to be fancy)
        const response = NextResponse.next()
        if (!req.cookies.has('NEXT_LOCALE')) {
            response.cookies.set('NEXT_LOCALE', 'ru')
        }

        return response
    },
    {
        callbacks: {
            authorized: ({ token }) => true, // Let middleware handle redirects, or keep as is. Actually 'authenticated' pages are protected by config.matcher usually.
            // But we want this middleware to run on PUBLIC pages too for locale? 
            // The config.matcher below lists '/dashboard' and '/admin'. 
            // We need to expand matcher to run on ALL pages if we want locale everywhere.
        },
    }
)

export const config = {
    // Match all request paths except for the ones starting with:
    // - api (API routes)
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
