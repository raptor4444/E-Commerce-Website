const express = require("express")
const { createNewOrder, getSingleOrder, myOrders, allOrders, updateOrder, deletOrder } = require("../controllers/orderController")
const { isAuthenticatedUser, authorizedRole } = require("../middleware/auth")

const router = express.Router()

router
.route("/order/new")
.post(isAuthenticatedUser, createNewOrder)

router
.route("/order/:id")
.get(isAuthenticatedUser, getSingleOrder)

router
.route("/orders/me")
.get(isAuthenticatedUser, myOrders)

router
.route("/admin/orders")
.get(isAuthenticatedUser, authorizedRole("admin"), allOrders)

router
.route("/admin/order/:id")
.put(isAuthenticatedUser, authorizedRole("admin"), updateOrder)
.delete(isAuthenticatedUser, authorizedRole("admin"), deletOrder)

module.exports = router;