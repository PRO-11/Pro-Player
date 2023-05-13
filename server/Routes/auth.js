import  express  from "express";
import { googleAuth, signin, signup} from "./controllers/auth.js";
import User from "./Models/User.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
const router =express.Router();

//Signup
router.post("/signup",async(req,res)=>{
    const salt=bcrypt.genSaltSync(10)
    const hash=bcrypt.hashSync(req.body.password,salt)
    console.log(req.body)
    const newUser=new User({...req.body,password:hash})

    await newUser.save()
    res.status(200).json({msg:"User has been created",hash })
})

//Signin
router.post("/signin",signin)

//Google Auth
router.post("/google",googleAuth)



export default router