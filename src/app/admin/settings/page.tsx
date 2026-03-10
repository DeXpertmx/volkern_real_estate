export default function AdminSettingsPage() {
    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Ajustes del Sistema</h1>
                <p className="text-slate-500 mt-1">Configura las credenciales y preferencias globales.</p>
            </div>

            <div className="space-y-6">
                {/* Seccion Perfil */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 line-clamp-1">
                    <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-4 mb-4">Perfil Administrativo</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
                            <input type="text" defaultValue="Admin Volkern" disabled className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-600 cursor-not-allowed" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email (Usuario)</label>
                            <input type="text" defaultValue="admin@volkern.com" disabled className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-600 cursor-not-allowed" />
                        </div>
                    </div>
                </div>

                {/* Seccion Conexiones */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-4 mb-4">Conexiones Externas</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center font-bold font-mono">MCP</div>
                                <div>
                                    <p className="font-semibold text-slate-800">API Volkern Nexa</p>
                                    <p className="text-xs text-slate-500">Sincronización activa (Lectura de Propiedades)</p>
                                </div>
                            </div>
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Conectado</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold">DB</div>
                                <div>
                                    <p className="font-semibold text-slate-800">PostgreSQL Cloud</p>
                                    <p className="text-xs text-slate-500">Base de datos principal (Prisma ORM)</p>
                                </div>
                            </div>
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">En Línea</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
