// const { Router } = require("express");
const express = require("express");
const userValidation = require("../validations/user.validation.js");
const { loginUser,
    contactUs,
    verify,
    resendOtpMobile,
    addReview,
    changeCurrentPassword,
    patientRegister,
    forgetPassword,
    updatePassword,
    sendotp,
    sendOtpForLogin,
    verifyOtpAndLogin } = require("../controllers/user.controller.js");
const { verifyJwt } = require("../middlewares/auth.middleware.js");
const validate = require("../helpers/validate.js");





const router = express.Router();
router.post("/sendotp", sendotp)
router.post("/resend-otp-mobile", resendOtpMobile)
router.post("/verifyOTP", verify)

router.post("/register", patientRegister)
router.post("/login", loginUser)
router.post("/sendOtpForLogin", sendOtpForLogin)
router.post("/verifyOtpAndLogin", verifyOtpAndLogin)

router.post("/contact-us", contactUs)

router.post("/changepassword", verifyJwt, changeCurrentPassword)

router.post("/forgetpassword", forgetPassword)
router.post("/add-review", verifyJwt, addReview)
router.post("/resendOtp-email", forgetPassword) //resendOtp

router.post("/updatePassword", updatePassword)







module.exports = router;
