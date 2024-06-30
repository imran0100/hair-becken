// const User = require('../models/user.model.js');
const ApiError = require('../utils/ApiError.js');
const ApiResponse = require('../utils/ApiResponse.js');
const asyncHandler = require('../utils/asyncHandler.js');
const UserService = require("../services/user.service.js");
const CommonHelper = require("../utils/commonHelper.js")
const User = require("../models/user.model.js")
const sendOTP = require("../utils/fast2sms.utils.js")
const Contact = require("../models/contactUs.model.js")




const patientRegister = asyncHandler(async (req, res) => {

    try {
        await UserService.registerService(req.body);
        return res.status(200).json(new ApiResponse(200, "User register succesffully"))


    } catch (error) {
        console.error('Error during signup:', error);
        throw new ApiError(400, "something went wrong", error.message)

    }
})


const sendotp = asyncHandler(async (req, res) => {
    try {
        // Check if the mobile number already exists and is verified
        const existingUser = await User.findOne({ mobile: req.body.mobile, isVerified: true });
        if (existingUser) {
            return res.status(400).json(new ApiResponse(400, existingUser, "Mobile number already verified"));
        }

        const temporaryEmail = generateTemporaryEmail();


        const otpGenerated = await sendOTP(req.body.mobile);
        console.log("Gen otp", otpGenerated);


        const user = await User.create({
            otp: otpGenerated,
            isVerified: false,
            status: false,
            otpCreatedAt: new Date(),
            mobile: req.body.mobile,
            email: temporaryEmail,
            role: "patient"
        });


        return res.status(200).json(new ApiResponse(200, user, "Otp sent successfully"))

    } catch (error) {
        console.log("eeeeeeeeeeeeeeer", error)
        throw new ApiError(400, "Something went wrong while sending OTP", error.message);
    }
});


function generateTemporaryEmail() {
    const randomNumber = generateRandomNumber();
    return `hairsrandom${randomNumber}@gmail.com`;
}


function generateRandomNumber() {
    return Math.floor(10000 + Math.random() * 90000); // Generates a random number between 1000 and 9999
}


const sendOtpForLogin = asyncHandler(async (req, res) => {
    try {
        const { mobile } = req.body
        console.log("mobile", mobile)
        const otpGenerated = await sendOTP(mobile.toString());
        console.log("Gen otp", otpGenerated)
        const user = await User.findOne({ mobile: mobile });
        if (user) {
            user.otp = otpGenerated
            user.otpCreatedAt = new Date()
            await user.save()
        } else {
            const newUser = new User({
                otp: otpGenerated,
                isVerified: false,
                status: false,
                otpCreatedAt: new Date(),
                mobile: mobile,
                role: "patient"
            });
            await newUser.save();
        }
        return res.status(200).json(new ApiResponse(200, "Otp send successfully"))


    } catch (error) {
        console.log("error", error.message)
        throw new ApiError(400, "Something went wrong", error.message);
    }
});
const verifyOtpAndLogin = asyncHandler(async (req, res) => {
    try {
        const { mobile, otp } = req.body;


        const user = await User.findOne({ mobile });

        if (!user) {
            throw new ApiError(401, "User does not exist");
        }



        const validOtp = CommonHelper.isValidOTP(user.otpCreatedAt);
        console.log("..........", validOtp)
        if (!validOtp) {
            user.otpCreatedAt = null
            user.otp = ""
            await user.save()
            return res.status(400).json(new ApiResponse(400, "Otp expired"))

        }
        if (user.otp !== otp) {
            return res.status(400).json(new ApiResponse(400, "Invalid otp"))
            // throw new ApiError(400, "Invalid OTP");
        }



        user.otp = null;
        user.otpCreatedAt = null
        await user.save();


        const accessToken = await CommonHelper.generateAccessToken(user._id);
        const refreshToken = await CommonHelper.generateRefreshToken(user._id);

        return res.status(200).json(new ApiResponse(200, "Login successful", {
            accessToken,
            refreshToken,
            user,
            role: user.role
        }));
    } catch (error) {
        throw new ApiError(error.status || 400, error.message);
    }
});




