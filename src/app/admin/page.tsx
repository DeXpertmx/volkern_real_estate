import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/api/auth/signin");
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Panel de Administración</h1>
                <div className="text-sm font-medium bg-blue-100 text-blue-800 px-4 py-2 rounded-full">
                    Sesión Activa: {(session.user as { email?: string })?.email}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-lg mb-2">Propiedades Sincronizadas</h3>
                    <p className="text-4xl font-extrabold text-blue-600">--</p>
                    <p className="text-xs text-slate-500 mt-2">vía Volkern MCP</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-lg mb-2">Mensajes Nuevos</h3>
                    <p className="text-4xl font-extrabold text-indigo-600">0</p>
                    <p className="text-xs text-slate-500 mt-2">Bandeja Vacía</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-lg mb-2">Estado del Sistema</h3>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                        <span className="font-semibold text-green-700">En Línea</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">Servicios Operativos</p>
                </div>
            </div>

            <div className="mt-12 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-center">
                <p className="text-slate-500">Módulo de Administración en Construcción (Fase 4)</p>
            </div>
        </div>
    );
}
