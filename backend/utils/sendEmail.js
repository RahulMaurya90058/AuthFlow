import axios from "axios";

const sendVerificationEmail = async (email, name, otp) => {
  try {
    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: process.env.BREVO_SENDER_NAME,
          email: process.env.BREVO_SENDER_EMAIL,
        },

        to: [
          {
            email: email,
            name: name,
          },
        ],

        subject: "Your AuthFlow Verification OTP",

        htmlContent: `
          <div
            style="
              font-family: Arial, sans-serif;
              background-color: #f3f7f6;
              padding: 40px 20px;
            "
          >
            <div
              style="
                max-width: 600px;
                margin: auto;
                background: #ffffff;
                border-radius: 20px;
                padding: 40px;
                text-align: center;
                box-shadow: 0 10px 30px rgba(0,0,0,0.08);
              "
            >

              <h1
                style="
                  margin-bottom: 10px;
                  color: #111827;
                "
              >
                AuthFlow
              </h1>

              <h2
                style="
                  color: #111827;
                  margin-top: 25px;
                "
              >
                Verify Your Email
              </h2>

              <p
                style="
                  color: #6b7280;
                  font-size: 16px;
                  line-height: 1.6;
                "
              >
                Hi ${name},<br /><br />

                Thanks for creating your AuthFlow account.
                Use the verification code below to verify your email address.
              </p>

              <div
                style="
                  margin: 30px auto;
                  padding: 18px 25px;
                  background: #ecfdf5;
                  border: 2px dashed #10b981;
                  border-radius: 14px;
                  max-width: 250px;
                "
              >
                <div
                  style="
                    color: #6b7280;
                    font-size: 13px;
                    margin-bottom: 8px;
                  "
                >
                  YOUR VERIFICATION CODE
                </div>

                <div
                  style="
                    color: #111827;
                    font-size: 34px;
                    font-weight: bold;
                    letter-spacing: 8px;
                  "
                >
                  ${otp}
                </div>
              </div>

              <p
                style="
                  color: #6b7280;
                  font-size: 14px;
                "
              >
                This OTP will expire in
                <strong>10 minutes</strong>.
              </p>

              <p
                style="
                  color: #6b7280;
                  font-size: 14px;
                  margin-top: 25px;
                "
              >
                If you did not create this account,
                you can safely ignore this email.
              </p>

              <hr
                style="
                  border: none;
                  border-top: 1px solid #e5e7eb;
                  margin: 30px 0;
                "
              />

              <p
                style="
                  color: #9ca3af;
                  font-size: 12px;
                "
              >
                © ${new Date().getFullYear()} AuthFlow. All rights reserved.
              </p>

            </div>
          </div>
        `,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    console.log(`Verification OTP sent to ${email}`);

    return true;
  } catch (error) {
    console.error(
      "Brevo Email Error:",
      error.response?.data || error.message
    );

    return false;
  }
};

export default sendVerificationEmail;