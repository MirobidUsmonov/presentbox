
import fs from 'fs';
import path from 'path';
import { Product, unifiedProducts } from './translations';

const DATA_DIR = path.join(process.cwd(), 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

export function getProducts(): Product[] {
    if (!fs.existsSync(PRODUCTS_FILE)) {
        // Initialize with default products if file doesn't exist
        saveProducts(unifiedProducts);
        return unifiedProducts;
    }

    try {
        const fileContent = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        console.error("Error reading products file:", error);
        return unifiedProducts; // Fallback
    }
}

export function saveProducts(products: Product[]): void {
    try {
        fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf-8');
    } catch (error) {
        console.error("Error writing products file:", error);
    }
}

export function addProduct(product: Product): Product[] {
    const products = getProducts();
    const newProduct = { ...product, id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1 };

    // Ensure arrays are initialized
    if (!newProduct.gallery) newProduct.gallery = [];
    if (!newProduct.variants) newProduct.variants = [];
    if (newProduct.stockQuantity === undefined) newProduct.stockQuantity = 0;

    products.push(newProduct);
    saveProducts(products);
    return products;
}

export function updateProduct(updatedProduct: Product): Product[] {
    const products = getProducts();
    const index = products.findIndex(p => p.id === updatedProduct.id);

    if (index !== -1) {
        products[index] = updatedProduct;
        saveProducts(products);
    }

    return products;
}

export function deleteProduct(id: number): Product[] {
    let products = getProducts();
    products = products.filter(p => p.id !== id);
    saveProducts(products);
    return products;
}
