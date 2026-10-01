import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
} from "lucide-react";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;
  const otp = location.state?.otp;

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.password) {
      newErrors.password = "New password is required";
    } else if (formData.password.length < 8) {
      newErrors.password =
        "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword =
        "Please confirm your password";
    } else if (
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword =
        "Passwords do not match";
    }

    return newErrors;
  };

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
        "http://localhost:5000/api/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp,
            newPassword: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setErrors({
          general:
            data.message ||
            "Unable to reset password. Please try again.",
        });
        return;
      }

      setSuccess(true);

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Reset password error:", error);

      setErrors({
        general:
          "Unable to connect to server. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // If user directly opens this page without OTP verification
  if (!email || !otp) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xl">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <LockKeyhole size={32} />
          </div>

          <h1 className="text-xl font-bold text-slate-900">
            Reset Session Expired
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Please request a new password reset code.
          </p>

          <Link
            to="/forgot-password"
            className="mt-6 inline-flex rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            Request New Code
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xl">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircle2 size={34} />
          </div>

          <h1 className="text-2xl font-bold text-slate-900">
            Password Reset Successful!
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            Your password has been updated successfully.
            Redirecting you to the login page...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center">
        <div className="w-full">
          {/* Back */}
          <button
            type="button"
            onClick={() => navigate("/verify-reset-otp", {
              state: { email },
            })}
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-emerald-600"
          >
            <ArrowLeft size={18} />
            Back to Verification
          </button>

          {/* Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/50 sm:p-8">
            {/* Icon */}
            <div className="mb-6 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <LockKeyhole size={32} />
              </div>
            </div>

            {/* Heading */}
            <div className="mb-7 text-center">
              <h1 className="text-2xl font-bold text-slate-900">
                Create New Password
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Choose a strong password for your AuthFlow
                account.
              </p>
            </div>

            {/* General Error */}
            {errors.general && (
              <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {errors.general}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* New Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  New Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={19}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="password"
                    name="password"
                    type={
                      showPassword ? "text" : "password"
                    }
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter new password"
                    autoComplete="new-password"
                    className={`w-full rounded-xl border bg-white py-3 pl-10 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 ${
                      errors.password
                        ? "border-red-400 focus:border-red-500"
                        : "border-slate-200 focus:border-emerald-500"
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => !prev)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                  >
                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>

                {errors.password && (
                  <p className="mt-1.5 text-xs text-red-500">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Confirm New Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={19}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm new password"
                    autoComplete="new-password"
                    className={`w-full rounded-xl border bg-white py-3 pl-10 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 ${
                      errors.confirmPassword
                        ? "border-red-400 focus:border-red-500"
                        : "border-slate-200 focus:border-emerald-500"
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (prev) => !prev
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>

                {errors.confirmPassword && (
                  <p className="mt-1.5 text-xs text-red-500">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Password Requirements */}
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="mb-2 text-xs font-semibold text-slate-700">
                  Password requirements
                </p>

                <ul className="space-y-1 text-xs text-slate-500">
                  <li>• At least 8 characters</li>
                  <li>• Avoid using an easily guessable password</li>
                  <li>• Use a combination of letters and numbers</li>
                </ul>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Updating Password..."
                  : "Reset Password"}
              </button>
            </form>

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
    </div>
  );
};

export default ResetPassword;