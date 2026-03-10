import { getProperties, Property } from "@/lib/volkern-mcp";
import { NewPropertyButton, EditPropertyButton } from "./AdminActions";

export const dynamic = 'force-dynamic';

export default async function AdminPropertiesPage() {
    let properties: Property[] = [];
    try {
        properties = await getProperties();
    } catch (e) {
        console.error(e);
    }

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Catálogo de Propiedades</h1>
                    <p className="text-slate-500 mt-1">Gestiona los inmuebles disponibles en la plataforma.</p>
                </div>
                <NewPropertyButton />
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="py-4 px-6 font-semibold text-slate-600">SKU</th>
                            <th className="py-4 px-6 font-semibold text-slate-600">Nombre</th>
                            <th className="py-4 px-6 font-semibold text-slate-600">Operación</th>
                            <th className="py-4 px-6 font-semibold text-slate-600">Precio</th>
                            <th className="py-4 px-6 font-semibold text-slate-600">Ubicación</th>
                            <th className="py-4 px-6 font-semibold text-slate-600 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {properties.map((prop: Property, idx: number) => (
                            <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                <td className="py-4 px-6 font-mono text-sm text-slate-500">{prop.sku || prop.id}</td>
                                <td className="py-4 px-6 font-medium text-slate-900">{prop.name || prop.nombre || 'Sin título'}</td>
                                <td className="py-4 px-6">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${prop.operation?.toLowerCase().includes('renta') ? 'bg-indigo-100 text-indigo-700' : 'bg-rose-100 text-rose-700'}`}>
                                        {prop.operation || 'N/A'}
                                    </span>
                                </td>
                                <td className="py-4 px-6 font-medium text-slate-700">
                                    {prop.price ? prop.price.toLocaleString('es-ES', { style: 'currency', currency: prop.currency || 'EUR', maximumFractionDigits: 0 }) : 'Consultar'}
                                </td>
                                <td className="py-4 px-6 text-slate-600">{prop.location || prop.zona || 'N/A'}</td>
                                <td className="py-4 px-6 text-right">
                                    <EditPropertyButton sku={prop.sku || prop.id} />
                                </td>
                            </tr>
                        ))}
                        {properties.length === 0 && (
                            <tr>
                                <td colSpan={6} className="py-8 text-center text-slate-500">No hay propiedades cargadas.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
