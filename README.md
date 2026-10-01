# AuthFlow

Reusable authentication system for MERN applications.

AuthFlow provides a ready-to-use authentication backend with email/password authentication, OTP verification, password reset, Google OAuth, GitHub OAuth, JWT-based authentication, protected routes, and contact email functionality.

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

## Installation

Install AuthFlow in your MERN backend:

```bash
npm install @rahulmaurya956945/authflow
```

## Requirements

- Node.js 18+
- Express
- MongoDB
- Google OAuth credentials (optional)
- GitHub OAuth credentials (optional)
- Brevo account/API key for email features

## Basic Usage

Import `createAuth`:

```js
import { createAuth } from "@rahulmaurya956945/authflow";
```

Create an AuthFlow instance:

```js
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
    process.env.BREVO_SENDER_EMAIL,
});
```

## Express Integration

Example `server.js`:

```js
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
    process.env.BREVO_SENDER_EMAIL,
});

auth.connectDB();

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
    message: "API is running",
  });
});

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});
```

## Configuration

Create a `.env` file in your application:

```env
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
```

## Authentication Routes

After mounting:

```js
app.use("/api/auth", auth.routes.auth);
```

the following routes become available:

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/verify-email` | Verify email OTP |
| POST | `/api/auth/resend-otp` | Resend verification OTP |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/verify-reset-otp` | Verify reset OTP |
| POST | `/api/auth/resend-reset-otp` | Resend reset OTP |
| POST | `/api/auth/reset-password` | Set new password |
| GET | `/api/auth/profile` | Get authenticated user |
| POST | `/api/auth/logout` | Logout |

## Google Authentication

Mount:

```js
app.use(
  "/api/auth",
  auth.routes.google
);
```

Endpoint:

```text
POST /api/auth/google
```

The frontend sends the Google credential to this endpoint.

## GitHub Authentication

Mount:

```js
app.use(
  "/api/auth",
  auth.routes.github
);
```

Endpoints:

```text
GET /api/auth/github
GET /api/auth/github/callback
```

The callback URL must match the GitHub OAuth application configuration.

## Contact Route

Mount:

```js
app.use(
  "/api/contact",
  auth.routes.contact
);
```

Endpoint:

```text
POST /api/contact/send
```

Request body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello!"
}
```

## Authentication Cookie

AuthFlow stores the JWT in an HTTP-only cookie named:

```text
token
```

The cookie is used automatically by protected routes.

For frontend requests, credentials should be enabled:

```js
fetch("http://localhost:5000/api/auth/profile", {
  credentials: "include",
});
```

## Available AuthFlow Instance

`createAuth()` returns:

```js
{
  config,
  connectDB,
  middleware,
  routes,
  controllers
}
```

### Database

```js
await auth.connectDB();
```

### Middleware

```js
auth.middleware.auth
```

### Routes

```js
auth.routes.auth
auth.routes.google
auth.routes.github
auth.routes.contact
```

### Controllers

```js
auth.controllers.auth
auth.controllers.google
auth.controllers.github
auth.controllers.contact
```

## Security

- JWT is stored in an HTTP-only cookie.
- Passwords are hashed using bcrypt.
- OTP values are hashed before storage.
- OTP verification uses an expiration time.
- Sensitive configuration should be stored in environment variables.
- Never commit `.env` files or API secrets to GitHub.

## Project Structure

```text
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
```

## License

MIT License

Copyright (c) 2026 Rahul Maurya