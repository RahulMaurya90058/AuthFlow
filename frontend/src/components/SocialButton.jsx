const SocialButton = ({ children, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex-1 rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:shadow-sm"
    >
      {children}
    </button>
  );
};

export default SocialButton;