import User from "../model/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import crypto from "crypto"
import sendEmail from "../utils/sendEmail.js"

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
        if (!user.isEmailVerified) {
             return res.status(403).json({
                message: "Please verify your email before logging in"
        });
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
        const verificationToken = crypto.randomBytes(32).toString("hex");
        const verificationTokenExpires = new Date(
            Date.now()+15*60*1000
        );
        const user = await User.create({
            name,
            email,
            password:hashedPassword,
            isEmailVerified:false,
            verificationToken,
            verificationTokenExpires
        });
        const apiBaseUrl = (
            process.env.API_BASE_URL || `http://localhost:${process.env.PORT || 5000}`
        ).replace(/\/+$/, "");
        const verificationUrl = `${apiBaseUrl}/api/auth/verify-email/${verificationToken}`;

        try {
            await sendEmail(
                email,
                "Verify Your Pizza Delivery Account",
                `<h2>Welcome to pizza Delivery!</h2>
                <p>Hello ${name}</p>
                <p>Thank you for registering with Pizza Delivery.</p>
                <p>Please click the button below to verify your email address.</p>
                <a href="${verificationUrl}"
                        style="
                            display:inline-block;
                            padding:10px 20px;
                            background:#ff5722;
                            color:white;
                            text-decoration:none;
                            border-radius:5px;
                        "
                    > Verify Email</a>
                    <p>This verification link will expire in 15 minutes.</p>
                `
            );
        } catch (emailError) {
            console.error("Registration verification email failed:", emailError.message);
            await User.deleteOne({ _id: user._id, isEmailVerified: false });
            return res.status(502).json({
                success: false,
                message: "Could not send the verification email. Please check the email settings and try again."
            });
        }

        return res.status(201).json({
            success:true,
            message:"Registeration Successful.Plaese check your email to verify your account",
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Error occur while try to Register"
        })
    }
}

export const verifyEmail = async(req,res)=>{
    try{
        const {token}=req.params;
        const user = await User.findOne({
            verificationToken:token
        });
        if(!user){
            return res.status(400).json({
                message:"Invalid verification token"
            })
        }
        if(!user.verificationTokenExpires || user.verificationTokenExpires < new Date()){
            return res.status(400).json({
                message:"verification token expired"
            })
        }

        user.isEmailVerified=true;
        user.verificationToken=undefined;
        user.verificationTokenExpires=undefined;

        await user.save();
        res.status(200).json({
            message:"Email verified successfully"
        })
    }catch(error){
        console.log("Email verification error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
}

export const forgotPassword = async(req,res)=>{
    try{
        const {email} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                message:"If this email exist then reset link must have been sent!"
            })
        }
        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenExpires = new Date(
            Date.now()+15*60*1000
        );
        user.passwordResetToken = resetToken;
        user.passwordResetTokenExpires = resetTokenExpires;
        await user.save();
        const resetUrl = `http://localhost:5000/reset-password/${resetToken}`
        await sendEmail(
                email,
                "Reset Your Pizza Delivery Account",
                `<h2>Welcome to pizza Delivery!</h2>
                <p>Reset Password from Pizza Delivery.</p>
                <p>Please click the button below to reset your password.</p>
                <a href="${resetUrl}"
                        style="
                            display:inline-block;
                            padding:10px 20px;
                            background:#ff5722;
                            color:white;
                            text-decoration:none;
                            border-radius:5px;
                        "
                    > Reset Password</a>
                    <p>This reset link will expire in 15 minutes.</p>
                `
        );
        return res.status(200).json({
            message:"If this email exst then reset link must have been sent!"
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            message:"Error while reset password"
        })
    }
}


export const resetPassword = async(req,res)=>{
  try{
    const {password} = req.body;
    const {token} = req.params;
     if (!password) {
        return res.status(400).json({
            message: "New password is required"
        });
    }
    if (password.length < 6) {
        return res.status(400).json({
            message: "Password must be at least 6 characters"
         });
    }

        const user = await User.findOne({
            passwordResetToken:token
        })
        if(!user){
            return res.status(400).json({
                message:"Invalid or expired reset token"
            })
        }
    if(!user.passwordResetTokenExpires || user.passwordResetTokenExpires < new Date()){
        return res.status(400).json({
            message:"reset token has expired"
        })
    }
    const salt=10;
    const hashedpassword = await bcrypt.hash(password,salt);
    user.password = hashedpassword;
    user.passwordResetToken=undefined;
    user.passwordResetTokenExpires=undefined;
    await user.save();
    return res.status(200).json({
        message:"Password reset successfully"
    })
  }catch(error){
    console.log(error);
    return res.status(500).json({
        message:"Error while reset password"
    })
  }
}