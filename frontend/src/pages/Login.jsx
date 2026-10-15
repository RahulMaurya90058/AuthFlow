import { useEffect, useState } from "react";

import { Link, useNavigate, useSearchParams } from "react-router-dom";

import axios from "axios";

import { GoogleLogin } from "@react-oauth/google";

import {
  FiArrowRight,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiShield,
  FiUserPlus,
} from "react-icons/fi";

import { FaGithub } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;

function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);

  // ==========================================
  // GITHUB CALLBACK ERROR
  // ==========================================

  useEffect(() => {
    const githubError = searchParams.get("error");

    if (!githubError) {
      return;
    }

    const githubErrors = {
      github_auth_failed:
        "GitHub authentication failed. Please try again.",

      invalid_github_state:
        "GitHub authentication session expired or is invalid. Please try again.",

      github_token_failed:
        "Unable to connect with GitHub. Please try again.",

      github_email_not_verified:
        "No verified email was found on your GitHub account.",
    };

    setError(
      githubErrors[githubError] ||
        "GitHub login failed. Please try again."
    );

    // URL se error remove kar do
    navigate("/login", {
      replace: true,
    });
  }, [searchParams, navigate]);

  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  // ==========================================
  // NORMAL LOGIN
  // ==========================================

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await axios.post(
        `${API_URL}/api/auth/login`,
        {
          email: formData.email,
          password: formData.password,
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
      console.error("Login Error:", error);

      setError(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // GOOGLE LOGIN
  // ==========================================

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setGoogleLoading(true);
      setError("");

      if (!credentialResponse?.credential) {
        setError(
          "Google authentication failed. Please try again."
        );
        return;
      }

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
      console.error("Google Login Error:", error);

      setError(
        error.response?.data?.message ||
          "Google login failed. Please try again."
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  // ==========================================
  // GITHUB LOGIN
  // ==========================================

  const handleGithubLogin = () => {
    if (loading || googleLoading || githubLoading) {
      return;
    }

    setError("");
    setGithubLoading(true);

    // Backend GitHub OAuth start endpoint
    window.location.assign(
      `${API_URL}/api/auth/github`
    );
  };

  return (
    <main className="min-h-screen bg-[#f3f7f6] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-6xl overflow-hidden rounded-[30px] bg-white shadow-[0_25px_80px_rgba(15,23,42,0.10)] grid lg:grid-cols-2">

        {/* ==========================================
            LEFT — BRANDING
        ========================================== */}

        <div className="relative hidden lg:flex min-h-[720px] overflow-hidden bg-[#ecf8f5] p-12">

          {/* Decorative shapes */}

          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#00a982]/10" />

          <div className="absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-[#00a982]/10" />

          <div className="absolute top-1/2 right-[-100px] h-56 w-56 -translate-y-1/2 rounded-full border-[35px] border-[#00a982]/10" />

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

            {/* Main content */}

            <div className="max-w-md">

              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#00a982]/20 bg-white px-4 py-2 text-xs font-bold text-[#00a982] shadow-sm">
                <FiLock size={13} />
                Secure Sign In
              </div>

              <h2 className="text-[48px] font-black leading-[1.05] tracking-tight text-[#111827]">
                Welcome
                <br />
                <span className="text-[#00a982]">
                  back.
                </span>
              </h2>

              <p className="mt-6 max-w-sm text-[15px] leading-7 text-gray-500">
                Sign in to your AuthFlow account and continue
                your journey with a secure and simple
                authentication experience.
              </p>

              {/* Feature cards */}

              <div className="mt-8 space-y-3">

                <div className="flex items-center gap-4 rounded-2xl border border-white bg-white/80 p-4 shadow-sm">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ecfdf5] text-[#00a982]">
                    <FiShield size={18} />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-[#111827]">
                      Secure authentication
                    </p>

                    <p className="mt-0.5 text-xs text-gray-500">
                      Your account stays protected.
                    </p>
                  </div>

                </div>

                <div className="flex items-center gap-4 rounded-2xl border border-white bg-white/80 p-4 shadow-sm">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ecfdf5] text-[#00a982]">
                    <FiMail size={18} />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-[#111827]">
                      Verified account
                    </p>

                    <p className="mt-0.5 text-xs text-gray-500">
                      Email verification keeps your account safe.
                    </p>
                  </div>

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

        {/* ==========================================
            RIGHT — LOGIN
        ========================================== */}

        <div className="px-6 py-10 sm:px-10 lg:px-14 lg:py-12">

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

          <div className="mx-auto max-w-md">

            {/* Heading */}

            <div className="mb-8">

              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#00a982]">
                Sign in
              </p>

              <h2 className="mt-2 text-3xl font-black tracking-tight text-[#111827]">
                Welcome back
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Enter your credentials to access your AuthFlow
                account.
              </p>

            </div>

            {/* Error */}

            {error && (
              <div className="mb-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {error}
              </div>
            )}

            {/* ==========================================
                NORMAL LOGIN FORM
            ========================================== */}

            <form
              onSubmit={handleLogin}
              className="space-y-5"
            >

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
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    autoComplete="email"
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3.5 pl-11 pr-4 text-sm text-gray-900 outline-none transition focus:border-[#00a982] focus:bg-white focus:ring-4 focus:ring-[#00a982]/10"
                  />

                </div>

              </div>

              {/* Password */}

              <div>

                <div className="mb-2 flex items-center justify-between">

                  <label className="block text-sm font-bold text-[#111827]">
                    Password
                  </label>

                  <button
                    type="button"
                    onClick={() =>
                      navigate("/forgot-password")
                    }
                    className="text-xs font-bold text-[#00a982] hover:underline"
                  >
                    Forgot password?
                  </button>

                </div>

                <div className="relative">

                  <FiLock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3.5 pl-11 pr-12 text-sm text-gray-900 outline-none transition focus:border-[#00a982] focus:bg-white focus:ring-4 focus:ring-[#00a982]/10"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => !prev)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-[#00a982]"
                  >
                    {showPassword ? (
                      <FiEyeOff size={18} />
                    ) : (
                      <FiEye size={18} />
                    )}
                  </button>

                </div>

              </div>

              {/* Login */}

              <button
                type="submit"
                disabled={
                  loading ||
                  googleLoading ||
                  githubLoading
                }
                className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-[#00a982] px-5 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-[#00a982]/20 transition hover:bg-[#008f70] disabled:cursor-not-allowed disabled:opacity-60"
              >

                {loading
                  ? "Signing in..."
                  : "Sign in"}

                {!loading && (
                  <FiArrowRight
                    size={17}
                    className="transition-transform group-hover:translate-x-1"
                  />
                )}

              </button>

            </form>

            {/* Divider */}

            <div className="my-7 flex items-center gap-4">

              <div className="h-px flex-1 bg-gray-200" />

              <span className="text-xs font-semibold text-gray-400">
                OR
              </span>

              <div className="h-px flex-1 bg-gray-200" />

            </div>

            {/* ==========================================
                GOOGLE LOGIN
            ========================================== */}

            <div className="flex w-full justify-center">

              {googleLoading ? (

                <div className="flex h-11 w-full items-center justify-center rounded-2xl border border-gray-200 text-sm font-bold text-gray-500">
                  Signing in with Google...
                </div>

              ) : (

                <div className="w-full">

                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => {
                      setError(
                        "Google Login Failed. Please try again."
                      );
                    }}
                    width="100%"
                    theme="outline"
                    shape="pill"
                    text="continue_with"
                  />

                </div>

              )}

            </div>

            {/* ==========================================
                GITHUB LOGIN
            ========================================== */}

            <button
              type="button"
              onClick={handleGithubLogin}
              disabled={
                loading ||
                googleLoading ||
                githubLoading
              }
              className="mt-3 flex w-full items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-3.5 text-sm font-bold text-[#111827] transition hover:border-[#111827] hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >

              {githubLoading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-[#111827]" />
                  Connecting to GitHub...
                </>
              ) : (
                <>
                  <FaGithub size={19} />
                  Continue with GitHub
                </>
              )}

            </button>

            {/* Register */}

            <Link
              to="/"
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 px-5 py-3.5 text-sm font-bold text-[#111827] transition hover:border-[#00a982] hover:text-[#00a982]"
            >
              <FiUserPlus size={17} />
              Create a new account
            </Link>

            {/* Terms */}

            <p className="mt-7 text-center text-xs leading-5 text-gray-400">
              By continuing, you agree to AuthFlow's terms
              and privacy policy.
            </p>

          </div>
        </div>

      </div>
    </main>
  );
}

export default Login;