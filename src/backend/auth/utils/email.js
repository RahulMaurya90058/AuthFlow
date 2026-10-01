import { BrevoClient } from "@getbrevo/brevo";

export const createEmailService = ({
  apiKey,
  senderName,
  senderEmail,
}) => {
  if (!apiKey) {
    throw new Error("Brevo API key is required");
  }

  if (!senderEmail) {
    throw new Error("Brevo sender email is required");
  }

  const brevo = new BrevoClient({
    apiKey,
  });

  const sendVerificationEmail = async ({
    email,
    name,
    otp,
  }) => {
    try {
      const result =
        await brevo.transactionalEmails.sendTransacEmail({
          subject: "Verify your account",

          htmlContent: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
              <h2>Welcome 👋</h2>

              <p>Hi ${name},</p>

              <p>Your verification code is:</p>

              <h1 style="letter-spacing: 8px;">
                ${otp}
              </h1>

              <p>
                This OTP will expire in
                <strong>10 minutes</strong>.
              </p>

              <p>
                If you did not create this account,
                you can ignore this email.
              </p>

              <p>
                Regards,<br/>
                ${senderName || "AuthFlow Team"}
              </p>
            </div>
          `,

          sender: {
            name: senderName || "AuthFlow",
            email: senderEmail,
          },

          to: [
            {
              email,
              name,
            },
          ],
        });

      return result;
    } catch (error) {
      console.error(
        "Brevo email error:",
        error
      );

      throw new Error(
        "Unable to send verification email"
      );
    }
  };

  return {
    sendVerificationEmail,
  };
};