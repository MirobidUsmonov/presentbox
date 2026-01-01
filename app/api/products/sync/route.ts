import { NextResponse } from "next/server";
import { getProducts, updateProduct, saveProducts } from "@/lib/data";
import { extractUzumId, getUzumStock } from "@/lib/uzum";
import { Product } from "@/lib/translations";

export async function POST(request: Request) {
    try {
        const products = getProducts();
        let updatedCount = 0;
        const productsToUpdate: Product[] = [];

        // Iterate over products to find Uzum products
        // We use map to process concurrently
        const updates = products.map(async (product) => {
            // Determine if it's an Uzum product
            const isUzum = product.source === 'uzum' || (!product.source && product.uzumUrl);

            if (isUzum && product.uzumUrl) {
                const uzumId = extractUzumId(product.uzumUrl);
                if (uzumId) {
                    const stock = await getUzumStock(uzumId);
                    if (stock !== null && stock !== product.stockQuantity) {
                        product.stockQuantity = stock;
                        // Determine inStock status based on quantity
                        product.inStock = stock > 0;
                        return true; // Mark as updated
                    }
                }
            }
            return false;
        });

        const results = await Promise.all(updates);
        updatedCount = results.filter(r => r).length;

        if (updatedCount > 0) {
            saveProducts(products);
        }

        return NextResponse.json({ success: true, updatedCount });
    } catch (error) {
        console.error("Sync failed:", error);
        return NextResponse.json({ success: false, error: "Sync failed" }, { status: 500 });
    }
}
