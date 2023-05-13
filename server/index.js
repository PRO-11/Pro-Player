import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import userRoutes from "./Routes/user.js"
import authRoutes from "./Routes/auth.js"
import videoRoutes from "./Routes/video.js"
import commentRoutes from "./Routes/comment.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import path from "path"
import { fileURLToPath } from 'url';
dotenv.config()

const app=express()
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const connect=()=>{
  mongoose.connect(process.env.MONGO).then(()=>{
    console.log("Connected to db")
  }).catch((err)=>{
    throw err
  })
}
app.use(cors());
app.use(cookieParser())
app.use(express.json())


app.use("/api/auth",authRoutes) 
app.use("/api/users",userRoutes)
app.use("/api/videos",videoRoutes)
app.use("/api/comments",commentRoutes)


//error handling middleware
app.use((err,req,res,next)=>{
    const status=err.status || 500
    const message=err.message || "Something went wrong!"

    return res.status(status).json({
        success:false,
        status,
        message
    })
})

console.log(path.resolve(__dirname,'build'))



if(process.env.NODE_ENV=='production'){
  
  console.log("Serve file")
  app.get('/',(req,res)=>{
    app.use(express.static(path.resolve(__dirname,'frrontend','build')))
    res.sendFile(path.resolve(__dirname,'frontend','build','index.html'))
})
}

const PORT=process.env.PORT||5000
app.listen(PORT,()=>{
    connect()
    console.log("Server is running on port 8081")
})