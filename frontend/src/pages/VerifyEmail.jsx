import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Mail,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(600);

  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [resendCooldown, setResendCooldown] = useState(0);

  // =========================================
  // CHECK EMAIL
  // =========================================

  useEffect(() => {
    if (!email) {
      navigate("/");
    }
  }, [email, navigate]);

  // =========================================
  // OTP TIMER
  // =========================================

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // =========================================
  // RESEND COOLDOWN
  // =========================================

  useEffect(() => {
    if (resendCooldown <= 0) return;

    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCooldown]);

  // =========================================
  // FORMAT TIME
  // =========================================

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  // =========================================
  // OTP INPUT
  // =========================================

  const handleOTPChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");

    if (value.length <= 6) {
      setOtp(value);
      setError("");
      setSuccess("");
    }
  };

  // =========================================
  // VERIFY OTP
  // =========================================

  const handleVerify = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (otp.length !== 6) {
      setError("Please enter the 6-digit OTP");
      return;
    }

    if (timeLeft <= 0) {
      setError("OTP has expired. Please request a new OTP.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/verify-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Invalid OTP");
        return;
      }

      setSuccess("Email verified successfully!");

      // Temporary redirect
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error("Verify OTP error:", error);

      setError(
        "Unable to verify OTP. Please check your internet connection."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // RESEND OTP
  // =========================================

  const handleResendOTP = async () => {
    if (resendCooldown > 0 || resendLoading) return;

    setError("");
    setSuccess("");

    try {
      setResendLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/resend-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to resend OTP");
        return;
      }

      // Restart 10 minute timer
      setTimeLeft(600);

      // 30 second resend cooldown
      setResendCooldown(30);

      // Clear old OTP
      setOtp("");

      setSuccess("A new OTP has been sent to your email.");
    } catch (error) {
      console.error("Resend OTP error:", error);

      setError(
        "Unable to resend OTP. Please check your internet connection."
      );
    } finally {
      setResendLoading(false);
    }
  };

  // =========================================
  // UI
  // =========================================

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center justify-center">
        <div className="w-full rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50">
          
          {/* Logo */}
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-400 text-white shadow-lg">
              <ShieldCheck size={25} />
            </div>

            <span className="text-2xl font-extrabold text-slate-800">
              AuthFlow
            </span>
          </div>

          {/* Icon */}
          <div className="mb-6 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
              <Mail
                size={38}
                className="text-emerald-500"
              />
            </div>
          </div>

          {/* Heading */}
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-slate-900">
              Verify Your Email
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              We've sent a 6-digit verification code to
            </p>

            <p className="mt-1 break-all text-sm font-semibold text-slate-700">
              {email}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-600">
              {success}
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleVerify}
            className="mt-7"
          >
            <label
              htmlFor="otp"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Enter Verification Code
            </label>

            <input
              id="otp"
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={handleOTPChange}
              placeholder="Enter 6-digit OTP"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-center text-xl font-bold tracking-[0.5em] text-slate-800 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
            />

            {/* Timer */}
            <div className="mt-5 text-center">
              {timeLeft > 0 ? (
                <p className="text-sm text-slate-500">
                  OTP expires in{" "}
                  <span className="font-bold text-emerald-600">
                    {formatTime(timeLeft)}
                  </span>
                </p>
              ) : (
                <p className="text-sm font-semibold text-red-500">
                  OTP has expired
                </p>
              )}
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              disabled={loading || timeLeft <= 0}
              className="mt-6 w-full rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-200 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify Email"}
            </button>
          </form>

          {/* Resend */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500">
              Didn't receive the code?
            </p>

            <button
              type="button"
              onClick={handleResendOTP}
              disabled={
                resendCooldown > 0 || resendLoading
              }
              className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-emerald-600 transition hover:text-emerald-700 disabled:cursor-not-allowed disabled:text-slate-400"
            >
              <RefreshCw
                size={16}
                className={
                  resendLoading
                    ? "animate-spin"
                    : ""
                }
              />

              {resendLoading
                ? "Sending..."
                : resendCooldown > 0
                ? `Resend OTP in ${resendCooldown}s`
                : "Resend OTP"}
            </button>
          </div>

          {/* Back */}
          <button
            type="button"
            onClick={() => navigate("/")}
            className="mx-auto mt-7 flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-800"
          >
            <ArrowLeft size={16} />
            Back to registration
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;