import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import {
  FiShield,
  FiMail,
  FiArrowLeft,
  FiRefreshCw,
  FiCheck,
} from "react-icons/fi";

const API_URL = import.meta.env.VITE_API_URL;

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Signup page se email receive hogi
  const email = location.state?.email;

  const [otp, setOtp] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  const [error, setError] = useState("");

  const inputRefs = useRef([]);

  // ==========================================
  // AUTO FOCUS
  // ==========================================

  useEffect(() => {
    if (email) {
      inputRefs.current[0]?.focus();
    }
  }, [email]);

  // ==========================================
  // OTP CHANGE
  // ==========================================

  const handleOtpChange = (index, value) => {
    // Sirf number allow
    const number = value.replace(/\D/g, "");

    if (number.length > 1) {
      return;
    }

    const newOtp = [...otp];

    newOtp[index] = number;

    setOtp(newOtp);
    setError("");

    // Next box par move
    if (number && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // ==========================================
  // BACKSPACE
  // ==========================================

  const handleKeyDown = (index, e) => {
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // ==========================================
  // PASTE OTP
  // ==========================================

  const handlePaste = (e) => {
    e.preventDefault();

    const pastedOtp = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pastedOtp) {
      return;
    }

    const newOtp = [
      "",
      "",
      "",
      "",
      "",
      "",
    ];

    pastedOtp.split("").forEach((digit, index) => {
      newOtp[index] = digit;
    });

    setOtp(newOtp);
    setError("");

    const nextIndex = Math.min(
      pastedOtp.length,
      5
    );

    inputRefs.current[nextIndex]?.focus();
  };

  // ==========================================
  // VERIFY BUTTON
  // ==========================================

  const handleVerify = async (e) => {
  e.preventDefault();

  const enteredOtp = otp.join("");

  if (enteredOtp.length !== 6) {
    setError("Please enter the complete 6-digit OTP.");
    return;
  }

  try {
    setError("");

    const response = await axios.post(
      `${API_URL}/api/verification/verify-email`,
      {
        email,
        otp: enteredOtp,
      }
    );

    if (response.data.success) {
      navigate("/account-created", {
        state: {
          name: response.data.user.name,
          email: response.data.user.email,
        },
      });
    }
  } catch (error) {
    setError(
      error.response?.data?.message ||
        "Something went wrong. Please try again."
    );
  }
};

const handleResendOTP = async () => {
  try {
    setError("");

    await axios.post(
     `${API_URL}/api/verification/resend-otp`,
      {
        email,
      }
    );

    setError("A new OTP has been sent to your email.");
  } catch (error) {
    setError(
      error.response?.data?.message ||
        "Failed to resend OTP. Please try again."
    );
  }
};
  // ==========================================
  // NO EMAIL
  // ==========================================

  if (!email) {
    return (
      <main className="min-h-screen bg-[#edf5f3] flex items-center justify-center px-4">

        <div className="w-full max-w-[460px] rounded-[30px] bg-white p-8 sm:p-10 shadow-[0_30px_80px_rgba(15,23,42,0.12)] text-center">

          <div className="mx-auto mb-6 w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center">
            <FiMail
              size={28}
              className="text-red-500"
            />
          </div>

          <h1 className="text-2xl font-bold text-[#111827]">
            Verification Session Expired
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#71809a]">
            We couldn't find your email address.
            Please go back and create your account
            again.
          </p>

          <button
            onClick={() => navigate("/")}
            className="mt-7 w-full h-[50px] rounded-[13px] bg-[#00cba6] text-white font-bold hover:bg-[#00b995] transition"
          >
            Back to Signup
          </button>

        </div>

      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#edf5f3] flex items-center justify-center p-4 sm:p-6">

      <div className="w-full max-w-[1050px] overflow-hidden rounded-[30px] bg-white shadow-[0_30px_80px_rgba(15,23,42,0.15)]">

        <div className="grid md:grid-cols-2">

          {/* ==========================================
              LEFT SIDE
          ========================================== */}

          <section className="relative min-h-[500px] md:min-h-[650px] overflow-hidden bg-gradient-to-br from-[#b9f1db] via-[#c4f5f5] to-[#ffd39b] flex flex-col items-center justify-center px-8 text-center">

            {/* Background shapes */}

            <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-white/10" />

            <div className="absolute top-16 right-[-70px] w-44 h-44 rounded-full bg-white/10" />

            <div className="absolute bottom-[-90px] left-[-50px] w-64 h-64 rounded-full bg-white/10" />

            {/* Shield */}

            <div className="relative z-10">

              <div className="w-[92px] h-[92px] rounded-[28px] bg-white/35 backdrop-blur-md border border-white/30 shadow-[0_15px_35px_rgba(0,0,0,0.08)] flex items-center justify-center">

                <FiShield
                  size={45}
                  strokeWidth={1.7}
                  className="text-white"
                />

              </div>

              <div className="absolute -right-2 -bottom-2 w-8 h-8 rounded-full bg-[#08cfa8] border-4 border-[#c3f3e8] flex items-center justify-center">

                <FiCheck
                  size={14}
                  className="text-white"
                />

              </div>

            </div>

            <div className="relative z-10 max-w-[400px] mt-10">

              <p className="uppercase tracking-[4px] text-[11px] font-semibold text-black/45">
                Email Verification
              </p>

              <h1 className="mt-5 text-[40px] sm:text-[46px] leading-[1.1] tracking-[-2px] font-semibold text-[#101418]">
                Almost
                <br />
                There!
              </h1>

              <p className="mt-6 text-[16px] leading-7 text-white/95">
                One quick step to secure your
                AuthFlow account and keep your
                information protected.
              </p>

              {/* Security badges */}

              <div className="mt-8 flex justify-center gap-2 flex-wrap">

                <span className="px-4 py-2 rounded-full bg-white/30 backdrop-blur-sm text-[12px] font-medium text-white">
                  Secure
                </span>

                <span className="px-4 py-2 rounded-full bg-white/30 backdrop-blur-sm text-[12px] font-medium text-white">
                  Private
                </span>

                <span className="px-4 py-2 rounded-full bg-white/30 backdrop-blur-sm text-[12px] font-medium text-white">
                  Verified
                </span>

              </div>

            </div>

            {/* Bottom decorations */}

            <div className="absolute bottom-20 left-[14%] w-20 h-20 rounded-[20px] bg-white/25 rotate-12" />

            <div className="absolute bottom-20 right-[15%] w-20 h-20 rounded-full bg-[#f3c879]/80" />

          </section>


          {/* ==========================================
              RIGHT SIDE
          ========================================== */}

          <section className="bg-white px-6 sm:px-10 lg:px-14 py-12 flex items-center">

            <div className="w-full max-w-[410px] mx-auto">

              {/* Brand */}

              <div className="flex justify-center items-center gap-3 mb-8">

                <div className="w-11 h-11 rounded-[13px] bg-gradient-to-br from-[#00d8a8] to-[#08bfd3] flex items-center justify-center shadow-[0_8px_20px_rgba(0,205,166,0.22)]">

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


              {/* Mail Icon */}

              <div className="flex justify-center mb-6">

                <div className="w-[72px] h-[72px] rounded-[22px] bg-[#e9fbf7] flex items-center justify-center">

                  <FiMail
                    size={30}
                    className="text-[#00b995]"
                  />

                </div>

              </div>


              {/* Heading */}

              <div className="text-center">

                <h2 className="text-[27px] font-semibold tracking-[-0.7px] text-[#111827]">
                  Verify Your Email
                </h2>

                <p className="mt-3 text-[14px] leading-6 text-[#71809a]">
                  We've sent a 6-digit verification
                  code to
                </p>

                <p className="mt-1 text-[14px] font-semibold text-[#263249] break-all">
                  {email}
                </p>

              </div>


              {/* OTP Form */}

              <form
                onSubmit={handleVerify}
                className="mt-8"
              >

                <label className="block text-center text-[13px] font-semibold text-[#3c4b63] mb-4">
                  Enter Verification Code
                </label>


                {/* OTP Boxes */}

                <div
                  className="flex justify-center gap-2 sm:gap-3"
                  onPaste={handlePaste}
                >

                  {otp.map((digit, index) => (

                    <input
                      key={index}
                      ref={(element) => {
                        inputRefs.current[index] =
                          element;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) =>
                        handleOtpChange(
                          index,
                          e.target.value
                        )
                      }
                      onKeyDown={(e) =>
                        handleKeyDown(index, e)
                      }
                      className="w-[43px] h-[52px] sm:w-[50px] sm:h-[58px] rounded-[13px] border border-[#dce3ec] bg-white text-center text-[21px] font-bold text-[#263249] outline-none transition focus:border-[#00cba6] focus:ring-4 focus:ring-[#00cba6]/10"
                    />

                  ))}

                </div>


                {/* Error */}

                {error && (

                  <div className="mt-4 rounded-[11px] border border-red-200 bg-red-50 px-4 py-3 text-center text-[13px] font-medium text-red-600">
                    {error}
                  </div>

                )}


                {/* Verify */}

                <button
                  type="submit"
                  className="mt-6 w-full h-[52px] rounded-[13px] bg-[#00cba6] text-white text-[14px] font-bold shadow-[0_8px_22px_rgba(0,203,166,0.25)] hover:bg-[#00b995] transition active:scale-[0.99]"
                >
                  Verify Email
                </button>

              </form>


              {/* Resend */}

              <div className="text-center mt-7">

                <p className="text-[13px] text-[#71809a]">
                  Didn't receive the code?
                </p>

               <button
  type="button"
  onClick={handleResendOTP}
  className="mt-2 inline-flex items-center gap-2 text-[13px] font-bold text-[#00a982] hover:underline"
>
  <FiRefreshCw size={14} />
  Resend OTP
</button>

              </div>


              {/* Back */}

              <button
                type="button"
                onClick={() => navigate("/")}
                className="mx-auto mt-7 flex items-center gap-2 text-[13px] font-semibold text-[#71809a] hover:text-[#263249] transition"
              >

                <FiArrowLeft size={15} />

                Back to Signup

              </button>


              {/* Security */}

              <p className="text-center mt-7 text-[11px] text-[#9aa6b8]">
                Your verification code is valid for a
                limited time.
              </p>

            </div>

          </section>

        </div>

      </div>

    </main>
  );
};

export default VerifyEmail;