
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'uzum-orders.json');

if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

export function saveUzumOrders(orders: any[]) {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
}

export function getUzumOrders(): any[] {
    if (!fs.existsSync(ORDERS_FILE)) return [];
    try {
        return JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf-8'));
    } catch {
        return [];
    }
}
