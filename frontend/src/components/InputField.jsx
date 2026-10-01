const InputField = ({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  icon,
  error,
}) => {
  return (
    <div className="space-y-2">
      {/* Label */}
      <label
        htmlFor={name}
        className="block text-sm font-semibold text-slate-700"
      >
        {label}
      </label>

      {/* Input */}
      <div className="relative">
        {icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </span>
        )}

        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={name === "email" ? "email" : "name"}
          className={`w-full rounded-xl border bg-white/70 py-3.5 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:bg-white focus:ring-4 ${
            icon ? "pl-11 pr-4" : "px-4"
          } ${
            error
              ? "border-red-400 focus:border-red-400 focus:ring-red-100"
              : "border-slate-200 focus:border-emerald-400 focus:ring-emerald-100"
          }`}
        />
      </div>

      {/* Error */}
      {error && (
        <p className="text-xs font-medium text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};

export default InputField;