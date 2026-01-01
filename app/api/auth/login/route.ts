import { NextResponse } from 'next/server';
import { getAdmins } from '@/lib/admins';
import { verifyPassword, signSession } from '@/lib/security';

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json();

        if (!username || !password) {
            return NextResponse.json({ error: 'Login va parol kiritilishi shart' }, { status: 400 });
        }

        const admins = getAdmins();
        const admin = admins.find(a => a.username === username);

        if (!admin) {
            return NextResponse.json({ error: "Login yoki parol noto'g'ri" }, { status: 401 });
        }

        // Check if admin has hash/salt (new system)
        if (admin.hash && admin.salt) {
            const isValid = await verifyPassword(password, admin.hash, admin.salt);
            if (!isValid) {
                return NextResponse.json({ error: "Login yoki parol noto'g'ri" }, { status: 401 });
            }
        } else if (admin.password) {
            // Fallback for old system (if any entries left)
            if (admin.password !== password) {
                return NextResponse.json({ error: "Login yoki parol noto'g'ri" }, { status: 401 });
            }
        } else {
            // No credentials found
            return NextResponse.json({ error: "Login yoki parol noto'g'ri" }, { status: 401 });
        }

        // Success - Create Session
        const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 1 day
        const payload = `${admin.username}|${admin.roleId}|${expiresAt}`;
        const token = await signSession(payload);

        const { hash, salt, password: _, ...adminSafe } = admin;

        const response = NextResponse.json({ user: adminSafe });

        response.cookies.set('admin_session', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24, // 1 day
            path: '/',
        });

        return response;
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ error: 'Tizim xatoligi' }, { status: 500 });
    }
}
