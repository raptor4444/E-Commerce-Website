const express = require("express");
const {
  getAllProducts,
  createProducts,
  updateProducts,
  deleteProducts,
  productDetails,
  createReviews,
  getAllReviews,
  deleteReview,
  getAdminProducts,
} = require("../controllers/productController");
const { 
    isAuthenticatedUser, 
    authorizedRole 
} = require("../middleware/auth");

const router = express.Router();

router
.route("/products")
.get(getAllProducts)


router
.route("/admin/products/new")
.post(isAuthenticatedUser, authorizedRole("admin"), createProducts)

router
.route("/admin/products")
.get(isAuthenticatedUser, authorizedRole("admin"), getAdminProducts)

router
.route("/product/:id")
.get(productDetails)

router
.route("/admin/products/:id")
.put(isAuthenticatedUser, authorizedRole("admin"), updateProducts)
.delete(isAuthenticatedUser, authorizedRole("admin"), deleteProducts)

router
.route("/reviews")
.get(isAuthenticatedUser, getAllReviews)
.put(isAuthenticatedUser, createReviews)
.delete(isAuthenticatedUser, deleteReview)

module.exports = router;
