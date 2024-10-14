const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {
        //userId: String,
        fullname: String,
        phone: String,
        email: String,
        address: String,
        products: Array,
        expireAt: {
            type: Date,
            expires: 0
        }
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model("Order", orderSchema, "orders");

module.exports = Order;