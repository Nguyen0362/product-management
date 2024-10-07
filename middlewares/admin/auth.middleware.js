const systemConfig = require("../../config/system");
const Account = require("../../model/account.model");
const Role = require("../../model/role.model");

module.exports.requireAuth = async (req, res, next) => {
    if(!req.cookies.token){
        res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
        return;
    }

    const user = await Account.findOne({
        token: req.cookies.token,
        deleted: false,
        status: "active"
    });

    if(!user){
        res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
        return;
    }

    const role = await Role.findOne({
        _id: user.role_id,
        deleted: false
    })

    res.locals.user = user;
    res.locals.role = role;
    next();
}