const ErrorHandler = require("../utils/errorHandler")

module.exports = (err, req, res, next) =>{
    err.statusCode = err.statusCode || 500
    err.message = err.message || "internal server error"

    // wrong Id
    if(err.name === "CastError"){
        const message = `Resource not found. Invalid ${err.path}`
        err = new ErrorHandler(message, 404)
    }

    // invalid json web token
    if(err.name === "JsonWebTokenError"){
        const message = `Json web token invalid`
        err = new ErrorHandler(message, 404)
    }

    // expired json web token
    if(err.name === "TokenExpiredError"){
        const message = `Json web token expired`
        err = new ErrorHandler(message, 404)
    }
    
    // mongoose duplicate key
    if(err.code === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`
        err = new ErrorHandler(message, 404)
    }

    res.status(err.statusCode).json({
        success: false,
        error: err.message
    })
}