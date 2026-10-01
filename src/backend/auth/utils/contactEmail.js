import { BrevoClient } from "@getbrevo/brevo";

export const createContactEmailService = ({
  apiKey,
  senderName,
  senderEmail,
  recipientEmail,
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

  const sendContactEmail = async ({
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
            name: senderName || "AuthFlow",
            email: senderEmail,
          },

          to: [
            {
              email: recipientEmail || senderEmail,
              name: senderName || "AuthFlow",
            },
          ],

          replyTo: {
            email,
            name,
          },
        });

      return result;
    } catch (error) {
      console.error(
        "Contact email error:",
        error
      );

      throw new Error(
        "Unable to send contact email"
      );
    }
  };

  return {
    sendContactEmail,
  };
};