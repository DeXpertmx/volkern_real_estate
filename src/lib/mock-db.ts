// Helper to get server-side modules dynamically
async function getServerModules() {
    if (typeof window !== 'undefined') {
        throw new Error("This module can only be used on the server.");
    }
    const fs = await import('fs');
    const path = await import('path');
    return { fs: fs.default || fs, path: path.default || path };
}

// Local mock database file path
const getDBPath = async () => {
    const { path } = await getServerModules();
    return path.join(process.cwd(), 'data', 'mock-properties.json');
};

async function initDB() {
    try {
        const { fs, path } = await getServerModules();
        const dbPath = await getDBPath();
        const dataDir = path.dirname(dbPath);

        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }

        if (!fs.existsSync(dbPath)) {
            fs.writeFileSync(dbPath, JSON.stringify({ created: [], updated: [] }, null, 2));
        }
    } catch (e) {
        console.warn("MockDB: Could not initialize local filesystem DB (likely read-only environment):", e);
    }
}

// Helper to read the DB
export async function getMockDB() {
    try {
        await initDB();
        const { fs } = await getServerModules();
        const dbPath = await getDBPath();
        if (fs.existsSync(dbPath)) {
            const data = fs.readFileSync(dbPath, 'utf8');
            return JSON.parse(data);
        }
    } catch (e) {
        console.warn("MockDB: Could not read local DB, using empty fallback:", e);
    }
    return { created: [], updated: [] };
}

// Helper to write to the DB
export async function saveMockDB(data: { created: unknown[]; updated: unknown[] }) {
    try {
        await initDB();
        const { fs } = await getServerModules();
        const dbPath = await getDBPath();
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    } catch (e) {
        console.warn("MockDB: Could not save to local DB (read-only environment):", e);
    }
}

export async function createMockProperty(property: Record<string, unknown>) {
    const db = await getMockDB();
    const newProp = {
        ...property,
        id: `mock-${Date.now()}`,
        isMock: true
    };
    db.created.push(newProp);
    await saveMockDB(db);
    return newProp;
}

export async function updateMockProperty(sku: string, property: Record<string, unknown>) {
    const db = await getMockDB();

    // Check if we are updating a newly created mock property
    const createdIndex = db.created.findIndex((p: { sku?: string; id?: string }) => p.sku === sku || p.id === sku);
    if (createdIndex >= 0) {
        db.created[createdIndex] = { ...db.created[createdIndex], ...property };
        await saveMockDB(db);
        return db.created[createdIndex];
    }

    // Otherwise, we are updating an existing CRM property - store in 'updated'
    const updatedIndex = db.updated.findIndex((p: { sku?: string; id?: string }) => p.sku === sku || p.id === sku);
    if (updatedIndex >= 0) {
        db.updated[updatedIndex] = { ...db.updated[updatedIndex], ...property };
    } else {
        db.updated.push({ sku, ...property });
    }
    await saveMockDB(db);
    return property;
}
