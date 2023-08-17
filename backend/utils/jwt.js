//creating token and saving in cookie

const sendtoken = (user, statuscode, res)=>{
const token = user.getJWTtoken()

    // options for cookie
    const option = {
        expires : new Date(
            Date.now() + process.env.COOKIE_EXPIRE *24 *60 *1000
        ),
        httpOnly : true
    }

    res.status(statuscode).cookie("token", token, option).json({
        success: true,
        message: "user logged in successfully",
        data: user,
        token: token
    })
}

module.exports = sendtoken