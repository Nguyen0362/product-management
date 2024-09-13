const Product = require('../../model/product.model');

module.exports.index = async (req, res) => {
    const product = await Product.find({
        deleted: false
    });

    console.log(product);

    res.render('client/pages/products/index', {
        pageTitle: "Danh sách sản phẩm"
    });
}