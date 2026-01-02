import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const productUrl = searchParams.get('url');

    if (!productUrl) {
        return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    try {
        // Extract Product ID and SKU ID from URL
        // Example: https://uzum.uz/ru/product/nabor-gubnykh-pomad-2178833?skuId=7811462
        const urlObj = new URL(productUrl);
        const match = urlObj.pathname.match(/-(\d+)$/); // Extract 2178833 from path
        const productId = match ? match[1] : null;
        const skuId = urlObj.searchParams.get('skuId');

        if (!productId) {
            return NextResponse.json({ error: 'Invalid Product URL' }, { status: 400 });
        }

        const apiUrl = `https://api.uzum.uz/api/v2/product/${productId}`;

        const headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            'Accept': 'application/json, text/plain, */*',
            'Origin': 'https://uzum.uz',
            'Referer': 'https://uzum.uz/',
            'x-iis-call': 'true'
        };

        const response = await fetch(apiUrl, { headers, next: { revalidate: 0 } });

        if (!response.ok) {
            console.error(`Uzum API fetch failed: ${response.status}`);
            return NextResponse.json({ error: 'Failed to fetch external API', status: response.status }, { status: response.status });
        }

        const data = await response.json();

        // Navigate to stock data
        // Structure: payload.data.skuList[]
        const skuList = data?.payload?.data?.skuList;

        if (!skuList || !Array.isArray(skuList)) {
            return NextResponse.json({ error: 'Invalid API response structure' }, { status: 500 });
        }

        let stock = 0;
        let price = 0;
        let fullPrice = 0;

        if (skuId) {
            const sku = skuList.find((s: any) => String(s.id) === String(skuId));
            if (sku) {
                stock = sku.availableAmount;
                price = sku.purchasePrice;
                fullPrice = sku.fullPrice;
            } else {
                // SKU specified but not found? Fallback to first available
                const firstAvailable = skuList.find((s: any) => s.availableAmount > 0) || skuList[0];
                if (firstAvailable) {
                    stock = firstAvailable.availableAmount;
                    price = firstAvailable.purchasePrice;
                    fullPrice = firstAvailable.fullPrice;
                }
            }
        } else {
            // No SKU specified, try to find the one that matches the product "minPrice" or just the first available
            const firstAvailable = skuList.find((s: any) => s.availableAmount > 0) || skuList[0];
            if (firstAvailable) {
                stock = skuList.reduce((acc: number, curr: any) => acc + curr.availableAmount, 0); // Total stock
                price = firstAvailable.purchasePrice;
                fullPrice = firstAvailable.fullPrice;
            }
        }

        return NextResponse.json({ stock, price, fullPrice });

    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
