export const createAuthConfig = (config = {}) => {
  return {
    jwtSecret:
      config.jwtSecret ||
      process.env.JWT_SECRET,

    mongoUri:
      config.mongoUri ||
      process.env.MONGO_URI,

    googleClientId:
      config.googleClientId ||
      process.env.GOOGLE_CLIENT_ID,

    githubClientId:
      config.githubClientId ||
      process.env.GITHUB_CLIENT_ID,

    githubClientSecret:
      config.githubClientSecret ||
      process.env.GITHUB_CLIENT_SECRET,

    githubCallbackUrl:
      config.githubCallbackUrl ||
      process.env.GITHUB_CALLBACK_URL,

    frontendUrl:
      config.frontendUrl ||
      process.env.FRONTEND_URL,

    brevoApiKey:
      config.brevoApiKey ||
      process.env.BREVO_API_KEY,

    brevoSenderEmail:
      config.brevoSenderEmail ||
      process.env.BREVO_SENDER_EMAIL,

    brevoSenderName:
      config.brevoSenderName ||
      process.env.BREVO_SENDER_NAME,

    brevoRecipientEmail:
      config.brevoRecipientEmail ||
      process.env.BREVO_SENDER_EMAIL,
  };
};