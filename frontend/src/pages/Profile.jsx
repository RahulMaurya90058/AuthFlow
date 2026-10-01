import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  User,
  Mail,
  ShieldCheck,
  LogOut,
  LoaderCircle,
  CalendarDays,
  ArrowLeft,
} from "lucide-react";

import { FaGithub, FaGoogle } from "react-icons/fa";

const Profile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [error, setError] = useState("");

  // ======================================================
  // GET PROFILE
  // ======================================================

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/auth/profile",
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          navigate("/login");
          return;
        }

        setError(
          data.message || "Unable to load profile."
        );

        return;
      }

      setUser(data.user);
    } catch (error) {
      console.error("Profile fetch error:", error);

      setError(
        "Unable to connect to server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // ======================================================
  // LOGOUT
  // ======================================================

  const handleLogout = async () => {
    try {
      setLogoutLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/auth/logout",
        {
          method: "POST",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Unable to logout."
        );
        return;
      }

      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);

      setError(
        "Unable to logout. Please try again."
      );
    } finally {
      setLogoutLoading(false);
    }
  };

  // ======================================================
  // PROVIDER ICON
  // ======================================================

  const getProviderIcon = () => {
    if (user?.authProvider === "github") {
      return <FaGithub size={17} />;
    }

    if (user?.authProvider === "google") {
      return <FaGoogle size={17} />;
    }

    return <Mail size={17} />;
  };

  // ======================================================
  // PROVIDER NAME
  // ======================================================

  const getProviderName = () => {
    if (user?.authProvider === "github") {
      return "GitHub";
    }

    if (user?.authProvider === "google") {
      return "Google";
    }

    return "Email & Password";
  };

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-lg">
          <LoaderCircle
            size={23}
            className="animate-spin text-emerald-500"
          />

          <span className="text-sm font-medium text-slate-600">
            Loading profile...
          </span>
        </div>
      </div>
    );
  }

  // ======================================================
  // ERROR
  // ======================================================

  if (error && !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-3xl border border-red-200 bg-white p-8 text-center shadow-xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
            <User
              size={26}
              className="text-red-500"
            />
          </div>

          <h2 className="mt-5 text-xl font-bold text-slate-900">
            Unable to Load Profile
          </h2>

          <p className="mt-2 text-sm text-red-500">
            {error}
          </p>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <ArrowLeft size={17} />
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  // ======================================================
  // PROFILE
  // ======================================================

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:py-8">
      <div className="mx-auto max-w-4xl">

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-md">
              <ShieldCheck size={22} />
            </div>

            <div>
              <h1 className="text-lg font-extrabold text-slate-900">
                AuthFlow
              </h1>

              <p className="text-xs text-slate-400">
                Your Profile
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={logoutLoading}
            className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-500 shadow-sm transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LogOut size={16} />

            {logoutLoading
              ? "Logging out..."
              : "Logout"}
          </button>
        </div>

        {/* ==================================================
            ERROR MESSAGE
        ================================================== */}

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        {/* ==================================================
            MAIN CARD
        ================================================== */}

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60">

          {/* ==================================================
              COVER
          ================================================== */}

          <div className="relative h-32 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 sm:h-36">

            <div className="absolute inset-0 bg-white/5" />

            <div className="absolute bottom-4 right-5 rounded-full border border-white/30 bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
              Authenticated
            </div>
          </div>

          {/* ==================================================
              PROFILE CONTENT
          ================================================== */}

          <div className="px-6 pb-8 sm:px-9">

            {/* ==================================================
                AVATAR + PROVIDER
            ================================================== */}

            <div className="-mt-14 flex flex-wrap items-end justify-between gap-4">

              {/* Avatar */}

              <div className="relative z-10 flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-slate-100 text-3xl font-bold text-slate-500 shadow-xl sm:h-32 sm:w-32 sm:text-4xl">
                {user?.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={`${user?.name || "User"} profile`}
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  user?.name
                    ?.charAt(0)
                    ?.toUpperCase()
                )}
              </div>

              {/* Provider */}

              <div className="mb-1 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm">
                {getProviderIcon()}
                <span>{getProviderName()}</span>
              </div>
            </div>

            {/* ==================================================
                USER NAME
            ================================================== */}

            <div className="mt-5">
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                {user?.name}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Welcome to your AuthFlow account
              </p>
            </div>

            {/* ==================================================
                DETAILS
            ================================================== */}

            <div className="mt-7 grid gap-4 sm:grid-cols-2">

              {/* EMAIL */}

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition duration-200 hover:border-emerald-200 hover:bg-emerald-50/40">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-500 shadow-sm">
                    <Mail size={19} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-400">
                      Email
                    </p>

                    <p className="mt-1 truncate text-sm font-semibold text-slate-700">
                      {user?.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* ACCOUNT TYPE */}

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition duration-200 hover:border-emerald-200 hover:bg-emerald-50/40">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-500 shadow-sm">
                    <User size={19} />
                  </div>

                  <div>
                    <p className="text-xs font-medium text-slate-400">
                      Account Type
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      {getProviderName()}
                    </p>
                  </div>
                </div>
              </div>

              {/* EMAIL STATUS */}

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition duration-200 hover:border-emerald-200 hover:bg-emerald-50/40">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-500 shadow-sm">
                    <ShieldCheck size={19} />
                  </div>

                  <div>
                    <p className="text-xs font-medium text-slate-400">
                      Email Status
                    </p>

                    <p
                      className={`mt-1 text-sm font-semibold ${
                        user?.isEmailVerified
                          ? "text-emerald-600"
                          : "text-red-500"
                      }`}
                    >
                      {user?.isEmailVerified
                        ? "Verified"
                        : "Not Verified"}
                    </p>
                  </div>
                </div>
              </div>

              {/* MEMBER SINCE */}

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition duration-200 hover:border-emerald-200 hover:bg-emerald-50/40">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-500 shadow-sm">
                    <CalendarDays size={19} />
                  </div>

                  <div>
                    <p className="text-xs font-medium text-slate-400">
                      Member Since
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      {user?.createdAt
                        ? new Date(
                            user.createdAt
                          ).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ==================================================
                ROLE
            ================================================== */}

            <div className="mt-4 flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
              <div>
                <p className="text-xs font-medium text-slate-400">
                  Role
                </p>

                <p className="mt-1 text-sm font-semibold capitalize text-slate-700">
                  {user?.role || "user"}
                </p>
              </div>

              <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold capitalize text-emerald-700">
                {user?.role || "user"}
              </div>
            </div>

            {/* ==================================================
                SECURITY
            ================================================== */}

            <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-4">
              <div className="flex gap-3">
                <ShieldCheck
                  size={20}
                  className="mt-0.5 shrink-0 text-emerald-600"
                />

                <div>
                  <p className="text-sm font-semibold text-emerald-800">
                    Your account is protected
                  </p>

                  <p className="mt-1 text-xs leading-5 text-emerald-700">
                    AuthFlow uses secure authentication
                    mechanisms to protect your account
                    session.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ==================================================
            FOOTER
        ================================================== */}

        <div className="mt-5 flex justify-center gap-4 text-xs text-slate-400">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="transition hover:text-emerald-600"
          >
            Sign Up
          </button>

          <span>•</span>

          <button
            type="button"
            onClick={() => navigate("/contact")}
            className="transition hover:text-emerald-600"
          >
            Contact Us
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;