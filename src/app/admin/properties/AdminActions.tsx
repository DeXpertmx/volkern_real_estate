"use client";

import Link from "next/link";

export function NewPropertyButton() {
    return (
        <Link
            href="/admin/properties/new"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Nueva Propiedad
        </Link>
    );
}

export function EditPropertyButton({ sku }: { sku: string }) {
    return (
        <Link
            href={`/admin/properties/${sku}/edit`}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
            Editar
        </Link>
    );
}
