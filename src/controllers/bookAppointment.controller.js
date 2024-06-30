
const Order = require('../models/order.model');
const Notification = require("../models/notification.model.js");
const Payment = require('../models/payment.model');
const Appointment = require("../models/Appointment.model.js")

const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const User = require("../models/user.model.js");
const asyncHandler = require('../utils/asyncHandler.js');
const UserService = require("../services/user.service.js")


const bookAppointment = asyncHandler(async (req, res) => {
    try {
        const payment = await UserService.bookAppointment(req, req.body)

        return res.status(200).json(new ApiResponse(200, payment, "payment saved"))
    } catch (error) {
        console.log("error", error.message)
        throw new ApiError(400, "Something wrong", error.message)
    }
})

const updatePayment = asyncHandler(async (req, res) => {
    try {
        const payment = await UserService.updatePayment(req, req.body)

        return res.status(200).json(new ApiResponse(200, {paymentStatus: "success"}, "payment updated"))
    } catch (error) {
        console.log("error", error.message)
        throw new ApiError(400, "Something wrong", error.message)
    }
})


const paymentVerification = asyncHandler(async (req, res) => {
    try {
        const orderId = req.body.payload.payment_link.entity.reference_id
        const method = req.body.payload.payment.entity.method
        // const created_At=req.body.payload.payment_link.updated_At   //   in future i have to update this on payment model
        // console.log("..............................", req.body.payload) 


        const order = await Order.findById(orderId);

        if (!order) {
            throw new ApiError(404, "Order not found");
        }

        const { orderType } = order;

        let message, eventType;

        if (orderType === 'Appointment') {
            message = `New Appointment has been booked of Rs.${req.body.payload.payment_link.entity.amount} and booking order id is :${req.body.payload.payment_link.entity.reference_id}`;
            eventType = ' Appointment';
        } else if (orderType === 'product Buy') {
            message = `New product has been purchased of Rs.${req.body.payload.payment_link.entity.amount} and order id is :${req.body.payload.payment_link.entity.reference_id}`;
            eventType = 'purchase products';
        }




        if (req.body.payload.payment_link.entity.status === 'paid') {
            const updatedOrder = await Order.findByIdAndUpdate(
                orderId,
                { status: 'paid' },
                { new: true }
            );
            const updatePaymentData = await Payment.findOneAndUpdate(
                { orderId: orderId }, { paymentStatus: "success", paymentMethod: method }, { new: true }
            )
            const updatedAppointment = await Appointment.findOneAndUpdate(
                { orderId: orderId },
                { status: 'booked', paymentStatus: "paid" },
                { new: true }
            );
        }
        const admin = await User.find({ role: "admin" })
        // console.log("adminnnnnn", admin)
        const adminId = admin[0]._id

        await Notification.create({
            message,
            fromUserId: req.body.payload.payment_link.entity.description,
            toUserId: adminId,
            eventType
        });
        return res.status(200).json(200, "Appointment book successfull",)

    } catch (error) {
        console.error("Error verifying payment:", error);
        throw new ApiError(400, "Something went wrong", error.message)
    }
});

module.exports = {
    bookAppointment,
    updatePayment,
    paymentVerification
}
