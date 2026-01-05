
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// SECURE: Credentials moved to environment variables
// SECURE: Credentials moved to environment variables
const UZUM_SELLER_TOKEN = process.env.UZUM_SELLER_TOKEN || '';
const BASE_URL = 'https://api-seller.uzum.uz/api/seller-openapi';
const SHOP_ID = process.env.UZUM_SHOP_ID ? parseInt(process.env.UZUM_SHOP_ID) : 0;

export const dynamic = 'force-dynamic';

export async function POST() {
    try {
        if (!UZUM_SELLER_TOKEN || !SHOP_ID) {
            console.error("Missing Environment Variables: UZUM_SELLER_TOKEN or UZUM_SHOP_ID");
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        // 1. Fetch latest orders from Uzum (all orders from start of current year)
        const now = new Date();
        const startOfYear = new Date(now.getFullYear(), 0, 1).getTime();
        const dateTo = now.getTime();

        let allNewOrders: any[] = [];
        let currentPage = 0;
        let totalPages = 1;

        console.log(`Starting full refresh from ${new Date(startOfYear).toLocaleDateString()}...`);

        while (currentPage < totalPages) {
            const finUrl = `${BASE_URL}/v1/finance/orders?shopIds=${SHOP_ID}&dateFrom=${startOfYear}&dateTo=${dateTo}&size=100&page=${currentPage}`;

            const response = await fetch(finUrl, {
                headers: {
                    'Authorization': UZUM_SELLER_TOKEN,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const text = await response.text();
                console.error(`Uzum API Error (Page ${currentPage}):`, text);
                break; // Stop but process what we have
            }

            const data = await response.json();
            const pageOrders = data.orderItems || [];
            allNewOrders = [...allNewOrders, ...pageOrders];

            totalPages = data.totalPages || 1;
            currentPage++;

            console.log(`Fetched page ${currentPage}/${totalPages}. Total orders so far: ${allNewOrders.length}`);

            // Safety break to prevent infinite loops in case of unexpected API behavior
            if (currentPage > 100) break;
        }

        const newOrders = allNewOrders;

        // 2. Read existing local data to preserve manual edits (Tan Narxi / purchasePrice)
        const dataPath = path.join(process.cwd(), 'data', 'uzum-orders.json');
        const costMap = new Map<number, number>(); // orderId -> purchasePrice

        if (fs.existsSync(dataPath)) {
            const fileContents = fs.readFileSync(dataPath, 'utf8');
            try {
                const existingOrders = JSON.parse(fileContents);
                // Map existing costs
                existingOrders.forEach((o: any) => {
                    if (typeof o.purchasePrice === 'number') {
                        costMap.set(o.orderId, o.purchasePrice);
                    }
                });
            } catch (e) {
                // If file is corrupt or empty, just proceed
            }
        }

        // 3. Merge new data with preserved costs AND minimalize structure
        const mergedOrders = newOrders.map((newOrder: any) => {
            const savedCost = costMap.get(newOrder.orderId);

            // Extract minimal image URL
            let imageUrl = '';
            try {
                // Check if it's already a string (maybe API changed?) or deep object
                if (typeof newOrder.productImage === 'string') {
                    imageUrl = newOrder.productImage;
                } else {
                    imageUrl = newOrder.productImage?.photo?.['240']?.high ||
                        newOrder.productImage?.photo?.['60']?.high ||
                        '';
                }
            } catch (e) { }

            return {
                id: newOrder.id,
                orderId: newOrder.orderId,
                status: newOrder.status,
                date: newOrder.date,
                skuTitle: newOrder.skuTitle,
                productId: newOrder.productId,
                productImage: imageUrl, // Flattened string only
                sellPrice: newOrder.sellPrice,
                amount: newOrder.amount,
                commission: newOrder.commission,
                sellerProfit: newOrder.sellerProfit,
                logisticDeliveryFee: newOrder.logisticDeliveryFee,
                // Preserve our custom field, default to 0
                purchasePrice: savedCost !== undefined ? savedCost : (newOrder.purchasePrice || 0)
            };
        });

        // 4. Save back to file
        const dir = path.dirname(dataPath);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

        fs.writeFileSync(dataPath, JSON.stringify(mergedOrders, null, 2));

        return NextResponse.json({ success: true, count: mergedOrders.length, orders: mergedOrders });

    } catch (error) {
        console.error("Refresh API Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
