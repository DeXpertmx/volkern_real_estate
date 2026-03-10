import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getProperties } from "@/lib/volkern-mcp";
// import prisma from "@/lib/prisma";

export async function GET() {
    // 1. Validate Session for Admin
    const session = await getServerSession(authOptions);

    if (!session || (session.user as { role?: string })?.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    try {
        // 2. Fetch properties securely
        // In Phase 5, this will sync between Prisma DB and MCP. For now we use MCP directly.
        const properties = await getProperties();
        return NextResponse.json({ success: true, data: properties });
    } catch (error) {
        console.error("Internal Admin API Error:", error);
        return NextResponse.json({ error: "Failed to fetch internal properties" }, { status: 500 });
    }
}

import { createMockProperty, updateMockProperty } from "@/lib/mock-db";

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as { role?: string })?.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    try {
        const body = await request.json();
        // TODO Phase 5: Create property in PostreSQL via Prisma
        // const newProp = await prisma.property.create({ data: body });
        const newProp = await createMockProperty(body);

        return NextResponse.json({ success: true, message: "Property created mock", data: newProp });
    } catch {
        return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
}

export async function PUT(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as { role?: string })?.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    try {
        const body = await request.json();
        // TODO Phase 5: Update property in PostreSQL via Prisma
        // const updatedProp = await prisma.property.update({ where: { id: body.id }, data: body });
        const propIdentifier = body.sku || body.id;
        if (!propIdentifier) {
            return NextResponse.json({ error: "Missing identity" }, { status: 400 });
        }
        const updatedProp = await updateMockProperty(propIdentifier, body);

        return NextResponse.json({ success: true, message: "Property updated mock", data: updatedProp });
    } catch {
        return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
}
