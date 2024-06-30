const express = require("express");

const { getCartDetail, updateCart, deleteCartItems } = require("../controllers/cart.controller.js");





const router = express.Router();

router.get("/get-cart", getCartDetail)
router.post("/update-cart", updateCart)
router.post("/delete-cart", deleteCartItems)







module.exports = router