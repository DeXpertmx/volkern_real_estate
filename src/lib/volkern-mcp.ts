import axios from 'axios';

// Mocking the MCP SDK interface as requested by Agent 3 specification
export class MCPClient {
    private endpoint: string;
    private apiKey: string;

    constructor(config: { endpoint: string, apiKey: string, timeout?: number }) {
        this.endpoint = config.endpoint;
        this.apiKey = config.apiKey;
    }

    async fetchCatalog(limit: number = 20) {
        try {
            const response = await axios.get(`${this.endpoint}/catalogo?limit=${limit}`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`
                }
            });
            return response.data;
        } catch (error) {
            console.error("MCP Client Error:", error);
            throw error;
        }
    }
}

export const volkernClient = new MCPClient({
    endpoint: process.env.VOLKERN_MCP_URL || 'https://volkern.app/api',
    apiKey: process.env.VOLKERN_MCP_API_KEY || '',
    timeout: 5000,
});

export interface PropertyFilters {
    type?: string;
    operation?: string;
    minPrice?: number;
    maxPrice?: number;
    location?: string;
}

import { getMockDB } from './mock-db';

export interface Property {
    id: string;
    sku: string;
    name: string;
    description: string;
    featured: boolean;
    price: number;
    currency: string;
    location: string;
    address?: string;
    operation: string;
    image: string;
    specs: {
        beds: number;
        baths: number;
        builtArea: number;
        totalArea: number;
        parking: number;
        availability: string;
    };
    active: boolean;
    raw?: Record<string, unknown>;
}

export async function getProperties() {
    const data = await volkernClient.fetchCatalog(100);
    const rawItems = (data.items || data) as Record<string, unknown>[];

    // Map original CRM items
    let mappedProps: Property[] = rawItems.map((item: Record<string, unknown>) => {
        const getCF = (key: string) => {
            const fields = item.customFieldValues || item.camposPersonalizados || item.customFields || {};
            if (Array.isArray(fields)) {
                const found = fields.find((f: { key?: string; name?: string; value: unknown }) => f.key === key || f.name === key);
                return found ? found.value : undefined;
            }
            return fields[key];
        };

        return {
            id: item.id,
            sku: item.sku || item.id,
            name: item.nombre || item.name,
            description: item.descripcion || item.description,
            featured: item.destacado || item.featured || false,
            price: item.precioBase || item.price || 0,
            currency: item.moneda || item.currency || 'EUR',
            location: getCF('zona') || getCF('direccion') || 'Sin ubicación',
            address: getCF('direccion'),
            operation: getCF('tipo_operacion') || item.operation || 'Venta',
            image: item.media?.imagenes?.[0] || item.media?.[0] || "https://images.unsplash.com/photo-1560518883-ce09059ee712?auto=format&fit=crop&w=800&q=80",
            specs: {
                beds: parseInt(getCF('habitaciones')) || 0,
                baths: parseInt(getCF('banos')) || 0,
                builtArea: parseInt(getCF('superficie_construida')) || parseInt(getCF('superficie')) || 0,
                totalArea: parseInt(getCF('superficie_total')) || parseInt(getCF('superficie')) || 0,
                parking: parseInt(getCF('estacionamientos')) || 0,
                availability: getCF('disponibilidad_inmueble') || getCF('disponibilidad') || 'Disponible'
            },
            active: true,
            raw: item
        };
    });

    // Merge local mocked properties
    try {
        const mockDb = await getMockDB();

        // Append newly created mock properties
        if (mockDb.created && mockDb.created.length > 0) {
            mappedProps = [...(mockDb.created as Property[]), ...mappedProps];
        }

        // Apply updates to existing properties
        if (mockDb.updated && mockDb.updated.length > 0) {
            mappedProps = mappedProps.map((prop: Property) => {
                const update = (mockDb.updated as Partial<Property>[]).find((u) => u.sku === prop.sku || u.id === prop.id);
                if (update) {
                    return { ...prop, ...update };
                }
                return prop;
            });
        }
    } catch {
        console.warn("Failed to merge mock database properties");
    }

    return mappedProps;
}
