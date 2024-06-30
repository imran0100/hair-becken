// const crypto = require("crypto");
const Razorpay = require("razorpay");
const Payment = require("../models/payment.model.js");
const asyncHandler = require("../utils/asyncHandler.js");
const User = require("../models/user.model.js");
const ApiResponse = require("../utils/ApiResponse.js");
const Order = require("../models/order.model.js");
const ApiError = require("../utils/ApiError.js");

const instance = new Razorpay({
    key_id: "rzp_test_IVOsFC0Bobcxcv",
    key_secret: "jrLluVVj1fpEiMNwR7QyBUDZ",
});





const placeOrder = asyncHandler(async (req, res) => {
    try {
        const { amount, products } = req.body;
        const { user } = req;

        if (!user || !user._id) {
            return res.status(404).json({ message: "User not found or user ID is missing" });
        }

        const order = new Order({
            userId: user._id,
            currency: "INR",
            amount,
            orderType: "product Buy",
            status: 'pending',
            products,
            fullname: "",
            email: "",
            mobile: "",
            Address: "",
            Appartment: "",
            country: "",
            city: "",
            state: "",

        });

        await order.save();
        const paymentData = {
            orderId: order._id,
            userId: user._id,
            totalAmount: amount,
            paymentStatus: 'pending',
            paymentMethod: "",
        };
        const payment = new Payment(paymentData);
        await payment.save();

        return res.status(200).json(new ApiResponse(200, order._id, "Order created successfully"));
    } catch (error) {
        throw new ApiError(400, "Failed to create order", error.message);
    }
});

const generatePaymentLink = asyncHandler(async (req, res) => {
    try {
        const { orderId, fullname, email, mobile, city, state, pinCode, country, Address, Appartment } = req.body;
        const { user } = req;

        if (!user || !user._id) {
            return res.status(404).json({ message: "User not found or user ID is missing" });
        }


        const order = await Order.findById(orderId);

        if (!order) {
            throw new ApiError(400, "Order not found");
        }

        order.fullname = fullname,
            order.city = city
        order.state = state
        order.country = country
        order.Address = Address
        order.Appartment = Appartment
        order.mobile = mobile
        order.pinCode = pinCode
        order.email = email

        await order.save();

        const loggedInUser = await User.findById(user._id);

        const response = await instance.paymentLink.create({
            amount: order.amount,
            currency: "INR",
            accept_partial: false,
            reference_id: order?._id || '',
            description: user._id,
            customer: {
                name: loggedInUser?.name,
                email: loggedInUser?.email,
                contact: loggedInUser?.mobile
            },
            notify: {
                sms: true,
                email: true
            },
            upi_link: false,
            reminder_enable: false,
            callback_url: req.body.callbackUrl,
            callback_method: "get",
        });

        return res.status(200).json(new ApiResponse(200, response.short_url, "Payment link generated successfully"));

    } catch (error) {
        throw new ApiError(400, "Failed to generate payment link", error.message);
    }
});


const deleteAllPayments = async () => {
    try {
        const result = await Payment.deleteMany({});
        console.log(`${result.deletedCount} payments deleted successfully.`);
    } catch (error) {
        console.error('Error deleting payments:', error);
    }
};






module.exports = { placeOrder, generatePaymentLink, deleteAllPayments }
