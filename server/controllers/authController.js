import User from "../model/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
export const register = async(req,res)=>{
    try{
        const{name,email,password} = req.body;
        if(!name || !email || !password){
            return res.status(400).json({
                message:"name,email and password fields are required!"
            })
        }
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"User with this email is already exists! try using different email"
            })
        }
        const salt = 10;
        const hashedPassword = await bcrypt.hash(password,salt);
        const user = await User.create({
            name,email,password:hashedPassword
        });
        return res.status(201).json({
            success:true,
            message:"Registeration Successfull",
            user
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Error occur while try to Register"
        })
    }
}

export const login = async(req,res)=>{
    try{
        const {email,password} = req.body;
         if(!email || !password){
            return res.status(400).json({
                message:"email and password fields are required!"
            })
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User with this email is not exist!Please register."
            })
        }
        const comparePassword = await bcrypt.compare(password,user.password);
        if(!comparePassword){
            return res.status(400).json({
                success:false,
                message:"Email or Password Incorrect"
            })
        }
        const token = jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:"1d"});
        return res.status(200).json({
            success:true,
            message:"Login Successfull",
            token
        })
    }catch(error){
        console.log(error.message);
        return res.status(500).json({
            success:false,
            message:"Failed to Login!"
        })
    }
}