import { NextResponse } from "next/server";
import { getShops, getFinancialOrders, getShopProducts } from "@/lib/uzum-seller";
import { saveUzumOrders, getUzumOrders } from "@/lib/uzum-data";
import { getProducts, saveProducts } from "@/lib/data";

export async function POST() {
    try {
        console.log("Starting Uzum FBO Order Sync (Financial Basis)...");

        // 1. Identify Target Shop
        // We know from research/user that 85087 is the primary target.
        // We still fetch shops to ensure the token is valid and IDs are visible.
        let shopsData;
        try {
            shopsData = await getShops();
        } catch (e: any) {
            console.error("Failed to fetch shops during sync:", e.message);
            return NextResponse.json({ success: false, error: `Auth/Shop Fetch Failed: ${e.message}` }, { status: 500 });
        }

        const shops = Array.isArray(shopsData) ? shopsData : (shopsData?.payload || []);
        const targetShopId = 85087;
        const shopIds = shops.map((s: any) => s.id);

        if (shopIds.length === 0) {
            return NextResponse.json({ success: false, error: "No shops available for this token." });
        }

        const activeShopIds = shopIds.includes(targetShopId) ? [targetShopId] : [shopIds[0]];
        console.log(`Syncing for shop(s): ${activeShopIds.join(',')}`);

        // 2. Fetch Financial Orders from Dec 1st, 2025
        // Using Unix MS as per Uzum API requirements
        const dateFrom = new Date('2025-12-01T00:00:00').getTime();
        const dateTo = new Date().getTime();

        let financialData;
        try {
            financialData = await getFinancialOrders(activeShopIds, dateFrom, dateTo);
            console.log(`Fetched ${financialData?.orderItems?.length || 0} financial items.`);
        } catch (e: any) {
            console.error("Failed to fetch financial orders:", e.message);
            return NextResponse.json({ success: false, error: `Finance API Error: ${e.message}` }, { status: 500 });
        }

        const newItems = financialData?.orderItems || [];

        // 3. Persistent Storage Merge for Orders
        const existingItems = getUzumOrders();
        const itemMap = new Map();

        existingItems.forEach(item => itemMap.set(item.id, item));
        newItems.forEach((item: any) => itemMap.set(item.id, item));

        const allItems = Array.from(itemMap.values()) as any[];
        saveUzumOrders(allItems);

        // 4. Fetch Product Catalog for Mapping
        let catalogData;
        try {
            catalogData = await getShopProducts(targetShopId);
            console.log(`Fetched ${catalogData?.productList?.length || 0} products from catalog.`);
        } catch (e: any) {
            console.warn("Failed to fetch product catalog, product card creation may be incomplete:", e.message);
        }

        const catalogProducts = (catalogData?.productList || []) as any[];
        const catalogMap = new Map();
        const skuTitleMap = new Map();

        catalogProducts.forEach((p: any) => {
            const skus = p.skus || p.skuList || [];
            if (Array.isArray(skus)) {
                skus.forEach((sku: any) => {
                    const productWithSku = { ...p, currentSku: sku };
                    const sId = sku.skuId || sku.id;
                    const sFullTitle = sku.skuFullTitle || sku.fullTitle || sku.title;

                    if (sId) catalogMap.set(sId, productWithSku);
                    if (sFullTitle) skuTitleMap.set(sFullTitle.trim(), productWithSku);
                });
            }
        });

        console.log(`Catalog Mapping: ${catalogMap.size} by SKU ID, ${skuTitleMap.size} by SKU Title (full).`);
        console.log("Catalog Titles:", Array.from(skuTitleMap.keys()));

        // 5. Sync Products (Auto-create missing cards and update existing)
        const localProducts = getProducts();

        // Build a robust set of existing SKU IDs, including those from URLs
        const localSkuIds = new Set();
        localProducts.forEach(p => {
            if (p.skuId) localSkuIds.add(p.skuId);
            if (p.uzumUrl) {
                const match = p.uzumUrl.match(/skuId=(\d+)/);
                if (match) localSkuIds.add(parseInt(match[1]));
            }
        });

        const updatedLocalProducts = [...localProducts];
        let productsCreated = 0;
        let productsUpdated = 0;

        console.log("Order Item Titles to match:", allItems.map(i => i.skuTitle));

        for (const item of allItems) {
            const skuId = item.skuId;
            const skuTitle = item.skuTitle;

            // Try to find catalog data regardless of whether we have it locally, to check for enrichment
            let uzumProd = skuId ? catalogMap.get(skuId) : null;
            if (!uzumProd && skuTitle) {
                uzumProd = skuTitleMap.get(skuTitle.trim());
            }

            if (uzumProd) {
                const finalSkuId = skuId || uzumProd.currentSku.skuId || uzumProd.currentSku.id;
                const prodId = (uzumProd.productId || uzumProd.id).toString();

                // 1. Try to find existing local product by SKU ID, uzumId, or URL
                const existingIndex = updatedLocalProducts.findIndex(p =>
                    (p.skuId && p.skuId === finalSkuId) ||
                    (p.uzumId && p.uzumId.toString() === prodId) ||
                    (p.uzumUrl && (p.uzumUrl.includes(`skuId=${finalSkuId}`) || p.uzumUrl.includes(prodId)))
                );

                if (existingIndex !== -1) {
                    // Update existing product with missing IDs if needed
                    const p = updatedLocalProducts[existingIndex];
                    let changed = false;
                    if (!p.skuId) { p.skuId = finalSkuId; changed = true; }
                    if (!p.uzumId) { p.uzumId = parseInt(prodId); changed = true; }
                    // Update image if missing
                    if (!p.image || p.image === "" || p.image === "undefined") {
                        const newImg = uzumProd.mainSizeImage || uzumProd.image || (uzumProd.photos?.[0]?.url) || "";
                        if (newImg && newImg !== p.image) {
                            console.log(`Updating image for product ${p.id} (${p.uz?.title || 'No Title'}): ${newImg}`);
                            p.image = newImg;
                            changed = true;
                        }
                    }

                    if (changed) {
                        console.log(`Enriched existing product ${p.id} (${p.uz?.title || 'No Title'})`);
                        productsUpdated++;
                    }
                } else if (!localSkuIds.has(finalSkuId)) {
                    // 2. Create new product ONLY if not found by any means
                    const newProduct = {
                        id: updatedLocalProducts.length > 0 ? Math.max(...updatedLocalProducts.map(p => p.id)) + 1 : 1,
                        skuId: finalSkuId,
                        uzumId: parseInt(prodId),
                        price: (uzumProd.currentSku.sellPrice || item.sellPrice || 0).toString(),
                        costPrice: (uzumProd.currentSku.purchasePrice || 0).toString(),
                        category: uzumProd.category?.title || "Uzum",
                        image: uzumProd.mainSizeImage || uzumProd.image || (uzumProd.photos?.[0]?.url) || "",
                        uzumUrl: `https://uzum.uz/uz/product/${prodId}?skuId=${finalSkuId}`,
                        inStock: uzumProd.currentSku.availableAmount > 0,
                        stockQuantity: uzumProd.currentSku.availableAmount || 0,
                        source: 'uzum' as const,
                        uz: {
                            title: uzumProd.title,
                            description: uzumProd.description || "",
                            characteristics: uzumProd.characteristics?.map((c: any) => `${c.title}: ${c.values?.[0]?.title}`).join('; ') || ""
                        },
                        ru: {
                            title: uzumProd.title,
                            description: uzumProd.description || "",
                            characteristics: uzumProd.characteristics?.map((c: any) => `${c.title}: ${c.values?.[0]?.title}`).join('; ') || ""
                        },
                        gallery: uzumProd.photos?.map((p: any) => p.url) || []
                    } as any;

                    updatedLocalProducts.push(newProduct);
                    localSkuIds.add(finalSkuId);
                    productsCreated++;
                }
            }
        }

        if (productsCreated > 0 || productsUpdated > 0) {
            saveProducts(updatedLocalProducts);
            console.log(`Sync update: ${productsCreated} created, ${productsUpdated} updated.`);
        }

        return NextResponse.json({
            success: true,
            syncedCount: newItems.length,
            totalStored: allItems.length,
            productsCreated,
            productsUpdated,
            message: `FBO data synced. Created ${productsCreated}, updated ${productsUpdated} products.`
        });

    } catch (error: any) {
        console.error("Unexpected error in Uzum Sync Route:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
