import { useLocation, useNavigate } from "react-router-dom";
import {
  FiCheck,
  FiShield,
  FiArrowRight,
  FiMail,
} from "react-icons/fi";

const AccountCreated = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const name = location.state?.name || "there";
  const email = location.state?.email || "";

  return (
    <main className="min-h-screen bg-[#edf5f3] flex items-center justify-center p-4 sm:p-6">

      <div className="w-full max-w-[1050px] overflow-hidden rounded-[30px] bg-white shadow-[0_30px_80px_rgba(15,23,42,0.15)]">

        <div className="grid md:grid-cols-2">

          {/* ==========================================
              LEFT SIDE
          ========================================== */}

          <section className="relative min-h-[500px] md:min-h-[650px] overflow-hidden bg-gradient-to-br from-[#b9f1db] via-[#c4f5f5] to-[#ffd39b] flex flex-col items-center justify-center px-8 text-center">

            {/* Background Decorations */}

            <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-white/10" />

            <div className="absolute top-16 right-[-70px] w-44 h-44 rounded-full bg-white/10" />

            <div className="absolute bottom-[-90px] left-[-50px] w-64 h-64 rounded-full bg-white/10" />

            <div className="absolute bottom-20 left-[14%] w-20 h-20 rounded-[20px] bg-white/25 rotate-12" />

            <div className="absolute bottom-20 right-[15%] w-20 h-20 rounded-full bg-[#f3c879]/80" />

            {/* Success Icon */}

            <div className="relative z-10">

              <div className="w-[110px] h-[110px] rounded-[32px] bg-white/40 backdrop-blur-md border border-white/40 shadow-[0_20px_40px_rgba(0,0,0,0.10)] flex items-center justify-center">

                <div className="w-[76px] h-[76px] rounded-full bg-[#08cfa8] flex items-center justify-center shadow-[0_12px_30px_rgba(8,207,168,0.35)]">

                  <FiCheck
                    size={42}
                    strokeWidth={2.5}
                    className="text-white"
                  />

                </div>

              </div>

            </div>

            {/* Text */}

            <div className="relative z-10 max-w-[410px] mt-10">

              <p className="uppercase tracking-[4px] text-[11px] font-semibold text-black/45">
                Verification Complete
              </p>

              <h1 className="mt-5 text-[40px] sm:text-[46px] leading-[1.1] tracking-[-2px] font-semibold text-[#101418]">
                You're All
                <br />
                Set!
              </h1>

              <p className="mt-6 text-[16px] leading-7 text-white/95">
                Your email has been verified successfully.
                Welcome to AuthFlow.
              </p>

              {/* Security Badges */}

              <div className="mt-8 flex justify-center gap-2 flex-wrap">

                <span className="px-4 py-2 rounded-full bg-white/30 backdrop-blur-sm text-[12px] font-medium text-white">
                  Verified
                </span>

                <span className="px-4 py-2 rounded-full bg-white/30 backdrop-blur-sm text-[12px] font-medium text-white">
                  Secure
                </span>

                <span className="px-4 py-2 rounded-full bg-white/30 backdrop-blur-sm text-[12px] font-medium text-white">
                  Protected
                </span>

              </div>

            </div>

          </section>


          {/* ==========================================
              RIGHT SIDE
          ========================================== */}

          <section className="bg-white px-6 sm:px-10 lg:px-14 py-12 flex items-center">

            <div className="w-full max-w-[410px] mx-auto">

              {/* Brand */}

              <div className="flex justify-center items-center gap-3 mb-9">

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


              {/* Success Circle */}

              <div className="flex justify-center mb-7">

                <div className="w-[82px] h-[82px] rounded-full bg-[#e9fbf7] flex items-center justify-center">

                  <div className="w-[60px] h-[60px] rounded-full bg-[#00cba6] flex items-center justify-center shadow-[0_10px_25px_rgba(0,203,166,0.25)]">

                    <FiCheck
                      size={31}
                      strokeWidth={2.5}
                      className="text-white"
                    />

                  </div>

                </div>

              </div>


              {/* Heading */}

              <div className="text-center">

                <h2 className="text-[28px] font-semibold tracking-[-0.8px] text-[#111827]">
                  Account Created!
                </h2>

                <p className="mt-3 text-[14px] leading-6 text-[#71809a]">
                  Congratulations,{" "}
                  <span className="font-semibold text-[#263249]">
                    {name}
                  </span>
                  !
                  <br />
                  Your AuthFlow account is ready.
                </p>

              </div>


              {/* Email Card */}

              {email && (

                <div className="mt-7 rounded-[16px] border border-[#e4ebe9] bg-[#f8fcfb] p-4">

                  <div className="flex items-center gap-3">

                    <div className="w-10 h-10 shrink-0 rounded-[11px] bg-[#e8faf6] flex items-center justify-center">

                      <FiMail
                        size={18}
                        className="text-[#00b995]"
                      />

                    </div>

                    <div className="min-w-0">

                      <p className="text-[11px] font-semibold uppercase tracking-[1px] text-[#9aa6b8]">
                        Verified Email
                      </p>

                      <p className="mt-1 text-[13px] font-semibold text-[#263249] truncate">
                        {email}
                      </p>

                    </div>

                  </div>

                </div>

              )}


              {/* Success Message */}

              <div className="mt-5 rounded-[14px] bg-[#ecfdf7] border border-[#d1f5e8] px-4 py-3">

                <p className="text-center text-[12px] leading-5 text-[#31816d]">
                  Your email address has been verified
                  and your account is now secure.
                </p>

              </div>


              {/* Continue Button */}

              <button
                type="button"
                onClick={() => navigate("/login")}
                className="mt-7 w-full h-[52px] rounded-[13px] bg-[#00cba6] text-white text-[14px] font-bold shadow-[0_8px_22px_rgba(0,203,166,0.25)] hover:bg-[#00b995] transition active:scale-[0.99] flex items-center justify-center gap-2"
              >
                Continue to Login

                <FiArrowRight size={17} />

              </button>


              {/* Footer */}

              <p className="text-center mt-7 text-[11px] text-[#9aa6b8]">
                Your account is protected by AuthFlow
                security.
              </p>

            </div>

          </section>

        </div>

      </div>

    </main>
  );
};

export default AccountCreated;