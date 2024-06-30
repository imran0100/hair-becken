const dotenv = require("dotenv")
const connectDB = require("./db/index.js")
const app = require('./app.js')
// const Razorpay = require("razorpay")

dotenv.config({
    path: "../.env"
})

connectDB()
    .then(() => {
        app.listen(3001, () => {
            console.log(`server is running at port : 3001`)
        })
    })
   .catch((err) => {
        console.log("Mongodb connection failed !!", err)
    })