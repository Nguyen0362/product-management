const Product = require("../../model/product.model");

module.exports.index = async (req, res) => {
    const product = await Product
    .find({
        status: "active",
        deleted: false
    })
    .sort({
        position: "desc"
    });

    for (const item of product) {
        item.priceNew = item.price*(100 - item.discountPercentage)/100;
        item.priceNew = (item.priceNew).toFixed(0);
    }

    res.render("client/pages/products/index", {
        pageTitle: "Danh sách sản phẩm",
        products: product
    });
}

module.exports.detail = async (req, res) => {
    const slug = req.params.slug;

    const product = await Product
    .findOne({
        slug: slug,
        status: "active",
        deleted: false
    });

    product.priceNew = product.price*(100 - product.discountPercentage)/100;
    product.priceNew = (product.priceNew).toFixed(0);

    res.render("client/pages/products/detail", {
        pageTitle: product.title,
        product: product
    });
}