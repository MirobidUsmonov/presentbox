
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { sendTelegramMessage } from '@/lib/telegram';

// File paths
const DATA_DIR = path.join(process.cwd(), 'data');
const UZUM_ORDERS_FILE = path.join(DATA_DIR, 'uzum-orders.json');
const INTERNAL_ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

export async function GET() {
    try {
        let allOrders: any[] = [];

        // 1. Read Internal Orders (from site)
        if (fs.existsSync(INTERNAL_ORDERS_FILE)) {
            try {
                const internalRaw = fs.readFileSync(INTERNAL_ORDERS_FILE, 'utf8');
                if (internalRaw.trim()) {
                    const internalOrders = JSON.parse(internalRaw);

                    // Enhance internal orders with top-level product info for table display
                    const enhancedInternalOrders = internalOrders.map((o: any) => {
                        const firstItem = o.items && o.items.length > 0 ? o.items[0] : null;
                        return {
                            ...o,
                            // Ensure these fields exist for the table to render correctly
                            productTitle: o.productTitle || (firstItem ? firstItem.title : 'Mahsulot(lar)'),
                            productImage: o.productImage || (firstItem ? firstItem.image : ''),
                            // Ensure total price is correct if missing
                            totalPrice: o.totalPrice || o.subtotal + (o.shippingCost || 0)
                        };
                    });

                    allOrders = [...allOrders, ...enhancedInternalOrders];
                }
            } catch (e) {
                console.error("Error reading internal orders:", e);
                // Continue without internal orders
            }
        }

        // 2. Read Uzum Orders
        if (fs.existsSync(UZUM_ORDERS_FILE)) {
            try {
                const uzumRaw = fs.readFileSync(UZUM_ORDERS_FILE, 'utf8');
                if (uzumRaw.trim()) {
                    const rawUzumOrders = JSON.parse(uzumRaw);

                    // Map raw Uzum data to our internal Order interface
                    const uzumOrders = rawUzumOrders.map((o: any) => ({
                        id: o.id,
                        createdAt: o.date ? new Date(o.date).toISOString() : new Date().toISOString(),
                        productTitle: o.skuTitle || 'Mahsulot',
                        productImage: typeof o.productImage === 'string' ? o.productImage : '',
                        totalPrice: (o.sellPrice || 0) * (o.amount > 0 ? o.amount : 1),
                        status: (o.status || 'new').toLowerCase() === 'canceled' ? 'cancelled' : (o.status || 'new').toLowerCase(),
                        // Mock customer data for Uzum orders
                        customer: {
                            firstName: "Mijoz",
                            lastName: o.orderId ? `#${o.orderId}` : '',
                            phone: "+998 -- --- -- --",
                            region: "Noma'lum",
                            district: "-",
                            telegram: ""
                        },
                        items: [
                            {
                                id: o.productId,
                                title: o.skuTitle,
                                price: o.sellPrice,
                                quantity: o.amount > 0 ? o.amount : 1
                            }
                        ],
                        // Financial data
                        purchasePrice: o.purchasePrice || 0,
                        commission: o.commission || 0,
                        logisticDeliveryFee: o.logisticDeliveryFee || 0,
                        sellerProfit: o.sellerProfit || 0,
                        variant: 'Standard'
                    }));

                    allOrders = [...allOrders, ...uzumOrders];
                }
            } catch (e) {
                console.error("Error reading Uzum orders:", e);
            }
        }

        // Sort by date (newest first)
        allOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        return NextResponse.json({ orders: allOrders });
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Read existing internal orders
        let orders: any[] = [];
        if (fs.existsSync(INTERNAL_ORDERS_FILE)) {
            try {
                const fileContent = fs.readFileSync(INTERNAL_ORDERS_FILE, 'utf-8');
                if (fileContent.trim()) {
                    orders = JSON.parse(fileContent);
                }
            } catch (e) {
                console.error("Error parsing orders.json, resetting to empty:", e);
                orders = [];
            }
        }

        // Generate new ID (find max ID < 100000 to avoid conflict with Uzum IDs)
        const maxId = orders.reduce((max, order) => (order.id < 100000 && order.id > max) ? order.id : max, 0);
        const newId = maxId + 1;

        const newOrder = {
            id: newId,
            createdAt: new Date().toISOString(),
            status: 'new',
            ...body
        };

        orders.push(newOrder);

        // Save back to file
        fs.writeFileSync(INTERNAL_ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');

        // Send Telegram Notification
        const itemsList = newOrder.items.map((i: any) => `- ${i.title} (${i.quantity}x)`).join('\n');
        const message = `
📦 <b>Yangi buyurtma! (#${newId})</b>

👤 <b>Mijoz:</b> ${newOrder.customer.firstName} ${newOrder.customer.lastName}
📞 <b>Tel:</b> ${newOrder.customer.phone}
📍 <b>Manzil:</b> ${newOrder.customer.region}, ${newOrder.customer.district}

🛒 <b>Mahsulotlar:</b>
${itemsList}

💰 <b>Jami:</b> ${newOrder.totalPrice.toLocaleString()} so'm
🚚 <b>Yetkazib berish:</b> ${newOrder.deliveryMethod}
        `;

        // Fire and forget telegram message (don't await to avoid blocking response)
        sendTelegramMessage(message).catch(err => console.error("BG Telegram Error:", err));

        return NextResponse.json(newOrder, { status: 201 });

    } catch (error) {
        console.error("Failed to create order:", error);
        return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }
}

// Handle DELETE for internal orders
export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = parseInt(searchParams.get('id') || '0');

        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        if (fs.existsSync(INTERNAL_ORDERS_FILE)) {
            const fileContent = fs.readFileSync(INTERNAL_ORDERS_FILE, 'utf-8');
            let orders = JSON.parse(fileContent);

            const initialLength = orders.length;
            orders = orders.filter((o: any) => o.id !== id);

            if (orders.length < initialLength) {
                fs.writeFileSync(INTERNAL_ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');
                return NextResponse.json({ success: true });
            }
        }

        return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }
}
