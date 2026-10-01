import crypto from "crypto";
import bcrypt from "bcryptjs";

// Generate 6-digit OTP
export const generateOTP = () => {
  return crypto.randomInt(100000, 1000000).toString();
};

// Hash OTP before storing it in database
export const hashOTP = async (otp) => {
  return await bcrypt.hash(otp, 10);
};

// Compare entered OTP with stored hash
export const compareOTP = async (otp, otpHash) => {
  return await bcrypt.compare(otp, otpHash);
};