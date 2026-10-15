import jwt from "jsonwebtoken";

export const protect = async (req, res, next) => {
  try {
    // Get token from HTTP-only cookie
    const token = req.cookies.authToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated. Please login first.",
      });
    }

    // Verify JWT
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Attach user information to request
    req.user = decoded;

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token",
    });
  }
};