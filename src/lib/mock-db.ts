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
    const { fs, path } = await getServerModules();
    const dbPath = await getDBPath();
    const dataDir = path.dirname(dbPath);

    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }

    if (!fs.existsSync(dbPath)) {
        fs.writeFileSync(dbPath, JSON.stringify({ created: [], updated: [] }, null, 2));
    }
}

// Helper to read the DB
export async function getMockDB() {
    await initDB();
    const { fs } = await getServerModules();
    const dbPath = await getDBPath();
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
}

// Helper to write to the DB
export async function saveMockDB(data: any) {
    await initDB();
    const { fs } = await getServerModules();
    const dbPath = await getDBPath();
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

export async function createMockProperty(property: any) {
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

export async function updateMockProperty(sku: string, property: any) {
    const db = await getMockDB();

    // Check if we are updating a newly created mock property
    const createdIndex = db.created.findIndex((p: any) => p.sku === sku || p.id === sku);
    if (createdIndex >= 0) {
        db.created[createdIndex] = { ...db.created[createdIndex], ...property };
        await saveMockDB(db);
        return db.created[createdIndex];
    }

    // Otherwise, we are updating an existing CRM property - store in 'updated'
    const updatedIndex = db.updated.findIndex((p: any) => p.sku === sku || p.id === sku);
    if (updatedIndex >= 0) {
        db.updated[updatedIndex] = { ...db.updated[updatedIndex], ...property };
    } else {
        db.updated.push({ sku, ...property });
    }
    await saveMockDB(db);
    return property;
}
