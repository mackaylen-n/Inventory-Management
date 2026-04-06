import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/products?search=term
export async function GET(request: NextRequest) {
    const search = request.nextUrl.searchParams.get("search") || "";

    const products = await prisma.product.findMany({
        where: search
            ? {
                OR: [
                    { name: { contains: search } },
                    { sku: { contains: search } },
                ],
            }
            : undefined,
        orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(products);
}

// POST /api/products
export async function POST(request: NextRequest) {
    const body = await request.json();
    const { name, sku, quantity } = body;

    // Validation
    const errors: Record<string, string> = {};

    if (!name || typeof name !== "string" || name.trim().length === 0) {
        errors.name = "Product name is required.";
    }

    const qty = Number(quantity);
    if (quantity === undefined || quantity === null || quantity === "") {
        errors.quantity = "Quantity is required.";
    } else if (!Number.isInteger(qty)) {
        errors.quantity = "Quantity must be a whole number.";
    } else if (qty < 0) {
        errors.quantity = "Quantity cannot be negative.";
    }

    if (Object.keys(errors).length > 0) {
        return NextResponse.json({ errors }, { status: 400 });
    }

    const product = await prisma.product.create({
        data: {
            name: name.trim(),
            sku: sku?.trim() || null,
            quantity: qty,
        },
    });

    return NextResponse.json(product, { status: 201 });
}
