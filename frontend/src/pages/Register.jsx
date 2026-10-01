import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaGithub } from "react-icons/fa";

import AuthLayout from "../components/AuthLayout";
import InputField from "../components/InputField";
import PasswordInput from "../components/PasswordInput";
import SocialButton from "../components/SocialButton";
import AuthButton from "../components/AuthButton";
import GoogleAuthButton from "../components/GoogleAuthButton";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Remove field error while typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Remove general error while typing
    if (errors.general) {
      setErrors((prev) => ({
        ...prev,
        general: "",
      }));
    }

    // Remove success message
    if (successMessage) {
      setSuccessMessage("");
    }
  };

  // ================= VALIDATION =================
  const validateForm = () => {
    const newErrors = {};

    // Name
    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name =
        "Name must contain at least 2 characters";
    }

    // Email
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email.trim()
      )
    ) {
      newErrors.email = "Please enter a valid email";
    }

    // Password
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password =
        "Password must be at least 8 characters";
    }

    return newErrors;
  };

  // ================= REGISTER =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous messages
    setErrors({});
    setSuccessMessage("");

    // Frontend validation
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name.trim(),
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
            "Registration failed. Please try again.",
        });

        return;
      }

      // ================= REGISTRATION SUCCESS =================
      console.log("Registration successful:", data);

      /*
        Registration successful ka matlab abhi
        account create nahi hua hai.

        Backend ne PendingVerification me data save
        kiya hai aur OTP email par bheja hai.

        Isliye user ko Verify Email page par bhejenge.
      */

      navigate("/verify-email", {
        state: {
          email:
            data.email ||
            formData.email.trim(),
        },
      });
    } catch (error) {
      console.error("Registration error:", error);

      setErrors({
        general:
          "Unable to connect to server. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // ================= GITHUB =================
  const handleGithubSignup = () => {
    window.location.href =
      `${import.meta.env.VITE_API_URL}/api/auth/github`;
  };

  // ================= APPLE =================
  const handleAppleSignup = () => {
    console.log("Apple Signup");
  };

  return (
    <AuthLayout>
      {/* ================= LOGO ================= */}
      <div className="mb-8 flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 text-xl">
          🔐
        </div>

        <span className="text-xl font-bold text-slate-800">
          AuthFlow
        </span>
      </div>

      {/* ================= HEADING ================= */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900">
          Create Your Account
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Sign up in seconds to get started.
        </p>
      </div>

      {/* ================= GENERAL ERROR ================= */}
      {errors.general && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {errors.general}
        </div>
      )}

      {/* ================= SUCCESS ================= */}
      {successMessage && (
        <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-600">
          {successMessage}
        </div>
      )}

      {/* ================= FORM ================= */}
      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        {/* Name */}
        <InputField
          label="Full Name"
          name="name"
          placeholder="John Doe"
          value={formData.name}
          onChange={handleChange}
          icon="👤"
          error={errors.name}
        />

        {/* Email */}
        <InputField
          label="Work Email"
          name="email"
          type="email"
          placeholder="john@company.com"
          value={formData.email}
          onChange={handleChange}
          icon="✉️"
          error={errors.email}
        />

        {/* Password */}
        <PasswordInput
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
        />

        {/* Submit */}
        <AuthButton type="submit">
          {loading
            ? "Sending Verification Code..."
            : "Create Account"}
        </AuthButton>
      </form>

      {/* ================= DIVIDER ================= */}
      <div className="my-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-slate-200" />

        <span className="text-xs text-slate-400">
          OR
        </span>

        <div className="h-px flex-1 bg-slate-200" />
      </div>

      {/* ================= GOOGLE ================= */}
      <GoogleAuthButton />

      {/* ================= OTHER PROVIDERS ================= */}
      <div className="mt-6 flex gap-3">
       <button
  type="button"
  onClick={handleGithubSignup}
  className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-slate-800 hover:shadow-md active:scale-[0.98]"
>
  <FaGithub size={20} />
  <span>Continue with GitHub</span>
</button>

       
      </div>

      {/* ================= TERMS ================= */}
      <p className="mt-6 text-center text-xs leading-relaxed text-slate-400">
        By signing up, you agree to our{" "}

        <Link
          to="/terms"
          className="font-medium text-slate-600 underline hover:text-emerald-600"
        >
          Terms of Service
        </Link>{" "}

        and{" "}

        <Link
          to="/privacy"
          className="font-medium text-slate-600 underline hover:text-emerald-600"
        >
          Privacy Policy
        </Link>
      </p>

      {/* ================= LOGIN ================= */}
      <p className="mt-5 text-center text-sm text-slate-500">
        Already have an account?{" "}

        <Link
          to="/login"
          className="font-semibold text-emerald-600 hover:text-emerald-700"
        >
          Log In
        </Link>
      </p>

      {/* ================= HELP ================= */}
      <p className="mt-4 text-center text-xs text-slate-400">
        Need help?{" "}

        <Link
          to="/contact"
          className="font-medium text-slate-600 underline hover:text-emerald-600"
        >
          Contact Us
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Register;