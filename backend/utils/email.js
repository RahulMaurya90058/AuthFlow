// 






import dotenv from "dotenv";
import { BrevoClient } from "@getbrevo/brevo";

dotenv.config();

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
});

export const sendVerificationEmail = async ({
  email,
  name,
  otp,
}) => {
  try {
    const result = await brevo.transactionalEmails.sendTransacEmail({
      subject: "Verify your AuthFlow account",

      htmlContent: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Welcome to AuthFlow 👋</h2>

          <p>Hi ${name},</p>

          <p>Your verification code is:</p>

          <h1 style="letter-spacing: 8px;">
            ${otp}
          </h1>

          <p>This OTP will expire in <strong>10 minutes</strong>.</p>

          <p>If you did not create this account, you can ignore this email.</p>

          <p>Regards,<br/>AuthFlow Team</p>
        </div>
      `,

      sender: {
        name: process.env.BREVO_SENDER_NAME,
        email: process.env.BREVO_SENDER_EMAIL,
      },

      to: [
        {
          email,
          name,
        },
      ],
    });

    console.log("Verification email sent:", result);

    return result;
  } catch (error) {
    console.error("========== BREVO ERROR ==========");
    console.error(error);
    console.error("================================");

    throw new Error("Unable to send verification email");
  }
};