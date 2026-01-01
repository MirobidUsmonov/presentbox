
const UZUM_SELLER_TOKEN = 'iDyntS+h8CZLNspTIorSAC4fY+iVdmd7lVxRgc5qRJM=';
const BASE_URL = 'https://api-seller.uzum.uz/api/seller-openapi';

async function test() {
    const url = `${BASE_URL}/v1/product/shop/85087?size=100&page=0`;
    const res = await fetch(url, {
        headers: {
            'Authorization': UZUM_SELLER_TOKEN
        }
    });
    const data = await res.json();
    const products = data.productList || [];

    products.forEach(p => {
        if (p.productId === 2025302) {
            console.log(JSON.stringify(p, null, 2));
        }
    });
}

test();
