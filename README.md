# AuthFlow

Reusable authentication system for MERN applications.

AuthFlow provides a ready-to-use authentication backend with email/password authentication, OTP verification, password reset, Google OAuth, GitHub OAuth, JWT-based authentication, protected routes, MongoDB integration, and contact email functionality.

## Features

- Email & password registration
- Email OTP verification
- Resend verification OTP
- Login with JWT authentication
- HTTP-only authentication cookies
- Google authentication
- GitHub OAuth authentication
- Forgot password
- Password reset OTP
- Resend password reset OTP
- Protected routes
- MongoDB integration
- Brevo email integration
- Contact form email service
- Local configuration support
- Reusable Express authentication routes
- Optional authentication providers
- Configurable services for different MERN applications

## Installation

Install AuthFlow in your MERN backend:

```bash
npm install @rahulmaurya956945/authflow
Requirements
Node.js 18+
Express
MongoDB
Google OAuth credentials (optional)
GitHub OAuth credentials (optional)
Brevo account/API key (optional, required only for email features)
Basic Usage

Import createAuth:

import { createAuth } from "@rahulmaurya956945/authflow";

Create an AuthFlow instance:

const auth = createAuth({
  mongoUri: process.env.MONGO_URI,

  jwtSecret: process.env.JWT_SECRET,

  googleClientId:
    process.env.GOOGLE_CLIENT_ID,

  githubClientId:
    process.env.GITHUB_CLIENT_ID,

  githubClientSecret:
    process.env.GITHUB_CLIENT_SECRET,

  githubCallbackUrl:
    process.env.GITHUB_CALLBACK_URL,

  frontendUrl:
    process.env.FRONTEND_URL,

  brevoApiKey:
    process.env.BREVO_API_KEY,

  brevoSenderEmail:
    process.env.BREVO_SENDER_EMAIL,

  brevoSenderName:
    process.env.BREVO_SENDER_NAME,

  brevoRecipientEmail:
    process.env.BREVO_RECIPIENT_EMAIL,
});

Google, GitHub, and Brevo configuration is optional.

Only configure the services that your application needs.

Express Integration

Example server.js:

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import { createAuth } from "@rahulmaurya956945/authflow";

dotenv.config();

const app = express();

const auth = createAuth({
  mongoUri: process.env.MONGO_URI,

  jwtSecret: process.env.JWT_SECRET,

  googleClientId:
    process.env.GOOGLE_CLIENT_ID,

  githubClientId:
    process.env.GITHUB_CLIENT_ID,

  githubClientSecret:
    process.env.GITHUB_CLIENT_SECRET,

  githubCallbackUrl:
    process.env.GITHUB_CALLBACK_URL,

  frontendUrl:
    process.env.FRONTEND_URL,

  brevoApiKey:
    process.env.BREVO_API_KEY,

  brevoSenderEmail:
    process.env.BREVO_SENDER_EMAIL,

  brevoSenderName:
    process.env.BREVO_SENDER_NAME,

  brevoRecipientEmail:
    process.env.BREVO_RECIPIENT_EMAIL,
});

await auth.connectDB();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  "/api/auth",
  auth.routes.auth
);

app.use(
  "/api/auth",
  auth.routes.google
);

app.use(
  "/api/auth",
  auth.routes.github
);

app.use(
  "/api/contact",
  auth.routes.contact
);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AuthFlow API is running 🚀",
  });
});

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});
Configuration

Create a .env file in your application.

Required Configuration

These variables are required for basic AuthFlow functionality:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
Optional: Frontend URL

Configure this when your application uses a frontend or GitHub OAuth:

FRONTEND_URL=http://localhost:5173
Optional: Google Authentication

Only required if you want to enable Google Login:

GOOGLE_CLIENT_ID=your_google_client_id
Optional: GitHub Authentication

Only required if you want to enable GitHub Login:

GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=http://localhost:5000/api/auth/github/callback
Optional: Brevo Email

Required for:

Email verification
Verification OTP
Password reset OTP
Password reset emails
Contact email functionality

Configuration:

BREVO_API_KEY=your_brevo_api_key
BREVO_SENDER_EMAIL=your_verified_sender_email
BREVO_SENDER_NAME=Your App Name
Optional: Contact Email Recipient

If you use the contact email functionality, configure the recipient:

BREVO_RECIPIENT_EMAIL=your_recipient_email

AuthFlow does not require Google, GitHub, or Brevo configuration if those features are not being used.

Example .env

A complete configuration may look like:

PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

FRONTEND_URL=http://localhost:5173

GOOGLE_CLIENT_ID=your_google_client_id

GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=http://localhost:5000/api/auth/github/callback

BREVO_API_KEY=your_brevo_api_key
BREVO_SENDER_EMAIL=your_verified_sender_email
BREVO_SENDER_NAME=Your App Name
BREVO_RECIPIENT_EMAIL=your_recipient_email

Never commit real credentials or API keys to GitHub.

Authentication Routes

After mounting:

app.use(
  "/api/auth",
  auth.routes.auth
);

the following routes become available:

Method	Endpoint	Purpose
POST	/api/auth/register	Register user
POST	/api/auth/verify-email	Verify email OTP
POST	/api/auth/resend-otp	Resend verification OTP
POST	/api/auth/login	Login
POST	/api/auth/forgot-password	Request password reset
POST	/api/auth/verify-reset-otp	Verify reset OTP
POST	/api/auth/resend-reset-otp	Resend reset OTP
POST	/api/auth/reset-password	Set new password
GET	/api/auth/profile	Get authenticated user
POST	/api/auth/logout	Logout
Google Authentication

Google authentication is optional.

If Google credentials are configured, mount:

app.use(
  "/api/auth",
  auth.routes.google
);

Endpoint:

POST /api/auth/google

The frontend sends the Google credential to this endpoint.

If Google configuration is not provided, AuthFlow initializes normally and the Google route remains inactive.

GitHub Authentication

GitHub authentication is optional.

If GitHub credentials are configured, mount:

app.use(
  "/api/auth",
  auth.routes.github
);

Endpoints:

GET /api/auth/github
GET /api/auth/github/callback

The callback URL must match the GitHub OAuth application configuration.

If GitHub configuration is not provided, AuthFlow initializes normally and the GitHub routes remain inactive.

Contact Route

The contact email service is optional.

If Brevo is configured, mount:

app.use(
  "/api/contact",
  auth.routes.contact
);

Endpoint:

POST /api/contact/send

Request body:

{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello!"
}
Authentication Cookie

AuthFlow stores the JWT in an HTTP-only cookie named:

token

The cookie is used automatically by protected routes.

For frontend requests, credentials should be enabled:

fetch(
  "http://localhost:5000/api/auth/profile",
  {
    credentials: "include",
  }
);
Available AuthFlow Instance

createAuth() returns:

{
  config,
  connectDB,
  middleware,
  routes,
  controllers
}
Database
await auth.connectDB();
Middleware
auth.middleware.auth
Routes
auth.routes.auth
auth.routes.google
auth.routes.github
auth.routes.contact
Controllers
auth.controllers.auth
auth.controllers.google
auth.controllers.github
auth.controllers.contact
Optional Providers

AuthFlow allows applications to enable only the authentication services they need.

Basic Authentication

Requires:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
Email Authentication

Add:

BREVO_API_KEY=your_brevo_api_key
BREVO_SENDER_EMAIL=your_verified_sender_email
BREVO_SENDER_NAME=Your App Name
Google Login

Add:

GOOGLE_CLIENT_ID=your_google_client_id
GitHub Login

Add:

GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=http://localhost:5000/api/auth/github/callback

This makes AuthFlow suitable for applications that do not need every authentication provider.

Security
JWT is stored in an HTTP-only cookie.
Passwords are hashed using bcrypt.
OTP values are hashed before storage.
OTP verification uses an expiration time.
Sensitive configuration should be stored in environment variables.
Never commit .env files or API secrets to GitHub.
Use HTTPS in production.
Use secure cookie settings in production.
Project Structure
AuthFlow/
├── index.js
├── package.json
├── README.md
└── src/
    └── backend/
        └── auth/
            ├── config/
            │   └── db.js
            ├── controllers/
            │   ├── authController.js
            │   ├── contactController.js
            │   ├── githubAuthController.js
            │   └── googleAuthController.js
            ├── middleware/
            │   └── authMiddleware.js
            ├── models/
            │   ├── User.js
            │   ├── PendingVerification.js
            │   └── PasswordReset.js
            ├── routes/
            │   ├── authRoutes.js
            │   ├── contactRoutes.js
            │   ├── githubAuthRoutes.js
            │   └── googleAuthRoutes.js
            ├── utils/
            │   ├── contactEmail.js
            │   ├── email.js
            │   └── otp.js
            ├── config.js
            └── index.js
License

MIT License

Copyright (c) 2026 Rahul Maurya
