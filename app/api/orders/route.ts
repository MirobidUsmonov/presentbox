
import { NextResponse } from 'next/server';
import { getOrders, addOrder } from '@/lib/orders';

export async function GET() {
    try {
        const orders = getOrders();
        // Sort by newest first
        const sortedOrders = orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        return NextResponse.json(sortedOrders);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Basic validation
        if (!body.customer || !body.items || body.items.length === 0) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const newOrder = addOrder(body);

        // Send Telegram Notification
        try {
            const { sendTelegramMessage } = await import('@/lib/telegram');
            let tgUsername = newOrder.customer.telegram || "Yo'q";
            if (tgUsername !== "Yo'q" && !tgUsername.startsWith('@')) {
                tgUsername = `@${tgUsername}`;
            }

            const itemsList = newOrder.items.map((item: any, index: number) =>
                `${index + 1}. ${item.title} ${item.variant ? `(${item.variant})` : ''} - ${item.quantity} x ${item.price}`
            ).join('\n');

            const message = `
<b>📦 Yangi Buyurtma! #${newOrder.id}</b>

👤 <b>Mijoz:</b> ${newOrder.customer.firstName} ${newOrder.customer.lastName}
📞 <b>Tel:</b> ${newOrder.customer.phone}
📍 <b>Manzil:</b> ${newOrder.customer.region}, ${newOrder.customer.district}

🛒 <b>Mahsulotlar:</b>
${itemsList}

💰 <b>Subtotal:</b> ${newOrder.subtotal?.toLocaleString()} so'm
🚚 <b>Yetkazib berish:</b> ${newOrder.deliveryMethod || "Noma'lum"}
📦 <b>Dostavka narxi:</b> ${newOrder.shippingCost === 0 ? "Bepul" : newOrder.shippingCost?.toLocaleString() + " so'm"}
☕ <b>Choychaqa:</b> ${newOrder.tip ? newOrder.tip.toLocaleString() + " so'm" : "0 so'm"}
💵 <b>JAMI:</b> ${newOrder.totalPrice.toLocaleString()} so'm

Telegram: ${tgUsername}
`;
            await sendTelegramMessage(message);
        } catch (tgError) {
            console.error("Failed to send Telegram notification:", tgError);
        }

        return NextResponse.json(newOrder, { status: 201 });
    } catch (error) {
        console.error("Order creation error:", error);
        return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
        }

        const { deleteOrder } = await import('@/lib/orders');
        const updatedOrders = deleteOrder(parseInt(id));
        return NextResponse.json(updatedOrders);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
    }
}
