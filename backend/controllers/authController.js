import bcrypt from "bcryptjs";
import User from "../models/User.js";
import sendVerificationEmail from "../utils/sendEmail.js";


// ==========================================
// REGISTER USER
// ==========================================

export const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      mobile,
      password,
      confirmPassword,
    } = req.body;

    // 1. Check required fields
    if (!name || !email || !mobile || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // 2. Check password match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    // 3. Check password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // 4. Check existing email
    const existingEmail = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    // 5. Check existing mobile
    const existingMobile = await User.findOne({
      mobile,
    });

    if (existingMobile) {
      return res.status(409).json({
        success: false,
        message: "Mobile number already registered",
      });
    }

    // 6. Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // 7. Generate 6-digit OTP
    const verificationOTP = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // 8. OTP expires in 10 minutes
    const verificationOTPExpires = new Date(
      Date.now() + 10 * 60 * 1000
    );

    // 9. Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      mobile,
      password: hashedPassword,

      isEmailVerified: false,

      emailVerificationOTP: verificationOTP,
      emailVerificationOTPExpires: verificationOTPExpires,
    });

    // 10. Send OTP email
    const emailSent = await sendVerificationEmail(
      user.email,
      user.name,
      verificationOTP
    );

    // 11. If email sending fails
    if (!emailSent) {
      await User.findByIdAndDelete(user._id);

      return res.status(500).json({
        success: false,
        message:
          "Account could not be created because verification email failed",
      });
    }

    // 12. Success response
    return res.status(201).json({
      success: true,
      message:
        "Account created successfully. Verification OTP has been sent to your email.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating account",
    });
  }
};


// ==========================================
// VERIFY EMAIL OTP
// ==========================================

export const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // 1. Check required fields
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    // 2. Validate OTP format
    if (!/^\d{6}$/.test(otp)) {
      return res.status(400).json({
        success: false,
        message: "OTP must be 6 digits",
      });
    }

    // 3. Find user
    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 4. Check already verified
    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified",
      });
    }

    // 5. Check OTP exists
    if (
      !user.emailVerificationOTP ||
      !user.emailVerificationOTPExpires
    ) {
      return res.status(400).json({
        success: false,
        message: "Verification OTP not found. Please request a new OTP.",
      });
    }

    // 6. Check OTP expiry
    if (user.emailVerificationOTPExpires < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new OTP.",
      });
    }

    // 7. Check OTP
    if (user.emailVerificationOTP !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // 8. Verify email
    user.isEmailVerified = true;

    // 9. Remove OTP after successful verification
    user.emailVerificationOTP = null;
    user.emailVerificationOTPExpires = null;

    await user.save();

    // 10. Success response
    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    console.error("Verify Email Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while verifying email",
    });
  }
};