import jwt from "jsonwebtoken";
import User from "../models/User.js";

const GITHUB_CLIENT_ID =
  process.env.GITHUB_CLIENT_ID;

const GITHUB_CLIENT_SECRET =
  process.env.GITHUB_CLIENT_SECRET;

// ================= GITHUB LOGIN =================
export const githubLogin = (req, res) => {
  const githubAuthUrl =
    `https://github.com/login/oauth/authorize` +
    `?client_id=${GITHUB_CLIENT_ID}` +
    `&redirect_uri=${process.env.GITHUB_CALLBACK_URL}` +
    `&scope=user:email`;

  return res.redirect(githubAuthUrl);
};

// ================= GITHUB CALLBACK =================
export const githubCallback = async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "GitHub authorization code is missing",
      });
    }

    // ================= GET ACCESS TOKEN =================
    const tokenResponse = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: GITHUB_CLIENT_ID,
          client_secret: GITHUB_CLIENT_SECRET,
          code,
        }),
      }
    );

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      console.error(
        "GitHub token error:",
        tokenData
      );

      return res.status(401).json({
        success: false,
        message:
          "Unable to get GitHub access token",
      });
    }

    const accessToken = tokenData.access_token;

    // ================= GET GITHUB USER =================
    const userResponse = await fetch(
      "https://api.github.com/user",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github+json",
        },
      }
    );

    const githubUser = await userResponse.json();

    if (!githubUser.id) {
      return res.status(401).json({
        success: false,
        message: "Unable to get GitHub user",
      });
    }

    // ================= GET GITHUB EMAIL =================
    const emailResponse = await fetch(
      "https://api.github.com/user/emails",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github+json",
        },
      }
    );

    const emails = await emailResponse.json();

    const primaryEmail = emails.find(
      (email) =>
        email.primary && email.verified
    );

    if (!primaryEmail) {
      return res.status(400).json({
        success: false,
        message:
          "No verified primary email found on GitHub",
      });
    }

    const email =
      primaryEmail.email.toLowerCase();

    const name =
      githubUser.name ||
      githubUser.login ||
      "GitHub User";

    const profilePicture =
      githubUser.avatar_url || "";

    const githubId = String(githubUser.id);

    // ================= FIND USER =================
    let user = await User.findOne({ email });

    // ================= CREATE USER =================
    if (!user) {
      user = await User.create({
        name,
        email,
        profilePicture,
        authProvider: "github",
        googleId: null,
        githubId,
        isEmailVerified: true,
      });
    } else {
      // ================= EXISTING GITHUB USER =================
      if (user.authProvider === "github") {
        user.githubId = githubId;
        user.isEmailVerified = true;

        if (!user.profilePicture && profilePicture) {
          user.profilePicture = profilePicture;
        }

        await user.save();
      }

      // ================= LINK LOCAL USER =================
      else if (
        user.authProvider === "local" &&
        !user.googleId &&
        !user.githubId
      ) {
        user.authProvider = "github";
        user.githubId = githubId;
        user.isEmailVerified = true;

        if (!user.profilePicture && profilePicture) {
          user.profilePicture = profilePicture;
        }

        await user.save();
      }

      // ================= GOOGLE USER =================
      else if (user.authProvider === "google") {
        return res.status(409).json({
          success: false,
          message:
            "This email is already registered with Google. Please continue with Google.",
        });
      }
    }

    // ================= CREATE JWT =================
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

    // ================= AUTH COOKIE =================
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

    // ================= REDIRECT =================
    return res.redirect(
      `${process.env.FRONTEND_URL}/profile`
    );
  } catch (error) {
    console.error(
      "GitHub authentication error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "GitHub authentication failed",
    });
  }
};