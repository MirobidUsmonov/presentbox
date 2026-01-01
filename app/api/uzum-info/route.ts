import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const productUrl = searchParams.get('url');

    if (!productUrl) {
        return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    try {
        // Extract Product ID from URL
        // Example: https://uzum.uz/ru/product/nabor-gubnykh-pomad-2178833
        const urlObj = new URL(productUrl);
        const match = urlObj.pathname.match(/-(\d+)$/);
        const productId = match ? match[1] : null;

        if (!productId) {
            return NextResponse.json({ error: 'Invalid Product URL' }, { status: 400 });
        }

        const apiUrl = `https://api.uzum.uz/api/v2/product/${productId}`;
        const headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            'Accept': 'application/json, text/plain, */*',
            'Origin': 'https://uzum.uz',
            'Referer': 'https://uzum.uz/',
            'x-iis-call': 'true'
        };

        const response = await fetch(apiUrl, { headers, next: { revalidate: 0 } });

        if (!response.ok) {
            return NextResponse.json({ error: 'Failed to fetch Uzum API', status: response.status }, { status: response.status });
        }

        const data = await response.json();
        const p = data.payload?.data;

        if (!p) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        // Map price from first SKU
        const firstSku = p.skuList?.[0];
        const rawPrice = firstSku?.purchasePrice || firstSku?.sellPrice || firstSku?.fullPrice || 0;
        const formattedPrice = new Intl.NumberFormat('fr-FR').format(rawPrice).replace(/\s/g, ' ') + " so'm";

        // Map characteristics (Bilingual)
        const characteristicsUz: string[] = [];
        const characteristicsRu: string[] = [];
        p.characteristics?.forEach((group: any) => {
            group.values?.forEach((val: any) => {
                // Uzum API often has localizable titles for characteristics too
                // But let's check if they exist or fallback to group title
                const groupTitleUz = group.localizableTitle?.uz || group.title;
                const groupTitleRu = group.localizableTitle?.ru || group.title;
                const valTitleUz = val.localizableTitle?.uz || val.title;
                const valTitleRu = val.localizableTitle?.ru || val.title;

                characteristicsUz.push(`${groupTitleUz}: ${valTitleUz}`);
                characteristicsRu.push(`${groupTitleRu}: ${valTitleRu}`);
            });
        });

        // Map variants (colors) - Keeping it simple for now, but color names could be bilingual
        const variants: { colorUz: string, colorRu: string, images: string[] }[] = [];

        // Find "Цвет" or "Rang" option
        const colorOption = p.productOptionDtos?.find((opt: any) =>
            opt.title.toLowerCase() === 'цвет' || opt.title.toLowerCase() === 'rang'
        );

        if (colorOption && p.skuList) {
            p.skuList.forEach((sku: any) => {
                const skuColorValue = sku.characteristics?.find((c: any) => c.charId === colorOption.id);
                if (skuColorValue) {
                    const skuImages = p.photos
                        ?.filter((photo: any) => !photo.color || photo.color === skuColorValue.title)
                        ?.map((photo: any) => photo.photo?.["720"]?.high || photo.photo?.["800"]?.high || "")
                        .filter(Boolean)
                        .slice(0, 7) || [];

                    const finalImages = skuImages.length > 0 ? skuImages : [p.photos?.[0]?.photo?.["720"]?.high || ""];

                    variants.push({
                        colorUz: skuColorValue.localizableTitle?.uz || skuColorValue.title,
                        colorRu: skuColorValue.localizableTitle?.ru || skuColorValue.title,
                        images: finalImages
                    });
                }
            });
        }

        // Clean description (Bilingual)
        const cleanDescriptionUz = p.description?.replace(/<[^>]*>?/gm, '\n').replace(/\n\s*\n/g, '\n').trim() || "";
        // Note: Uzum API data object might not have localized description directly if fetched with a specific locale
        // However, usually it's just one description field in the main data.
        // If they have localizableDescription, use it.
        const cleanDescriptionRu = p.localizableDescription?.ru?.replace(/<[^>]*>?/gm, '\n').replace(/\n\s*\n/g, '\n').trim() || cleanDescriptionUz;

        // Map seller info
        const sellerData = p.seller;
        const seller: any = sellerData ? {
            name: sellerData.title || sellerData.name || "Noma'lum do'kon",
            logo: sellerData.avatar || sellerData.logo?.["256"]?.high || sellerData.logo?.["128"]?.high || "/images/seller-logo.png",
            rating: sellerData.rating || 5.0,
            reviewsCount: sellerData.reviews || 0,
            ordersCount: sellerData.orders || "0",
            registrationDate: sellerData.registrationDate
                ? new Date(sellerData.registrationDate).toLocaleDateString(
                    'ru-RU',
                    { day: 'numeric', month: 'long', year: 'numeric' }
                )
                : "yaqinda",
            url: sellerData.link ? (sellerData.link.startsWith('http') ? sellerData.link : `https://uzum.uz/ru/shop/${sellerData.link}`) : "https://uzum.uz"
        } : null;

        const result = {
            id: p.id,
            titles: {
                uz: p.localizableTitle?.uz || p.title,
                ru: p.localizableTitle?.ru || p.title
            },
            price: formattedPrice,
            category: "Go'zallik",
            image: p.photos?.[0]?.photo?.["720"]?.high || "",
            gallery: p.photos?.map((ph: any) => ph.photo?.["720"]?.high).filter(Boolean).slice(0, 10),
            descriptions: {
                uz: cleanDescriptionUz,
                ru: cleanDescriptionRu
            },
            characteristics: {
                uz: characteristicsUz,
                ru: characteristicsRu
            },
            variants: variants.filter((v, i, self) => i === self.findIndex((t) => t.colorUz === v.colorUz)), // Unique colors
            seller: seller
        };

        return NextResponse.json(result);

    } catch (error: any) {
        console.error('Scraper Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
