async function test() {
    const productId = '2178833';
    const apiUrl = `https://api.uzum.uz/api/v2/product/${productId}`;
    const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Origin': 'https://uzum.uz',
        'Referer': 'https://uzum.uz/',
        'x-iis-call': 'true'
    };

    try {
        const res = await fetch(apiUrl, { headers });
        const data = await res.json();

        // Save immediately so we can see it if it crashes later
        require('fs').writeFileSync('uzum_api_sample.json', JSON.stringify(data, null, 2));

        const p = data.payload?.data;
        if (!p) {
            console.log('No payload data found');
            return;
        }

        console.log('Title:', p.title);
        console.log('Keys in data:', Object.keys(p));

        if (p.skuList && p.skuList[0]) {
            console.log('First SKU Keys:', Object.keys(p.skuList[0]));
            const sku = p.skuList[0];
            const price = sku.purchasePrice || sku.sellPrice || sku.fullPrice;
            console.log('Price found:', price);
        }

        console.log('Photos:', p.photos ? p.photos.length : 0);
        console.log('Description Length:', p.description ? p.description.length : 0);
        console.log('Char Groups:', p.characteristics ? p.characteristics.length : 0);
    } catch (e) {
        console.error('Error during test:', e);
    }
}
test();
