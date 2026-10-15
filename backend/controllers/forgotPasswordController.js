import User from "../models/User.js";
import sendVerificationEmail from "../utils/sendEmail.js";

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
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

    // Don't reveal whether email exists
    if (!user) {
      return res.status(200).json({
        success: true,
        message:
          "If an account exists with this email, a password reset OTP has been sent.",
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // OTP valid for 10 minutes
    const otpExpires = new Date(
      Date.now() + 10 * 60 * 1000
    );

    // Save OTP
    user.forgotPasswordOTP = otp;
    user.forgotPasswordOTPExpires = otpExpires;

    await user.save();

    // Send OTP email
    const emailSent = await sendVerificationEmail(
      user.email,
      user.name,
      otp
    );

    // If email failed, remove the reset OTP
    if (!emailSent) {
      user.forgotPasswordOTP = null;
      user.forgotPasswordOTPExpires = null;

      await user.save();

      return res.status(500).json({
        success: false,
        message: "Failed to send password reset OTP",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "If an account exists with this email, a password reset OTP has been sent.",
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while processing your request",
    });
  }
};