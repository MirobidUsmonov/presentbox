import https from 'https';

export function extractUzumId(url: string): string | null {
    // Regex to find ID at the end of the URL or before ?skuId
    // Example: https://uzum.uz/ru/product/...-2038777
    // Example: https://uzum.uz/ru/product/...-2038777?skuId=...
    const match = url.match(/-(\d+)(\?|$)/);
    return match ? match[1] : null;
}

export async function getUzumStock(productId: string): Promise<number | null> {
    return new Promise((resolve) => {
        const url = `https://api.uzum.uz/api/v2/product/${productId}`;
        const headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            'Accept': 'application/json, text/plain, */*',
            'Origin': 'https://uzum.uz',
            'Referer': 'https://uzum.uz/',
            'x-iis-call': 'true'
        };

        const req = https.get(url, { headers }, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                if (res.statusCode !== 200) {
                    console.error(`Error fetching Uzum data for ID ${productId}: Status ${res.statusCode}`);
                    resolve(null);
                    return;
                }
                try {
                    const json = JSON.parse(data);
                    const skus = json?.payload?.data?.skuList || [];
                    const total = skus.reduce((acc: number, curr: any) => acc + (curr.availableAmount || 0), 0);
                    resolve(total);
                } catch (e: any) {
                    console.error(`Error parsing Uzum JSON for ID ${productId}:`, e.message);
                    resolve(null);
                }
            });
        });

        req.on('error', (e) => {
            console.error(`Request error for Uzum ID ${productId}:`, e.message);
            resolve(null);
        });

        req.end();
    });
}
