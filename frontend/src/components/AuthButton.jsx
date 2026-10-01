const AuthButton = ({ children }) => {
  return (
    <button
      type="submit"
      className="w-full rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-200 transition hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0"
    >
      {children}
    </button>
  );
};

export default AuthButton;