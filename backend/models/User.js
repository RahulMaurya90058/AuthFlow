import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // User name
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    // Email
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // Mobile number
    mobile: {
       type: String,
  required: false,
  unique: true,
  sparse: true,
  trim: true,
    },

    // Password
    password: {
      type: String,
      required: false,
      minlength: 6,
    },

    // =========================
    // EMAIL VERIFICATION
    // =========================

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    // 6-digit email OTP
    emailVerificationOTP: {
      type: String,
      default: null,
    },

    // OTP expiry time
    emailVerificationOTPExpires: {
      type: Date,
      default: null,
    },

    // =========================
    // MOBILE VERIFICATION
    // =========================

    // Future mobile OTP verification
    isMobileVerified: {
      type: Boolean,
      default: false,
    },

    forgotPasswordOTP: {
  type: String,
  default: null,
},

forgotPasswordOTPExpires: {
  type: Date,
  default: null,
},

forgotPasswordResetToken: {
  type: String,
  default: null,
},

forgotPasswordResetTokenExpires: {
  type: Date,
  default: null,
},

authProvider: {
  type: String,
  enum: ["local", "google", "github"],
  default: "local",
},

    // =========================
    // PROFILE
    // =========================

    profileImage: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;