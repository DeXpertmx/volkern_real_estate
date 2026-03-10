"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  MapPin,
} from "lucide-react";
import Image from "next/image";
import { Property } from "@/lib/volkern-mcp";

export default function Home() {
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    location: "",
    operation: "all",
    type: "all"
  });

  useEffect(() => {
    async function fetchProps() {
      try {
        const res = await fetch('/api/properties');
        if (!res.ok) throw new Error("Failed to fetch");
        const json = await res.json();
        const props = json.data || [];
        setAllProperties(props);
        setFilteredProperties(props);
      } catch (e) {
        console.error("No properties fetched:", e);
        // Fallback mocks
        const mocks: Property[] = [
          { id: '1', sku: '1', name: 'Apartamento Playa', description: '', featured: false, price: 450000, currency: 'EUR', location: 'Málaga', address: '', specs: { beds: 2, baths: 2, builtArea: 90, totalArea: 120, parking: 1, availability: 'Disponible' }, operation: 'venta', image: 'https://images.unsplash.com/photo-1560518883-ce09059ee712?auto=format&fit=crop&w=800&q=80', active: true }
        ];
        setAllProperties(mocks);
        setFilteredProperties(mocks);
      } finally {
        setLoading(false);
      }
    }
    fetchProps();
  }, []);

  const normalizeText = (text: string) =>
    text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const handleSearch = () => {
    let result = [...allProperties];

    if (filters.location) {
      const search = normalizeText(filters.location);
      result = result.filter(p =>
        normalizeText(p.location || "").includes(search) ||
        normalizeText(p.name || "").includes(search) ||
        normalizeText(p.address || "").includes(search)
      );
    }

    if (filters.operation !== "all") {
      const opSearch = normalizeText(filters.operation);
      result = result.filter(p =>
        normalizeText(p.operation || "").includes(opSearch)
      );
    }

    if (filters.type !== "all") {
      const typeSearch = normalizeText(filters.type);
      result = result.filter(p =>
        normalizeText(p.name || "").includes(typeSearch) ||
        normalizeText(p.description || "").includes(typeSearch)
      );
    }

    setFilteredProperties(result);
  };

  const featured = filteredProperties.filter((p: Property) => p.featured || (p as unknown as { destacado?: boolean }).destacado).slice(0, 3);
  const displayFeatured = featured.length > 0 ? featured : filteredProperties.filter(p => p.featured).slice(0, 3);

  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section id="inicio" className="relative h-[80vh] min-h-[600px] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image src="/hero-family.png" alt="Familia feliz" fill priority className="object-cover" />
          <div className="absolute inset-0 bg-blue-900/60 mix-blend-multiply" />
        </div>

        <div className="container relative z-10 px-4 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-md">
            Encuentra el hogar de tus sueños
          </h1>
          <p className="text-lg md:text-xl text-blue-50 max-w-2xl mb-12 drop-shadow">
            Propiedades exclusivas con el respaldo y la confianza de Volkern Properties. Minimalismo, lujo y profesionalismo a tu alcance.
          </p>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl w-full max-w-5xl flex flex-col md:flex-row gap-4 items-end shadow-2xl">
            <div className="flex-1 w-full text-left">
              <label className="text-xs font-semibold text-blue-100 uppercase tracking-wider block mb-2">Ubicación</label>
              <input
                type="text"
                placeholder="¿Dónde quieres vivir?"
                className="w-full h-12 px-4 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <div className="flex-1 w-full text-left">
              <label className="text-xs font-semibold text-blue-100 uppercase tracking-wider block mb-2">Operación</label>
              <select
                className="w-full h-12 px-4 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                value={filters.operation}
                onChange={(e) => setFilters({ ...filters, operation: e.target.value })}
              >
                <option value="all">Todas</option>
                <option value="venta">Venta</option>
                <option value="renta">Renta</option>
              </select>
            </div>
            <div className="flex-1 w-full text-left">
              <label className="text-xs font-semibold text-blue-100 uppercase tracking-wider block mb-2">Tipo</label>
              <select
                className="w-full h-12 px-4 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              >
                <option value="all">Todos</option>
                <option value="Piso">Piso</option>
                <option value="Casa">Casa</option>
              </select>
            </div>
            <button
              onClick={handleSearch}
              className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors w-full md:w-auto flex-shrink-0"
            >
              Buscar
            </button>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section id="destacados" className="container mx-auto px-4 pt-8">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Propiedades Destacadas</h2>
          <p className="text-slate-500">Selección premium de nuestras mejores oportunidades inmobiliarias.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-96 rounded-2xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayFeatured.map((prop: Property) => (
              <PropertyCard key={prop.id || Math.random().toString()} property={prop} />
            ))}
            {displayFeatured.length === 0 && (
              <p className="col-span-full text-center text-slate-400 py-10">No hay propiedades destacadas que coincidan.</p>
            )}
          </div>
        )}
      </section>

      {/* All Properties */}
      <section id="propiedades" className="container mx-auto px-4 pt-16 border-t border-slate-100">
        <div className="mb-10 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Listado de Propiedades</h2>
            <p className="text-slate-500">Explora nuestro catálogo completo.</p>
          </div>
          <div className="text-sm text-slate-400">
            {filteredProperties.length} resultados encontrados
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-80 rounded-2xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProperties.map((prop: Property) => (
              <PropertyCard key={prop.id || Math.random().toString()} property={prop} />
            ))}
            {filteredProperties.length === 0 && (
              <div className="col-span-full flex flex-col items-center py-20 text-slate-400 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                <svg className="w-12 h-12 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                <p className="text-lg font-medium">No se encontraron propiedades</p>
                <p>Intenta ajustar tus criterios de búsqueda.</p>
                <button
                  onClick={() => {
                    setFilters({ location: "", operation: "all", type: "all" });
                    setFilteredProperties(allProperties);
                  }}
                  className="mt-4 text-blue-600 font-semibold hover:underline"
                >
                  Limpiar filtros
                </button>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

function PropertyCard({ property }: { property: Property }) {
  // Fallbacks if data mapping missed something
  const isRent = property.operation?.toLowerCase().includes('renta') || property.operation?.toLowerCase().includes('alquiler');
  const price = property.price || 0;
  const currency = property.currency || 'EUR';
  const specs = property.specs || {};

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full relative cursor-pointer">
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        {property.featured && <span className="bg-amber-400 text-amber-950 text-xs font-bold px-3 py-1 rounded-full shadow-sm">Destacado</span>}
        <span className={`text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm ${isRent ? 'bg-indigo-500' : 'bg-rose-500'}`}>
          {isRent ? 'Renta' : 'Venta'}
        </span>
      </div>

      <div className="relative h-64 overflow-hidden bg-slate-100">
        <Image
          src={property.image || (((property.raw as unknown as Record<string, unknown>)?.media as Record<string, unknown>)?.imagenes as string[])?.[0] || "https://images.unsplash.com/photo-1560518883-ce09059ee712?auto=format&fit=crop&w=800&q=80"}
          alt={property.name || (property as unknown as Record<string, unknown>).nombre as string || "Property Image"}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-900/80 to-transparent p-4 pt-12">
          <h3 className="text-white font-bold text-xl truncate">{property.name || property.nombre}</h3>
          <div className="flex items-center text-blue-100 text-sm mt-1">
            <span className="mr-1 text-blue-100/70"><MapPin size={16} /></span>
            <span className="truncate">{property.location || property.zona || 'Ver ubicación'}</span>
          </div>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="text-2xl font-bold text-blue-900 mb-4">
          {price.toLocaleString('es-ES', { style: 'currency', currency, maximumFractionDigits: 0 })}
          {isRent && <span className="text-sm font-normal text-slate-500 ml-1">/mes</span>}
        </div>

        <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm text-slate-600 mb-6 font-medium">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 flex items-center justify-center">
              <Image src="/habitaciones.svg" alt="Hab" width={16} height={16} className="opacity-70" />
            </span>
            <span className="truncate">{specs.beds || 0} Hab</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 flex items-center justify-center">
              <Image src="/banos.svg" alt="Baños" width={16} height={16} className="opacity-70" />
            </span>
            <span className="truncate">{specs.baths || 0} Baños</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 flex items-center justify-center">
              <Image src="/superficie_construida.svg" alt="Const." width={16} height={16} className="opacity-70" />
            </span>
            <span className="truncate">{specs.builtArea || 0} m² C.</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 flex items-center justify-center">
              <Image src="/superficie_total.svg" alt="Total" width={16} height={16} className="opacity-70" />
            </span>
            <span className="truncate">{specs.totalArea || 0} m² T.</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 flex items-center justify-center">
              <Image src="/estacionamientos.svg" alt="Est." width={16} height={16} className="opacity-70" />
            </span>
            <span className="truncate">{specs.parking || 0} Est.</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 flex items-center justify-center">
              <Image src="/disponibilidad.svg" alt="Disp." width={16} height={16} />
            </span>
            <span className="truncate font-semibold text-emerald-600">{specs.availability || 'Disponible'}</span>
          </div>
        </div>

        <Link href={`/propiedad/${property.sku || property.id}`} className="mt-auto block w-full text-center bg-slate-50 hover:bg-blue-50 text-blue-600 font-semibold py-3 rounded-xl border border-blue-100 transition-colors">
          Ver Detalles
        </Link>
      </div>
    </div>
  )
}
