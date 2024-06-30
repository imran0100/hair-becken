const express = require("express");
// const userValidation = require("../validations/user.validation.js");
const { createDoctor, assignDoctorToAppointment, getBookedAppointment, softDeleteTransaction, transactionData, updateProductDetails, deleteProductFromCategory, blockUnblock, addAdmin, searchUsers, updateAdminProfile, getallPatient, getProductsByCategory, getallDoctor, deleteUser, getTotalpatient, addProductToCategory, searchdoctor } = require("../controllers/admin.controller.js");
const adminValidation = require("../validations/admin.validations.js");
const { verifyJwt } = require("../middlewares/auth.middleware.js");

const validate = require("../helpers/validate.js");
const { addPlan } = require("../controllers/plan.controller.js");



const router = express.Router();

router.post("/addDoctor", validate(adminValidation.createDoctor), createDoctor)
router.get("/allpatient", verifyJwt, getallPatient)
router.post("/addAdmin", addAdmin)
router.get("/get-Booked-appointment", getBookedAppointment)
router.post("/assignAppointmentToDoctor", assignDoctorToAppointment)

router.get("/transaction-data", verifyJwt, transactionData)
router.delete("/transaction-delete", softDeleteTransaction)
router.put("/update-admin-profile", verifyJwt, updateAdminProfile)
router.get("/alldoctor", verifyJwt, getallDoctor)
// router.get("/allPendingAppointment", getPendingAppointments)
router.delete("/deleteuser", verifyJwt, deleteUser)
router.get("/totalpatient", verifyJwt, getTotalpatient)
router.post("/addproduct", verifyJwt, addProductToCategory)
router.delete("/deleteproduct", verifyJwt, deleteProductFromCategory)
router.put("/update-product", verifyJwt, updateProductDetails)
router.get("/productBycategory", verifyJwt, getProductsByCategory)
router.get("/search", verifyJwt, searchUsers)
router.get("/search-doctor", verifyJwt, searchdoctor)
router.put("/block", verifyJwt, blockUnblock)
router.post("/addPlan", addPlan)
module.exports = router