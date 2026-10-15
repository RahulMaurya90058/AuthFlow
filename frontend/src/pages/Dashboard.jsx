import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import {
  FiArrowRight,
  FiCheck,
  FiChevronRight,
  FiLogOut,
  FiMail,
  FiPhone,
  FiShield,
  FiUser,
  FiCalendar,
  FiLock,
} from "react-icons/fi";

import { FaGithub, FaGoogle } from "react-icons/fa";
const API_URL = import.meta.env.VITE_API_URL;

function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  // User data received from login page
  const loginUser = location.state?.user;

  // Protected backend profile
  const [profile, setProfile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  // ==========================================
  // FETCH PROTECTED PROFILE
  // ==========================================

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/user/profile`,
          {
            withCredentials: true,
          }
        );

        if (response.data.success) {
          setProfile(response.data.user);
        }
      } catch (error) {
        console.error("Profile Fetch Error:", error);

        if (error.response?.status === 401) {
          navigate("/login", { replace: true });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      await axios.post(
        `${API_URL}/api/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      );

      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout Error:", error);

      navigate("/login", { replace: true });
    }
  };

  // ==========================================
  // LOADING SCREEN
  // ==========================================

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f4f7f6] flex items-center justify-center px-4">
        <div className="w-full max-w-sm rounded-[28px] bg-white p-8 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)]">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ecfdf5] text-[#00a982]">
            <FiShield size={24} />
          </div>

          <h2 className="mt-5 text-xl font-black text-[#111827]">
            Checking your account
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Please wait while we securely verify your session.
          </p>

          <div className="mx-auto mt-6 h-1.5 w-32 overflow-hidden rounded-full bg-gray-100">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-[#00a982]" />
          </div>

        </div>
      </main>
    );
  }

  // ==========================================
  // USER
  // ==========================================

  const user = profile || loginUser;

  const userName = user?.name || "User";
  const userEmail = user?.email || "Not available";
  const userMobile = user?.mobile || "Not available";
  const profileImage = user?.profileImage || "";

  // ==========================================
  // INITIALS
  // ==========================================

  const getInitials = (name) => {
    if (!name) return "U";

    const words = name.trim().split(/\s+/);

    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }

    return (
      words[0].charAt(0) +
      words[words.length - 1].charAt(0)
    ).toUpperCase();
  };

  const initials = getInitials(userName);

  // ==========================================
  // PROFILE IMAGE COMPONENT
  // ==========================================

  const ProfileAvatar = ({
    size = "large",
    showStatus = true,
  }) => {
    const sizeClasses = {
      small: "h-10 w-10 text-sm",
      medium: "h-14 w-14 text-lg",
      large: "h-24 w-24 text-3xl",
    };

    return (
      <div className="relative inline-block">

        <div
          className={`${sizeClasses[size]} overflow-hidden rounded-[28%] bg-gradient-to-br from-[#00a982] to-[#007f68] flex items-center justify-center font-black text-white shadow-[0_12px_30px_rgba(0,169,130,0.25)] ring-4 ring-white`}
        >
          {profileImage ? (
            <img
              src={profileImage}
              alt={`${userName} profile`}
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                e.currentTarget.parentElement.innerHTML = `
                  <span class="flex h-full w-full items-center justify-center">
                    ${initials}
                  </span>
                `;
              }}
            />
          ) : (
            <span>{initials}</span>
          )}
        </div>

        {showStatus && (
          <span className="absolute bottom-0 right-0 h-5 w-5 rounded-full border-[3px] border-white bg-[#22c55e]" />
        )}

      </div>
    );
  };

  // ==========================================
  // AUTH PROVIDER
  // ==========================================

  const getProvider = () => {
    if (user?.authProvider === "google") {
      return {
        name: "Google",
        icon: <FaGoogle size={15} />,
        className: "text-[#4285F4] bg-blue-50",
      };
    }

    if (user?.authProvider === "github") {
      return {
        name: "GitHub",
        icon: <FaGithub size={16} />,
        className: "text-gray-800 bg-gray-100",
      };
    }

    return {
      name: "Email & Password",
      icon: <FiMail size={15} />,
      className: "text-[#00a982] bg-[#ecfdf5]",
    };
  };

  const provider = getProvider();

  return (
    <main className="min-h-screen bg-[#f4f7f6] px-4 py-6 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-7xl">

        {/* ==========================================
            HEADER
        ========================================== */}

        <header className="mb-6 flex items-center justify-between rounded-[26px] border border-gray-100 bg-white px-5 py-4 shadow-[0_8px_30px_rgba(15,23,42,0.04)] sm:px-6">

          {/* Logo */}

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#00a982] text-white shadow-lg shadow-[#00a982]/20">
              <FiShield size={21} />
            </div>

            <div>
              <h1 className="text-lg font-black tracking-tight text-[#111827]">
                AuthFlow
              </h1>

              <p className="hidden text-xs text-gray-400 sm:block">
                Secure Dashboard
              </p>
            </div>

          </div>

          {/* Right */}

          <div className="flex items-center gap-3">

            <div className="hidden items-center gap-3 sm:flex">

              <ProfileAvatar
                size="small"
                showStatus={false}
              />

              <div className="max-w-[150px]">
                <p className="truncate text-sm font-bold text-[#111827]">
                  {userName}
                </p>

                <p className="truncate text-xs text-gray-400">
                  {userEmail}
                </p>
              </div>

            </div>

            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex items-center gap-2 rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm font-bold text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FiLogOut size={16} />

              <span className="hidden sm:inline">
                {loggingOut ? "Logging out..." : "Logout"}
              </span>
            </button>

          </div>

        </header>

        {/* ==========================================
            HERO / PROFILE
        ========================================== */}

        <section className="relative overflow-hidden rounded-[32px] bg-[#0b1715] p-6 text-white shadow-[0_25px_70px_rgba(15,23,42,0.12)] sm:p-8 lg:p-10">

          {/* Background decoration */}

          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#00a982]/10" />

          <div className="absolute -bottom-32 right-24 h-80 w-80 rounded-full bg-[#00a982]/5" />

          <div className="absolute right-[18%] top-1/2 hidden h-32 w-32 -translate-y-1/2 rounded-full border-[20px] border-[#00a982]/5 lg:block" />

          <div className="relative z-10">

            <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">

              {/* Profile */}

              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

                <ProfileAvatar
                  size="large"
                  showStatus={true}
                />

                <div>

                  <div className="mb-2 flex flex-wrap items-center gap-2">

                    <span className="rounded-full border border-[#00c896]/20 bg-[#00c896]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#00c896]">
                      Dashboard
                    </span>

                    <span
                      className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold ${provider.className}`}
                    >
                      {provider.icon}
                      {provider.name}
                    </span>

                  </div>

                  <h2 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                    Welcome back,
                    <br className="sm:hidden" />{" "}
                    <span className="text-[#00c896]">
                      {userName}
                    </span>{" "}
                    👋
                  </h2>

                  <p className="mt-3 max-w-xl text-sm leading-6 text-white/50">
                    Your AuthFlow account is secure and
                    successfully authenticated. Manage your
                    account information from your dashboard.
                  </p>

                </div>

              </div>

              {/* Verification */}

              <div className="shrink-0 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00a982]/15 text-[#00c896]">
                    <FiCheck size={19} />
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-white/40">
                      Account
                    </p>

                    <p className="mt-0.5 text-sm font-bold text-white">
                      Verified & Secure
                    </p>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* ==========================================
            PROFILE SUMMARY
        ========================================== */}

        <section className="mt-6 grid gap-5 lg:grid-cols-[1.5fr_1fr]">

          {/* Personal Information */}

          <div className="rounded-[28px] border border-gray-100 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)] sm:p-7">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#00a982]">
                  Account
                </p>

                <h3 className="mt-1 text-xl font-black text-[#111827]">
                  Personal information
                </h3>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#ecfdf5] text-[#00a982]">
                <FiUser size={20} />
              </div>

            </div>

            <div className="mt-7 grid gap-4 sm:grid-cols-2">

              {/* Name */}

              <div className="rounded-2xl border border-gray-100 bg-[#fafcfb] p-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-gray-400 shadow-sm">
                    <FiUser size={16} />
                  </div>

                  <div className="min-w-0">

                    <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                      Full name
                    </p>

                    <p className="mt-1 truncate text-sm font-bold text-[#111827]">
                      {userName}
                    </p>

                  </div>

                </div>

              </div>

              {/* Email */}

              <div className="rounded-2xl border border-gray-100 bg-[#fafcfb] p-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-gray-400 shadow-sm">
                    <FiMail size={16} />
                  </div>

                  <div className="min-w-0">

                    <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                      Email address
                    </p>

                    <p className="mt-1 truncate text-sm font-bold text-[#111827]">
                      {userEmail}
                    </p>

                  </div>

                </div>

              </div>

              {/* Mobile */}

              <div className="rounded-2xl border border-gray-100 bg-[#fafcfb] p-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-gray-400 shadow-sm">
                    <FiPhone size={16} />
                  </div>

                  <div className="min-w-0">

                    <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                      Mobile number
                    </p>

                    <p className="mt-1 truncate text-sm font-bold text-[#111827]">
                      {userMobile}
                    </p>

                  </div>

                </div>

              </div>

              {/* Login Method */}

              <div className="rounded-2xl border border-gray-100 bg-[#fafcfb] p-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-gray-400 shadow-sm">
                    {provider.icon}
                  </div>

                  <div className="min-w-0">

                    <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                      Login method
                    </p>

                    <p className="mt-1 truncate text-sm font-bold text-[#111827]">
                      {provider.name}
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* Profile Card */}

          <div className="rounded-[28px] border border-gray-100 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)] sm:p-7">

            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#00a982]">
              Profile
            </p>

            <h3 className="mt-1 text-xl font-black text-[#111827]">
              Your profile
            </h3>

            <div className="mt-6 flex flex-col items-center rounded-3xl bg-[#f7faf9] px-5 py-7 text-center">

              <ProfileAvatar
                size="large"
                showStatus={true}
              />

              <h4 className="mt-5 text-lg font-black text-[#111827]">
                {userName}
              </h4>

              <p className="mt-1 max-w-full truncate text-sm text-gray-500">
                {userEmail}
              </p>

              <div className="mt-4 flex items-center gap-2 rounded-full bg-[#ecfdf5] px-3.5 py-1.5 text-xs font-bold text-[#00a982]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e]" />
                Active account
              </div>

            </div>

          </div>

        </section>

        {/* ==========================================
            SECURITY SECTION
        ========================================== */}

        <section className="mt-6 rounded-[28px] border border-gray-100 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)] sm:p-7">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#ecfdf5] text-[#00a982]">
                <FiShield size={21} />
              </div>

              <div>

                <h3 className="font-black text-[#111827]">
                  Account security
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Your account is protected and your email
                  has been verified.
                </p>

              </div>

            </div>

            <div className="flex items-center gap-2 rounded-full bg-[#ecfdf5] px-4 py-2 text-xs font-bold text-[#00a982]">
              <FiCheck size={14} />
              Verified
            </div>

          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

            <div className="flex items-center gap-3 rounded-2xl border border-gray-100 p-4">

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-50 text-gray-500">
                <FiMail size={16} />
              </div>

              <div>
                <p className="text-xs font-bold text-[#111827]">
                  Email verification
                </p>

                <p className="mt-0.5 text-xs text-[#00a982]">
                  Verified
                </p>
              </div>

            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-gray-100 p-4">

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-50 text-gray-500">
                <FiLock size={16} />
              </div>

              <div>
                <p className="text-xs font-bold text-[#111827]">
                  Authentication
                </p>

                <p className="mt-0.5 text-xs text-[#00a982]">
                  Protected
                </p>
              </div>

            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-gray-100 p-4">

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-50 text-gray-500">
                <FiCalendar size={16} />
              </div>

              <div>
                <p className="text-xs font-bold text-[#111827]">
                  Account status
                </p>

                <p className="mt-0.5 text-xs text-[#00a982]">
                  Active
                </p>
              </div>

            </div>

          </div>

        </section>

        {/* ==========================================
            FOOTER
        ========================================== */}

        <footer className="flex flex-col items-center justify-between gap-3 px-2 py-7 text-xs text-gray-400 sm:flex-row">

          <p>
            © {new Date().getFullYear()} AuthFlow. Secure by design.
          </p>

          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00a982]" />
            Authentication system active
            <FiChevronRight size={13} />
          </div>

        </footer>

      </div>
    </main>
  );
}

export default Dashboard;