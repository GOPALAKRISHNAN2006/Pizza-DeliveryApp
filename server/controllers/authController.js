import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../model/User.js";
import { sendVerificationEmail, sendPasswordResetEmail } from "../services/emailService.js";

/**
 * Register a new user
 * POST /api/auth/register
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields: name, email, and password."
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address."
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters in length."
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "An account with this email address already exists."
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      isEmailVerified: false,
      verificationToken,
      verificationTokenExpires,
      role: "user"
    });

    try {
      await sendVerificationEmail(user, verificationToken);
    } catch (emailError) {
      console.warn("⚠️ Verification email send failed:", emailError.message);
      // In development, if email fails to send, do not crash; provide friendly instruction
    }

    return res.status(201).json({
      success: true,
      message: "Registration successful! Please check your email to verify your account.",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        role: user.role
      },
      // In dev mode when offline or demoing:
      verificationTokenPreview: process.env.NODE_ENV !== "production" ? verificationToken : undefined
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Verify user email via token
 * GET /api/auth/verify-email/:token
 */
export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Verification token is required."
      });
    }

    const user = await User.findOne({
      verificationToken: token
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification token or account already verified."
      });
    }

    if (!user.verificationTokenExpires || user.verificationTokenExpires < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Verification token has expired. Please request a new verification link."
      });
    }

    user.isEmailVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully! You can now log in to Oasis Pizza."
    });
  } catch (error) {
    next(error);
  }
};

/**
 * User Login
 * POST /api/auth/login
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required."
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password."
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password."
      });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before logging in. Check your inbox for the verification link.",
        isEmailVerified: false
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role || "user"
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful! Welcome back to Oasis Pizza.",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Forgot password request
 * POST /api/auth/forgot-password
 */
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please provide your registered email address."
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    // Do not reveal whether user exists for security
    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If an account with that email exists, a password reset link has been sent."
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.passwordResetToken = resetToken;
    user.passwordResetTokenExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
    await user.save();

    try {
      await sendPasswordResetEmail(user, resetToken);
    } catch (emailErr) {
      console.warn("⚠️ Password reset email failed:", emailErr.message);
    }

    return res.status(200).json({
      success: true,
      message: "If an account with that email exists, a password reset link has been sent.",
      resetTokenPreview: process.env.NODE_ENV !== "production" ? resetToken : undefined
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Reset password
 * POST /api/auth/reset-password/:token
 */
export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "New password is required."
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters in length."
      });
    }

    const user = await User.findOne({
      passwordResetToken: token
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired password reset token."
      });
    }

    if (!user.passwordResetTokenExpires || user.passwordResetTokenExpires < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Password reset token has expired. Please request a new one."
      });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successful! You can now log in with your new password."
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current authenticated user
 * GET /api/auth/me
 */
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found."
      });
    }

    return res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

export default {
  register,
  verifyEmail,
  login,
  forgotPassword,
  resetPassword,
  getMe
};