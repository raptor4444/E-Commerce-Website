const ErrorHandler = require("../utils/errorHandler");
const userSchema = require("../models/userModel");
const sendtoken = require("../utils/jwt");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary")

// register user
exports.registerUser = async (req, res, next) => {

  try {

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: "150",
      crop: "scale"
    })
    const { name, email, password } = req.body;

    const User = await userSchema.create({
      name,
      email,
      password,
      avatar: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
    });

    const jwt = User.getJWTtoken();

    sendtoken(User, 201, res);
  } catch (err) {
    if(err.code === 11000)
    {
      let dup = Object.keys(err.keyValue)[0]
      return next(new ErrorHandler(`a user with that ${dup} already exists`, 400)); 
    }
    
    let fault = Object.keys(err.errors)[0]
    return next(new ErrorHandler(`${fault} requires minimum 3 charecters`, 400)); 
  }
};

// login function
exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorHandler("please enter email and password", 400));
    }

    const User = await userSchema.findOne({ email }).select("+password");

    if (!User) {
      return next(
        new ErrorHandler("please enter correct email and password", 401)
      );
    }

    const isPasswordMatched = await User.comparePasswords(password);

    if (!isPasswordMatched) {
      return next(
        new ErrorHandler("please enter correct email and password", 401)
      );
    }

    const jwt = User.getJWTtoken();

    sendtoken(User, 200, res);
  } catch (err) {
    res.status(400).json(err.message);
  }
};

// logout method
exports.logoutUser = async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "logged out",
  });
};

// forgot password
exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await userSchema.findOne({ email: req.body.email });

    if (!user) {
      return next(new ErrorHandler("user not found", 404));
    }

    //reset password token
    const resetToken = user.generatePassResetToken();

    await user.save({ validateBeforeSave: false });

    const resetPassURL = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`;

    const message = `Your reset password token is : \n\n ${resetPassURL} \n\nIf you have not requested this email then please ignore it`;

    try {
      await sendEmail({
        email: user.email,
        subject: `Ecommerce password recovery`,
        message,
      });

      res.json({
        success: true,
        message: `Email sent to ${user.email} successfully`,
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save({ validateBeforeSave: false });

      return next(new ErrorHandler(error.message, 500));
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// reset password
exports.resetPassword = async (req, res, next) => {
  try {
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await userSchema.findOne({
      resetPasswordToken,
      resetPasswordToken: { $gt: Date.now() },
    });

    if (!user) {
      return next(
        new ErrorHandler("reset password token is invalid or has expired", 400)
      );
    }

    if (req.body.password !== req.body.confirmPassword) {
      return next(
        new ErrorHandler("password does not match confirm password", 400)
      );
    }

    user.password = req.body.password;
    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;

    await user.save();

    sendtoken(user, 200, res);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// user details
exports.getUserDetails = async (req, res, next) => {
  try {
    const user = await userSchema.findById(req.User.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

// update user password
exports.updateUserPassword = async (req, res, next) => {
  try {
    const user = await userSchema.findById(req.User.id).select("+password");

    const isPasswordMatched = await user.comparePasswords(req.body.oldPassword);

    if (!isPasswordMatched) {
      return next(new ErrorHandler("please enter correct password", 401));
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
      return next(
        new ErrorHandler("password does not match confirm password", 400)
      );
    }

    user.password = req.body.newPassword;

    await user.save();

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

// update user profile
exports.updateUserProfile = async (req, res, next) => {
  try {
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
    };

    // profile pic update bug
    // if (req.body.avatar !== "") {

    //   const user = await userSchema.findById(req.user.id);
  
    //   const imageId = user.avatar.public_id;
  
    //   await cloudinary.v2.uploader.destroy(imageId);
  
    //   const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
    //     folder: "avatars",
    //     width: "150",
    //     crop: "scale"
    //   })
  
    //   newUserData.avatar = {
    //     public_id: myCloud.public_id,
    //     url: myCloud.secure_url,
    //   };
    // }  

    const User = await userSchema.findByIdAndUpdate(req.User.id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.status(200).json({
      success: true,
      data: User,
    });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

// get all users
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await userSchema.find();

    res.status(200).json({
      success: true,
      message: "all users displayed successfully",
      data: users,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// get single user
exports.getSingleUser = async (req, res, next) => {
  try {
    const user = await userSchema.findById(req.params.id);

    if (!user) {
      next(new ErrorHandler(`User with id: ${req.params.id} not found`));
    }
    res.status(200).json({
      success: true,
      message: "user found successfully",
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// update roles
exports.updateRole = async (req, res, next) => {
  try {

    const newUserData = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
    };
  
    const User = await userSchema.findByIdAndUpdate(req.params.id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.status(200).json({
      success: true,
      message: `role updated to ${req.body.role}`,
      data: User,
    });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

// delete user
exports.deleteUser = async (req, res, next) => {
  try {

    const User = await userSchema.findByIdAndDelete(req.params.id);

    if(!User){
      next(new ErrorHandler(`user with id: ${req.params.id} not found`))
    }

    await User.remove()

    res.status(200).json({
      success: true,
      message: "user removed successfully"
    });
  } catch (error) {
    res.status(400).json(error.message);
  }
};