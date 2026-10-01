import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, KeyRound, ShieldCheck } from "lucide-react";

const VerifyResetOTP = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [timeLeft, setTimeLeft] = useState(600);
  const [resendCooldown, setResendCooldown] = useState(300);

  // Redirect if email is missing
  useEffect(() => {
    if (!email) {
      navigate("/forgot-password", { replace: true });
    }
  }, [email, navigate]);

  // OTP expiry timer
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;

    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCooldown]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");

    if (value.length <= 6) {
      setOtp(value);

      if (errors.otp || errors.general) {
        setErrors({
          otp: "",
          general: "",
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (otp.length !== 6) {
      setErrors({
        otp: "Please enter the 6-digit verification code",
      });
      return;
    }

    if (timeLeft <= 0) {
      setErrors({
        general:
          "This verification code has expired. Please request a new one.",
      });
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/verify-reset-otp",
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
        setErrors({
          general:
            data.message ||
            "Invalid verification code. Please try again.",
        });
        return;
      }

      // OTP verified successfully
      navigate("/reset-password", {
        state: {
          email,
          otp,
        },
      });
    } catch (error) {
      console.error("Verify reset OTP error:", error);

      setErrors({
        general:
          "Unable to connect to server. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;

    setErrors({});

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/resend-reset-otp",
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
        setErrors({
          general:
            data.message ||
            "Unable to resend verification code.",
        });
        return;
      }

      setOtp("");
      setTimeLeft(600);
      setResendCooldown(30);
    } catch (error) {
      console.error("Resend reset OTP error:", error);

      setErrors({
        general:
          "Unable to connect to server. Please try again.",
      });
    }
  };

  if (!email) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Back */}
        <Link
          to="/forgot-password"
          state={{ email }}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-emerald-600"
        >
          <ArrowLeft size={18} />
          Change Email
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
              Verify Reset Code
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Enter the 6-digit code sent to
            </p>

            <p className="mt-1 break-all text-sm font-semibold text-slate-700">
              {email}
            </p>
          </div>

          {/* General Error */}
          {errors.general && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* OTP */}
            <div>
              <label
                htmlFor="otp"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Verification Code
              </label>

              <input
                id="otp"
                name="otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={otp}
                onChange={handleOtpChange}
                placeholder="000000"
                className={`w-full rounded-xl border bg-white px-4 py-4 text-center text-2xl font-bold tracking-[0.5em] text-slate-900 outline-none transition placeholder:text-slate-300 ${
                  errors.otp
                    ? "border-red-400 focus:border-red-500"
                    : "border-slate-200 focus:border-emerald-500"
                }`}
              />

              {errors.otp && (
                <p className="mt-1.5 text-xs text-red-500">
                  {errors.otp}
                </p>
              )}
            </div>

            {/* Timer */}
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-slate-500">
                Code expires in
              </span>

              <span
                className={`font-semibold ${
                  timeLeft <= 60
                    ? "text-red-500"
                    : "text-emerald-600"
                }`}
              >
                {formatTime(timeLeft)}
              </span>
            </div>

            {/* Verify */}
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <ShieldCheck size={19} />

              {loading
                ? "Verifying..."
                : "Verify Code"}
            </button>
          </form>

          {/* Resend */}
          <div className="mt-6 text-center">
            {resendCooldown > 0 ? (
              <p className="text-sm text-slate-500">
                Didn't receive the code?{" "}
                <span className="font-semibold text-slate-700">
                  Resend in {resendCooldown}s
                </span>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResendOTP}
                className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
              >
                Resend Verification Code
              </button>
            )}
          </div>

          {/* Login */}
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
      </div>
    </div>
  );
};

export default VerifyResetOTP;