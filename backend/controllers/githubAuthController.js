import crypto from "crypto";
import axios from "axios";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const FRONTEND_URL =
  process.env.FRONTEND_URL || "http://localhost:5173";

const CALLBACK_URL =
  `${process.env.BACKEND_URL || "http://localhost:5000"}/api/auth/github/callback`;

// Start GitHub OAuth
export const githubLogin = (req, res) => {
  try {
    const state = crypto.randomBytes(32).toString("hex");

    res.cookie("githubOAuthState", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 10 * 60 * 1000,
    });

    const githubAuthUrl =
      `https://github.com/login/oauth/authorize` +
      `?client_id=${encodeURIComponent(
        process.env.GITHUB_CLIENT_ID
      )}` +
      `&redirect_uri=${encodeURIComponent(CALLBACK_URL)}` +
      `&scope=${encodeURIComponent("read:user user:email")}` +
      `&state=${encodeURIComponent(state)}`;

    return res.redirect(githubAuthUrl);
  } catch (error) {
    console.error("GitHub Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to start GitHub authentication",
    });
  }
};

// GitHub OAuth callback
export const githubCallback = async (req, res) => {
  try {
    const { code, state } = req.query;
    const savedState = req.cookies.githubOAuthState;

    if (!code || !state) {
      return res.redirect(
        `${FRONTEND_URL}/login?error=github_auth_failed`
      );
    }

    if (!savedState || state !== savedState) {
      return res.redirect(
        `${FRONTEND_URL}/login?error=invalid_github_state`
      );
    }

    res.clearCookie("githubOAuthState", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    // Exchange authorization code for GitHub access token
    const tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: CALLBACK_URL,
      },
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    if (!accessToken) {
      return res.redirect(
        `${FRONTEND_URL}/login?error=github_token_failed`
      );
    }

    // Get GitHub profile
    const profileResponse = await axios.get(
      "https://api.github.com/user",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github+json",
        },
      }
    );

    const githubProfile = profileResponse.data;

    // Get GitHub email addresses
    const emailResponse = await axios.get(
      "https://api.github.com/user/emails",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github+json",
        },
      }
    );

    const emails = emailResponse.data;

    const primaryEmail = emails.find(
      (email) => email.primary && email.verified
    );

    if (!primaryEmail) {
      return res.redirect(
        `${FRONTEND_URL}/login?error=github_email_not_verified`
      );
    }

    const email = primaryEmail.email.toLowerCase().trim();

    // Find existing user
    let user = await User.findOne({ email });

    // Create new user if not found
    if (!user) {
      user = await User.create({
        name:
          githubProfile.name ||
          githubProfile.login ||
          "GitHub User",
        email,
        password: undefined,
        mobile: undefined,
        isEmailVerified: true,
        isMobileVerified: false,
        profileImage: githubProfile.avatar_url || "",
        authProvider: "github",
      });
    }

    // Create AuthFlow JWT
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // Store JWT in HTTP-only cookie
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Redirect user to dashboard
    return res.redirect(
      `${FRONTEND_URL}/dashboard`
    );
  } catch (error) {
    console.error(
      "GitHub Authentication Error:",
      error.response?.data || error.message
    );

    return res.redirect(
      `${FRONTEND_URL}/login?error=github_auth_failed`
    );
  }
};