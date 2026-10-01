import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, KeyRound, Mail, ShieldCheck } from "lucide-react";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateEmail = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
      newErrors.email = "Please enter a valid email";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    setEmail(e.target.value);

    if (errors.email || errors.general) {
      setErrors({
        email: "",
        general: "",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const validationErrors = validateEmail();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setErrors({
          general:
            data.message ||
            "Unable to process your request. Please try again.",
        });
        return;
      }

      // Move to OTP verification page
      navigate("/verify-reset-otp", {
        state: {
          email: email.trim(),
        },
      });
    } catch (error) {
      console.error("Forgot password error:", error);

      setErrors({
        general:
          "Unable to connect to server. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Back to Login */}
        <Link
          to="/login"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-emerald-600"
        >
          <ArrowLeft size={18} />
          Back to Login
        </Link>

        {/* Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/50 sm:p-8">
          {/* Icon */}
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <KeyRound size={32} />
            </div>
          </div>

          {/* Heading */}
          <div className="mb-7 text-center">
            <h1 className="text-2xl font-bold text-slate-900">
              Forgot Password?
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Enter your registered email address and we'll
              send you a verification code to reset your
              password.
            </p>
          </div>

          {/* General Error */}
          {errors.general && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {errors.general}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={19}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  autoComplete="email"
                  className={`w-full rounded-xl border bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 ${
                    errors.email
                      ? "border-red-400 focus:border-red-500"
                      : "border-slate-200 focus:border-emerald-500"
                  }`}
                />
              </div>

              {errors.email && (
                <p className="mt-1.5 text-xs text-red-500">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <ShieldCheck size={19} />

              {loading
                ? "Sending OTP..."
                : "Send Verification Code"}
            </button>
          </form>

          {/* Login Link */}
          <p className="mt-6 text-center text-sm text-slate-500">
            Remember your password?{" "}
            <Link
              to="/login"
              className="font-semibold text-emerald-600 hover:text-emerald-700"
            >
              Log In
            </Link>
          </p>
        </div>

        {/* Security Note */}
        <p className="mt-5 text-center text-xs leading-5 text-slate-400">
          For your security, we'll never reveal whether an
          account exists for an email address.
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;