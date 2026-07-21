import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import { useAuth } from "../context/AuthContext";
import { loginApi } from "../api/auth.api";

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

/* ─── Google icon ───────────────────────────────────────── */
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

/* ─── Apple icon ────────────────────────────────────────── */
const AppleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
  </svg>
);

/* ─── Moon / Sun toggle icons ───────────────────────────── */
const MoonIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);
const SunIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
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
    title: "Track Every Project",
    desc: "Monitor all Kabul IT firm projects in real time — from kickoff to delivery, nothing slips through.",
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
    title: "Manage Your Team",
    desc: "Assign tasks, set deadlines, and keep developers, designers, and managers aligned in one workspace.",
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
    title: "Insights & Reports",
    desc: "Visual dashboards give leadership a clear view of progress, bottlenecks, and team velocity.",
  },
];

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════ */
export default function Login() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [formData, setFormData]       = useState({ email: "", password: "", rememberMe: false });
  const [errors, setErrors]           = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]         = useState(false);
  const [serverError, setServerError] = useState("");
  const [slide, setSlide]             = useState(0);
  const [fadeIn, setFadeIn]           = useState(true);

  /* auto-slide */
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

  /* form */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(p => ({ ...p, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!formData.email.trim())                                            e.email    = "Email is required";
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) e.email = "Enter a valid email";
    if (!formData.password)                                                e.password = "Password is required";
    else if (formData.password.length < 6)                                 e.password = "Minimum 6 characters";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;
    try {
      setLoading(true);
      await loginApi({ email: formData.email, password: formData.password });
      await refreshUser(); // tell AuthContext we're now logged in BEFORE navigating
      navigate("/dashboard");
    } catch (err) {
      setServerError(err?.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  /* input shared classes */
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

        {/* Card */}
        <div className="w-full max-w-4xl flex flex-col lg:flex-row rounded-2xl overflow-hidden shadow-2xl shadow-blue-900/20 dark:shadow-blue-900/40">

          {/* ── LEFT: Login form ─────────────────────────────── */}
          <div className="flex-1 bg-white dark:bg-black px-8 sm:px-12 py-6 flex flex-col justify-center transition-colors duration-300">

            {/* Logo */}
            <div className="mb-7">
              <Link to="/" aria-label="Go to homepage" className="inline-block">
                <Logo />
              </Link>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-1">
              Welcome Back
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-7">
              Login to your KabulTrack workspace
            </p>

            {/* Server error */}
            {serverError && (
              <div className="mb-5 flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 text-sm">
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
                {serverError}
              </div>
            )}

            {/* Email */}
            <div className="mb-4">
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

            {/* Password */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 tracking-wide uppercase">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"} name="password"
                  value={formData.password} onChange={handleChange}
                  placeholder="Enter your password"
                  className={`${inputBase} pr-11 ${errors.password ? inputErr : inputOk}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
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

            {/* Remember me / Forgot */}
            {/* <div className="flex items-center justify-between mb-6">
              <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 cursor-pointer select-none">
                <input
                  type="checkbox" name="rememberMe" checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 rounded accent-blue-600 cursor-pointer"
                />
                Remember me
              </label>
            </div> */}
            <div className="flex justify-end mb-6">
              <Link to="/forgot-password" className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors cursor-pointer">
                Forgot Password?
              </Link>
            </div>

            {/* Login button */}
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
                  Logging in…
                </span>
              ) : "Login"}
            </button>

            {/* Divider */}
            {/* <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700"/>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium tracking-widest">OR</span>
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700"/>
            </div> */}

            {/* Social buttons */}
            {/* <div className="flex gap-3 mb-6">
              <button
                type="button"
                className="flex-1 flex items-center justify-center gap-2.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                <GoogleIcon /> Google
              </button>
              <button
                type="button"
                className="flex-1 flex items-center justify-center gap-2.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                <AppleIcon /> Apple
              </button>
            </div> */}

            {/* Sign up */}
            <p className="text-center text-sm text-slate-500 dark:text-slate-400">
              Don't have an account?{" "}
              <Link to="/signup" className="text-orange-500 hover:text-orange-600 dark:hover:text-orange-400 font-semibold transition-colors cursor-pointer">
                Sign Up
              </Link>
            </p>
          </div>

          {/* ── RIGHT: Feature slideshow ──────────────────────── */}
          <div className="hidden lg:flex flex-col items-center justify-center flex-1 relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-800 to-blue-950 px-8 py-8">

            {/* Decorative blobs */}
            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/5 pointer-events-none"/>
            <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-orange-500/10 pointer-events-none"/>
            <div className="absolute top-1/3 -left-8 w-24 h-24 rounded-full bg-white/[0.03] pointer-events-none"/>

            {/* White logo */}
            <div className="mb-10 opacity-90">
              <Logo white />
            </div>

            {/* Slide */}
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

            {/* Dots */}
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

            {/* Footer label */}
            <p className="absolute bottom-5 text-[10px] text-white/30 tracking-[0.18em] uppercase">
              Project Management · Kabul IT Firms
            </p>
          </div>

        </div>
      </div>
  );
}
