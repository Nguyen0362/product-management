const Cart = require('../../model/cart.model');
const Product = require('../../model/product.model');

module.exports.index = async (req, res) => {
    const cartId = req.cookies.cartId;
    
    const cart = await Cart.findOne({
        _id: cartId
    })

    const products = cart.products;

    let total = 0;

    for(const item of products){
        const infoItem = await Product.findOne({
            _id: item.productId,
            deleted: false,
            status: "active"
        })
         
        item.thumbnail = infoItem.thumbnail;
        item.title = infoItem.title;
        item.slug = infoItem.slug;
        item.priceNew = infoItem.price;
        if(infoItem.discountPercentage > 0){
            item.priceNew = (1 - infoItem.discountPercentage / 100) * infoItem.price;
            item.priceNew = item.priceNew.toFixed(0);
        }
        item.total = item.priceNew * item.quantity;

        total += item.total;
    }

    res.render("client/pages/cart/index",{
        products: products,
        total: total
    });
}

module.exports.addPost = async (req, res) => {
    const cartId = req.cookies.cartId;

    const cart = await Cart.findOne({
        _id: cartId
    });

    const products = cart.products;

    const existProducts = products.find(item => item.productId == req.params.id);

    if(existProducts){
        existProducts.quantity = existProducts.quantity + parseInt(req.body.quantity);
    } else {
        const product = {
            productId: req.params.id,
            quantity: parseInt(req.body.quantity)
        }
    
        products.push(product);
    }

    await Cart.updateOne({
        _id: cartId
    }, {
        products: products
    })

    res.redirect("back");
}

module.exports.delete = async (req, res) => {
    const cartId = req.cookies.cartId;
    const productId = req.params.id;

    const cart = await Cart.findOne({
        _id: cartId
    })

    const products = cart.products.filter(item => item.productId != productId);

    await Cart.updateOne({
        _id: cartId
    }, {
        products: products
    })

    res.redirect("back");
}

module.exports.updatePatch = async (req, res) => {
    const cartId = req.cookies.cartId;
    const product = req.body;

    const cart = await Cart.findOne({
        _id: cartId
    });

    const products = cart.products;

    const productsUpdate = products.find(item => item.productId == product.productId);

    productsUpdate.quantity = parseInt(product.quantity);

    await Cart.updateOne({
        _id: cartId
    }, {
        products: products
    })

    res.json({
        code: "success",
        message: "Cập nhật thành công!"
    }) 
}