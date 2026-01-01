const https = require('https');

const productId = '2038777';
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
    res.on('data', c => data += c);
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            const skus = json.payload.data.skuList;
            console.log('Product ID:', productId);
            console.log('SKUs found:', skus.length);
            const total = skus.reduce((acc, curr) => acc + curr.availableAmount, 0);
            console.log('Total Available:', total);
        } catch (e) {
            console.error('Error parsing JSON:', e.message);
            console.log('Raw data:', data.substring(0, 200));
        }
    });
});
