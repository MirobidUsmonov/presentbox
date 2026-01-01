
import { NextResponse } from 'next/server';
import { getRoles, addRole, updateRole, deleteRole } from '@/lib/roles';

export async function GET() {
    try {
        const roles = getRoles();
        return NextResponse.json(roles);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch roles' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        if (!body.name || !body.permissions) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const newRole = addRole(body);
        return NextResponse.json(newRole, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create role' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        if (!body.id) {
            return NextResponse.json({ error: 'Role ID is required' }, { status: 400 });
        }

        const updatedRoles = updateRole(body.id, body);
        return NextResponse.json(updatedRoles);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update role' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Role ID is required' }, { status: 400 });
        }

        try {
            const updatedRoles = deleteRole(parseInt(id));
            return NextResponse.json(updatedRoles);
        } catch (e: any) {
            return NextResponse.json({ error: e.message }, { status: 400 });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete role' }, { status: 500 });
    }
}
