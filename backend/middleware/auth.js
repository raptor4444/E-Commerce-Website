const ErrorHandler = require("../utils/errorHandler");
const userSchema = require("../models/userModel");
const jwt = require("jsonwebtoken");

// authentication
exports.isAuthenticatedUser = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return next(new ErrorHandler("You need to login", 401));
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    req.User = await userSchema.findById(decodedData.id);

    next();
  } catch (err) {
    res.status(401).json(err.message);
  }
};

// roles
exports.authorizedRole = (role) => {
  
  return (req, res, next) => {
    if (role != req.User.role) {
      return next(
        new ErrorHandler(
          `Role: ${req.User.role} is not allowed access here`,
          403
        )
      );
    }

    next();
  };
};
