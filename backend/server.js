const app = require("./app")
const connectDatabase = require("./config/database")
const cloudinary = require("cloudinary")

// handling Uncaught exception
process.on("uncaughtException", (err)=>{
    console.log(`Error: ${err.message}`)
    console.log(`Shuttindown the server due to unHandled Promise Rejection`)
    process.exit(1)
})

if(process.env.NODE_ENV !== "PRODUCTION"){
    require("dotenv").config({path:"backend/config/config.env"})
}

const server = app.listen(process.env.PORT, ()=>{
    console.log(`server listening at http://localhost:${process.env.PORT}`)
    connectDatabase()
})

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

// unhandled promise rejection
process.on("unhandledRejection", (err) => {

    console.log(`Error: ${err.message}`)
    console.log(`Shuttindown the server due to unHandled Promise Rejection`)

    server.close(()=>{
        process.exit(1)
    })
})