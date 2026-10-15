import crypto from "crypto";
import User from "../models/User.js";

export const verifyResetOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Validate fields
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    // Validate OTP format
    if (!/^\d{6}$/.test(otp)) {
      return res.status(400).json({
        success: false,
        message: "OTP must be 6 digits",
      });
    }

    // Find user
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP or email",
      });
    }

    // Check OTP exists
    if (
      !user.forgotPasswordOTP ||
      !user.forgotPasswordOTPExpires
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Reset OTP not found. Please request a new OTP.",
      });
    }

    // Check OTP expiry
    if (user.forgotPasswordOTPExpires < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new OTP.",
      });
    }

    // Check OTP
    if (user.forgotPasswordOTP !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Generate secure reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Save reset token and expiry
    user.forgotPasswordResetToken = resetToken;
    user.forgotPasswordResetTokenExpires = new Date(
      Date.now() + 10 * 60 * 1000
    );

    // Invalidate OTP so it cannot be reused
    user.forgotPasswordOTP = null;
    user.forgotPasswordOTPExpires = null;

    await user.save();

    // OTP verified successfully
    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      resetToken,
    });
  } catch (error) {
    console.error("Verify Reset OTP Error:", error);

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while verifying OTP",
    });
  }
};