const verify = asyncHandler(async (req, res) => {
    try {
        const { mobile, otp } = req.body;

        const user = await User.findOne({ mobile });

        if (!user) {
            return res.status(400).json(new ApiResponse(400, "User not found"));
        }
        const validOtp = CommonHelper.isValidOTP(user.otpCreatedAt);
        console.log("..........", validOtp)
        if (!validOtp) {
            user.otpCreatedAt = null,
                user.otp = "",
                // user.mobile = null,
                await user.save()
            return res.status(400).json(new ApiResponse(400, "Otp expired"))

        }


        if (user.otp === otp) {
            user.isVerified = true;
            user.otp = "";
            user.otpCreatedAt = null
            await user.save();

            return res.status(200).json(new ApiResponse(200, "OTP verified successfully"));
        } else {
            return res.status(400).json(new ApiResponse(400, "Invalid OTP"));
        }

    } catch (error) {

        console.error(error);
        throw new ApiError(400, "Failed to verify OTP", error.message);
    }
});
const resendOtpMobile = asyncHandler(async (req, res) => {
    try {
        const { mobile } = req.body;


        const user = await User.findOne({ mobile });


        if (!user) {
            return res.status(400).json(new ApiResponse(400, "User not found"));
        }

        const otpGenerated = await sendOTP(mobile);
        // console.log("Gen otp", otpGenerated);


        user.otp = otpGenerated;
        user.otpCreatedAt = new Date();
        await user.save();

        return res.status(200).json(new ApiResponse(200, "OTP resent successfully"));

    } catch (error) {
        console.error(error);
        throw new ApiError(400, "Failed to resend OTP", error.message);
    }
});



const loginUser = asyncHandler(async (req, res) => {
    try {
        const logedInUser = await UserService.loginService(req.body)
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    {
                        logedInUser
                    },
                    `${logedInUser.role} logedIn Succesfully`
                )
            )

    } catch (error) {
        console.log("error====", error)
        throw new ApiError(400, "Something went wrong  " + error.message);
    }
})


const changeCurrentPassword = asyncHandler(async (req, res) => {
    try {
        // console.log("rrrrrrrrr", req.user)
        await UserService.changePassword(req, req.body)

        return res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"));
    } catch (error) {

        throw new ApiError(400, "Something wrong", error.message)
    }
});

const forgetPassword = asyncHandler(async (req, res) => {
    try {

        const forgetpassword = await UserService.forgetPassword(req.body)

        // if (!result.success) {
        //     return res.status(400).json(new ApiResponse(400, result.message));
        // }
        return res.status(200).json(new ApiResponse(200, "otp sent successfully"))
    } catch (error) {
        console.error('Error:', error);
        if (error instanceof ApiError) {
            return res.status(error.statusCode).json(new ApiResponse(error.statusCode, error.message));
        }
        throw new ApiError(400, "error while sending otp", error.message)

    }
});
const updatePassword = asyncHandler(async (req, res) => {

    try {

        const updatePass = await UserService.updatePassword(req.body)
        return res.status(200).json(200, "Password updated successfully")
    } catch (error) {
        throw new ApiError(400, "Something went wrong  " + error.message);

    }
});
const addReview = asyncHandler(async (req, res) => {
    try {
        await UserService.addReview(req, req.body)
        return res.status(200).json(new ApiResponse(200, "review Addedd successfully"))
    } catch (error) {
        throw new ApiError(400, "something error", error.message)

    }
})

const contactUs = asyncHandler(async (req, res) => {
    try {
        const { name, mobile, message, city } = req.body

        await Contact.create({
            name,
            mobile,
            city,
            message
        })
        return res.status(200).json(new ApiResponse(200, "Thank you for your time . we will get back to you soon...."))

    } catch (error) {
        throw new ApiError(400, "Something went wrong", error.message)

    }

})



module.exports = { patientRegister, sendOtpForLogin, verifyOtpAndLogin, contactUs, resendOtpMobile, verify, addReview, loginUser, changeCurrentPassword, forgetPassword, updatePassword, sendotp }



