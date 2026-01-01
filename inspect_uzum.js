const fs = require('fs');

async function fetchUzum() {
    const url = 'https://uzum.uz/ru/product/nabor-gubnykh-pomad-2178833';
    const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    };

    try {
        const response = await fetch(url, { headers });
        if (!response.ok) {
            console.error('Failed to fetch:', response.status);
            return;
        }
        const text = await response.text();
        console.log('Fetched length:', text.length);

        // Save to file for inspection
        fs.writeFileSync('uzum_dump.html', text);
        console.log('Saved to uzum_dump.html');

        // Search for keywords
        const quantityMatch = text.match(/"quantity":\s*(\d+)/g);
        console.log('Quantity matches:', quantityMatch);

        const stockMatch = text.match(/"stock":\s*(\d+)/g);
        console.log('Stock matches:', stockMatch);

        // Look for initial state
        const stateMatch = text.match(/window\.__INITIAL_STATE__\s*=\s*({.+?});/);
        if (stateMatch) {
            console.log('Found Initial State!');
            const state = JSON.parse(stateMatch[1]);
            // Try to find product data in state
            // This structure depends on Uzum's implementation, logging keys might help
            // console.log(Object.keys(state)); 
        } else {
            console.log('Initial State not found directly.');
        }

    } catch (e) {
        console.error(e);
    }
}

fetchUzum();
