import { createAuthConfig } from "./config.js";

import { connectAuthDB } from "./config/db.js";

import { createEmailService } from "./utils/email.js";
import {
  createContactEmailService,
} from "./utils/contactEmail.js";

import {
  createAuthController,
} from "./controllers/authController.js";

import {
  createGoogleAuthController,
} from "./controllers/googleAuthController.js";

import {
  createGithubAuthController,
} from "./controllers/githubAuthController.js";

import {
  createContactController,
} from "./controllers/contactController.js";

import {
  createAuthMiddleware,
} from "./middleware/authMiddleware.js";

import {
  createAuthRoutes,
} from "./routes/authRoutes.js";

import {
  createGoogleAuthRoutes,
} from "./routes/googleAuthRoutes.js";

import {
  createGithubAuthRoutes,
} from "./routes/githubAuthRoutes.js";

import {
  createContactRoutes,
} from "./routes/contactRoutes.js";

const createAuth = (config = {}) => {
  // ======================================================
  // CONFIG
  // ======================================================

  const authConfig = createAuthConfig(config);

  // ======================================================
  // EMAIL SERVICES
  // ======================================================

  const {
    sendVerificationEmail,
  } = createEmailService({
    apiKey: authConfig.brevoApiKey,
    senderName: authConfig.brevoSenderName,
    senderEmail:
      authConfig.brevoSenderEmail,
  });

  const {
    sendContactEmail,
  } = createContactEmailService({
    apiKey: authConfig.brevoApiKey,
    senderName: authConfig.brevoSenderName,
    senderEmail:
      authConfig.brevoSenderEmail,
    recipientEmail:
      authConfig.brevoRecipientEmail,
  });

  // ======================================================
  // CONTROLLERS
  // ======================================================

  const authController =
    createAuthController({
      jwtSecret: authConfig.jwtSecret,
      sendVerificationEmail,
    });

  const googleAuthController =
    createGoogleAuthController({
      googleClientId:
        authConfig.googleClientId,
      jwtSecret: authConfig.jwtSecret,
    });

  const githubAuthController =
    createGithubAuthController({
      githubClientId:
        authConfig.githubClientId,
      githubClientSecret:
        authConfig.githubClientSecret,
      githubCallbackUrl:
        authConfig.githubCallbackUrl,
      jwtSecret: authConfig.jwtSecret,
      frontendUrl:
        authConfig.frontendUrl,
    });

  const contactController =
    createContactController({
      sendContactEmail,
    });

  // ======================================================
  // MIDDLEWARE
  // ======================================================

  const authMiddleware =
    createAuthMiddleware({
      jwtSecret: authConfig.jwtSecret,
    });

  // ======================================================
  // ROUTES
  // ======================================================

  const authRoutes = createAuthRoutes({
    authController,
    authMiddleware,
  });

  const googleAuthRoutes =
    createGoogleAuthRoutes({
      googleAuth:
        googleAuthController.googleAuth,
    });

  const githubAuthRoutes =
    createGithubAuthRoutes({
      githubLogin:
        githubAuthController.githubLogin,
      githubCallback:
        githubAuthController.githubCallback,
    });

  const contactRoutes =
    createContactRoutes({
      sendContactMessage:
        contactController.sendContactMessage,
    });

  // ======================================================
  // RETURN AUTHFLOW INSTANCE
  // ======================================================

  return {
    config: authConfig,

    connectDB: () =>
      connectAuthDB(authConfig.mongoUri),

    middleware: {
      auth: authMiddleware,
    },

    routes: {
      auth: authRoutes,
      google: googleAuthRoutes,
      github: githubAuthRoutes,
      contact: contactRoutes,
    },

    controllers: {
      auth: authController,
      google: googleAuthController,
      github: githubAuthController,
      contact: contactController,
    },
  };
};

export { createAuth };