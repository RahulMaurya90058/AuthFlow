import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Mail,
  MessageSquare,
  Send,
  ShieldCheck,
} from "lucide-react";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name] || errors.general) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
        general: "",
      }));
    }

    if (success) {
      setSuccess(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name =
        "Name must contain at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email.trim()
      )
    ) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message =
        "Message must be at least 10 characters";
    }

    return newErrors;
  };

  // ================= SEND MESSAGE =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({});
    setSuccess(false);

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/contact/send`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            email: formData.email.trim(),
            message: formData.message.trim(),
          }),
        }
      );

      const data = await response.json();

      // ================= BACKEND ERROR =================
      if (!response.ok) {
        setErrors({
          general:
            data.message ||
            "Unable to send your message. Please try again.",
        });

        return;
      }

      // ================= SUCCESS =================
      console.log("Contact message sent:", data);

      setSuccess(true);

      setFormData({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      console.error("Contact form error:", error);

      setErrors({
        general:
          "Unable to connect to server. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-5xl">
        {/* Back */}
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-emerald-600"
        >
          <ArrowLeft size={18} />
          Back to Sign Up
        </Link>

        {/* Header */}
        <div className="mb-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-cyan-600 p-8 text-white shadow-lg">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
              <MessageSquare size={26} />
            </div>

            <div>
              <h1 className="text-3xl font-bold">
                Contact Us
              </h1>

              <p className="mt-1 text-sm text-white/80">
                Have a question? We're here to help.
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid gap-6 md:grid-cols-[0.8fr_1.2fr]">
          {/* Contact Information */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-bold text-slate-900">
              Get in Touch
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              If you have questions about AuthFlow,
              authentication, your account, or any issue with
              the platform, send us a message.
            </p>

            {/* Email */}
            <div className="mt-7 flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Mail size={21} />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Email Support
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  {import.meta.env.VITE_SUPPORT_EMAIL ||
                    "rahulmaurya956945@gmail.com"}
                </p>
              </div>
            </div>

            {/* Security */}
            <div className="mt-7 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
              <div className="flex gap-3">
                <ShieldCheck
                  size={20}
                  className="mt-0.5 shrink-0 text-emerald-600"
                />

                <div>
                  <p className="text-sm font-semibold text-emerald-800">
                    Account Security
                  </p>

                  <p className="mt-1 text-xs leading-5 text-emerald-700">
                    Never send your password, OTP, or other
                    authentication credentials through the
                    contact form.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-bold text-slate-900">
              Send us a Message
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Fill out the form below and tell us how we can
              help.
            </p>

            {/* General Error */}
            {errors.general && (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {errors.general}
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="mt-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                <CheckCircle2
                  size={20}
                  className="mt-0.5 shrink-0 text-emerald-600"
                />

                <div>
                  <p className="text-sm font-semibold text-emerald-700">
                    Message sent successfully!
                  </p>

                  <p className="mt-1 text-xs text-emerald-600">
                    Thank you for contacting AuthFlow.
                    We will get back to you soon.
                  </p>
                </div>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-5"
            >
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Your Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 ${
                    errors.name
                      ? "border-red-400 focus:border-red-500"
                      : "border-slate-200 focus:border-emerald-500"
                  }`}
                />

                {errors.name && (
                  <p className="mt-1.5 text-xs text-red-500">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 ${
                    errors.email
                      ? "border-red-400 focus:border-red-500"
                      : "border-slate-200 focus:border-emerald-500"
                  }`}
                />

                {errors.email && (
                  <p className="mt-1.5 text-xs text-red-500">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Message
                </label>

                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us how we can help..."
                  className={`w-full resize-none rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 ${
                    errors.message
                      ? "border-red-400 focus:border-red-500"
                      : "border-slate-200 focus:border-emerald-500"
                  }`}
                />

                {errors.message && (
                  <p className="mt-1.5 text-xs text-red-500">
                    {errors.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Send size={18} />

                {loading
                  ? "Sending..."
                  : "Send Message"}
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
          <Link
            to="/"
            className="font-medium text-slate-500 hover:text-emerald-600"
          >
            Sign Up
          </Link>

          <span className="text-slate-300">•</span>

          <Link
            to="/terms"
            className="font-medium text-slate-500 hover:text-emerald-600"
          >
            Terms of Service
          </Link>

          <span className="text-slate-300">•</span>

          <Link
            to="/privacy"
            className="font-medium text-slate-500 hover:text-emerald-600"
          >
            Privacy Policy
          </Link>

          <span className="text-slate-300">•</span>

          <Link
            to="/login"
            className="font-medium text-slate-500 hover:text-emerald-600"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;