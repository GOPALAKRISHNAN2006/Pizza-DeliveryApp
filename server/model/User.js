import mongoose from "mongoose"

const UserSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            trim:true
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true
        },
        password:{
            type:String,
            required:true,
            minlength:6
        },
        isEmailVerified:{
            type:Boolean,
            default:false
        },
        role:{
        type:String,
        enum:["user"],
        default:"user"
     }
    },
    {
        timestamps:true
    }
    
)

const User = mongoose.model("User",UserSchema);
export default User;