const { getShopProducts } = require('./lib/uzum-seller');

async function testFetchProducts() {
    try {
        const targetShopId = 85087;
        const productsData = await getShopProducts(targetShopId);
        const list = productsData?.productList || [];
        console.log("Total products fetched:", list.length);
        if (list.length > 0) {
            const p = list[0];
            console.log("Product Name:", p.title);
            console.log("Product ID:", p.productId);
            console.log("SKUs:", JSON.stringify(p.skus, null, 2));
        }
    } catch (error) {
        console.error("Error fetching products:", error);
    }
}

testFetchProducts();
