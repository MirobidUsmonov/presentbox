
const UZUM_SELLER_TOKEN = process.env.UZUM_SELLER_TOKEN || '';
const BASE_URL = 'https://api-seller.uzum.uz/api/seller-openapi';

async function uzumFetch(endpoint: string, options: RequestInit = {}, retries = 3, backoff = 1000) {
    const url = `${BASE_URL}${endpoint}`;

    for (let i = 0; i < retries; i++) {
        console.log(`Uzum API Request (Attempt ${i + 1}): ${options.method || 'GET'} ${url}`);

        const res = await fetch(url, {
            ...options,
            headers: {
                'Authorization': UZUM_SELLER_TOKEN,
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        const status = res.status;
        const text = status === 204 ? "" : await res.text();
        console.log(`Uzum API Response Status: ${status}`);

        if (status === 429 && i < retries - 1) {
            console.warn(`Uzum API Rate Limit (429). Retrying in ${backoff}ms...`);
            await new Promise(resolve => setTimeout(resolve, backoff));
            backoff *= 2;
            continue;
        }

        if (!res.ok) {
            console.error(`Uzum API Error body: ${text}`);
            throw new Error(`Uzum API failed: ${status} ${text}`);
        }

        try {
            const parsed = text ? JSON.parse(text) : {};
            return parsed;
        } catch (e) {
            console.warn('Uzum API response is not JSON:', text);
            return text;
        }
    }
}

export async function getShops() {
    return uzumFetch('/v1/shops');
}

/**
 * Fetch detailed financial data for orders. 
 * This is the primary source for Unit Economics.
 */
export async function getFinancialOrders(shopIds: number[], dateFrom: number, dateTo: number) {
    // Note: Uzum API expects shopIds as repeated query parameters or comma separated depending on version
    // Based on research, query parameters as shopIds=1&shopIds=2 or shopIds=1,2
    const query = new URLSearchParams();
    shopIds.forEach(id => query.append('shopIds', id.toString()));
    query.set('dateFrom', dateFrom.toString());
    query.set('dateTo', dateTo.toString());

    return uzumFetch(`/v1/finance/orders?${query.toString()}`);
}

/**
 * Fetch general expenses (storage, marketing, etc.)
 */
export async function getExpenses(shopIds: number[], dateFrom: number, dateTo: number) {
    const query = new URLSearchParams();
    shopIds.forEach(id => query.append('shopIds', id.toString()));
    query.set('dateFrom', dateFrom.toString());
    query.set('dateTo', dateTo.toString());

    return uzumFetch(`/v1/finance/expenses?${query.toString()}`);
}

/**
 * Fetch product catalog for a shop. 
 * Useful for syncing prices and stock (FBO catalog).
 */
export async function getShopProducts(shopId: number, size = 100, page = 0) {
    return uzumFetch(`/v1/product/shop/${shopId}?size=${size}&page=${page}`);
}

/**
 * Bulk update product prices
 */
export async function updatePrices(shopId: number, priceData: { skuId: number, price: number }[]) {
    return uzumFetch(`/v1/product/${shopId}/sendPriceData`, {
        method: 'POST',
        body: JSON.stringify(priceData)
    });
}
