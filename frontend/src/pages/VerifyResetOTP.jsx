import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FiArrowLeft,
  FiArrowRight,
  FiMail,
  FiShield,
} from "react-icons/fi";

const API_URL = import.meta.env.VITE_API_URL;

function VerifyResetOTP() {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const inputRefs = useRef([]);

  useEffect(() => {
    if (!email) {
      navigate("/forgot-password", { replace: true });
    }
  }, [email, navigate]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) {
      return;
    }

    const digit = value.slice(-1);

    const newOtp = [...otp];
    newOtp[index] = digit;

    setOtp(newOtp);
    setError("");
    setMessage("");

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();

    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pastedData) {
      return;
    }

    const newOtp = ["", "", "", "", "", ""];

    pastedData.split("").forEach((digit, index) => {
      newOtp[index] = digit;
    });

    setOtp(newOtp);
    setError("");
    setMessage("");

    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleVerify = async (e) => {
    e.preventDefault();

    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      setError("Please enter the complete 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const response = await axios.post(
         `${API_URL}/api/auth/verify-reset-otp`,
        {
          email,
          otp: enteredOtp,
        }
      );

      if (response.data.success) {
        const resetToken = response.data.resetToken;

        if (!resetToken) {
          setError(
            "Reset session could not be created. Please request a new OTP."
          );
          return;
        }

        setMessage("OTP verified successfully.");

        setTimeout(() => {
          navigate("/reset-password", {
            state: {
              email,
              resetToken,
            },
          });
        }, 500);
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to verify OTP. Please try again."
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

            <div className="max-w-md">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#00a982]/20 bg-white px-4 py-2 text-xs font-bold text-[#00a982] shadow-sm">
                <FiShield size={13} />
                Verify Identity
              </div>

              <h2 className="text-[48px] font-black leading-[1.05] tracking-tight text-[#111827]">
                Check your
                <br />
                <span className="text-[#00a982]">email.</span>
              </h2>

              <p className="mt-6 max-w-sm text-[15px] leading-7 text-gray-500">
                We've sent a 6-digit verification code to your
                registered email address.
              </p>

              <div className="mt-8 flex items-center gap-4 rounded-2xl border border-white bg-white/80 p-4 shadow-sm">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ecfdf5] text-[#00a982]">
                  <FiMail size={18} />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-bold text-[#111827]">
                    Verification code
                  </p>

                  <p className="mt-0.5 truncate text-xs text-gray-500">
                    {email}
                  </p>
                </div>
              </div>
            </div>

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
              to="/forgot-password"
              className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-gray-500 transition hover:text-[#00a982]"
            >
              <FiArrowLeft size={16} />
              Change email
            </Link>

            <div className="mb-8">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#00a982]">
                Verification
              </p>

              <h2 className="mt-2 text-3xl font-black tracking-tight text-[#111827]">
                Enter your OTP
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Enter the 6-digit code sent to your email.
              </p>

              <p className="mt-2 break-all text-sm font-bold text-[#111827]">
                {email}
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

            <form onSubmit={handleVerify}>

              {/* OTP */}
              <div className="flex justify-between gap-2 sm:gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(element) => {
                      inputRefs.current[index] = element;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) =>
                      handleChange(index, e.target.value)
                    }
                    onKeyDown={(e) =>
                      handleKeyDown(index, e)
                    }
                    onPaste={handlePaste}
                    className="h-14 w-12 rounded-2xl border border-gray-200 bg-gray-50 text-center text-xl font-black text-[#111827] outline-none transition focus:border-[#00a982] focus:bg-white focus:ring-4 focus:ring-[#00a982]/10 sm:h-16 sm:w-14"
                  />
                ))}
              </div>

              {/* Verify */}
              <button
                type="submit"
                disabled={loading}
                className="group mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#00a982] px-5 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-[#00a982]/20 transition hover:bg-[#008f70] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Verifying..." : "Verify OTP"}

                {!loading && (
                  <FiArrowRight
                    size={17}
                    className="transition-transform group-hover:translate-x-1"
                  />
                )}
              </button>
            </form>

            <p className="mt-7 text-center text-xs leading-5 text-gray-400">
              The OTP is valid for 10 minutes. Never share your
              verification code with anyone.
            </p>

          </div>
        </div>
      </div>
    </main>
  );
}

export default VerifyResetOTP;