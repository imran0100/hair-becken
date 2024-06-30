const mongoose = require('mongoose');
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const Cart = require("../models/Cart.model")
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');






const getCartDetail = asyncHandler(async (req, res) => {
    try {
        const { userId, cartId } = req.query

        const cart = await Cart.findOne({ userId: userId, cartId: cartId });


        if (!cart) {
            return res.status(404).json(new ApiResponse(404, null, "Hair test not found"));
        }

        return res.status(200).json(new ApiResponse(200, cart, "Cart details retrieved successfully"));

    } catch (error) {
        throw new ApiError(400, "Something went wrong", error.message);
    }
});

const updateCart = asyncHandler(async (req, res) => {

    try {
        const userId = req.query.userId
        const cartId = req.query.cartId

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: "Invalid user ID" });
        }
        // console.log("useriddddddddd", userId)


       let cart
        cart = await Cart.findOne({ userId, cartId });
        
        if(cart){
        cart.items && cart.items.push(req.body)
        }
        else{
            cart = new Cart({
                userId: userId,
                cartId,
                items: [{...req.body}]
            });
        }
        await cart.save()

        return res.status(201).json({
            success: true,
            message: "Successfully updated"
        });
    } catch (error) {

        console.error(error);
        return res.status(500).json({ success: false, message: "Failed to update cart" });
    }
});
const deleteCartItems = asyncHandler(async (req, res) => {
    try {
        const { userId, cartId } = req.query;
        const cart = await Cart.findOneAndDelete({ userId: userId, cartId: cartId });

        if (!cart) {
            return res.status(404).send('Cart not found for this user');
        }

        return res.status(200).json(new ApiResponse(200, cart, "Cart detail deleted successfully"));
    } catch (error) {
        return res.status(400).json(new ApiError(400, "Something went wrong while getting cart details"));
    }
})





module.exports = {
    getCartDetail,
    deleteCartItems,
    updateCart,
};

