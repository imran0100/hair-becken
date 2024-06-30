const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// const bcrypt = require("bcrypt");


const userSchema = new Schema(

    {
        fullname: {
            type: String,
            // required: true
        },
        email: {
            type: String,
            // required: true,
            unique: true,
        },
        password: {
            type: String,
            // required: true,
        },
        role: {
            type: String,
            enum: ["admin", "patient", "doctor"],
            required: true
        },
        mobile: {
            type: String,
            unique: true

        },
        profileImage: {
            type: String,
            default: ""
        },
        coverImage: {
            type: String,
            default: ""
        },
        speciality: {
            type: String
        },
        description: {
            type: String
        },
        location: {
            type: String
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
        otp: {
            type: String,
            default: null
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        status: {
            default: true,
            type: Boolean
        },

        otpCreatedAt: {
            type: Date,
            default: null
        }
    }, { timestamps: true }
)

userSchema.pre("save", async function (next) {
    if (!this.isModified("password"))
        return next()


})

// userSchema.methods.isPasswordCorrect = async function (password) {
//     return await bcrypt.compare(password, this.password)
// }

// userSchema.methods.generateAccessToken = function () {
//     return jwt.sign(
//         {
//             _id: this._id,
//             email: this.email,
//             role: this.role


//         },
//         process.env.ACCESS_TOKEN_SECRET,
//         {
//             expiresIn: process.env.ACCESS_TOKEN_EXPIRY
//         }



//     )
// }
// userSchema.methods.generateRefreshToken = function () {
//     return jwt.sign(
//         {
//             id: this._id
//         },
//         process.env.REFRESH_TOKEN_SECRET,
//         {
//             expiresIn: process.env.REFRESH_TOKEN_EXPIRY
//         }
//     )
// }
const User = mongoose.model("User", userSchema)

module.exports = User;

