import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const shopUrl = searchParams.get('url');

    if (!shopUrl) {
        return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    try {
        const response = await fetch(shopUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
                'x-iis-call': 'true'
            },
            next: { revalidate: 0 }
        });

        if (!response.ok) {
            return NextResponse.json({ error: 'Failed to fetch Uzum shop page' }, { status: response.status });
        }

        const html = await response.text();

        // 1. Extract JSON-LD
        let sellerInfo: any = {};
        const jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
        if (jsonLdMatch) {
            try {
                const jsonLd = JSON.parse(jsonLdMatch[1]);
                const ratingInfo = jsonLd.aggregateRating;
                sellerInfo = {
                    name: jsonLd.name || "",
                    logo: jsonLd.image || jsonLd.logo || "",
                    rating: ratingInfo?.ratingValue || 5.0,
                    reviewsCount: ratingInfo?.reviewCount || 0,
                    registrationDate: "Noma'lum",
                };
            } catch (e) {
                console.error("JSON-LD parse error:", e);
            }
        }

        // 2. Extract Orders count using Regex (try multiple patterns)
        // Example: "27 616 заказов" or "21 634 продаж"
        const ordersMatch = html.match(/(\d[\d\s]*)\s*(заказов|продаж)/);
        sellerInfo.ordersCount = ordersMatch ? ordersMatch[1].trim() : "0";

        // 3. Extract Registration Date (if visible)
        const regMatch = html.match(/на Uzum с (.*?)<\/div>/);
        if (regMatch) {
            sellerInfo.registrationDate = regMatch[1].trim();
        }

        return NextResponse.json({
            ...sellerInfo,
            url: shopUrl,
            lastSynced: new Date().toISOString()
        });

    } catch (error: any) {
        console.error('Seller Scraper Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
