import { NextResponse } from 'next/server';
import { getProperties } from '@/lib/volkern-mcp';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        // Parse search params if any filters are passed
        const type = searchParams.get('type') || undefined;
        const operation = searchParams.get('operation') || undefined;
        const location = searchParams.get('location') || undefined;

        const properties = await getProperties({
            type,
            operation,
            location
        });

        return NextResponse.json({ success: true, data: properties });
    } catch (error) {
        console.error("API Error in /api/properties:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch properties" }, { status: 500 });
    }
}
