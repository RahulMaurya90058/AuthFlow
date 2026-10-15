import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";

import {
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiEye,
  FiEyeOff,
  FiShield,
  FiCheck,
} from "react-icons/fi";

import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
const API_URL = import.meta.env.VITE_API_URL;

const Signup = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [accepted, setAccepted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // PASSWORD STRENGTH
  // ==========================================

  const passwordStrength =
    formData.password.length === 0
      ? 0
      : formData.password.length < 6
      ? 1
      : formData.password.length < 10
      ? 2
      : 3;

  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  // ==========================================
  // REGISTER USER
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // Terms validation
    if (!accepted) {
      setError(
        "Please accept the Terms of Service and Privacy Policy."
      );
      return;
    }

    // Password validation
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
         `${API_URL}/api/auth/register`,
        formData
      );

      console.log("Register Response:", response.data);

      if (response.data.success) {
        // Email save karo
        const registeredEmail = formData.email;

        // Form clear karo
        setFormData({
          name: "",
          email: "",
          mobile: "",
          password: "",
          confirmPassword: "",
        });

        setAccepted(false);

        // Direct OTP page par jana hai
        navigate("/verify-email", {
          state: {
            email: registeredEmail,
          },
        });
      }
    } catch (error) {
      console.error("Signup Error:", error);

      setError(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // GOOGLE SIGNUP
  // ==========================================

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setError("");

      const response = await axios.post(
        `${API_URL}/api/auth/google`,
        {
          credential: credentialResponse.credential,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        navigate("/dashboard", {
          state: {
            user: response.data.user,
          },
        });
      }
    } catch (error) {
      console.error("Google Signup Error:", error);

      setError(
        error.response?.data?.message ||
          "Google signup failed. Please try again."
      );
    }
  };

  // ==========================================
  // GITHUB SIGNUP
  // ==========================================

  const handleGithubLogin = () => {
    setError("");

    window.location.href =
      `${API_URL}/api/auth/github`;
  };

  return (
    <main className="min-h-screen bg-[#edf5f3] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-[1100px] overflow-hidden rounded-[30px] bg-white shadow-[0_30px_80px_rgba(15,23,42,0.15)] border border-white">
        <div className="grid md:grid-cols-2">

          {/* ==========================================
              LEFT SECTION
          ========================================== */}

          <section className="relative min-h-[500px] md:min-h-[720px] overflow-hidden bg-gradient-to-br from-[#b9f1db] via-[#c4f5f5] to-[#ffd39b] px-8 py-12 flex flex-col justify-center items-center text-center">

            {/* Decorations */}

            <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-white/10" />

            <div className="absolute top-16 right-[-70px] w-44 h-44 rounded-full bg-white/10" />

            <div className="absolute bottom-[-90px] left-[-50px] w-64 h-64 rounded-full bg-white/10" />

            {/* Shield */}

            <div className="relative z-10 mb-10">

              <div className="w-[86px] h-[86px] rounded-[25px] bg-white/35 backdrop-blur-md border border-white/30 shadow-[0_15px_35px_rgba(0,0,0,0.08)] flex items-center justify-center">
                <FiShield
                  size={42}
                  strokeWidth={1.7}
                  className="text-white drop-shadow-sm"
                />
              </div>

              <div className="absolute -right-2 -bottom-2 w-7 h-7 rounded-full bg-[#08cfa8] border-4 border-[#c3f3e8] flex items-center justify-center">
                <FiCheck
                  size={13}
                  className="text-white"
                />
              </div>

            </div>

            {/* Left Content */}

            <div className="relative z-10 max-w-[430px]">

              <p className="uppercase tracking-[4px] text-[11px] font-semibold text-black/45 mb-5">
                Secure Authentication
              </p>

              <h1 className="text-[42px] sm:text-[48px] leading-[1.08] tracking-[-2px] font-semibold text-[#101418]">
                Join AuthFlow
                <br />
                Today!
              </h1>

              <p className="mt-7 text-[16px] sm:text-[17px] leading-7 text-white/95">
                One simple authentication system for all your
                applications. Secure, fast and developer friendly.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-2">

                <span className="px-4 py-2 rounded-full bg-white/30 backdrop-blur-sm text-[12px] font-medium text-white">
                  Secure
                </span>

                <span className="px-4 py-2 rounded-full bg-white/30 backdrop-blur-sm text-[12px] font-medium text-white">
                  Fast
                </span>

                <span className="px-4 py-2 rounded-full bg-white/30 backdrop-blur-sm text-[12px] font-medium text-white">
                  Developer Friendly
                </span>

              </div>

            </div>

            {/* Bottom Shapes */}

            <div className="absolute bottom-24 left-[15%] w-24 h-24 rounded-[22px] bg-white/30 rotate-12" />

            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full bg-[#f3c879]/90" />

            <div className="absolute bottom-24 right-[18%] w-24 h-24 rounded-[22px] bg-[#8de0d7]/70 -rotate-12" />

          </section>

          {/* ==========================================
              RIGHT SECTION
          ========================================== */}

          <section className="bg-white px-6 sm:px-10 lg:px-14 py-10 flex items-center">

            <div className="w-full max-w-[410px] mx-auto">

              {/* Brand */}

              <div className="flex justify-center items-center gap-3 mb-7">

                <div className="w-11 h-11 rounded-[13px] bg-gradient-to-br from-[#00d8a8] to-[#08bfd3] flex items-center justify-center shadow-[0_8px_20px_rgba(0,205,168,0.22)]">
                  <FiShield
                    size={22}
                    strokeWidth={2}
                    className="text-white"
                  />
                </div>

                <span className="text-[23px] font-bold tracking-[-0.5px] text-[#263249]">
                  AuthFlow
                </span>

              </div>

              {/* Heading */}

              <div className="text-center mb-7">

                <h2 className="text-[25px] font-semibold tracking-[-0.5px] text-[#111827]">
                  Create Your Account
                </h2>

                <p className="mt-2 text-[14px] text-[#71809a]">
                  Sign up in seconds to get started.
                </p>

              </div>

              {/* Error */}

              {error && (
                <div className="mb-5 rounded-[11px] border border-red-200 bg-red-50 px-4 py-3 text-center text-[13px] font-medium text-red-600">
                  {error}
                </div>
              )}

              {/* ==========================================
                  FORM
              ========================================== */}

              <form
                onSubmit={handleSubmit}
                className="space-y-4"
              >

                {/* Full Name */}

                <Input
                  label="Full Name"
                  icon={<FiUser />}
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                />

                {/* Email */}

                <Input
                  label="Work Email"
                  icon={<FiMail />}
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@company.com"
                />

                {/* Mobile */}

                <Input
                  label="Mobile Number"
                  icon={<FiPhone />}
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="+91 9876543210"
                />

                {/* Password */}

                <div>

                  <label className="block text-[13px] font-semibold text-[#3c4b63] mb-2">
                    Password
                  </label>

                  <div className="relative">

                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8390a6]" />

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a password"
                      className="w-full h-[51px] rounded-[13px] border border-[#dce3ec] pl-11 pr-11 text-[14px] text-[#27344a] placeholder:text-[#9aa8bc] outline-none transition focus:border-[#00cba6] focus:ring-4 focus:ring-[#00cba6]/10"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8390a6] hover:text-[#263249]"
                    >
                      {showPassword ? (
                        <FiEyeOff />
                      ) : (
                        <FiEye />
                      )}
                    </button>

                  </div>

                  {/* Password Strength */}

                  {formData.password && (
                    <div className="mt-2 flex gap-1.5">

                      {[1, 2, 3].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full transition ${
                            passwordStrength >= level
                              ? level === 1
                                ? "bg-red-400"
                                : level === 2
                                ? "bg-yellow-400"
                                : "bg-[#00cba6]"
                              : "bg-[#e6ebf1]"
                          }`}
                        />
                      ))}

                    </div>
                  )}

                </div>

                {/* Confirm Password */}

                <div>

                  <label className="block text-[13px] font-semibold text-[#3c4b63] mb-2">
                    Confirm Password
                  </label>

                  <div className="relative">

                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8390a6]" />

                    <input
                      type={
                        showConfirm
                          ? "text"
                          : "password"
                      }
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      className="w-full h-[51px] rounded-[13px] border border-[#dce3ec] pl-11 pr-11 text-[14px] text-[#27344a] placeholder:text-[#9aa8bc] outline-none transition focus:border-[#00cba6] focus:ring-4 focus:ring-[#00cba6]/10"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirm(!showConfirm)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8390a6]"
                    >
                      {showConfirm ? (
                        <FiEyeOff />
                      ) : (
                        <FiEye />
                      )}
                    </button>

                  </div>

                </div>

                {/* Terms */}

                <label className="flex items-start gap-3 cursor-pointer pt-1">

                  <input
                    type="checkbox"
                    checked={accepted}
                    onChange={(e) =>
                      setAccepted(e.target.checked)
                    }
                    className="mt-0.5 w-4 h-4 accent-[#00cba6] cursor-pointer"
                  />

                  <span className="text-[12px] leading-5 text-[#71809a]">

                    I agree to the{" "}

                    <span className="font-semibold text-[#00a982]">
                      Terms of Service
                    </span>

                    {" "}and{" "}

                    <span className="font-semibold text-[#00a982]">
                      Privacy Policy
                    </span>

                  </span>

                </label>

                {/* Create Account */}

                <button
                  type="submit"
                  disabled={loading || !accepted}
                  className="w-full h-[52px] rounded-[13px] bg-[#00cba6] text-white text-[14px] font-bold shadow-[0_8px_22px_rgba(0,203,166,0.25)] hover:bg-[#00b995] disabled:opacity-50 disabled:cursor-not-allowed transition active:scale-[0.99]"
                >
                  {loading
                    ? "Creating Account..."
                    : "Create Account"}
                </button>

              </form>

              {/* Divider */}

              <div className="flex items-center gap-4 my-6">

                <div className="flex-1 h-px bg-[#e1e6ed]" />

                <span className="text-[11px] font-medium text-[#91a0b6]">
                  OR CONTINUE WITH
                </span>

                <div className="flex-1 h-px bg-[#e1e6ed]" />

              </div>

              {/* ==========================================
                  SOCIAL LOGIN
              ========================================== */}

              <div className="grid grid-cols-2 gap-3">

                {/* Google */}

                <div className="w-full flex justify-center overflow-hidden rounded-[4px]">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => {
                      setError(
                        "Google Login Failed. Please try again."
                      );
                    }}
                    width="190"
                    text="continue_with"
                    shape="rectangular"
                    theme="outline"
                    size="large"
                  />
                </div>

                {/* GitHub */}

                <button
                  type="button"
                  onClick={handleGithubLogin}
                  className="w-full h-[40px] rounded-[4px] border border-[#dadce0] bg-white flex items-center justify-center gap-3 text-[14px] font-medium text-[#3c4043] hover:bg-[#f8f9fa] transition active:scale-[0.99]"
                >
                  <FaGithub
                    size={19}
                    className="text-[#24292f]"
                  />

                  <span>
                    Continue with GitHub
                  </span>
                </button>

              </div>

              {/* Login */}

              <p className="text-center mt-6 text-[13px] text-[#71809a]">

                Already have an account?{" "}

                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-sm font-bold text-[#00a982] hover:underline"
                >
                  Login
                </button>

              </p>

              {/* Security Message */}

              <p className="text-center mt-2 text-[11px] text-[#9aa6b8]">
                Your information is encrypted and securely stored.
              </p>

            </div>

          </section>

        </div>
      </div>
    </main>
  );
};

// ==========================================
// REUSABLE INPUT COMPONENT
// ==========================================

const Input = ({
  label,
  icon,
  type = "text",
  placeholder,
  name,
  value,
  onChange,
}) => {
  return (
    <div>

      <label className="block text-[13px] font-semibold text-[#3c4b63] mb-2">
        {label}
      </label>

      <div className="relative">

        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8390a6]">
          {icon}
        </div>

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full h-[51px] rounded-[13px] border border-[#dce3ec] pl-11 pr-4 text-[14px] text-[#27344a] placeholder:text-[#9aa8bc] outline-none transition focus:border-[#00cba6] focus:ring-4 focus:ring-[#00cba6]/10"
        />

      </div>

    </div>
  );
};

export default Signup;