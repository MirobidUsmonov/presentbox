
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySession } from '@/lib/security';

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // 1. Protect Admin UI Routes
    if (path.startsWith('/admin')) {
        const token = request.cookies.get('admin_session')?.value;

        // If we have a token, check validity
        // Note: In Edge runtime (middleware), node:crypto might behave differently or be polyfilled.
        // If verifySession fails due to runtime, we might need Web Crypto.
        // For local dev (Node), this works.
        const session = token ? await verifySession(token) : null;

        if (!session) {
            return NextResponse.redirect(new URL('/kirsaboladi', request.url));
        }

        // Optional: Check expiration from payload
        const [username, roleId, exp] = session.split('|');
        if (parseInt(exp) < Date.now()) {
            // Session expired
            const response = NextResponse.redirect(new URL('/kirsaboladi', request.url));
            response.cookies.delete('admin_session');
            return response;
        }
    }

    // 2. Protect Admin API Routes (State-changing operations)
    if (path.startsWith('/api')) {
        // Skip auth check for:
        // - /api/auth/* (Login needs to be public)
        // - GET requests (read-only data for storefront)
        // - /api/upload (if public upload is needed? Probably not, usually admin only)

        if (path.startsWith('/api/auth')) {
            return NextResponse.next();
        }

        // If it's a mutation (POST, PUT, DELETE, PATCH), require Admin Auth
        if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
            // EXCEPTION: Allow public to create orders
            if (path === '/api/orders' && request.method === 'POST') {
                return NextResponse.next();
            }

            const token = request.cookies.get('admin_session')?.value;
            const session = token ? await verifySession(token) : null;

            if (!session) {
                return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
            }
        }

        // Also protect sensitive GET routes
        const protectedGetPaths = ['/api/admins', '/api/orders', '/api/roles', '/api/customers'];
        if (request.method === 'GET' && protectedGetPaths.some(p => path.startsWith(p))) {
            const token = request.cookies.get('admin_session')?.value;
            const session = token ? await verifySession(token) : null;

            if (!session) {
                return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/admin/:path*',
        '/api/:path*',
    ],
};
