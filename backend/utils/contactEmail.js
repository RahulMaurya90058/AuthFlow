import dotenv from "dotenv";
import { BrevoClient } from "@getbrevo/brevo";

dotenv.config();

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
});

export const sendContactEmail = async ({
  name,
  email,
  message,
}) => {
  try {
    const result =
      await brevo.transactionalEmails.sendTransacEmail({
        subject: `New Contact Message from ${name}`,

        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px;">

            <h2 style="color: #0f172a;">
              New Contact Message
            </h2>

            <hr />

            <p>
              <strong>Name:</strong> ${name}
            </p>

            <p>
              <strong>Email:</strong> ${email}
            </p>

            <p>
              <strong>Message:</strong>
            </p>

            <div
              style="
                background: #f8fafc;
                padding: 15px;
                border-radius: 8px;
                border: 1px solid #e2e8f0;
                white-space: pre-wrap;
              "
            >
              ${message}
            </div>

            <br />

            <p style="color: #64748b; font-size: 13px;">
              This message was sent through the AuthFlow Contact Us form.
            </p>

          </div>
        `,

        sender: {
          name: process.env.BREVO_SENDER_NAME,
          email: process.env.BREVO_SENDER_EMAIL,
        },

        to: [
          {
            email: process.env.BREVO_SENDER_EMAIL,
            name: process.env.BREVO_SENDER_NAME,
          },
        ],

        replyTo: {
          email: email,
          name: name,
        },
      });

    console.log("Contact email sent:", result);

    return result;
  } catch (error) {
    console.error("========== CONTACT EMAIL ERROR ==========");
    console.error(error);
    console.error("=========================================");

    throw new Error("Unable to send contact email");
  }
};