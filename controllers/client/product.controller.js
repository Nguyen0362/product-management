const Product = require("../../model/product.model");
const ProductCategory = require('../../model/product-category.model');

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

    if(product.category_id){
        const category = await ProductCategory.findOne({
        _id: product.category_id,
        deleted: false,
        status: "active"
        });

        product.category = category;
    }

    product.priceNew = product.price*(100 - product.discountPercentage)/100;
    product.priceNew = (product.priceNew).toFixed(0);

    res.render("client/pages/products/detail", {
        pageTitle: product.title,
        product: product
    });
}

module.exports.category = async (req, res) => {
    const slug = req.params.slugCategory;
    
    const category = await ProductCategory
    .findOne({
        slug: slug,
        status: "active",
        deleted: false
    });

    const allCategoryChildren = [];

    const getCategoryChildren = async (parentId) => {
        const childs = await ProductCategory.find({
            parent_id: parentId,
            status: "active",
            deleted: false
        })

        for(const child of childs){
            allCategoryChildren.push(child.id);
            await getCategoryChildren(child.id);
        }
    }

    await getCategoryChildren(category.id);
    
    const products = await Product.find({
        category_id: {$in: [category.id, ...allCategoryChildren]},
        status: "active",
        deleted: "false"
    })

    for(const product of products){
        product.priceNew = product.price*(100 - product.discountPercentage)/100;
        product.priceNew = (product.priceNew).toFixed(0);
    }

    res.render("client/pages/products/index", {
        pageTitle: "Danh sách sản phẩm",
        products: products
    });
}

module.exports.search = async (req, res) => {
    const keyword = req.query.keyword

    let products = []

    //Tìm kiếm
    if(keyword){
        const regax = new RegExp(keyword, "i");

        products = await Product.find({
            title: regax,
            deleted: false,
            status: "active"
        })
        .sort({position: "desc"});
    }

    for(const product of products){
        product.priceNew = product.price*(100 - product.discountPercentage)/100;
        product.priceNew = (product.priceNew).toFixed(0);
    }
    //Hết tìm kiếm

    res.render("client/pages/products/search", {
        pageTitle: `Kết quả tìm kiếm: ${keyword}`,
        keyword: keyword,
        products: products
    });
}