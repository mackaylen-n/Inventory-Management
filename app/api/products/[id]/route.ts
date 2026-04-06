import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PATCH /api/products/:id
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const body = await request.json();
    const { quantity } = body;

    // Validation
    const qty = Number(quantity);
    if (quantity === undefined || quantity === null || quantity === "") {
        return NextResponse.json(
            { errors: { quantity: "Quantity is required." } },
            { status: 400 }
        );
    }
    if (!Number.isInteger(qty)) {
        return NextResponse.json(
            { errors: { quantity: "Quantity must be a whole number." } },
            { status: 400 }
        );
    }
    if (qty < 0) {
        return NextResponse.json(
            { errors: { quantity: "Quantity cannot be negative." } },
            { status: 400 }
        );
    }

    try {
        const product = await prisma.product.update({
            where: { id },
            data: { quantity: qty },
        });
        return NextResponse.json(product);
    } catch {
        return NextResponse.json(
            { errors: { id: "Product not found." } },
            { status: 404 }
        );
    }
}

// DELETE /api/products/:id
export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        await prisma.product.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json(
            { errors: { id: "Product not found." } },
            { status: 404 }
        );
    }
}
