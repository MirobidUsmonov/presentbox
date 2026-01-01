
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const ADMINS_FILE = path.join(DATA_DIR, 'admins.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

export interface Admin {
    id: number;
    username: string;
    roleId: number;
    password?: string; // @deprecated - use hash/salt
    hash?: string;
    salt?: string;
    fullName: string;
    createdAt: string;
}

const defaultAdmins: Admin[] = [
    {
        id: 1,
        username: "presentbox",
        roleId: 1,
        password: "admin123",
        fullName: "Super Admin",
        createdAt: new Date().toISOString()
    }
];

export function getAdmins(): Admin[] {
    if (!fs.existsSync(ADMINS_FILE)) {
        saveAdmins(defaultAdmins);
        return defaultAdmins;
    }

    try {
        const fileContent = fs.readFileSync(ADMINS_FILE, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        console.error("Error reading admins file:", error);
        return defaultAdmins;
    }
}

export function saveAdmins(admins: Admin[]): void {
    try {
        fs.writeFileSync(ADMINS_FILE, JSON.stringify(admins, null, 2), 'utf-8');
    } catch (error) {
        console.error("Error writing admins file:", error);
    }
}

export function addAdmin(adminData: Omit<Admin, 'id' | 'createdAt'>): Admin {
    const admins = getAdmins();
    const newAdmin: Admin = {
        ...adminData,
        id: admins.length > 0 ? Math.max(...admins.map(a => a.id)) + 1 : 1,
        createdAt: new Date().toISOString(),
    };

    admins.push(newAdmin);
    saveAdmins(admins);
    return newAdmin;
}

export function updateAdmin(id: number, updates: Partial<Admin>): Admin[] {
    const admins = getAdmins();
    const index = admins.findIndex(a => a.id === id);

    if (index !== -1) {
        admins[index] = { ...admins[index], ...updates };
        saveAdmins(admins);
    }

    return admins;
}

export function deleteAdmin(id: number): Admin[] {
    let admins = getAdmins();
    // Prevent deleting the last super admin
    const adminToDelete = admins.find(a => a.id === id);
    if (adminToDelete?.roleId === 1) {
        const superAdminsCount = admins.filter(a => a.roleId === 1).length;
        if (superAdminsCount <= 1) {
            throw new Error("Cannot delete the last Super Admin");
        }
    }

    admins = admins.filter(a => a.id !== id);
    saveAdmins(admins);
    return admins;
}
