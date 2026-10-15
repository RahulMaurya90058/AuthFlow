import User from "../models/User.js";

export const verifyEmailOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Check required fields
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    // OTP must be exactly 6 digits
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

    // OTP doesn't exist
    if (
      !user.emailVerificationOTP ||
      !user.emailVerificationOTPExpires
    ) {
      return res.status(400).json({
        success: false,
        message: "Verification OTP not found. Please request a new OTP.",
      });
    }

    // OTP expired
    if (user.emailVerificationOTPExpires < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new OTP.",
      });
    }

    // Wrong OTP
    if (user.emailVerificationOTP !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Verification successful
    user.isEmailVerified = true;

    // Remove OTP after successful verification
    user.emailVerificationOTP = null;
    user.emailVerificationOTPExpires = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    console.error("Verify Email OTP Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while verifying email",
    });
  }
};