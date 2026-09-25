"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import Link from "next/link";
import Logo from "@/app/components/Logo";

type Mode = "login" | "signup" | "forgot";

const MailIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" className="text-zinc-500 shrink-0">
    <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
);

const LockIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" className="text-zinc-500 shrink-0">
    <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
  </svg>
);

const EyeOpen = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" className="text-zinc-400 hover:text-zinc-200 transition-colors shrink-0">
    <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M2.036 12c2.018-4.596 6.273-7.5 10.964-7.5 4.69 0 8.946 2.904 10.964 7.5-2.018 4.596-6.273 7.5-10.964 7.5-4.69 0-8.946-2.904-10.964-7.5z" />
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const EyeOff = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" className="text-zinc-400 hover:text-zinc-200 transition-colors shrink-0">
    <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
  </svg>
);

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" className="shrink-0">
    <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.1 9 5 12 5z" />
    <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
    <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12s.7 2.3 1.9 4.7l3.7-2.9z" />
    <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.1-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z" />
  </svg>
);

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 50);
    async function checkSession() {
      const {
        data: { session },
      } = await getSupabase().auth.getSession();
      if (session) router.push("/dashboard");
    }
    checkSession();
  }, [router]);

  const reset = () => {
    setError("");
    setSuccess("");
  };

  const switchMode = (m: Mode) => {
    setMode(m);
    reset();
    setPassword("");
    setConfirmPassword("");
  };

  const handleSubmit = async () => {
    reset();
    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    if (mode === "forgot") {
      setLoading(true);
      const { error: e } = await getSupabase().auth.resetPasswordForEmail(
        email,
        {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        }
      );
      setLoading(false);
      if (e) setError(e.message);
      else setSuccess("Password reset link sent. Check your email.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    if (mode === "signup") {
      if (password.length < 8) {
        setError("Password must be at least 8 characters.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords don't match.");
        return;
      }
      setLoading(true);
      const { data, error: e } = await getSupabase().auth.signUp({
        email,
        password,
      });
      setLoading(false);
      if (e) {
        setError(e.message);
        return;
      }
      if (data.user) {
        setSuccess(
          "Account created. Check your email to confirm, then sign in."
        );
      }
      return;
    }

    setLoading(true);
    const { error: e } = await getSupabase().auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (e) {
      setError(e.message);
      return;
    }
    router.push("/dashboard");
  };

  const handleGoogleAuth = async () => {
    reset();
    setLoading(true);
    const { error: e } = await getSupabase().auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setLoading(false);
    if (e) setError(e.message);
  };

  const titles = {
    login: {
      h: "Log in",
      sub: "Log in to your account and seamlessly continue managing your projects, ideas, and progress just where you left off.",
      btn: "Log in",
    },
    signup: {
      h: "Sign up",
      sub: "Create your account to get started and enjoy a simple, secure, and personalized experience.",
      btn: "Sign up",
    },
    forgot: {
      h: "Reset password",
      sub: "Enter your email address and we'll send a reset link directly to your inbox.",
      btn: "Send reset link",
    },
  };

  return (
    <div className="min-h-screen bg-[#07080d] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      <style>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 1000px #0b0c12 inset !important;
          -webkit-text-fill-color: #ffffff !important;
          caret-color: #ffffff !important;
          border-radius: 9999px !important;
          transition: background-color 50000s ease-in-out 0s !important;
        }
      `}</style>

      {/* Background Radial Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-[radial-gradient(circle,rgba(37,99,235,0.15)_0%,rgba(14,165,233,0.06)_40%,transparent_70%)] blur-[90px]" />
        <div className="absolute top-1/4 right-1/4 w-[350px] h-[350px] bg-indigo-600/[0.06] rounded-full blur-[110px]" />
      </div>

      <div
        className="relative z-10 w-full max-w-[460px] my-auto"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(16px)",
          transition:
            "opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        {/* Top Logo */}
        <Link
          href="/"
          className="flex items-center justify-center gap-2.5 mb-6 group cursor-pointer"
        >
          <Logo size={32} className="w-8 h-8 group-hover:scale-105 transition-transform shrink-0" />
          <span className="font-semibold text-lg tracking-tight text-white">Saim</span>
        </Link>

        {/* Neumorphic Card Container */}
        <div className="relative bg-[#0d0e15] rounded-[32px] p-8 sm:p-10 shadow-[-16px_-16px_40px_rgba(255,255,255,0.02),20px_20px_50px_rgba(0,0,0,0.9)] border border-white/[0.07]">
          {/* Subtle Neumorphic Top Highlight Edge */}
          <div className="absolute inset-0 rounded-[32px] pointer-events-none border border-white/[0.04] shadow-[inset_1px_1px_2px_rgba(255,255,255,0.1)]" />

          {/* Heading Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-medium tracking-tight text-white mb-3">
              {titles[mode].h}
            </h1>
            <p className="text-zinc-400 text-xs sm:text-[13px] leading-relaxed max-w-sm mx-auto font-normal">
              {titles[mode].sub}
            </p>
          </div>

          <div className="space-y-4">
            {/* Email Input - Neumorphic Inset */}
            <div className="relative flex items-center w-full bg-[#0b0c12] shadow-[inset_4px_4px_10px_rgba(0,0,0,0.85),inset_-3px_-3px_8px_rgba(255,255,255,0.025)] border border-zinc-900 focus-within:border-blue-500/40 focus-within:ring-2 focus-within:ring-blue-500/10 rounded-full px-4 py-1 transition-all overflow-hidden">
              <div className="pl-1">
                <MailIcon />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="Enter your email address"
                className="w-full bg-transparent text-sm text-white placeholder-zinc-500 outline-none px-3 py-3 font-normal"
              />
            </div>

            {/* Password Input - Neumorphic Inset */}
            {mode !== "forgot" && (
              <div className="relative flex items-center w-full bg-[#0b0c12] shadow-[inset_4px_4px_10px_rgba(0,0,0,0.85),inset_-3px_-3px_8px_rgba(255,255,255,0.025)] border border-zinc-900 focus-within:border-blue-500/40 focus-within:ring-2 focus-within:ring-blue-500/10 rounded-full px-4 py-1 transition-all overflow-hidden">
                <div className="pl-1">
                  <LockIcon />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  placeholder="Enter your password"
                  className="w-full bg-transparent text-sm text-white placeholder-zinc-500 outline-none px-3 py-3 font-normal"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="pr-1 focus:outline-none"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff /> : <EyeOpen />}
                </button>
              </div>
            )}

            {/* Confirm Password Input (Signup) */}
            {mode === "signup" && (
              <div className="space-y-2">
                <div className="relative flex items-center w-full bg-[#0b0c12] shadow-[inset_4px_4px_10px_rgba(0,0,0,0.85),inset_-3px_-3px_8px_rgba(255,255,255,0.025)] border border-zinc-900 focus-within:border-blue-500/40 focus-within:ring-2 focus-within:ring-blue-500/10 rounded-full px-4 py-1 transition-all overflow-hidden">
                  <div className="pl-1">
                    <LockIcon />
                  </div>
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    placeholder="Confirm your password"
                    className="w-full bg-transparent text-sm text-white placeholder-zinc-500 outline-none px-3 py-3 font-normal"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="pr-1 focus:outline-none"
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirm ? <EyeOff /> : <EyeOpen />}
                  </button>
                </div>
                {confirmPassword && confirmPassword !== password && (
                  <p className="text-red-400 text-xs px-4">Passwords don't match</p>
                )}
                {confirmPassword && confirmPassword === password && (
                  <p className="text-emerald-400 text-xs px-4">Passwords match</p>
                )}
              </div>
            )}

            {/* Remember Me / Forgot Password Links (Login mode) */}
            {mode === "login" && (
              <div className="flex items-center justify-between px-2 pt-1 pb-1">
                <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-zinc-800 bg-zinc-900 text-blue-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  />
                  Remember me
                </label>
                <button
                  type="button"
                  onClick={() => switchMode("forgot")}
                  className="text-xs text-zinc-400 hover:text-white transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            {/* Error / Success Notifications */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-300 text-xs rounded-2xl px-4 py-3 text-center">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs rounded-2xl px-4 py-3 text-center">
                {success}
              </div>
            )}

            {/* Primary Submit Button - Neumorphic Extruded */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full mt-2 bg-[#161824] hover:bg-[#1c1f2e] active:scale-[0.99] active:shadow-[inset_3px_3px_8px_rgba(0,0,0,0.85),inset_-2px_-2px_6px_rgba(255,255,255,0.03)] shadow-[6px_6px_16px_rgba(0,0,0,0.8),-4px_-4px_12px_rgba(255,255,255,0.025)] text-white font-medium py-3.5 px-6 rounded-full text-sm transition-all duration-200 border border-white/[0.06] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              ) : (
                titles[mode].btn
              )}
            </button>

            {/* Google SSO Only Option */}
            {mode !== "forgot" && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-full bg-[#11131c] hover:bg-[#171926] active:scale-[0.99] active:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.8),inset_-2px_-2px_5px_rgba(255,255,255,0.02)] shadow-[5px_5px_14px_rgba(0,0,0,0.75),-4px_-4px_10px_rgba(255,255,255,0.025)] border border-white/[0.05] text-sm font-medium text-zinc-200 hover:text-white transition-all cursor-pointer"
                >
                  <GoogleIcon />
                  <span>Google</span>
                </button>
              </div>
            )}

            {/* Footer Navigation Link */}
            <div className="text-center pt-3 text-xs text-zinc-400">
              {mode === "login" && (
                <p>
                  Didn't have an account?{" "}
                  <button
                    onClick={() => switchMode("signup")}
                    className="text-blue-400 hover:text-blue-300 font-medium hover:underline transition-colors"
                  >
                    Sign up
                  </button>
                </p>
              )}
              {mode === "signup" && (
                <p>
                  Already have an account?{" "}
                  <button
                    onClick={() => switchMode("login")}
                    className="text-blue-400 hover:text-blue-300 font-medium hover:underline transition-colors"
                  >
                    Log in
                  </button>
                </p>
              )}
              {mode === "forgot" && (
                <p>
                  Remember your password?{" "}
                  <button
                    onClick={() => switchMode("login")}
                    className="text-blue-400 hover:text-blue-300 font-medium hover:underline transition-colors"
                  >
                    Log in
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>

        <p className="text-center text-zinc-600 text-xs mt-6">
          By continuing you agree to our{" "}
          <span className="text-zinc-500 hover:text-zinc-400 cursor-pointer transition-colors">
            Terms of Service
          </span>{" "}
          &{" "}
          <span className="text-zinc-500 hover:text-zinc-400 cursor-pointer transition-colors">
            Privacy Policy
          </span>
        </p>
      </div>
    </div>
  );
}

