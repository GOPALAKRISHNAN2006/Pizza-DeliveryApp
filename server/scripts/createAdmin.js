import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import connectDB from "../config/db.js";
import Admin from "../model/Admin.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await connectDB();

    const adminEmail = (process.env.ADMIN_EMAIL || process.env.ADMIN_EMAIl || "admin@oasispizza.com").toLowerCase().trim();
    const adminPassword = process.env.ADMIN_PASSWORD || "Admin@12345";
    const adminName = process.env.ADMIN_NAME || "Super Admin";

    console.log(`Checking existing admin with email: ${adminEmail}`);
    const existingAdmin = await Admin.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log(`ℹ️ Admin already exists: ${adminEmail}`);
      await mongoose.disconnect();
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    const newAdmin = await Admin.create({
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: "admin"
    });

    console.log("==========================================");
    console.log("🎉 Administrator Created Successfully!");
    console.log(`📧 Email: ${newAdmin.email}`);
    console.log("🔒 Password: (as specified in .env)");
    console.log("==========================================");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to create admin:", error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

createAdmin();