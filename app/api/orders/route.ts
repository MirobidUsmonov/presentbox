
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
    try {
        // Path to the real Uzum data
        const dataPath = 'C:\\Users\\Windows 11\\.gemini\\antigravity\\scratch\\presentbox\\data\\uzum-orders.json';

        let orders = [];

        if (fs.existsSync(dataPath)) {
            const fileContents = fs.readFileSync(dataPath, 'utf8');
            let rawOrders = JSON.parse(fileContents);

            // Map raw Uzum data to our internal Order interface
            orders = rawOrders.map((o: any) => ({
                id: o.id,
                // Convert timestamp to ISO string. Handle potential invalid dates gracefully.
                createdAt: o.date ? new Date(o.date).toISOString() : new Date().toISOString(),
                productTitle: o.skuTitle || 'Mahsulot',
                // Image is now a simple string in our cleaned DB
                productImage: typeof o.productImage === 'string' ? o.productImage : '',
                // Calculate total price, ensure amount is at least 1 for display if 0
                totalPrice: (o.sellPrice || 0) * (o.amount > 0 ? o.amount : 1),
                // Map status to lowercase and standardize 'canceled' -> 'cancelled'
                status: (o.status || 'new').toLowerCase() === 'canceled' ? 'cancelled' : (o.status || 'new').toLowerCase(),
                // Mock customer data since it's missing in the JSON
                customer: {
                    firstName: "Mijoz",
                    lastName: o.orderId ? `#${o.orderId}` : '',
                    phone: "+998 -- --- -- --", // Placeholder as data is missing
                    region: "Noma'lum", // Placeholder
                    district: "-", // Placeholder
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
                // Add extra fields if needed by UI
                variant: 'Standard'
            }));

        } else {
            // Fallback or empty
            return NextResponse.json({ orders: [], message: 'No data file found' });
        }

        return NextResponse.json({ orders });
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}
