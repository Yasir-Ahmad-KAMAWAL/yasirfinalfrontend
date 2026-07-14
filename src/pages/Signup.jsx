import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import { useAuth } from "../context/AuthContext";
import { signupApi, loginApi } from "../api/auth.api";

/* ─── Logo ─────────────────────────────────────────────── */
const Logo = ({ white = false }) => (
  <svg width="170" height="56" viewBox="0 4 192 70" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-auto w-[140px] sm:w-[160px]">
    <path d="M4 20 L22 39 L4 58"  stroke={white ? "white" : "#1D4ED8"} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.25"/>
    <path d="M14 20 L32 39 L14 58" stroke={white ? "white" : "#1D4ED8"} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.55"/>
    <path d="M24 20 L42 39 L24 58" stroke="#F97316" strokeWidth="4.5"  strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <text x="58" y="36" fontFamily="-apple-system,BlinkMacSystemFont,'Inter',sans-serif" fontSize="22" fontWeight="700"
      fill={white ? "white" : "#1D4ED8"} letterSpacing="-0.4">
      Kabul<tspan fill="#F97316">Track</tspan>
    </text>
    <text x="59" y="53" fontFamily="-apple-system,BlinkMacSystemFont,'Inter',sans-serif" fontSize="9"
      fill={white ? "rgba(255,255,255,0.45)" : "#9CA3AF"} letterSpacing="0.2em">
      FORWARD MOTION·KT
    </text>
  </svg>
);

/* ─── Eye icon ──────────────────────────────────────────── */
const Eye = ({ open }) => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {open ? (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
      </>
    )}
  </svg>
);

