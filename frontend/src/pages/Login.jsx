import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import GoogleAuthButton from "../components/GoogleAuthButton";
import { FaGithub } from "react-icons/fa";

import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // ================= HANDLE INPUT =================
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
  };

  // ================= VALIDATION =================
  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email.trim()
      )
    ) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    return newErrors;
  };

  // ================= LOGIN =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({});

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            email: formData.email.trim(),
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      // ================= BACKEND ERROR =================
      if (!response.ok) {
        setErrors({
          general:
            data.message ||
            "Login failed. Please try again.",
        });

        return;
      }

      console.log("Login successful:", data);

      // ================= LOGIN SUCCESS =================
      navigate("/profile");
    } catch (error) {
      console.error("Login error:", error);

      setErrors({
        general:
          "Unable to connect to server. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // ================= GITHUB LOGIN =================
  const handleGithubLogin = () => {
    window.location.href =
      `${import.meta.env.VITE_API_URL}/api/auth/github`;
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center justify-center">
        <div className="w-full rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50">

          {/* ================= LOGO ================= */}
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-400 text-white shadow-lg">
              <ShieldCheck size={25} />
            </div>

            <span className="text-2xl font-extrabold text-slate-800">
              AuthFlow
            </span>
          </div>

          {/* ================= HEADING ================= */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">
              Welcome Back
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Login to continue to your account.
            </p>
          </div>

          {/* ================= GENERAL ERROR ================= */}
          {errors.general && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {errors.general}
            </div>
          )}

          {/* ================= FORM ================= */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* ================= EMAIL ================= */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Email
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  className={`w-full rounded-xl border bg-white py-3.5 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:ring-4 ${
                    errors.email
                      ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                      : "border-slate-200 focus:border-emerald-400 focus:ring-emerald-100"
                  }`}
                />
              </div>

              {errors.email && (
                <p className="mt-2 text-xs font-medium text-red-500">
                  {errors.email}
                </p>
              )}
            </div>

            {/* ================= PASSWORD ================= */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="password"
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  className={`w-full rounded-xl border bg-white py-3.5 pl-11 pr-12 text-sm text-slate-800 outline-none transition focus:ring-4 ${
                    errors.password
                      ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                      : "border-slate-200 focus:border-emerald-400 focus:ring-emerald-100"
                  }`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (prev) => !prev
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              {errors.password && (
                <p className="mt-2 text-xs font-medium text-red-500">
                  {errors.password}
                </p>
              )}
            </div>

            {/* ================= FORGOT PASSWORD ================= */}
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm font-semibold text-emerald-600 transition hover:text-emerald-700"
              >
                Forgot Password?
              </Link>
            </div>

            {/* ================= LOGIN BUTTON ================= */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-200 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Logging in..."
                : "Login"}
            </button>
          </form>

          {/* ================= DIVIDER ================= */}
          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-200" />

            <span className="text-xs font-medium text-slate-400">
              OR
            </span>

            <div className="h-px flex-1 bg-slate-200" />
          </div>

          {/* ================= GOOGLE ================= */}
          <GoogleAuthButton />

          {/* ================= GITHUB ================= */}
          <button
            type="button"
            onClick={handleGithubLogin}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-slate-800 hover:shadow-md active:scale-[0.98]"
          >
            <FaGithub size={20} />
            <span>Continue with GitHub</span>
          </button>

          {/* ================= REGISTER ================= */}
          <p className="mt-7 text-center text-sm text-slate-500">
            Don't have an account?{" "}

            <Link
              to="/"
              className="font-semibold text-emerald-600 transition hover:text-emerald-700"
            >
              Create Account
            </Link>
          </p>

          {/* ================= CONTACT ================= */}
          <p className="mt-4 text-center text-xs text-slate-400">
            Need help?{" "}

            <Link
              to="/contact"
              className="font-medium text-slate-600 underline transition hover:text-emerald-600"
            >
              Contact Us
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;