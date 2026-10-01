import { sendContactEmail } from "../utils/contactEmail.js";

export const sendContactMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // ================= VALIDATION =================

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email and message are required",
      });
    }

    if (name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Name must contain at least 2 characters",
      });
    }

    if (message.trim().length < 5) {
      return res.status(400).json({
        success: false,
        message: "Message must contain at least 5 characters",
      });
    }

    // Basic email validation
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    // ================= SEND EMAIL =================

    await sendContactEmail({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    });

    // ================= SUCCESS =================

    return res.status(200).json({
      success: true,
      message:
        "Your message has been sent successfully",
    });
  } catch (error) {
    console.error(
      "Contact message error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to send your message. Please try again later.",
    });
  }
};