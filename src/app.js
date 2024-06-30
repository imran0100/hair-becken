const express = require("express");
// const cookieParser = require("cookie-parser");
const cors = require("cors");
const errorHandler = require("./middlewares/errorHandler.js");
const route = require('../src/routes/user.routes.js');
const hairTestRoutes = require("../src/routes/hairTest.routes.js");
const paymentRoute = require("./routes/payment.routes.js")
const adminRoutes = require("./routes/admin.routes.js")
const doctorRoutes = require("./routes/doctor.routes.js")
const bookapointment = require("./routes/payment.routes.js")
const cartRoutes = require("./routes/cart.routes.js")




const app = express()
app.use(cors({
    origin: "*",
    credentials: true
}))




app.use(express.json())
app.use(express.urlencoded({ extended: true }))













//routes declarition 
app.use("/api/v1/users", route)
app.use("/api/v1/hair-tests", hairTestRoutes);
//payment
app.use("/api/v1/payment", paymentRoute);
app.use("/api/vi/bookAppointment", bookapointment)

//admin
app.use("/api/v1/admin", adminRoutes)

//
app.use("/api/v1/doctor", doctorRoutes)
app.use("/api/v1/cart", cartRoutes)



app.use(errorHandler)
// console.log("avinash")




module.exports = app