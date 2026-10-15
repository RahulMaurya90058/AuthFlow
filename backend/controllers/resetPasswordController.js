import bcrypt from "bcryptjs";
import User from "../models/User.js";

export const resetPassword = async (req, res) => {
  try {
    const {
      email,
      resetToken,
      password,
      confirmPassword,
    } = req.body;

    // Validate fields
    if (
      !email ||
      !resetToken ||
      !password ||
      !confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // Check password confirmation
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    // Find user with valid reset token
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
      forgotPasswordResetToken: resetToken,
      forgotPasswordResetTokenExpires: {
        $gt: new Date(),
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid or expired password reset session. Please request a new OTP.",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update password
    user.password = hashedPassword;

    // Invalidate reset token
    user.forgotPasswordResetToken = null;
    user.forgotPasswordResetTokenExpires = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Password reset successfully. You can now login with your new password.",
    });
  } catch (error) {
    console.error("Reset Password Error:", error);

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while resetting your password",
    });
  }
};