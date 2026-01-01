
import { NextResponse } from 'next/server';
import { updateOrderDetails } from '@/lib/orders';
import { Order } from '@/lib/orders';

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);
        const body = await request.json();

        // Update status if provided
        if (body.status) {
            const validStatuses: Order['status'][] = ['new', 'accepted', 'shipping', 'delivered', 'cancelled'];
            if (!validStatuses.includes(body.status)) {
                return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
            }
        }

        // Update the order with any provided fields
        const updatedOrders = updateOrderDetails(id, body);
        const updatedOrder = updatedOrders.find(o => o.id === id);

        if (!updatedOrder) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json(updatedOrder);
    } catch (error) {
        console.error("Order update error:", error);
        return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }
}
