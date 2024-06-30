const express = require("express")

const router = express.Router()
const userValidation = require("../validations/user.validation.js");
const validate = require("../helpers/validate.js");

// const { orderCreate, paymentCreate, paymentVerification } = require("../controllers/payment.controller");
const { verifyJwt } = require("../middlewares/auth.middleware");
const { bookAppointment, paymentVerification, updatePayment } = require("../controllers/bookAppointment.controller")
const { placeOrder, generatePaymentLink, deleteAllPayments } = require("../controllers/payment.controller.js")



// router.post("/order-create", verifyJwt, orderCreate);


// router.post("/payment-create", verifyJwt, bookAppointment);
router.post("/verification", paymentVerification);
router.post("/bookAppointment", verifyJwt, bookAppointment)
router.post("/update-payment", verifyJwt, updatePayment)
router.post("/place-order", verifyJwt, placeOrder)
router.post("/generate-paymentLink", verifyJwt, generatePaymentLink)
router.delete("/deleteAllPayment", deleteAllPayments)


module.exports = router