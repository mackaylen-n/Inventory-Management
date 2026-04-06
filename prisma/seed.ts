import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    // Clear existing products
    await prisma.product.deleteMany();

    await prisma.product.createMany({
        data: [
            { name: "Wireless Mouse", sku: "WM-001", quantity: 150 },
            { name: "USB-C Cable", sku: "UC-042", quantity: 300 },
            { name: "Mechanical Keyboard", sku: "MK-107", quantity: 75 },
            { name: "Monitor Stand", sku: "MS-023", quantity: 40 },
            { name: "HD Webcam", sku: "WC-005", quantity: 120 },
        ],
    });

    console.log("✓ Seeded 5 sample products.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
