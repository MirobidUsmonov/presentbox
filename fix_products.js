
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(process.cwd(), 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');

try {
    const fileContent = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
    let products = JSON.parse(fileContent);

    // 1. Remove ID 16
    products = products.filter(p => p.id !== 16);

    // 2. Find ID 3 and add yandexUrl
    const product3 = products.find(p => p.id === 3);
    if (product3) {
        // Use Uzum URL as temporary placeholder for Yandex URL so the button appears
        if (!product3.yandexUrl) {
            product3.yandexUrl = product3.uzumUrl;
        }
    }

    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf-8');
    console.log("Fixed: Removed ID 16 and updated ID 3.");
} catch (error) {
    console.error("Error fixing products:", error);
}
