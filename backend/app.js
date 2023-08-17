const express = require('express')
const errorMiddleware = require("./middleware/error")
const cookieParser = require("cookie-parser")
const bodyParser = require("body-parser")
const fileUpload = require("express-fileUpload")
const dotenv = require("dotenv")
const app = express();
const path = require("path")

app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(fileUpload())

if(process.env.NODE_ENV !== "PRODUCTION"){
    require("dotenv").config({path:"backend/config/config.env"})
}

// product route
const products = require("./routes/productRoutes")
app.use("/api/v1", products)

// user route
const user = require("./routes/userRoutes")
app.use("/api/v1", user)

// order route
const order = require("./routes/orderRoutes")
app.use("/api/v1", order)

// payment route
const payment = require("./routes/paymentRoutes");
app.use("/api/v1", payment);

app.use(express.static(path.join(__dirname,"../frontend/build")))

app.get("*", (req,res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"))
})

// error middelware
app.use(errorMiddleware)


module.exports = app
