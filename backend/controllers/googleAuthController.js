import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID
);

export const googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: "Google credential is required",
      });
    }

    // Verify Google ID token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(401).json({
        success: false,
        message: "Invalid Google credential",
      });
    }

    const {
      sub: googleId,
      email,
      name,
      picture,
      email_verified: emailVerified,
    } = payload;

    if (!email || !emailVerified) {
      return res.status(400).json({
        success: false,
        message: "Google email could not be verified",
      });
    }

    // Check if user already exists
    let user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      // Create new Google user
      user = await User.create({
        name: name || "Google User",
        email: email.toLowerCase(),
        profilePicture: picture || "",
        authProvider: "google",
        googleId,
        isEmailVerified: true,
      });
    } else {
      // Existing user
      if (user.authProvider === "local" && !user.googleId) {
        user.googleId = googleId;
        user.isEmailVerified = true;

        if (!user.profilePicture && picture) {
          user.profilePicture = picture;
        }

        await user.save();
      }
    }

    // Create JWT
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // Store JWT in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite:
        process.env.NODE_ENV === "production"
          ? "none"
          : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Google authentication successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
        authProvider: user.authProvider,
        isEmailVerified: user.isEmailVerified,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(
      "Google authentication error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Google authentication failed",
    });
  }
};