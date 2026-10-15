import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FiArrowLeft,
  FiArrowRight,
  FiMail,
  FiShield,
} from "react-icons/fi";
const API_URL = import.meta.env.VITE_API_URL;

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const response = await axios.post(
        `${API_URL}/api/auth/forgot-password`,
        {
          email: email.trim(),
        }
      );

      if (response.data.success) {
        setMessage(response.data.message);

        // Go to OTP verification page
        setTimeout(() => {
          navigate("/verify-reset-otp", {
            state: {
              email: email.trim(),
            },
          });
        }, 800);
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f3f7f6] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-6xl overflow-hidden rounded-[30px] bg-white shadow-[0_25px_80px_rgba(15,23,42,0.10)] grid lg:grid-cols-2">

        {/* LEFT */}
        <div className="relative hidden min-h-[680px] overflow-hidden bg-[#ecf8f5] p-12 lg:flex">
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#00a982]/10" />

          <div className="absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-[#00a982]/10" />

          <div className="relative z-10 flex w-full flex-col justify-between">

            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#00a982] text-white shadow-lg shadow-[#00a982]/20">
                <FiShield size={22} />
              </div>

              <div>
                <h1 className="text-xl font-extrabold tracking-tight text-[#111827]">
                  AuthFlow
                </h1>

                <p className="text-xs text-gray-500">
                  Secure authentication
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="max-w-md">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#00a982]/20 bg-white px-4 py-2 text-xs font-bold text-[#00a982] shadow-sm">
                <FiShield size={13} />
                Account Recovery
              </div>

              <h2 className="text-[48px] font-black leading-[1.05] tracking-tight text-[#111827]">
                Forgot your
                <br />
                <span className="text-[#00a982]">password?</span>
              </h2>

              <p className="mt-6 max-w-sm text-[15px] leading-7 text-gray-500">
                Don't worry. Enter your registered email address and
                we'll send you a secure OTP to reset your password.
              </p>

              <div className="mt-8 flex items-center gap-4 rounded-2xl border border-white bg-white/80 p-4 shadow-sm">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ecfdf5] text-[#00a982]">
                  <FiMail size={18} />
                </div>

                <div>
                  <p className="text-sm font-bold text-[#111827]">
                    Secure OTP recovery
                  </p>

                  <p className="mt-0.5 text-xs text-gray-500">
                    Your reset code will be valid for 10 minutes.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom */}
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <div className="h-2 w-2 rounded-full bg-[#00a982]" />
              Secure. Simple. AuthFlow.
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="px-6 py-10 sm:px-10 lg:px-14 lg:py-12">
          <div className="mx-auto max-w-md">

            {/* Mobile brand */}
            <div className="mb-10 flex items-center gap-3 lg:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#00a982] text-white">
                <FiShield size={22} />
              </div>

              <div>
                <h1 className="text-xl font-extrabold text-[#111827]">
                  AuthFlow
                </h1>

                <p className="text-xs text-gray-400">
                  Secure authentication
                </p>
              </div>
            </div>

            {/* Back */}
            <Link
              to="/login"
              className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-gray-500 transition hover:text-[#00a982]"
            >
              <FiArrowLeft size={16} />
              Back to login
            </Link>

            <div className="mb-8">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#00a982]">
                Reset password
              </p>

              <h2 className="mt-2 text-3xl font-black tracking-tight text-[#111827]">
                Find your account
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Enter the email address associated with your AuthFlow
                account.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {error}
              </div>
            )}

            {/* Success */}
            {message && (
              <div className="mb-5 rounded-2xl border border-green-100 bg-green-50 px-4 py-3 text-sm font-medium text-green-600">
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-bold text-[#111827]">
                  Email address
                </label>

                <div className="relative">
                  <FiMail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                      setMessage("");
                    }}
                    placeholder="Enter your email"
                    autoComplete="email"
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3.5 pl-11 pr-4 text-sm text-gray-900 outline-none transition focus:border-[#00a982] focus:bg-white focus:ring-4 focus:ring-[#00a982]/10"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-[#00a982] px-5 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-[#00a982]/20 transition hover:bg-[#008f70] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Sending OTP..." : "Send reset OTP"}

                {!loading && (
                  <FiArrowRight
                    size={17}
                    className="transition-transform group-hover:translate-x-1"
                  />
                )}
              </button>
            </form>

            <p className="mt-7 text-center text-xs leading-5 text-gray-400">
              For your security, we'll never reveal whether an email
              is registered with AuthFlow.
            </p>

          </div>
        </div>
      </div>
    </main>
  );
}

export default ForgotPassword;