/* ─── Right-panel slide data ────────────────────────────── */
const slides = [
  {
    icon: (
      <svg viewBox="0 0 88 88" width="88" height="88" fill="none">
        <circle cx="44" cy="44" r="42" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"/>
        <rect x="24" y="28" width="40" height="32" rx="5" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5"/>
        <rect x="30" y="36" width="12" height="3" rx="1.5" fill="white" opacity="0.9"/>
        <rect x="30" y="42" width="20" height="2.5" rx="1.25" fill="white" opacity="0.55"/>
        <rect x="30" y="47" width="14" height="2.5" rx="1.25" fill="white" opacity="0.38"/>
        <circle cx="57" cy="31" r="8" fill="#F97316"/>
        <path d="M54 31 L56.5 33.5 L60.5 28" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Set Up Your Workspace",
    desc: "Create your company's workspace in seconds and invite your team to start collaborating.",
  },
  {
    icon: (
      <svg viewBox="0 0 88 88" width="88" height="88" fill="none">
        <circle cx="44" cy="44" r="42" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"/>
        <circle cx="32" cy="37" r="9" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5"/>
        <circle cx="32" cy="37" r="4" fill="white" opacity="0.85"/>
        <circle cx="56" cy="37" r="9" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5"/>
        <circle cx="56" cy="37" r="4" fill="white" opacity="0.85"/>
        <path d="M23 55 C23 49 27 47 32 47 C37 47 41 49 41 55" stroke="rgba(255,255,255,0.55)" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M47 55 C47 49 51 47 56 47 C61 47 65 49 65 55" stroke="rgba(255,255,255,0.55)" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="44" cy="51" r="5" fill="#F97316"/>
        <path d="M42 51 L43.5 52.5 L46.5 49.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Bring Your Team Aboard",
    desc: "Appoint project leads, add members, and assign tasks — all scoped to each project.",
  },
  {
    icon: (
      <svg viewBox="0 0 88 88" width="88" height="88" fill="none">
        <circle cx="44" cy="44" r="42" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"/>
        <rect x="22" y="30" width="44" height="30" rx="5" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5"/>
        <rect x="28" y="38" width="7" height="16" rx="2.5" fill="rgba(255,255,255,0.3)"/>
        <rect x="38" y="33" width="7" height="21" rx="2.5" fill="rgba(255,255,255,0.55)"/>
        <rect x="48" y="41" width="7" height="13" rx="2.5" fill="#F97316" opacity="0.85"/>
        <path d="M28 29 L38 25 L48 31 L60 24" stroke="rgba(255,255,255,0.65)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="60" cy="24" r="3" fill="white"/>
      </svg>
    ),
    title: "Ship With Confidence",
    desc: "Every member sees exactly what's theirs to do, and leads see the full picture.",
  },
];

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════ */
export default function Signup() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [mode, setMode] = useState("create"); // "create" a new company, or "join" an existing one
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    companyName: "",
    companyId: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [slide, setSlide] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);

  useEffect(() => {
    const t = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => { setSlide(s => (s + 1) % slides.length); setFadeIn(true); }, 300);
    }, 4000);
    return () => clearInterval(t);
  }, []);

  const goSlide = (i) => {
    setFadeIn(false);
    setTimeout(() => { setSlide(i); setFadeIn(true); }, 250);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!formData.name.trim()) e.name = "Full name is required";
    if (!formData.email.trim()) e.email = "Email is required";
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) e.email = "Enter a valid email";
    if (mode === "create" && !formData.companyName.trim()) e.companyName = "Company name is required";
    if (mode === "join" && !formData.companyId.trim()) e.companyId = "Company invite code is required";
    if (!formData.password) e.password = "Password is required";
    else if (formData.password.length < 6) e.password = "Minimum 6 characters";
    if (!formData.confirmPassword) e.confirmPassword = "Please confirm your password";
    else if (formData.confirmPassword !== formData.password) e.confirmPassword = "Passwords do not match";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;
    try {
      setLoading(true);
      await signupApi({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        ...(mode === "create"
          ? { companyName: formData.companyName }
          : { companyId: formData.companyId.trim() }),
      });
      await loginApi({ email: formData.email, password: formData.password });
      await refreshUser(); // tell AuthContext we're now logged in BEFORE navigating
      navigate("/dashboard");
    } catch (err) {
      setServerError(err?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputBase =
    "w-full px-3.5 py-2.5 rounded-xl text-sm outline-none border transition-colors duration-150 " +
    "bg-slate-50 dark:bg-[#0D1526] text-slate-900 dark:text-white " +
    "placeholder:text-slate-400 dark:placeholder:text-slate-600 ";
  const inputOk  = "border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500";
  const inputErr = "border-red-500 dark:border-red-500";

  return (
  <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-black transition-colors duration-300 px-4 py-4 font-sans">

        <div className="absolute top-4 right-4 z-50">
          <ThemeToggle />
        </div>

        <div className="w-full max-w-4xl flex flex-col lg:flex-row rounded-2xl overflow-hidden shadow-2xl shadow-blue-900/20 dark:shadow-blue-900/40">

          <div className="flex-1 bg-white dark:bg-black px-8 sm:px-12 py-3 flex flex-col justify-center transition-colors duration-300">

            <div className="">
              <Link to="/" aria-label="Go to homepage" className="inline-block">
                <Logo />
              </Link>
            </div>

            <h1 className="text-2xl pb-2 sm:text-3xl font-bold text-slate-900 dark:text-white mb-1">
              Create Your Workspace
            </h1>

            {serverError && (
              <div className="mb-4 flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 text-sm">
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
                {serverError}
              </div>
            )}

            <div className="mb-3.5">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 tracking-wide uppercase">
                Full Name
              </label>
              <input
                type="text" name="name" value={formData.name}
                onChange={handleChange} placeholder="Yasir Ahmad"
                className={`${inputBase} ${errors.name ? inputErr : inputOk}`}
              />
              {errors.name && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1.5 flex items-center gap-1">
                  <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
                  {errors.name}
                </p>
              )}
            </div>

            <div className="mb-3.5">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 tracking-wide uppercase">
                Email Address
              </label>
              <input
                type="email" name="email" value={formData.email}
                onChange={handleChange} placeholder="you@example.com"
                className={`${inputBase} ${errors.email ? inputErr : inputOk}`}
              />
              {errors.email && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1.5 flex items-center gap-1">
                  <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Toggle: create new company vs join existing one */}
            <div className="flex items-center gap-1 mb-3.5 bg-slate-100 dark:bg-white/5 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setMode("create")}
                className={`flex-1 text-xs font-semibold py-1.5 rounded-md transition-colors ${
                  mode === "create"
                    ? "bg-white dark:bg-[#0D1526] text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                Create a company
              </button>
              <button
                type="button"
                onClick={() => setMode("join")}
                className={`flex-1 text-xs font-semibold py-1.5 rounded-md transition-colors ${
                  mode === "join"
                    ? "bg-white dark:bg-[#0D1526] text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                Join a company
              </button>
            </div>

            {mode === "create" ? (
              <div className="mb-3.5">
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 tracking-wide uppercase">
                  Company Name
                </label>
                <input
                  type="text" name="companyName" value={formData.companyName}
                  onChange={handleChange} placeholder="Your IT firm's name"
                  className={`${inputBase} ${errors.companyName ? inputErr : inputOk}`}
                />
                {errors.companyName && (
                  <p className="text-red-500 dark:text-red-400 text-xs mt-1.5 flex items-center gap-1">
                    <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
                    {errors.companyName}
                  </p>
                )}
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5">
                  You'll be set up as the owner of this workspace.
                </p>
              </div>
            ) : (
              <div className="mb-3.5">
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 tracking-wide uppercase">
                  Company Invite Code
                </label>
                <input
                  type="text" name="companyId" value={formData.companyId}
                  onChange={handleChange} placeholder="Paste the code your admin shared"
                  className={`${inputBase} ${errors.companyId ? inputErr : inputOk}`}
                />
                {errors.companyId && (
                  <p className="text-red-500 dark:text-red-400 text-xs mt-1.5 flex items-center gap-1">
                    <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
                    {errors.companyId}
                  </p>
                )}
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5">
                  Get this from your company admin — it's on their Settings page.
                </p>
              </div>
            )}

            <div className="mb-3.5">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 tracking-wide uppercase">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"} name="password"
                  value={formData.password} onChange={handleChange}
                  placeholder="Create a password"
                  className={`${inputBase} pr-11 ${errors.password ? inputErr : inputOk}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <Eye open={showPassword} />
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1.5 flex items-center gap-1">
                  <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
                  {errors.password}
                </p>
              )}
            </div>

            <div className="mb-5">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 tracking-wide uppercase">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"} name="confirmPassword"
                  value={formData.confirmPassword} onChange={handleChange}
                  placeholder="Re-enter your password"
                  className={`${inputBase} pr-11 ${errors.confirmPassword ? inputErr : inputOk}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  <Eye open={showConfirmPassword} />
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1.5 flex items-center gap-1">
                  <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="button" onClick={handleSubmit} disabled={loading}
              className="w-full py-2.5 rounded-xl font-semibold text-sm text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors duration-150 mb-5 shadow-sm shadow-blue-500/30"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                  </svg>
                  Creating workspace…
                </span>
              ) : "Create Account"}
            </button>

            <p className="text-center text-sm text-slate-500 dark:text-slate-400">
              Already have an account?{" "}
              <Link to="/login" className="text-orange-500 hover:text-orange-600 dark:hover:text-orange-400 font-semibold transition-colors">
                Log In
              </Link>
            </p>
          </div>

          <div className="hidden lg:flex flex-col items-center justify-center flex-1 relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-800 to-blue-950 px-8 py-8">

            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/5 pointer-events-none"/>
            <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-orange-500/10 pointer-events-none"/>
            <div className="absolute top-1/3 -left-8 w-24 h-24 rounded-full bg-white/[0.03] pointer-events-none"/>

            <div className="mb-10 opacity-90">
              <Logo white />
            </div>

            <div
              className="flex flex-col items-center text-center transition-all duration-300"
              style={{ opacity: fadeIn ? 1 : 0, transform: fadeIn ? "translateY(0)" : "translateY(10px)" }}
            >
              <div className="mb-7 drop-shadow-xl">
                {slides[slide].icon}
              </div>
              <h2 className="text-xl font-bold text-white mb-3 tracking-tight">
                {slides[slide].title}
              </h2>
              <p className="text-sm text-blue-200/80 leading-relaxed max-w-[280px]">
                {slides[slide].desc}
              </p>
            </div>

            <div className="flex items-center gap-2.5 mt-10">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goSlide(i)}
                  className={`h-2 rounded-full transition-all duration-300 border-none cursor-pointer ${
                    i === slide
                      ? "w-6 bg-orange-400"
                      : "w-2 bg-white/30 hover:bg-white/50"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            <p className="absolute bottom-5 text-[10px] text-white/30 tracking-[0.18em] uppercase">
              Project Management · Kabul IT Firms
            </p>
          </div>

        </div>
      </div>
  );
}
