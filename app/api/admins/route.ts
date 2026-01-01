
import { NextResponse } from 'next/server';
import { getAdmins, addAdmin, updateAdmin, deleteAdmin } from '@/lib/admins';
import { hashPassword } from '@/lib/security';

export async function GET() {
    try {
        const admins = getAdmins();
        const safeAdmins = admins.map(({ password, hash, salt, ...rest }) => rest);
        return NextResponse.json(safeAdmins);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch admins' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        // Basic validation
        if (!body.username || !body.roleId || !body.fullName || !body.password) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const { hash, salt } = await hashPassword(body.password);
        const adminData = {
            ...body,
            hash,
            salt,
        };
        delete adminData.password;

        const newAdmin = addAdmin(adminData);
        return NextResponse.json(newAdmin, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create admin' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        if (!body.id) {
            return NextResponse.json({ error: 'Admin ID is required' }, { status: 400 });
        }

        if (body.password) {
            const { hash, salt } = await hashPassword(body.password);
            body.hash = hash;
            body.salt = salt;
            delete body.password;
        }

        const updatedAdmins = updateAdmin(body.id, body);
        return NextResponse.json(updatedAdmins);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update admin' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Admin ID is required' }, { status: 400 });
        }

        try {
            const updatedAdmins = deleteAdmin(parseInt(id));
            return NextResponse.json(updatedAdmins);
        } catch (e: any) {
            return NextResponse.json({ error: e.message }, { status: 400 });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete admin' }, { status: 500 });
    }
}
