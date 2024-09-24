const Product = require('../../model/product.model');
const sytemConfig = require('../../config/system');

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

    const products = await Product.find(find).limit(limitItem).skip(skip).sort({
        position: "desc"
    });

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

    req.flash('success', 'Đổi trạng thái thành công');

    res.json({
        code: "success",
        message: "Đổi trạng thái thành công"
    });
}
// Hết đổi trạng thái

//Đổi trạng thái nhiều bản ghi
module.exports.changeMulti = async (req, res) => {
    switch (req.body.status) {
        case 'active':
        case 'inactive':
            await Product.updateMany({
                _id: req.body.id  
            }, {
                status: req.body.status
            })
        
            req.flash('success', 'Đổi trạng thái thành công');

            res.json({
                code: "success",
                message: "Đổi trạng thái thành công"
            });
            break;
        
        case 'delete':
            await Product.updateMany({
                _id: req.body.id  
            }, {
                deleted: true
            });
            res.json({
                code: "success",
                message: "Xóa thành công"
            });
            break;
        default:
            res.json({
                code: "error",
                message: "Trạng thái không hợp lệ"
            });
            break;
    }
}
// Hết đổi trạng thái nhiều bản ghi

//Xóa
module.exports.delete = async(req, res) => {
    await Product.updateOne({
        _id: req.body.id
    },{
        deleted: true
    })

    req.flash('success', 'Xóa thành công');

    res.json({
        code: "success",
        message: "Đổi trạng thái thành công"
    })
}
// Hết xóa 

//Đổi vị trí
module.exports.changePosition = async(req, res) => {
    await Product.updateOne({
        _id: req.body.id
    },{
        position: req.body.position
    })

    req.flash('success', 'Đổi vị trí thành công');

    res.json({
        code: "success",
        message: "Đổi trạng thái thành công"
    })
}
//Hết đổi vị trí

module.exports.create = async (req, res) => {
    res.render("admin/pages/products/create", {
        pageTitle: "Thêm mới sản phẩm",
    });
}

module.exports.createPost = async (req, res) => {
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    if(req.body.position){
        req.body.position = parseInt(req.body.position);
    } else {
        const count = await Product.countDocuments();
        req.body.position = count + 1;
    }
    
    if(req.file){
        req.body.thumbnail = `/uploads/${req.file.filename}`;
    }

    const record = new Product(req.body);
    await record.save();

    res.redirect(`/${sytemConfig.prefixAdmin}/products`);
}

module.exports.edit = async (req, res) => {
    const id = req.params.id;

    const product = await Product.findOne({
        _id: id,
        deleted: false
    })

    res.render("admin/pages/products/edit", {
        pageTitle: "Chỉnh sửa sản phẩm",
        product: product
    });
}

module.exports.editPatch = async (req, res) => {
    const id = req.params.id;

    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    if(req.body.position){
        req.body.position = parseInt(req.body.position);
    }
    
    if(req.file){
        req.body.thumbnail = `/uploads/${req.file.filename}`;
    }

    await Product.updateOne({
        _id: id,
        deleted: false
    }, req.body);

    req.flash("success", "Cập nhật thánh công");
    res.redirect("back");
}

module.exports.detail = async (req, res) => {
    const id = req.params.id;

    const product = await Product.findOne({
        _id: id,
        deleted: false
    })

    res.render("admin/pages/products/detail", {
        pageTitle: "Chi tiết sản phẩm",
        product: product
    });
}
