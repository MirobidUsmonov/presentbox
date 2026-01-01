
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const ROLES_FILE = path.join(DATA_DIR, 'roles.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

export interface Permissions {
    products_view: boolean;
    products_manage: boolean; // Add, Edit, Delete
    categories_view: boolean;
    categories_manage: boolean;
    orders_view: boolean;
    orders_manage: boolean;
    customers_view: boolean;
    settings_view: boolean; // View admins/roles
    settings_manage: boolean; // Create/Edit admins/roles
}

export interface Role {
    id: number;
    name: string;
    permissions: Permissions;
    isSystem?: boolean; // If true, cannot be deleted (e.g., Super Admin)
}

const defaultRoles: Role[] = [
    {
        id: 1,
        name: "Super Admin",
        permissions: {
            products_view: true,
            products_manage: true,
            categories_view: true,
            categories_manage: true,
            orders_view: true,
            orders_manage: true,
            customers_view: true,
            settings_view: true,
            settings_manage: true
        },
        isSystem: true
    },
    {
        id: 2,
        name: "Manager",
        permissions: {
            products_view: true,
            products_manage: true,
            categories_view: true,
            categories_manage: false,
            orders_view: true,
            orders_manage: true,
            customers_view: true,
            settings_view: false,
            settings_manage: false
        },
        isSystem: false
    }
];

export function getRoles(): Role[] {
    if (!fs.existsSync(ROLES_FILE)) {
        saveRoles(defaultRoles);
        return defaultRoles;
    }

    try {
        const fileContent = fs.readFileSync(ROLES_FILE, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        console.error("Error reading roles file:", error);
        return defaultRoles;
    }
}

export function saveRoles(roles: Role[]): void {
    try {
        fs.writeFileSync(ROLES_FILE, JSON.stringify(roles, null, 2), 'utf-8');
    } catch (error) {
        console.error("Error writing roles file:", error);
    }
}

export function addRole(roleData: Omit<Role, 'id'>): Role {
    const roles = getRoles();
    const newRole: Role = {
        ...roleData,
        id: roles.length > 0 ? Math.max(...roles.map(r => r.id)) + 1 : 1,
    };

    roles.push(newRole);
    saveRoles(roles);
    return newRole;
}

export function updateRole(id: number, updates: Partial<Role>): Role[] {
    const roles = getRoles();
    const index = roles.findIndex(r => r.id === id);

    if (index !== -1) {
        // Prevent modifying system roles critical parts if needed, but for now allow editing permissions
        roles[index] = { ...roles[index], ...updates };
        saveRoles(roles);
    }

    return roles;
}

export function deleteRole(id: number): Role[] {
    let roles = getRoles();
    const roleToDelete = roles.find(r => r.id === id);

    if (roleToDelete?.isSystem) {
        throw new Error("Cannot delete a system role");
    }

    roles = roles.filter(r => r.id !== id);
    saveRoles(roles);
    return roles;
}
