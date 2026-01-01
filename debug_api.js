
const url = 'http://localhost:3000/api/uzum-info?url=https://uzum.uz/ru/product/nastennye-polki-z-obraznye-1-st-1065602';

async function test() {
    try {
        const res = await fetch(url);
        const data = await res.json();
        console.log('API Result:', JSON.stringify(data.seller, null, 2));
    } catch (e) {
        console.error('Error:', e.message);
    }
}

test();
