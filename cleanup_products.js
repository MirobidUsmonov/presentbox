
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(process.cwd(), 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');

try {
    const fileContent = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
    const products = JSON.parse(fileContent);

    // Filter out the specific duplicate (ID 16)
    const newProducts = products.filter((p) => p.id !== 16);

    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(newProducts, null, 2), 'utf-8');
    console.log(`Removed product with ID 16. Total products: ${newProducts.length}`);
} catch (error) {
    console.error("Error cleaning up products:", error);
}
