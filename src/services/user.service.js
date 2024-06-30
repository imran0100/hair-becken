const User = require('../models/user.model.js');
const ApiError = require('../utils/ApiError.js');
const Order = require("../models/order.model.js")
const Payment = require("../models/payment.model.js")
const Razorpay = require("razorpay")
const Plan = require("../models/plan.model");
const Review = require("../models/Review.model.js")
const Appointment = require("../models/Appointment.model.js")

const CommonHelper = require("../utils/commonHelper.js")
const { sendEmail } = require("../utils/nodemailer.util.js")
const sendOTP = require("../utils/fast2sms.utils.js");
const ApiResponse = require('../utils/ApiResponse.js');

const instance = new Razorpay({
    key_id: "rzp_test_8ZrSJwOa8vWxQu",
    key_secret: "IppjQRgEVWjB5cnPvoP1jMB8",
});



class UserService {

    registerService = async (data) => {

        // const existedUser = await User.findOne({ email: data.email });
        // if (existedUser) {
        //     throw new ApiError(409, "This email is already in use.");
        // }
        const user = await User.findOne({ mobile: data.mobile, isVerified: true });
        if (!user) {
            return res.status(200).json(new ApiResponse(200, "User is not verified,first verify mobile number "))

        }
        const passwordHash = await CommonHelper.hashPassword(data.password);
        user.fullname = data.fullname
        user.email = data.email
        user.password = passwordHash
        user.status = true
        await user.save()

        return user

    }
    loginService = async (data) => {

        const user = await User.findOne({ email: data.email })


        if (!user) {
            throw new ApiError(401, "User does not exist")
        }
        const isPasswordValid = await CommonHelper.isPasswordCorrect(data.password, user.password)

        if (!isPasswordValid) {
            // return res.status(400).json({ "message": "Invalid credential" })
            throw new ApiError(400, "Invalid user credential")
        }
        const role = user.role
        const accessToken = await CommonHelper.generateAccessToken(user._id);
        console.log(accessToken)
        const refreshToken = await CommonHelper.generateRefreshToken(user._id);
        return { accessToken, refreshToken, role, user };
    }

    forgetPassword = async (data) => {
        function generateOTP() {
            return Math.floor(100000 + Math.random() * 900000).toString();
        }
        const user = await User.findOne({ email: data.email });
        if (!user) {
            throw new ApiError(400, "user not found")
        }
        const otp = generateOTP();
        user.otp = otp;
        user.otpCreatedAt = new Date();
        await user.save();
        await sendEmail(data.email, 'OTP for password recovery',
            `put this otp on required field to reset password
          ${otp}`)
    }

    updatePassword = async (data) => {
        const user = await User.findOne({ email: data.email });
        const validOtp = CommonHelper.isValidOTP(user.otpCreatedAt);
        if (validOtp) {
            throw new ApiError(400, "Invalid Otp or OTP expired");
        }
        const hashedPassword = await CommonHelper.hashPassword(data.newPassword)
        user.password = hashedPassword;
        user.otp = "";
        await user.save();
    }
    changePassword = async (req, data) => {

        const { user } = req;

        if (!user || !user._id) {
            throw new ApiError(404, "User not found or user ID is missing");
        }
        const userToUpdate = await User.findById(user._id);
        if (!userToUpdate) {
            throw new ApiError(404, "User not found");
        }
        const isPasswordCorrect = await CommonHelper.isPasswordCorrect(data.oldPassword, userToUpdate.password)
        if (!isPasswordCorrect) {
            throw new ApiError(401, "Invalid old password");
        }
        const hashpass = await CommonHelper.hashPassword(data.newPassword)
        userToUpdate.password = hashpass;
        await userToUpdate.save({ validateBeforeSave: false });
    }
    bookAppointment = async (req, data) => {
        const { user } = req;
        // console.log("userrrrr", user)
        if (!user || !user._id) {
            return res.status(404).json({ message: "User not found or user ID is missing" });
        }
        const loggedInUser = await User.findById(user._id);


        // const { appointmentDate, timeSlot, planId } = req.body;

        const selectedPlan = await Plan.findById(data.planId);
        // console.log("body", req.body)
        // console.log("selectedplan", selectedPlan)
        if (!selectedPlan) {
            const err = {
                status: 404,
                message: "Selected plan not found"
            }
            return err
        }


        const order = new Order({
            userId: user._id,

            planId: data.planId,
            amount: selectedPlan.price,
            status: 'pending',
            orderType: "Appointment"
        });
        await order.save();
        console.log("order", order)
        const appointment = new Appointment({
            userId: user._id,
            orderId: order._id,
            appointmentDate: selectedPlan.features === 'appointment' ? data.appointmentDate : "",
            timeSlot: selectedPlan.features === 'appointment' ? data.timeSlot : 'noon',
            status: 'pending',
            planId: data.planId,
            amount: selectedPlan.price,
            paymentStatus: "pending"
        });


        console.log("app", appointment)
        
        await appointment.save();
        
        const paymentData = {
            orderId: order._id,
            userId: user._id,
            totalAmount: selectedPlan.price,
            paymentStatus: 'pending',
            paymentMethod: "",
        };
        const payment = new Payment(paymentData);
        const response = await payment.save();
        console.log("res", response)
        return response
        // console.log("response", response)

    }

    updatePayment = async (req, data) => {
        const { user } = req;
        // console.log("userrrrr", user)
        if (!user || !user._id) {
            return res.status(404).json({ message: "User not found or user ID is missing" });
        }
        const loggedInUser = await User.findById(user._id);


        // const { appointmentDate, timeSlot, planId } = req.body;

        const selectedPlan = await Plan.findById(data.planId);
        // console.log("body", req.body)
        // console.log("selectedplan", selectedPlan)
        if (!selectedPlan) {
            const err = {
                status: 404,
                message: "Selected plan not found"
            }
            return err
        }

        // const paymentData = {
        //     orderId: data.id,
        //     paymentStatus: 'success',
        // };
        // const payment = new Payment(paymentData);
        await Payment.findOneAndUpdate({orderId: data.id}, {paymentStatus: 'success'}) ;
        const response = await Appointment.findOneAndUpdate({orderId: data.id}, {paymentStatus: 'success', status: 'booked'}) ;
        return response
    }
    addReview = async (req, data) => {

        const { user } = req
        console.log(".......", user)
        // console.log(data)
        const review = new Review({
            userId: user._id,
            rating: data.rating,
            comment: data.comment
        });


        await review.save();


    }






}
module.exports = new UserService()
