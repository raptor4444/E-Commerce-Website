const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updateUserPassword,
  updateUserProfile,
  getAllUsers,
  getSingleUser,
  updateRole,
  deleteUser,
} = require("../controllers/userController");

const { 
    isAuthenticatedUser, 
    authorizedRole 
} = require("../middleware/auth");

const router = express.Router();

router
.route("/register")
.post(registerUser)

router
.route("/login")
.post(loginUser)

router
.route("/password/forgot")
.post(forgotPassword)

router
.route("/password/reset/:token")
.put(resetPassword)

router
.route("/logout")
.get(logoutUser)

router
.route("/me")
.get(isAuthenticatedUser, getUserDetails)

router
.route("/password/update")
.put(isAuthenticatedUser, updateUserPassword)

router
.route("/me/update")
.put(isAuthenticatedUser, updateUserProfile)

router
.route("/admin/users")
.get(isAuthenticatedUser, authorizedRole("admin"), getAllUsers)

router
.route("/admin/users/:id")
.get(isAuthenticatedUser, authorizedRole("admin"), getSingleUser)
.put(isAuthenticatedUser, authorizedRole("admin"), updateRole)
.delete(isAuthenticatedUser, authorizedRole("admin"), deleteUser)

module.exports = router;
