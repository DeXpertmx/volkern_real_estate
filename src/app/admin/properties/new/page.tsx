import PropertyForm from "@/components/admin/PropertyForm";
import Link from "next/link";

export default function NewPropertyPage() {
    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="mb-6">
                <Link href="/admin/properties" className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-2 mb-4">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Volver al Catálogo
                </Link>
                <h1 className="text-3xl font-bold text-slate-800">Nueva Propiedad</h1>
                <p className="text-slate-500 mt-1">Completa los campos para publicar un nuevo inmueble en la demostración.</p>
            </div>

            <PropertyForm />
        </div>
    );
}
