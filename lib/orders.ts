
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

export interface Order {
    id: number;
    productId: number;
    productTitle: string;
    productImage: string;
    variant?: string;
    price: string;
    quantity: number;
    totalPrice: number;
    customer: {
        firstName: string;
        lastName: string;
        phone: string;
        telegram: string;
        region: string;
        district: string;
    };
    status: 'new' | 'accepted' | 'shipping' | 'delivered' | 'cancelled';
    createdAt: string;
}

export function getOrders(): Order[] {
    if (!fs.existsSync(ORDERS_FILE)) {
        return [];
    }

    try {
        const fileContent = fs.readFileSync(ORDERS_FILE, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        console.error("Error reading orders file:", error);
        return [];
    }
}

export function saveOrders(orders: Order[]): void {
    try {
        fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');
    } catch (error) {
        console.error("Error writing orders file:", error);
    }
}

export function addOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'status'>): Order {
    const orders = getOrders();
    const newOrder: Order = {
        ...orderData,
        id: orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1,
        status: 'new',
        createdAt: new Date().toISOString(),
    };

    orders.push(newOrder);
    saveOrders(orders);
    return newOrder;
}

export function updateOrderStatus(id: number, status: Order['status']): Order[] {
    const orders = getOrders();
    const orderIndex = orders.findIndex(o => o.id === id);

    if (orderIndex !== -1) {
        orders[orderIndex].status = status;
        saveOrders(orders);
    }

    return orders;
}

export function updateOrderDetails(id: number, updates: Partial<Order>): Order[] {
    const orders = getOrders();
    const orderIndex = orders.findIndex(o => o.id === id);

    if (orderIndex !== -1) {
        orders[orderIndex] = { ...orders[orderIndex], ...updates };

        // Deep merge customer details if provided
        if (updates.customer) {
            orders[orderIndex].customer = {
                ...orders[orderIndex].customer,
                ...updates.customer
            };
        }

        saveOrders(orders);
    }

    return orders;
}

export function deleteOrder(id: number): Order[] {
    let orders = getOrders();
    orders = orders.filter(o => o.id !== id);
    saveOrders(orders);
    return orders;
}
