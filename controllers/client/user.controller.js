const User = require('../../model/user.model');
const md5 = require('md5');
const ForgotPassword = require('../../model/forgot-password.model');

const generateHelper = require('../../helpers/generate.helper');
const sendMailHelper = require('../../helpers/sendMail.helper')

module.exports.register = async (req, res) => {
    res.render("client/pages/user/register", {
        pageTitle: "Đăng kí"
    })
}

module.exports.registerPost = async (req, res) => {
    const user = req.body;

    const existUser = await User.findOne({
        email: user.email,
        deleted: false
    });

    if(existUser){
        req.flash("error", "Email đã tồn tại trong hệ thống!");
        res.redirect("back");
        return;
    }

    const dataUser = {
        fullName: user.fullName, 
        email: user.email,
        password: md5(user.password),
        token: generateHelper.generateRandomString(30),
        status: "active"
    }

    const newUser = new User(dataUser);
    await newUser.save();

    res.cookie("tokenUser", newUser.token);

    req.flash("success", "Đăng ký tài khoản thành công!");

    res.redirect("/");
}

module.exports.login = async (req, res) => {
    res.render("client/pages/user/login", {
        pageTitle: "Đăng Nhập"
    })
}

module.exports.loginPost = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const existUser = await User.findOne({
        email: email,
        deleted: false
    });
    
    if(!existUser){
        req.flash("error", "Email không tồn tại trong hệ thống!");
        res.redirect("back");
        return;
    }

    if(md5(password) != existUser.password){
        req.flash("error", "Sai mật khẩu!");
        res.redirect("back");
        return;
    }

    if(existUser.status != "active"){
        req.flash("error", "Tài khoản đã bị khóa");
        res.redirect("back");
        return;
    }

    res.cookie("tokenUser", existUser.token);

    req.flash("success", "Đăng nhập tài khoản thành công!");

    res.redirect("/");
}

module.exports.logout = async (req, res) => {
    res.clearCookie("tokenUser");
    res.redirect("/user/login");
}

module.exports.profile = async (req, res) => {
    res.render("client/pages/user/profile", {
        pageTitle: "Thông tin người dùng"
    })
}

module.exports.forgotPassword = async (req, res) => {
    res.render("client/pages/user/forgot-pasword", {
        pageTitle: "Lấy lại mật Khẩu"
    })
}

module.exports.forgotPasswordPost = async (req, res) => {
    const email = req.body.email;

    const existUser = await User.findOne({
        email: email,
        deleted: false,
        status: "active"
    })

    if(!existUser){
        req.flash("error", "Email không tồn tại");
        res.redirect("back");
        return;
    }

    // Việc 1: Lưu email và mã otp vào database
    const existForgitPasswordEmail = await ForgotPassword.findOne({
        email: email
    });

    if(!existForgitPasswordEmail){
        const otp = generateHelper.generateRandomNumber(6);

        const data = {
            email: email,
            otp: otp,
            expireAt: Date.now() + 5*60*1000
        };

        const record = new ForgotPassword(data);
        await record.save();

        // Việc 2: Gửi mã otp qua email cho user
        const subject = "Xác thực mã OTP";
        const text = `Mã xác thực của bản là <b>${otp}</b>. Mã OTP có hiệu lực trong 5 phút, vui lòng không cung cấp cho bất kỳ ai.`

        sendMailHelper.sendNail(email, subject, text);
    };

    res.redirect(`/user/password/otp?email=${email}`);
}

module.exports.otpPassword = async (req, res) => {
    const email = req.query.email;

    res.render("client/pages/user/otp-password", {
        pageTitle: "xác thực OTP",
        email: email
    })
}

module.exports.otpPasswordPost = async (req, res) => {
    const email = req.body.email;
    const otp = req.body.otp;

    const existRecord = await ForgotPassword.findOne({
        email: email,
        otp: otp
    });

    if(!existRecord){
        req.flash("error", "Mã OTP không hợp lệ");
        res.redirect("back");
        return;
    }

    const user = await User.findOne({
        email: email
    });

    res.cookie("tokenUser", user.token);

    res.redirect("/user/password/reset"); 
}

module.exports.resetPassword = async (req, res) => {
    const email = req.query.email;

    res.render("client/pages/user/reset-password", {
        pageTitle: "Đổi mật khẩu",
        email: email
    })
}

module.exports.resetPasswordPost = async (req, res) => {
    const password = req.body.password;
    const tokenUser = req.cookies.tokenUser;

    await User.updateOne({
        token: tokenUser,
        status: "active",
        deleted: false
    }, {
        password: md5(password)
    })

    req.flash("success", "Đổi mật khẩu thành công!");

    res.redirect("/");
}