
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { orderId, purchasePrice } = body;

        if (!orderId || typeof purchasePrice !== 'number') {
            return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
        }

        const dataPath = 'C:\\Users\\Windows 11\\.gemini\\antigravity\\scratch\\presentbox\\data\\uzum-orders.json';

        if (fs.existsSync(dataPath)) {
            const fileContents = fs.readFileSync(dataPath, 'utf8');
            const orders = JSON.parse(fileContents);

            const orderIndex = orders.findIndex((o: any) => o.id === orderId || o.orderId === orderId); // Check both just in case

            if (orderIndex !== -1) {
                // Update the specific order
                orders[orderIndex].purchasePrice = purchasePrice;

                // Write back to file
                fs.writeFileSync(dataPath, JSON.stringify(orders, null, 2));

                return NextResponse.json({ success: true, order: orders[orderIndex] });
            } else {
                return NextResponse.json({ error: 'Order not found' }, { status: 404 });
            }
        }

        return NextResponse.json({ error: 'Database not found' }, { status: 500 });
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }
}
