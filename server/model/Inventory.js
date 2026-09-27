import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            trim:true
        },
        category:{
            type:String,
            enum:["base","sauce","cheese","vegetable"],
        },
        quantity:{
            type:Number,
            required:true,
            min:0
        },
        lowStockThreshold:{
            type:String,
            required:true,
            trim:true
        }
    },
    {
        timestamps:true
    }
)

const Inventory = mongoose.model("Inventory",inventorySchema);
export default Inventory;