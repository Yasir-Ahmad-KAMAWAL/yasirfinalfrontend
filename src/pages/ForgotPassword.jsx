import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import { forgotPasswordApi, resetPasswordApi } from "../api/auth.api";

/* ─── Logo ─────────────────────────────────────────────── */
const Logo = () => (
  <svg width="170" height="56" viewBox="0 4 192 70" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-auto w-[140px] sm:w-[160px]">
    <path d="M4 20 L22 39 L4 58"  stroke="#1D4ED8" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.25"/>
    <path d="M14 20 L32 39 L14 58" stroke="#1D4ED8" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.55"/>
    <path d="M24 20 L42 39 L24 58" stroke="#F97316" strokeWidth="4.5"  strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <text x="58" y="36" fontFamily="-apple-system,BlinkMacSystemFont,'Inter',sans-serif" fontSize="22" fontWeight="700"
      fill="#1D4ED8" letterSpacing="-0.4">
      Kabul<tspan fill="#F97316">Track</tspan>
    </text>
    <text x="59" y="53" fontFamily="-apple-system,BlinkMacSystemFont,'Inter',sans-serif" fontSize="9"
      fill="#9CA3AF" letterSpacing="0.2em">
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

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════ */
export default function ForgotPassword() {
  const navigate = useNavigate();

  // Step 1: email -> get security question
  // Step 2: answer question + set new password
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const inputBase =
    "w-full px-3.5 py-2.5 rounded-xl text-sm outline-none border transition-colors duration-150 " +
    "bg-slate-50 dark:bg-[#0D1526] text-slate-900 dark:text-white " +
    "placeholder:text-slate-400 dark:placeholder:text-slate-600 ";
  const inputOk  = "border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500";
  const inputErr = "border-red-500 dark:border-red-500";

  // Step 1: Find account by email
  const handleFindAccount = async (e) => {
    e.preventDefault();
    setServerError("");
    setErrors({});

    if (!email.trim()) {
      setErrors({ email: "Email is required" });
      return;
    }
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      setErrors({ email: "Enter a valid email" });
      return;
    }

    try {
      setLoading(true);
      const res = await forgotPasswordApi({ email: email.trim() });
      setSecurityQuestion(res.data.data.securityQuestion);
      setStep(2);
    } catch (err) {
      setServerError(err?.response?.data?.message || "No account found with this email.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify answer and reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setServerError("");
    setErrors({});

    const errs = {};
    if (!securityAnswer.trim()) errs.securityAnswer = "Answer is required";
    if (!newPassword) errs.newPassword = "New password is required";
    else if (newPassword.length < 6) errs.newPassword = "Minimum 6 characters";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    try {
      setLoading(true);
      await resetPasswordApi({
        email: email.trim(),
        securityAnswer: securityAnswer.trim(),
        newPassword,
      });
      setSuccessMessage("Password reset successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setServerError(err?.response?.data?.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-black transition-colors duration-300 px-4 py-4 font-sans">
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-black rounded-2xl shadow-2xl shadow-blue-900/20 dark:shadow-blue-900/40 px-8 sm:px-12 py-8">

          {/* Logo */}
          <div className="mb-7 text-center">
            <Link to="/" aria-label="Go to homepage" className="inline-block">
              <Logo />
            </Link>
          </div>

          {successMessage ? (
            <>
              <div className="mb-5 flex items-center gap-2 px-4 py-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-700 text-green-600 dark:text-green-400 text-sm">
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                {successMessage}
              </div>
            </>
          ) : step === 1 ? (
            <>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-1">
                Forgot Password?
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-7">
                Enter your email and we'll show you your security question.
              </p>

              {serverError && (
                <div className="mb-5 flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 text-sm">
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
                  {serverError}
                </div>
              )}

              <form onSubmit={handleFindAccount}>
                <div className="mb-6">
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 tracking-wide uppercase">
                    Email Address
                  </label>
                  <input
                    type="email" value={email}
                    onChange={(e) => { setEmail(e.target.value); setErrors({}); }}
                    placeholder="you@example.com"
                    className={`${inputBase} ${errors.email ? inputErr : inputOk}`}
                  />
                  {errors.email && (
                    <p className="text-red-500 dark:text-red-400 text-xs mt-1.5 flex items-center gap-1">
                      <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
                      {errors.email}
                    </p>
                  )}
                </div>

                <button
                  type="submit" disabled={loading}
                  className="w-full py-2.5 rounded-xl font-semibold text-sm text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors duration-150 mb-5 shadow-sm shadow-blue-500/30"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                      </svg>
                      Searching…
                    </span>
                  ) : "Find Account"}
                </button>
              </form>
            </>
          ) : (
            <>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-1">
                Reset Password
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                Answer your security question to reset your password.
              </p>

              {/* Security Question Display */}
              <div className="mb-4 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 tracking-wide uppercase">
                  Security Question
                </p>
                <p className="text-sm text-slate-900 dark:text-white font-medium">
                  {securityQuestion}
                </p>
              </div>

              {serverError && (
                <div className="mb-4 flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 text-sm">
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
                  {serverError}
                </div>
              )}

              <form onSubmit={handleResetPassword}>
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 tracking-wide uppercase">
                    Your Answer
                  </label>
                  <input
                    type="text" value={securityAnswer}
                    onChange={(e) => { setSecurityAnswer(e.target.value); setErrors(p => ({ ...p, securityAnswer: "" })); }}
                    placeholder="Enter your answer"
                    className={`${inputBase} ${errors.securityAnswer ? inputErr : inputOk}`}
                  />
                  {errors.securityAnswer && (
                    <p className="text-red-500 dark:text-red-400 text-xs mt-1.5 flex items-center gap-1">
                      <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
                      {errors.securityAnswer}
                    </p>
                  )}
                </div>

                <div className="mb-6">
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 tracking-wide uppercase">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"} value={newPassword}
                      onChange={(e) => { setNewPassword(e.target.value); setErrors(p => ({ ...p, newPassword: "" })); }}
                      placeholder="Enter new password"
                      className={`${inputBase} pr-11 ${errors.newPassword ? inputErr : inputOk}`}
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
                  {errors.newPassword && (
                    <p className="text-red-500 dark:text-red-400 text-xs mt-1.5 flex items-center gap-1">
                      <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
                      {errors.newPassword}
                    </p>
                  )}
                </div>

                <button
                  type="submit" disabled={loading}
                  className="w-full py-2.5 rounded-xl font-semibold text-sm text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors duration-150 mb-5 shadow-sm shadow-blue-500/30"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                      </svg>
                      Resetting…
                    </span>
                  ) : "Reset Password"}
                </button>
              </form>
            </>
          )}

          {/* Back to login */}
          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            Remember your password?{" "}
              <Link to="/login" className="text-orange-500 hover:text-orange-600 dark:hover:text-orange-400 font-semibold transition-colors cursor-pointer">
                Log In
              </Link>
          </p>
        </div>
      </div>
    </div>
  );
}