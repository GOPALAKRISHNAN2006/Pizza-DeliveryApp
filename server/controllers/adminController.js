import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import Admin from "../model/Admin.js";
export const adminLogin = async(req,res)=>{
    try{
        const {email,password} = req.body;
         if(!email || !password){
            return res.status(400).json({
                message:"email and password fields are required!"
            })
        }
        const admin = await Admin.findOne({email});
        if(!admin){
            return res.status(400).json({
                success:false,
                message:"admin with this email is not exist!Please register."
            })
        }
        const comparePassword = await bcrypt.compare(password,admin.password);
        if(!comparePassword){
            return res.status(400).json({
                success:false,
                message:"Email or Password Incorrect"
            })
        }
        
        const token = jwt.sign({adminId:admin._id,role:admin.role},process.env.JWT_SECRET,{expiresIn:"1d"});
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

export const dashboard = async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            message: "Welcome to Admin Dashboard",
            admin: req.admin.name
        });
    } catch (error) {
        console.log(error.message);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

