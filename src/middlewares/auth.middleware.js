const ApiError = require("../utils/ApiError.js");
const User = require("../models/user.model.js");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler.js");

const verifyJwt = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        
        if (!token) {
            throw new ApiError(404, "Unauthorized request");
        }
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
        // console.log("nnnnnnnnnnn", user)
        if (!user) {
            throw new ApiError(401, "Invalid Access Token");
        }

        req.user = user;
        req.role = user.role;
        next();
    } catch (error) {
        console.log("errrrrrrrrrrrrrrr", error.message)
        throw new ApiError(401, error?.message || "Invalid Access Token");
    }
});



module.exports = { verifyJwt };
