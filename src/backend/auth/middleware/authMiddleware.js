import jwt from "jsonwebtoken";

export const createAuthMiddleware = ({
  jwtSecret,
}) => {
  if (!jwtSecret) {
    throw new Error("JWT secret is required");
  }

  const authMiddleware = (req, res, next) => {
    try {
      // Get token from HTTP-only cookie
      const token = req.cookies.token;

      // No token
      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      // Verify JWT
      const decoded = jwt.verify(
        token,
        jwtSecret
      );

      // Attach decoded user information
      // to request object
      req.user = decoded;

      // Continue to protected route
      next();
    } catch (error) {
      console.error(
        "Auth middleware error:",
        error.message
      );

      return res.status(401).json({
        success: false,
        message:
          "Invalid or expired authentication token",
      });
    }
  };

  return authMiddleware;
};