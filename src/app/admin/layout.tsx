import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/api/auth/signin");
    }

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50">
            <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col">
                <div className="h-20 flex items-center px-6 border-b border-slate-800">
                    <Link href="/admin" className="text-white font-bold text-xl flex items-center gap-2">
                        <span className="w-8 h-8 bg-blue-600 rounded-lg flex justify-center items-center text-sm">V</span>
                        Admin
                    </Link>
                </div>
                <nav className="flex-1 py-6 px-4 space-y-2">
                    <Link href="/admin" className="flex items-center gap-3 px-4 py-3 bg-slate-800/50 text-white rounded-xl transition-colors hover:bg-slate-800">
                        <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                        Dashboard
                    </Link>
                    <Link href="/admin/properties" className="flex items-center gap-3 px-4 py-3 text-slate-400 rounded-xl transition-colors hover:bg-slate-800 hover:text-white">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                        Catálogo
                    </Link>
                    <Link href="/admin/calendar" className="flex items-center gap-3 px-4 py-3 text-slate-400 rounded-xl transition-colors hover:bg-slate-800 hover:text-white">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        Agenda Visitas
                    </Link>
                    <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 text-slate-400 rounded-xl transition-colors hover:bg-slate-800 hover:text-white">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        Ajustes
                    </Link>
                </nav>
                <div className="p-4 border-t border-slate-800">
                    <Link href="/api/auth/signout" className="flex items-center justify-center gap-2 w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors text-sm">
                        Cerrar Sesión
                    </Link>
                </div>
            </aside>

            <main className="flex-1 overflow-y-auto bg-slate-50 relative z-10 w-full">
                {children}
            </main>
        </div>
    );
}
