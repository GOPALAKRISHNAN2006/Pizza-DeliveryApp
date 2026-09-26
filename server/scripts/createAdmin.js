import dotenv from "dotenv"
import connectDB from "../config.js/db.js"
import bcrypt from "bcryptjs"
import Admin from "../model/Admin.js"
dotenv.config();
const createAdmin = async()=>{
    try{
        await connectDB();
        const existingAdmin = await Admin.findOne({
            email:process.env.ADMIN_EMAIL
        })
        
        if(existingAdmin){
            console.log("Admin Already exists");
            process.exit(1);
        }
        const hashedPassword= await bcrypt.hash(process.env.ADMIN_PASSWORD,10);
        await Admin.create({
                name: "Admin",
                email:process.env.ADMIN_EMAIL,
                password:hashedPassword
        })

        console.log("Admin Created Successfully");
    }catch(error){
        console.log(error.message);
    }
}

createAdmin();