import PropertyForm from "@/components/admin/PropertyForm";
import { getProperties } from "@/lib/volkern-mcp";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function EditPropertyPage({ params }: { params: { id: string } }) {
    const allProps = await getProperties();
    const property = allProps.find((p: any) => (p.sku || p.id) === params.id);

    if (!property) {
        // Mock fallback if not found in MCP data
        if (params.id === '1') {
            return (
                <div className="p-8 max-w-4xl mx-auto">
                    <div className="mb-6">
                        <Link href="/admin/properties" className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-2 mb-4">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                            Volver al Catálogo
                        </Link>
                        <h1 className="text-3xl font-bold text-slate-800">Editar Propiedad</h1>
                        <p className="text-slate-500 mt-1">Actualiza los detalles de la propiedad seleccionada.</p>
                    </div>
                    <PropertyForm
                        isEdit
                        initialData={{
                            name: 'Apartamento Playa', sku: '1', price: 450000, currency: 'EUR', location: 'Málaga',
                            specs: { beds: 2, baths: 2, area: 90, parking: 1 }, operation: 'venta',
                            description: 'Hermoso apartamento frente al mar.'
                        }}
                    />
                </div>
            )
        }
        notFound();
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="mb-6">
                <Link href="/admin/properties" className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-2 mb-4">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Volver al Catálogo
                </Link>
                <h1 className="text-3xl font-bold text-slate-800">Editar Propiedad</h1>
                <p className="text-slate-500 mt-1">Actualiza los detalles de la propiedad seleccionada.</p>
            </div>

            <PropertyForm isEdit initialData={property} />
        </div>
    );
}
