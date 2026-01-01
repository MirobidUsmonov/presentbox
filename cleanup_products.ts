
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');

try {
    const fileContent = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
    const products = JSON.parse(fileContent);

    // Filter out the specific duplicate (ID 16)
    // We can also filter out any product with source 'yandex' that lacks a yandexUrl if that's safer,
    // but specific ID is best to avoid accidents.
    const newProducts = products.filter((p: any) => p.id !== 16);

    // Also, let's update ID 3 to ensure it has the correct structure if needed, 
    // but simpler to just remove the bad one.

    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(newProducts, null, 2), 'utf-8');
    console.log(`Removed product with ID 16. Total products: ${newProducts.length}`);
} catch (error) {
    console.error("Error cleaning up products:", error);
}
