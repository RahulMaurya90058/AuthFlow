import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.js";
import PendingVerification from "../models/PendingVerification.js";
import PasswordReset from "../models/PasswordReset.js";

import {
  generateOTP,
  hashOTP,
  compareOTP,
} from "../utils/otp.js";

export const createAuthController = ({
  jwtSecret,
  sendVerificationEmail,
}) => {
  if (!jwtSecret) {
    throw new Error("JWT secret is required");
  }

  if (!sendVerificationEmail) {
    throw new Error(
      "sendVerificationEmail service is required"
    );
  }

  // ======================================================
  // REGISTER USER
  // ======================================================

  const registerUser = async (req, res) => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        });
      }

      if (name.trim().length < 2) {
        return res.status(400).json({
          success: false,
          message: "Name must be at least 2 characters",
        });
      }

      if (password.length < 8) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 8 characters",
        });
      }

      const normalizedEmail =
        email.trim().toLowerCase();

      const existingUser = await User.findOne({
        email: normalizedEmail,
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message:
            "An account with this email already exists",
        });
      }

      await PendingVerification.deleteOne({
        email: normalizedEmail,
      });

      const otp = generateOTP();

      const otpExpiresAt = new Date(
        Date.now() + 10 * 60 * 1000
      );

      const hashedPassword = await bcrypt.hash(
        password,
        10
      );

      const otpHash = await hashOTP(otp);

      await PendingVerification.create({
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        otpHash,
        otpExpiresAt,
      });

      try {
        await sendVerificationEmail({
          email: normalizedEmail,
          name: name.trim(),
          otp,
        });
      } catch (emailError) {
        console.error(
          "Verification email error:",
          emailError
        );

        await PendingVerification.deleteOne({
          email: normalizedEmail,
        });

        return res.status(500).json({
          success: false,
          message:
            "Unable to send verification email. Please try again.",
        });
      }

      return res.status(201).json({
        success: true,
        message:
          "Verification code sent to your email",
        email: normalizedEmail,
      });
    } catch (error) {
      console.error("Register error:", error);

      return res.status(500).json({
        success: false,
        message:
          "Server error. Please try again later.",
      });
    }
  };

  // ======================================================
  // VERIFY EMAIL
  // ======================================================

  const verifyEmail = async (req, res) => {
    try {
      const { email, otp } = req.body;

      if (!email || !otp) {
        return res.status(400).json({
          success: false,
          message: "Email and OTP are required",
        });
      }

      const normalizedEmail = email
        .trim()
        .toLowerCase();

      const pendingVerification =
        await PendingVerification.findOne({
          email: normalizedEmail,
        });

      if (!pendingVerification) {
        return res.status(404).json({
          success: false,
          message:
            "Verification request not found. Please register again.",
        });
      }

      if (
        new Date() >
        pendingVerification.otpExpiresAt
      ) {
        await PendingVerification.deleteOne({
          email: normalizedEmail,
        });

        return res.status(400).json({
          success: false,
          message:
            "OTP has expired. Please request a new OTP.",
        });
      }

      const isOTPValid = await compareOTP(
        otp.toString(),
        pendingVerification.otpHash
      );

      if (!isOTPValid) {
        return res.status(400).json({
          success: false,
          message: "Invalid OTP",
        });
      }

      const existingUser = await User.findOne({
        email: normalizedEmail,
      });

      if (existingUser) {
        await PendingVerification.deleteOne({
          email: normalizedEmail,
        });

        return res.status(409).json({
          success: false,
          message:
            "An account with this email already exists",
        });
      }

      const user = await User.create({
        name: pendingVerification.name,
        email: pendingVerification.email,
        password: pendingVerification.password,
        authProvider: "local",
        isEmailVerified: true,
      });

      await PendingVerification.deleteOne({
        email: normalizedEmail,
      });

      return res.status(201).json({
        success: true,
        message: "Email verified successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          profilePicture: user.profilePicture,
          authProvider: user.authProvider,
          isEmailVerified: user.isEmailVerified,
        },
      });
    } catch (error) {
      console.error(
        "Verify email error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Server error. Please try again later.",
      });
    }
  };

  // ======================================================
  // RESEND REGISTRATION OTP
  // ======================================================

  const resendOTP = async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email is required",
        });
      }

      const normalizedEmail = email
        .trim()
        .toLowerCase();

      const existingUser = await User.findOne({
        email: normalizedEmail,
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message:
            "This email is already verified",
        });
      }

      const pendingVerification =
        await PendingVerification.findOne({
          email: normalizedEmail,
        });

      if (!pendingVerification) {
        return res.status(404).json({
          success: false,
          message:
            "Verification request not found. Please register again.",
        });
      }

      const otp = generateOTP();

      const otpExpiresAt = new Date(
        Date.now() + 10 * 60 * 1000
      );

      const otpHash = await hashOTP(otp);

      pendingVerification.otpHash = otpHash;
      pendingVerification.otpExpiresAt =
        otpExpiresAt;

      await pendingVerification.save();

      try {
        await sendVerificationEmail({
          email: normalizedEmail,
          name: pendingVerification.name,
          otp,
        });
      } catch (emailError) {
        console.error(
          "Resend email error:",
          emailError
        );

        return res.status(500).json({
          success: false,
          message:
            "Unable to send OTP. Please try again.",
        });
      }

      return res.status(200).json({
        success: true,
        message:
          "A new OTP has been sent to your email",
      });
    } catch (error) {
      console.error(
        "Resend OTP error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Server error. Please try again later.",
      });
    }
  };

  // ======================================================
  // LOGIN USER
  // ======================================================

  const loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message:
            "Email and password are required",
        });
      }

      const normalizedEmail = email
        .trim()
        .toLowerCase();

      const user = await User.findOne({
        email: normalizedEmail,
      }).select("+password");

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      if (!user.isEmailVerified) {
        return res.status(403).json({
          success: false,
          message:
            "Please verify your email before logging in",
        });
      }

      if (!user.password) {
        return res.status(400).json({
          success: false,
          message:
            "This account uses Google login. Please continue with Google.",
        });
      }

      const isPasswordCorrect =
        await bcrypt.compare(
          password,
          user.password
        );

      if (!isPasswordCorrect) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      const token = jwt.sign(
        {
          userId: user._id.toString(),
        },
        jwtSecret,
        {
          expiresIn: "7d",
        }
      );

      res.cookie("token", token, {
        httpOnly: true,

        secure:
          process.env.NODE_ENV === "production",

        sameSite:
          process.env.NODE_ENV === "production"
            ? "none"
            : "lax",

        maxAge:
          7 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        success: true,
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          profilePicture:
            user.profilePicture,
          authProvider:
            user.authProvider,
          isEmailVerified:
            user.isEmailVerified,
          role: user.role,
        },
      });
    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Server error. Please try again later.",
      });
    }
  };

  // ======================================================
  // GET PROFILE
  // ======================================================

  const getProfile = async (req, res) => {
    try {
      const user = await User.findById(
        req.user.userId
      );

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      return res.status(200).json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          profilePicture:
            user.profilePicture,
          authProvider:
            user.authProvider,
          isEmailVerified:
            user.isEmailVerified,
          role: user.role,
          createdAt: user.createdAt,
        },
      });
    } catch (error) {
      console.error(
        "Get profile error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Server error. Please try again later.",
      });
    }
  };

  // ======================================================
  // LOGOUT USER
  // ======================================================

  const logoutUser = async (req, res) => {
    try {
      res.clearCookie("token", {
        httpOnly: true,

        secure:
          process.env.NODE_ENV === "production",

        sameSite:
          process.env.NODE_ENV === "production"
            ? "none"
            : "lax",
      });

      return res.status(200).json({
        success: true,
        message: "Logout successful",
      });
    } catch (error) {
      console.error(
        "Logout error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Server error. Please try again later.",
      });
    }
  };

  // ======================================================
  // FORGOT PASSWORD
  // ======================================================

  const forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email is required",
        });
      }

      const normalizedEmail = email
        .trim()
        .toLowerCase();

      const user = await User.findOne({
        email: normalizedEmail,
      });

      /*
        Security note:
        We don't reveal whether an email exists.
        This prevents email/account enumeration.
      */

      if (!user) {
        return res.status(200).json({
          success: true,
          message:
            "If an account exists with this email, a reset OTP has been sent.",
          email: normalizedEmail,
        });
      }

      if (
        user.authProvider === "google" &&
        !user.password
      ) {
        return res.status(400).json({
          success: false,
          message:
            "This account uses Google login. Please continue with Google.",
        });
      }

      await PasswordReset.deleteOne({
        email: normalizedEmail,
      });

      const otp = generateOTP();

      const otpExpiresAt = new Date(
        Date.now() + 10 * 60 * 1000
      );

      const otpHash = await hashOTP(otp);

      await PasswordReset.create({
        email: normalizedEmail,
        otpHash,
        otpExpiresAt,
      });

      try {
        await sendVerificationEmail({
          email: normalizedEmail,
          name: user.name,
          otp,
        });
      } catch (emailError) {
        console.error(
          "Password reset email error:",
          emailError
        );

        await PasswordReset.deleteOne({
          email: normalizedEmail,
        });

        return res.status(500).json({
          success: false,
          message:
            "Unable to send reset OTP. Please try again.",
        });
      }

      return res.status(200).json({
        success: true,
        message:
          "If an account exists with this email, a reset OTP has been sent.",
        email: normalizedEmail,
      });
    } catch (error) {
      console.error(
        "Forgot password error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Server error. Please try again later.",
      });
    }
  };

  // ======================================================
  // VERIFY RESET OTP
  // ======================================================

  const verifyResetOTP = async (req, res) => {
    try {
      const { email, otp } = req.body;

      if (!email || !otp) {
        return res.status(400).json({
          success: false,
          message: "Email and OTP are required",
        });
      }

      const normalizedEmail = email
        .trim()
        .toLowerCase();

      const passwordReset =
        await PasswordReset.findOne({
          email: normalizedEmail,
        });

      if (!passwordReset) {
        return res.status(404).json({
          success: false,
          message:
            "Reset request not found. Please request a new OTP.",
        });
      }

      if (
        new Date() >
        passwordReset.otpExpiresAt
      ) {
        await PasswordReset.deleteOne({
          email: normalizedEmail,
        });

        return res.status(400).json({
          success: false,
          message:
            "OTP has expired. Please request a new OTP.",
        });
      }

      const isOTPValid = await compareOTP(
        otp.toString(),
        passwordReset.otpHash
      );

      if (!isOTPValid) {
        return res.status(400).json({
          success: false,
          message: "Invalid OTP",
        });
      }

      return res.status(200).json({
        success: true,
        message: "OTP verified successfully",
      });
    } catch (error) {
      console.error(
        "Verify reset OTP error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Server error. Please try again later.",
      });
    }
  };

  // ======================================================
  // RESEND RESET OTP
  // ======================================================

  const resendResetOTP = async (
    req,
    res
  ) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email is required",
        });
      }

      const normalizedEmail = email
        .trim()
        .toLowerCase();

      const user = await User.findOne({
        email: normalizedEmail,
      });

      if (!user) {
        return res.status(200).json({
          success: true,
          message:
            "If an account exists with this email, a new reset OTP has been sent.",
        });
      }

      if (
        user.authProvider === "google" &&
        !user.password
      ) {
        return res.status(400).json({
          success: false,
          message:
            "This account uses Google login. Please continue with Google.",
        });
      }

      const otp = generateOTP();

      const otpExpiresAt = new Date(
        Date.now() + 10 * 60 * 1000
      );

      const otpHash = await hashOTP(otp);

      await PasswordReset.findOneAndUpdate(
        {
          email: normalizedEmail,
        },
        {
          email: normalizedEmail,
          otpHash,
          otpExpiresAt,
        },
        {
          upsert: true,
          new: true,
        }
      );

      try {
        await sendVerificationEmail({
          email: normalizedEmail,
          name: user.name,
          otp,
        });
      } catch (emailError) {
        console.error(
          "Resend reset email error:",
          emailError
        );

        return res.status(500).json({
          success: false,
          message:
            "Unable to send reset OTP. Please try again.",
        });
      }

      return res.status(200).json({
        success: true,
        message:
          "A new reset OTP has been sent to your email",
      });
    } catch (error) {
      console.error(
        "Resend reset OTP error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Server error. Please try again later.",
      });
    }
  };

  // ======================================================
  // RESET PASSWORD
  // ======================================================

  const resetPassword = async (
    req,
    res
  ) => {
    try {
      const {
        email,
        otp,
        newPassword,
      } = req.body;

      if (!email || !otp || !newPassword) {
        return res.status(400).json({
          success: false,
          message:
            "Email, OTP and new password are required",
        });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({
          success: false,
          message:
            "Password must be at least 8 characters",
        });
      }

      const normalizedEmail = email
        .trim()
        .toLowerCase();

      const passwordReset =
        await PasswordReset.findOne({
          email: normalizedEmail,
        });

      if (!passwordReset) {
        return res.status(404).json({
          success: false,
          message:
            "Reset request not found. Please request a new OTP.",
        });
      }

      if (
        new Date() >
        passwordReset.otpExpiresAt
      ) {
        await PasswordReset.deleteOne({
          email: normalizedEmail,
        });

        return res.status(400).json({
          success: false,
          message:
            "OTP has expired. Please request a new OTP.",
        });
      }

      const isOTPValid = await compareOTP(
        otp.toString(),
        passwordReset.otpHash
      );

      if (!isOTPValid) {
        return res.status(400).json({
          success: false,
          message: "Invalid OTP",
        });
      }

      const user = await User.findOne({
        email: normalizedEmail,
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const hashedPassword =
        await bcrypt.hash(
          newPassword,
          10
        );

      user.password = hashedPassword;
      user.isEmailVerified = true;

      await user.save();

      await PasswordReset.deleteOne({
        email: normalizedEmail,
      });

      res.clearCookie("token", {
        httpOnly: true,

        secure:
          process.env.NODE_ENV === "production",

        sameSite:
          process.env.NODE_ENV === "production"
            ? "none"
            : "lax",
      });

      return res.status(200).json({
        success: true,
        message:
          "Password reset successfully",
      });
    } catch (error) {
      console.error(
        "Reset password error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Server error. Please try again later.",
      });
    }
  };

  // ======================================================
  // RETURN CONTROLLERS
  // ======================================================

  return {
    registerUser,
    verifyEmail,
    resendOTP,
    loginUser,
    getProfile,
    logoutUser,
    forgotPassword,
    verifyResetOTP,
    resendResetOTP,
    resetPassword,
  };
};