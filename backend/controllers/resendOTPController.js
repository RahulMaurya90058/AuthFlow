import User from "../models/User.js";
import sendVerificationEmail from "../utils/sendEmail.js";

export const resendEmailOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Check email
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Find user
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Already verified
    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified",
      });
    }

    // Generate new 6-digit OTP
    const newOTP = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // OTP valid for 10 minutes
    const newOTPExpires = new Date(
      Date.now() + 10 * 60 * 1000
    );

    // Update user
    user.emailVerificationOTP = newOTP;
    user.emailVerificationOTPExpires = newOTPExpires;

    await user.save();

    // Send new OTP
    const emailSent = await sendVerificationEmail(
      user.email,
      user.name,
      newOTP
    );

    // If email failed, don't pretend it worked
    if (!emailSent) {
      return res.status(500).json({
        success: false,
        message: "Failed to send verification OTP",
      });
    }

    return res.status(200).json({
      success: true,
      message: "A new verification OTP has been sent to your email",
    });
  } catch (error) {
    console.error("Resend OTP Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while resending OTP",
    });
  }
};