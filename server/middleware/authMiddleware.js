import jwt from "jsonwebtoken"
import Admin from "../model/Admin.js"

export const authMiddleware = async(req,res,next)=>{
    try{
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).json({
                success:false,
                message:"Not Authorized please login!"
            })
        }
        const token = authHeader.split(" ")[1];

        if(!token){
            return res.status(401).json({
                success:false,
                message:"Unauthorized"
            })
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        if(decoded.role !== "admin"){
            return res.status(403).json({
                success:false,
                message:"Invalid"
            })
        }
        const admin = await Admin.findOne({_id:decoded.adminId,role:decoded.role});
        if(!admin){
            return res.status(401).json({
                success:false,
                message:"Invalid"
            })
        }
        req.admin = admin;
        next();

    }catch(error){
        console.log(error.message);
        return res.status(500).json({
            success:false,
            message:error.message || "Autherntication Error"
        })
    }
}