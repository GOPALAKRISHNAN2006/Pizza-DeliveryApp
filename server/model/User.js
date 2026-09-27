import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"]
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    verificationToken: {
      type: String
    },
    verificationTokenExpires: {
      type: Date
    },
    passwordResetToken: {
      type: String
    },
    passwordResetTokenExpires: {
      type: Date
    },
    role: {
      type: String,
      enum: ["user"],
      default: "user"
    }
  },
  {
    timestamps: true
  }
);

// Method to remove password from JSON representation
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.verificationToken;
  delete obj.verificationTokenExpires;
  delete obj.passwordResetToken;
  delete obj.passwordResetTokenExpires;
  return obj;
};

const User = mongoose.model("User", userSchema);
export default User;