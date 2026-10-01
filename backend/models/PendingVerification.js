import mongoose from "mongoose";

const pendingVerificationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    otpHash: {
      type: String,
      required: true,
    },

    otpExpiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const PendingVerification = mongoose.model(
  "PendingVerification",
  pendingVerificationSchema
);

export default PendingVerification;