import { ShieldCheck } from "lucide-react";

const AuthLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#eef7f5] p-4">
      <div className="grid min-h-[680px] w-full max-w-6xl overflow-hidden rounded-3xl border border-white/60 bg-white/80 shadow-2xl backdrop-blur-xl lg:grid-cols-2">

        {/* ================= LEFT SIDE ================= */}
        <div className="relative hidden overflow-hidden bg-gradient-to-br from-emerald-200 via-cyan-100 to-orange-200 p-12 lg:flex lg:items-center">

          {/* Decorative circles */}
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/30 blur-2xl" />

          <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-orange-300/30 blur-3xl" />

          <div className="relative z-10 max-w-lg">

            {/* Shield */}
            <div className="mb-10 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/30 shadow-lg backdrop-blur-md">
              <ShieldCheck
                size={48}
                strokeWidth={1.5}
                className="text-white"
              />
            </div>

            {/* Heading */}
            <h1 className="text-5xl font-bold leading-tight text-white drop-shadow-md">
              Join AuthFlow
              <br />
              Today!
            </h1>

            {/* Description */}
            <p className="mt-6 max-w-md text-lg leading-relaxed text-white/90">
              One simple authentication system for all your
              applications. Secure, fast and developer friendly.
            </p>

            {/* Decorative Shapes */}
            <div className="mt-14 flex gap-6">
              <div className="h-24 w-24 rotate-12 rounded-3xl bg-white/40 backdrop-blur-md" />

              <div className="h-24 w-24 rounded-full bg-orange-300/50 backdrop-blur-md" />

              <div className="h-24 w-24 -rotate-12 rounded-3xl bg-cyan-300/40 backdrop-blur-md" />
            </div>
          </div>
        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div className="flex items-center justify-center p-6 sm:p-10 lg:p-14">
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AuthLayout;