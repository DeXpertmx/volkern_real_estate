import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { headers } from "next/headers";

interface Appointment {
    id: string;
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    propertySku: string;
    propertyName: string;
    date: string;
    status: string;
    notes?: string;
}

async function getAppointments(): Promise<Appointment[]> {
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
    const host = headers().get("host") || "localhost:3002";

    try {
        const res = await fetch(`${protocol}://${host}/api/admin/appointments`, {
            cache: 'no-store',
        });

        if (!res.ok) {
            return [];
        }

        const json = await res.json();
        return json.data || [];
    } catch (e) {
        console.error("Error fetching mock appointments:", e);
        return [];
    }
}

export default async function AdminCalendarPage() {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any)?.role !== "ADMIN") {
        redirect("/api/auth/signin");
    }

    const appointments: Appointment[] = await getAppointments();

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Agenda de Visitas</h1>
                    <p className="text-slate-500 mt-1">Consulta y gestiona las reservas de los clientes (Demostración).</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="py-4 px-6 text-sm font-semibold text-slate-600">Fecha y Hora</th>
                                <th className="py-4 px-6 text-sm font-semibold text-slate-600">Cliente</th>
                                <th className="py-4 px-6 text-sm font-semibold text-slate-600">Contacto</th>
                                <th className="py-4 px-6 text-sm font-semibold text-slate-600">Propiedad</th>
                                <th className="py-4 px-6 text-sm font-semibold text-slate-600">Estado</th>
                                <th className="py-4 px-6 text-sm font-semibold text-slate-600">Notas</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {appointments.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center text-slate-500">
                                        No hay citas programadas actualmente.
                                    </td>
                                </tr>
                            ) : (
                                appointments.map((app: Appointment) => {
                                    const dateObj = new Date(app.date);
                                    return (
                                        <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="py-4 px-6 text-sm text-slate-900 border-b border-slate-100 whitespace-nowrap">
                                                <div className="font-semibold">{dateObj.toLocaleDateString('es-ES')}</div>
                                                <div className="text-slate-500">{dateObj.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</div>
                                            </td>
                                            <td className="py-4 px-6 text-sm text-slate-900 border-b border-slate-100">
                                                {app.clientName}
                                            </td>
                                            <td className="py-4 px-6 text-sm text-slate-900 border-b border-slate-100">
                                                <div>{app.clientEmail}</div>
                                                <div className="text-slate-500">{app.clientPhone}</div>
                                            </td>
                                            <td className="py-4 px-6 text-sm text-slate-900 border-b border-slate-100">
                                                <Link href={`/propiedad/${app.propertySku}`} className="text-blue-600 hover:underline">
                                                    {app.propertyName}
                                                </Link>
                                            </td>
                                            <td className="py-4 px-6 text-sm text-slate-900 border-b border-slate-100">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${app.status === 'Confirmada' ? 'bg-green-100 text-green-800' :
                                                    app.status === 'Pendiente' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-800'
                                                    }`}>
                                                    {app.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-sm text-slate-500 border-b border-slate-100 max-w-xs truncate" title={app.notes}>
                                                {app.notes || "-"}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
