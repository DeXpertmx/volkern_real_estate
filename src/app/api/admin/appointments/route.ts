import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Basic mock data for appointments (Phase 4)
const mockAppointments = [
    {
        id: "app-1",
        clientName: "Ana Martínez",
        clientEmail: "ana.m@example.com",
        clientPhone: "+34 600 123 456",
        propertySku: "1",
        propertyName: "Apartamento Playa",
        date: "2026-03-12T10:00:00Z",
        status: "Confirmada",
        notes: "Interesada en opciones de financiamiento."
    },
    {
        id: "app-2",
        clientName: "David López",
        clientEmail: "d.lopez@example.com",
        clientPhone: "+34 611 987 654",
        propertySku: "3",
        propertyName: "Casa de Campo",
        date: "2026-03-15T16:30:00Z",
        status: "Pendiente",
        notes: "Llamar una hora antes para confirmar asistencia."
    }
];

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as { role?: string })?.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    try {
        // Return mock appointments for Phase 4
        return NextResponse.json({ success: true, data: mockAppointments });
    } catch {
        return NextResponse.json({ error: "Failed to fetch appointments" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as { role?: string })?.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    try {
        const body = await request.json();

        const newApp = {
            id: `app-${Date.now()}`,
            ...body,
            status: "Confirmada", // auto confirm for demo
        }

        return NextResponse.json({ success: true, message: "Appointment created mock", data: newApp });
    } catch {
        return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
}
