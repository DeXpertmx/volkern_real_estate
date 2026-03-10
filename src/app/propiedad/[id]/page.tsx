import { getProperties } from "@/lib/volkern-mcp";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function PropertyPage({ params }: { params: { id: string } }) {
    let property = null;

    try {
        const allProps = await getProperties();
        property = allProps.find((p: any) => (p.sku || p.id) === params.id);
    } catch (error) {
        console.error("Failed to load property", error);
    }

    // Fallback mock check
    if (!property) {
        if (params.id === '1') {
            property = {
                id: '1', name: 'Apartamento Playa', price: 450000, currency: 'EUR', location: 'Málaga', zone: 'Centro',
                specs: { beds: 2, baths: 2, area: 90, parking: 1 }, operation: 'venta',
                description: 'Hermoso apartamento frente al mar con acabados de lujo y vistas espectaculares. Totalmente amueblado y equipado, listo para entrar a vivir.',
                image: 'https://images.unsplash.com/photo-1560518883-ce09059ee712?auto=format&fit=crop&w=1200&q=80'
            }
        } else {
            notFound();
        }
    }

    const isRent = property.operation?.toLowerCase().includes('renta') || property.operation?.toLowerCase().includes('alquiler');
    const price = property.price || 0;
    const currency = property.currency || 'EUR';
    const mainImage = property.image || property.media?.imagenes?.[0] || "https://images.unsplash.com/photo-1560518883-ce09059ee712?auto=format&fit=crop&w=1200&q=80";

    return (
        <div className="container mx-auto px-4 py-8">
            <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium mb-6 transition-colors">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Volver a propiedades
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left Column: Images & Details */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="rounded-3xl overflow-hidden bg-slate-100 aspect-video relative group">
                        <img src={mainImage} alt={property.name || property.nombre} className="w-full h-full object-cover" />
                        <div className="absolute top-4 left-4 z-10 flex gap-2">
                            <span className={`text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-md ${isRent ? 'bg-indigo-500' : 'bg-rose-500'}`}>
                                {isRent ? 'Renta' : 'Venta'}
                            </span>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">{property.name || property.nombre}</h1>
                                <div className="flex items-center text-slate-500">
                                    <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    <span className="text-lg">{property.location || 'Ubicación Premium'} {property.address ? `• ${property.address}` : ''}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold text-blue-600">
                                    {price.toLocaleString('es-ES', { style: 'currency', currency, maximumFractionDigits: 0 })}
                                    {isRent && <span className="text-lg font-normal text-slate-500">/mes</span>}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-6 py-6 border-y border-slate-200 my-8">
                            <SpecItem icon="/habitaciones.svg" value={property.specs?.beds || 0} label="Habitaciones" />
                            <SpecItem icon="/banos.svg" value={property.specs?.baths || 0} label="Baños" />
                            <SpecItem icon="/superficie_construida.svg" value={`${property.specs?.builtArea || property.specs?.area || 0} m² C.`} label="Construidos" />
                            <SpecItem icon="/superficie_total.svg" value={`${property.specs?.totalArea || property.specs?.area || 0} m² T.`} label="Superficie Total" />
                            {(property.specs?.parking > 0) && (
                                <SpecItem icon="/estacionamientos.svg" value={property.specs?.parking} label="Estacionamiento" />
                            )}
                        </div>

                        <div className="prose max-w-none text-slate-600">
                            <h3 className="text-xl font-bold text-slate-900 mb-4">Descripción</h3>
                            <p className="whitespace-pre-line leading-relaxed">{property.description || property.descripcion || 'Sin descripción detallada. Contacte con nuestros agentes para más información sobre esta fantástica propiedad.'}</p>
                        </div>
                    </div>
                </div>

                {/* Right Column: Contact Widget */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 sticky top-32">
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">Me interesa</h3>
                        <p className="text-slate-500 mb-6">Agenda una visita presencial o virtual con nuestros asesores.</p>

                        <div className="space-y-4">
                            <a
                                href={`https://volkern.app/booking/heriberto-garciacela?service=${isRent ? 'Renta' : 'Venta'}&ref=${property.sku || property.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full flex justify-center items-center h-14 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg"
                            >
                                Agendar Visita Oficial
                            </a>
                            <button className="w-full h-14 bg-white border-2 border-slate-200 hover:border-blue-600 hover:text-blue-600 text-slate-700 font-bold rounded-xl transition-all">
                                Llamar al Asesor
                            </button>
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-100">
                            <p className="text-sm text-slate-500 mb-2 font-medium">Referencia de propiedad:</p>
                            <div className="bg-slate-50 py-2 px-4 rounded-lg font-mono text-slate-700 font-semibold tracking-wider text-center">
                                #{property.sku || property.id}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SpecItem({ icon, value, label }: { icon: string, value: any, label: string }) {
    return (
        <div className="flex items-center gap-3">
            <div className="bg-blue-50 p-3 rounded-full flex items-center justify-center">
                <img src={icon} alt={label} className="w-6 h-6 opacity-80" />
            </div>
            <div>
                <div className="text-xl font-bold text-slate-900">{value}</div>
                <div className="text-sm text-slate-500 font-medium">{label}</div>
            </div>
        </div>
    );
}
