import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function GET(request: Request) {
    try {
        const url = 'https://uzum.uz/ru/product/nabor-gubnykh-pomad-2178833?skuId=7811462';

        // Mimic a browser to avoid simple bot detection
        const headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        };

        const response = await fetch(url, { headers, next: { revalidate: 0 } });

        if (!response.ok) {
            return NextResponse.json({ error: `Failed to fetch: ${response.status} ${response.statusText}` }, { status: 500 });
        }

        const html = await response.text();

        // Basic parsing logic (this needs to be refined based on actual HTML structure)
        // Looking for widely used schema.org data or searching for specific Uzum classes

        // Regex for price to verify we got the right page
        const priceMatch = html.match(/(\d+\s*\d+)\s*сум/);
        const titleMatch = html.match(/<h1[^>]*>([^<]+)<\/h1>/);

        return NextResponse.json({
            status: 'success',
            fetchedUrl: url,
            contentLength: html.length,
            sampleTitle: titleMatch ? titleMatch[1].trim() : 'Not found',
            samplePrice: priceMatch ? priceMatch[0] : 'Not found',
            htmlPreview: html.substring(0, 500)
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
    }
}
