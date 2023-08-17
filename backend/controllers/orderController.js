const orderSchema = require("../models/orderModels")
const productSchema = require("../models/productModels")
const ErrorHandler = require("../utils/errorHandler")

// create new order
exports.createNewOrder = async (req, res, next) => {

    try {
        
        const {
            shippingInfo,
            orderItems,
            paymentInfo,
            itmesPrice,
            taxPrice,
            shippingPrice,
            totalPrice
        } = req.body

        const order = await orderSchema.create({
            shippingInfo,
            orderItems,
            paymentInfo,
            itmesPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            paidAt: Date.now(),
            user: req.User._id
        })

        res.status(201).json({
            success: true,
            message: "order placed successfully",
            data: order
        })
    } catch (error) {        
        return next(new ErrorHandler(error.message, 404));
    }
}

// get single order
exports.getSingleOrder = async (req, res, next) => {

    try {
        
        const order = await orderSchema.findById(req.params.id).populate("user", "name email")

        if(!order){
            next( new ErrorHandler("order not found", 400))
        }

        res.status(200).json({
            success: true,
            data: order
        })

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

// user orders
exports.myOrders = async (req, res, next) => {

    try {
        
        const orders = await orderSchema.find({ user: req.User._id})

        res.status(200).json({
            success: true,
            data: orders
        })

    } catch (error) {
        return next(new ErrorHandler(error, 404));
    }
}

// get all orders
exports.allOrders = async (req, res, next) => {

    try {
        
        const orders = await orderSchema.find()

        let totalPrice = 0

        orders.forEach((order) => {
            totalPrice += order.totalPrice
        })

        res.status(200).json({
            success: true,
            revenue: totalPrice,
            data: orders
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

//update order status
exports.updateOrder = async (req, res, next) => {

    try {
        
        const order = await orderSchema.findById(req.params.id)

        if(order.orderStatus === "Delivered"){
            return( next(new ErrorHandler("this order is delivered", 404)))
        }

        // order.orderItems.forEach(async (order) => {
        //     await updateStock(order.product, order.quantity)
        // })

        order.orderStatus = req.body.status

        if(req.body.status === "Delivired"){
            order.deliveredAt = Date.now()
        }

        await order.save({validateBeforeSave: false})

        res.status(200).json({
            success: true,
            data: order
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}
// update stock
const updateStock = async (id, quantity) => {

    const product = await productSchema.findById(id)

    product.stock-=quantity

    await product.save({validateBeforeSave: false})
}

// delete order 
exports.deletOrder = async (req, res, next) => {

    try {
        const order = await orderSchema.findById(req.params.id)

        if(!order){
            next(new ErrorHandler("order not found"))
        }

        order.remove()

        res.status(200).json({
            success: true,
            message: "order deleted successfully"
        })
    
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}
