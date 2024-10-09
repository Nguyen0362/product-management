const Product = require('../../model/product.model');

module.exports.index = async (req, res) => {
    //Sản phẩm nổi bật
    const productsFeatured = await Product
    .find({
        deleted: false,
        status: "active",
        featured: "1"

    })
    .sort({
        position: "desc"
    })
    .limit(6);

    for(const item of productsFeatured){
        item.priceNew = (1 - item.discountPercentage/100) * item.price;
        item.priceNew = item.priceNew.toFixed(0);
    }
    // Hết sản phẩm nổi bật
    
    // Sản phẩm nổi bật
    const productsNew = await Product
    .find({
        deleted: false,
        status: "active",
    })
    .sort({
        position: "desc"
    })
    .limit(6);

    for(const item of productsNew){
        item.priceNew = (1 - item.discountPercentage/100) * item.price;
        item.priceNew = item.priceNew.toFixed(0);
    }
    // Hết sản phẩm nổi bật
    
    //Sản phẩm giảm giá nhiều
    const productsDiscount = await Product
    .find({
        deleted: false,
        status: "active",
    })
    .sort({
        discountPercentage: "desc"
    })
    .limit(6);

    for(const item of productsDiscount){
        item.priceNew = (1 - item.discountPercentage/100) * item.price;
        item.priceNew = item.priceNew.toFixed(0);
    }
    //Hết sản phẩm giảm giá nhiều

    //Lấy ra các sản phẩm cụ thể
    const productsChoose = await Product
    .find({
        _id: {
            $in: [
                "66e2f75a151d84ca523370dc",
                "66e2f75a151d84ca523370de"
            ]
        },
        deleted: false,
        status: "active",
    })
    .sort({
        position: "desc"
    })

    for(const item of productsChoose){
        item.priceNew = (1 - item.discountPercentage/100) * item.price;
        item.priceNew = item.priceNew.toFixed(0);
    }
    // Hết lấy ra các sản phẩm cụ thể

    res.render("client/pages/home/index", {
        pageTitle: "Trang chủ",
        productsFeatured: productsFeatured,
        productsNew: productsNew,
        productsDiscount: productsDiscount,
        productsChoose: productsChoose
    });

}