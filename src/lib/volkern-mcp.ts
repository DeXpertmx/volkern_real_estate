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
    endpoint: process.env.VOLKERN_MCP_URL || process.env.VOLKERN_API_URL || 'https://volkern.app/api',
    apiKey: process.env.VOLKERN_MCP_API_KEY || process.env.VOLKERN_API_KEY || '',
    timeout: 10000,
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
    nombre?: string;
    zona?: string;
    destacado?: boolean;
}

export async function getProperties(filters?: { type?: string; operation?: string; location?: string }) {
    let rawItems: Record<string, unknown>[] = [];

    try {
        if (filters) { /* Prepare for Phase 5 filter pushdown */ }
        const data = await volkernClient.fetchCatalog(100);

        if (Array.isArray(data)) {
            rawItems = data as Record<string, unknown>[];
        } else if (data && typeof data === 'object' && Array.isArray((data as Record<string, unknown>).items)) {
            rawItems = (data as Record<string, unknown>).items as Record<string, unknown>[];
        } else if (data && typeof data === 'object' && Array.isArray((data as Record<string, unknown>).data)) {
            rawItems = (data as Record<string, unknown>).data as Record<string, unknown>[];
        } else {
            console.warn("Unexpected data format from MCP Catalog:", data);
        }
    } catch (error) {
        console.error("Critical Error fetching from CRM Catalog:", error);
    }

    // Map original CRM items
    let mappedProps: Property[] = [];

    try {
        mappedProps = rawItems.map((item: Record<string, unknown>) => {
            const getCF = (key: string) => {
                const fields = item.customFieldValues || item.camposPersonalizados || item.customFields || {};
                if (Array.isArray(fields)) {
                    const found = fields.find((f: Record<string, unknown>) => f.key === key || f.name === key);
                    return found ? found.value : undefined;
                }
                return (fields as Record<string, unknown>)[key];
            };

            return {
                id: String(item.id || Math.random()),
                sku: String(item.sku || item.id || Math.random()),
                name: String(item.nombre || item.name || "Sin título"),
                description: String(item.descripcion || item.description || ""),
                featured: Boolean(item.destacado || item.featured),
                price: Number(item.precioBase || item.price) || 0,
                currency: String(item.moneda || item.currency || 'EUR'),
                location: String(getCF('zona') || getCF('direccion') || 'Sin ubicación'),
                address: getCF('direccion') ? String(getCF('direccion')) : undefined,
                operation: String(getCF('tipo_operacion') || item.operation || 'Venta'),
                image: String(((item.media as Record<string, unknown>)?.imagenes as string[])?.[0] || ((item.media as string[])?.[0]) || "https://images.unsplash.com/photo-1560518883-ce09059ee712?auto=format&fit=crop&w=800&q=80"),
                specs: {
                    beds: parseInt(String(getCF('habitaciones'))) || 0,
                    baths: parseInt(String(getCF('banos'))) || 0,
                    builtArea: parseInt(String(getCF('superficie_construida'))) || parseInt(String(getCF('superficie'))) || 0,
                    totalArea: parseInt(String(getCF('superficie_total'))) || parseInt(String(getCF('superficie'))) || 0,
                    parking: parseInt(String(getCF('estacionamientos'))) || 0,
                    availability: String(getCF('disponibilidad_inmueble') || getCF('disponibilidad') || 'Disponible')
                },
                active: true,
                raw: item
            };
        });
    } catch (mapError) {
        console.error("Error during property mapping:", mapError);
    }

    // Merge local mocked properties
    try {
        const mockDb = await getMockDB();

        // Append newly created mock properties
        if (mockDb.created && Array.isArray(mockDb.created)) {
            mappedProps = [...(mockDb.created as Property[]), ...mappedProps];
        }

        // Apply updates to existing properties
        if (mockDb.updated && Array.isArray(mockDb.updated)) {
            mappedProps = mappedProps.map((prop: Property) => {
                const update = (mockDb.updated as Partial<Property>[]).find((u) => u.sku === prop.sku || u.id === prop.id);
                if (update) {
                    return { ...prop, ...update };
                }
                return prop;
            });
        }
    } catch (mockError) {
        console.warn("Failed to merge mock database properties:", mockError);
    }

    return mappedProps;
}
