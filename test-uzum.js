
const UZUM_SELLER_TOKEN = 'iDyntS+h8CZLNspTIorSAC4fY+iVdmd7lVxRgc5qRJM=';
const BASE_URL = 'https://api-seller.uzum.uz/api/seller-openapi';

async function test() {
    console.log("Testing Uzum API...");

    const shopsUrl = `${BASE_URL}/v1/shops`;
    console.log(`Fetching shops: ${shopsUrl}`);

    try {
        const shopsRes = await fetch(shopsUrl, {
            headers: {
                'Authorization': UZUM_SELLER_TOKEN,
                'Content-Type': 'application/json'
            }
        });

        const shopsText = await shopsRes.text();
        console.log(`Shops Status: ${shopsRes.status}`);
        console.log(`Shops Response: ${shopsText}`);

        if (shopsRes.ok) {
            const shopsData = JSON.parse(shopsText);
            const shopIds = shopsData.map(s => s.id) || [];

            if (shopIds.length > 0) {
                const dateFrom = 0; // Fetch everything
                const dateTo = new Date().getTime();
                const shopId = 85087;

                // Test Finance orders
                const finUrl = `${BASE_URL}/v1/finance/orders?shopIds=${shopId}&dateFrom=${dateFrom}&dateTo=${dateTo}`;
                console.log(`Fetching finance orders: ${finUrl}`);

                const finRes = await fetch(finUrl, {
                    headers: {
                        'Authorization': UZUM_SELLER_TOKEN,
                        'Content-Type': 'application/json'
                    }
                });

                const finText = await finRes.text();
                console.log(`Finance Status: ${finRes.status}`);

                if (finRes.ok) {
                    const data = JSON.parse(finText);
                    const fs = require('fs');
                    const path = require('path');
                    const dir = path.join(__dirname, 'data');
                    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
                    fs.writeFileSync(path.join(dir, 'uzum-orders.json'), JSON.stringify(data.orderItems, null, 2));
                    console.log(`Saved ${data.orderItems.length} items to data/uzum-orders.json`);
                }
            } else {
                console.log("No shops found to test orders.");
            }
        }
    } catch (e) {
        console.error("Test failed with error:", e);
    }
}

test();
