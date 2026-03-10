"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function PropertyForm({ initialData, isEdit = false }: { initialData?: Record<string, unknown>, isEdit?: boolean }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        sku: initialData?.sku || "",
        operation: initialData?.operation || "Venta",
        price: initialData?.price || "",
        location: initialData?.location || "",
        address: initialData?.address || "",
        description: initialData?.description || "",
        beds: initialData?.specs?.beds || "",
        baths: initialData?.specs?.baths || "",
        area: initialData?.specs?.area || "",
        parking: initialData?.specs?.parking || "",
        active: initialData?.active !== undefined ? initialData.active : true,
        featured: initialData?.featured || false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Simulated API call payload structure
            const payload = {
                ...formData,
                price: Number(formData.price),
                specs: {
                    beds: Number(formData.beds),
                    baths: Number(formData.baths),
                    area: Number(formData.area),
                    parking: Number(formData.parking),
                },
                active: formData.active,
                featured: formData.featured,
            };

            const res = await fetch("/api/admin/properties", {
                method: isEdit ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                alert(`Propiedad ${isEdit ? 'actualizada' : 'creada'} exitosamente (Mock)`);
                router.push("/admin/properties");
                router.refresh();
            } else {
                alert("Hubo un error al procesar la solicitud.");
            }
        } catch (error) {
            console.error(error);
            alert("Error de conexión");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nombre / Título</label>
                    <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full h-11 px-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">SKU / Referencia</label>
                    <input required type="text" name="sku" value={formData.sku} onChange={handleChange} className="w-full h-11 px-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Operación</label>
                    <select name="operation" value={formData.operation} onChange={handleChange} className="w-full h-11 px-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none">
                        <option value="Venta">Venta</option>
                        <option value="Renta">Renta</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Precio</label>
                    <input required type="number" name="price" value={formData.price} onChange={handleChange} className="w-full h-11 px-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Ubicación (Zona)</label>
                    <input required type="text" name="location" value={formData.location} onChange={handleChange} className="w-full h-11 px-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Dirección Completa</label>
                    <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full h-11 px-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-4 border-t border-slate-100">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Habitaciones</label>
                    <input type="number" name="beds" value={formData.beds} onChange={handleChange} className="w-full h-11 px-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Baños</label>
                    <input type="number" name="baths" value={formData.baths} onChange={handleChange} className="w-full h-11 px-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Área (m²)</label>
                    <input type="number" name="area" value={formData.area} onChange={handleChange} className="w-full h-11 px-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Estacionamientos</label>
                    <input type="number" name="parking" value={formData.parking} onChange={handleChange} className="w-full h-11 px-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
                <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
                <textarea rows={4} name="description" value={formData.description} onChange={handleChange} className="w-full p-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"></textarea>
            </div>

            <div className="flex gap-6 pt-4 border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="active" checked={formData.active} onChange={handleChange} className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                    <span className="text-sm font-medium text-slate-700">Propiedad Activa (Visible)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                    <span className="text-sm font-medium text-slate-700">Destacar en Inicio</span>
                </label>
            </div>

            <div className="flex justify-end pt-6 border-t border-slate-100">
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-8 py-3 rounded-xl font-bold transition-colors"
                >
                    {loading ? "Guardando..." : isEdit ? "Actualizar Propiedad" : "Crear Propiedad"}
                </button>
            </div>
        </form>
    );
}
