const Product = require('../../model/product.model');

module.exports.index = async (req, res) => {
    const find = {
        deleted: false
    };

    // Lọc theo trạng thái
    if(req.query.status){
        find.status = req.query.status;
    }
    // Hết lọc theo trạng thái

    // Tìm Kiếm
    if(req.query.keyword){
        const regex = new RegExp(req.query.keyword, "i");
        find.title = regex;
    }
    // Hết tìm Kiếm

    // Phân trang
    let limitItem = 4;
    let page = 1;

    if(req.query.page){
        page = parseInt(req.query.page);
    }

    if(req.query.limit){
        limitItem = parseInt(req.query.limit);
    }

    const skip = (page - 1) * limitItem;

    const totalProduct = await Product.countDocuments(find);

    const totalPage = Math.ceil(totalProduct / limitItem);

    console.log(totalPage);
    // Hết phân trang

    const products = await Product.find(find).limit(limitItem).skip(skip);

    res.render("admin/pages/products/index", {
        pageTitle: "Trang danh sách sản phẩm",
        products: products,
        totalPage: totalPage,
        currentPage: page
    });
}

//Đổi trạng thái
module.exports.changeStatus = async (req, res) => {
    await Product.updateOne({
        _id: req.body.id
    }, {
        status: req.body.status
    })

    res.json({
        code: "success",
        message: "Đổi trạng thái thành công"
    });
}
// Hết đổi trạng thái

//Đổi trạng thái nhiều bản ghi
module.exports.changeMulti = async (req, res) => {
    await Product.updateMany({
        _id: req.body.id  
    }, {
        status: req.body.status
    })

    res.json({
        code: "success",
        message: "Đổi trạng thái thành công"
    });
}
// Hết đổi trạng thái nhiều bản ghi

//Xóa
module.exports.delete = async(req, res) => {
    await Product.updateOne({
        _id: req.body.id
    },{
        deleted: true
    })

    res.json({
        code: "success",
        message: "Đổi trạng thái thành công"
    })
}
// Hết xóa 