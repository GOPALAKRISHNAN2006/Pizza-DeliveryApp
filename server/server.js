import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./config.js/db.js";
import authRoutes from "./routes/authRoutes.js"
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

connectDB();

const PORT = process.env.PORT || 5000;

app.get("/",(req,res)=>{
    res.send({
        success:true,
        message:"Pizza Delivery app is running"
    })
})

app.use("/api/auth",authRoutes);

app.listen(PORT,()=>{
    console.log(`Server is running on PORT ${PORT}`)
})