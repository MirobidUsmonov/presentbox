
import { NextResponse } from "next/server";
import { getUzumOrders } from "@/lib/uzum-data";

export async function GET() {
    try {
        const orders = getUzumOrders();
        return NextResponse.json(orders);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
