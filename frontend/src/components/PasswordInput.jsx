import { useState } from "react";
import {
  Eye,
  EyeOff,
  LockKeyhole,
} from "lucide-react";

const PasswordInput = ({
  value,
  onChange,
  error,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  // Password strength
  const getStrength = () => {
    if (!value) return 0;

    let strength = 0;

    if (value.length >= 8) strength++;
    if (/[A-Z]/.test(value)) strength++;
    if (/[0-9]/.test(value)) strength++;
    if (/[^A-Za-z0-9]/.test(value)) strength++;

    return strength;
  };

  const strength = getStrength();

  const strengthText = {
    0: "",
    1: "Weak",
    2: "Fair",
    3: "Good",
    4: "Strong",
  };

  return (
    <div className="space-y-2">
      {/* Label */}
      <label
        htmlFor="password"
        className="block text-sm font-semibold text-slate-700"
      >
        Password
      </label>

      {/* Input */}
      <div className="relative">
        <LockKeyhole
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          value={value}
          onChange={onChange}
          autoComplete="new-password"
          className={`w-full rounded-xl border bg-white/70 py-3.5 pl-11 pr-12 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:bg-white focus:ring-4 ${
            error
              ? "border-red-400 focus:border-red-400 focus:ring-red-100"
              : "border-slate-200 focus:border-emerald-400 focus:ring-emerald-100"
          }`}
        />

        {/* Show / Hide Password */}
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
        >
          {showPassword ? (
            <EyeOff size={18} />
          ) : (
            <Eye size={18} />
          )}
        </button>
      </div>

      {/* Error */}
      {error && (
        <p className="text-xs font-medium text-red-500">
          {error}
        </p>
      )}

      {/* Password Strength */}
      {value && !error && (
        <div className="space-y-1.5">
          <div className="flex gap-1">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className={`h-1 flex-1 rounded-full transition-all ${
                  item <= strength
                    ? "bg-emerald-400"
                    : "bg-slate-200"
                }`}
              />
            ))}
          </div>

          <div className="flex justify-between gap-3">
            <p className="text-xs text-slate-400">
              Use 8+ characters with numbers and symbols.
            </p>

            <p className="shrink-0 text-xs font-medium text-slate-500">
              {strengthText[strength]}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PasswordInput;