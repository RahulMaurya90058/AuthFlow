import User from "../models/User.js";

export const getProfile = async (req, res) => {
  try {
    // Get user ID from verified JWT
    const userId = req.user.userId;

    // Find user in database
    const user = await User.findById(userId).select(
      "-password -emailVerificationOTP -emailVerificationOTPExpires"
    );

    // User not found
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile accessed successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        isEmailVerified: user.isEmailVerified,
        isMobileVerified: user.isMobileVerified,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching profile",
    });
  }
};