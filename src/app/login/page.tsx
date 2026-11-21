"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import Link from "next/link";
import Logo from "@/app/components/Logo";
import HeroOrb from "@/app/components/HeroOrb";
import Tilt3D from "@/app/components/Tilt3D";
import TagButton from "@/app/components/TagButton";

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
    const requested = new URLSearchParams(window.location.search).get("mode");
    if (requested === "signup" || requested === "forgot") setMode(requested);
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
          redirectTo: `${window.location.origin}/auth/callback?next=/auth/reset-password`,
        }
      );
      setLoading(false);
      if (e) {
        if (e.message.toLowerCase().includes("rate limit") || e.status === 429) {
          setError("Email rate limit exceeded. Please wait a few minutes before trying again or configure a custom SMTP in Supabase Dashboard.");
        } else {
          setError(e.message);
        }
      } else {
        setSuccess("Password reset link sent. Check your email.");
      }
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
        if (e.message.toLowerCase().includes("rate limit") || e.status === 429) {
          setError("Email rate limit exceeded. Please wait a few minutes before trying again or configure custom SMTP in Supabase.");
        } else {
          setError(e.message);
        }
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
    if (e) {
      if (
        e.message.toLowerCase().includes("provider is not enabled") ||
        e.message.toLowerCase().includes("unsupported provider")
      ) {
        setError(
          "Google Sign-In is not enabled. Please enable the Google Provider under Authentication -> Providers in your Supabase Dashboard."
        );
      } else {
        setError(e.message);
      }
    }
  };

  const titles = {
    login: {
      h: "Welcome back",
      sub: "Your leads are waiting. Log in to see who your agent spoke to.",
      btn: "Log in",
    },
    signup: {
      h: "Create your free sales agent",
      sub: "Free plan, no card needed. Your agent can be live on your website in 5 minutes.",
      btn: "Create free account",
    },
    forgot: {
      h: "Reset your password",
      sub: "Enter your email and we'll send a reset link straight to your inbox.",
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

      <div className="relative z-10 w-full max-w-6xl my-auto grid lg:grid-cols-2 gap-12 items-center">
      <AuthShowcase />
      <div
        className="relative w-full max-w-[460px] mx-auto"
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

          {/* Log in / Sign up tabs */}
          {mode !== "forgot" && (
            <div className="relative grid grid-cols-2 p-1 mb-8 rounded-full bg-[#0b0c12] border border-zinc-900 shadow-[inset_3px_3px_8px_rgba(0,0,0,0.8)]">
              <span
                className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full bg-[#1a1d2b] border border-white/[0.07] shadow-[0_4px_14px_rgba(0,0,0,0.6)] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{ transform: mode === "signup" ? "translateX(calc(100% + 0px))" : "translateX(0)", left: 4 }}
                aria-hidden="true"
              />
              {(["login", "signup"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => switchMode(m)}
                  className={`relative z-10 py-2.5 text-[13px] font-medium rounded-full transition-colors ${mode === m ? "text-white" : "text-zinc-500 hover:text-zinc-300"}`}
                >
                  {m === "login" ? "Log in" : "Sign up"}
                </button>
              ))}
            </div>
          )}

          <div key={mode} className="form-swap">
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

            {mode === "signup" && password.length > 0 && password.length < 8 && (
              <p className="text-zinc-500 text-xs px-4 -mt-2">At least 8 characters ({8 - password.length} more)</p>
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
                  <p className="text-red-400 text-xs px-4">Passwords don&apos;t match</p>
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
                  Forgot password?
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

            {/* Primary submit + Google: a matching pair of tag buttons */}
            <div className="pt-2 space-y-3">
              <TagButton
                onClick={handleSubmit}
                disabled={loading}
                variant="primary"
                slant="down"
                fullWidth
                height={50}
              >
                {loading ? (
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                ) : (
                  titles[mode].btn
                )}
              </TagButton>

              {mode !== "forgot" && (
                <TagButton
                  onClick={handleGoogleAuth}
                  variant="secondary"
                  slant="up"
                  fullWidth
                  height={50}
                >
                  <GoogleIcon />
                  <span>Continue with Google</span>
                </TagButton>
              )}
            </div>

            {/* Footer Navigation Link */}
            <div className="text-center pt-3 text-xs text-zinc-400">
              {mode === "login" && (
                <p>
                  Don't have an account?{" "}
                  <button
                    onClick={() => switchMode("signup")}
                    className="text-blue-400 hover:text-blue-300 font-medium hover:underline transition-colors"
                  >
                    Sign up free
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
    </div>
  );
}

const SHOWCASE_BUBBLES = [
  { text: "Do you deliver to Lekki? How much for 3 bedrooms?", from: "visitor", className: "top-[6%] left-[2%]" },
  { text: "Yes! 3-bed packages start at ₦450k. When are you moving?", from: "agent", className: "top-[30%] right-[0%] auth-float-2" },
  { text: "New lead · moving in 2 weeks · email captured", from: "lead", className: "bottom-[8%] left-[8%] auth-float-3" },
] as const;

function AuthShowcase() {
  return (
    <div className="hidden lg:block">
      <div className="relative h-[360px] mb-8">
        <div className="absolute inset-0 flex items-center justify-center">
          <HeroOrb />
        </div>
        {SHOWCASE_BUBBLES.map((b) => (
          <div key={b.text} className={`absolute auth-float ${b.className}`}>
            <Tilt3D max={10}>
              <div
                className={`max-w-[260px] px-4 py-3 rounded-2xl text-[13px] leading-relaxed backdrop-blur-md shadow-[0_20px_50px_-12px_rgba(0,0,0,0.8)] ${
                  b.from === "visitor"
                    ? "bg-zinc-900/80 border border-zinc-700/60 text-zinc-200 rounded-bl-sm"
                    : b.from === "agent"
                      ? "bg-blue-600/90 border border-blue-400/40 text-white rounded-br-sm"
                      : "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300"
                }`}
              >
                {b.from === "lead" && <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2 animate-pulse align-middle" />}
                {b.text}
              </div>
            </Tilt3D>
          </div>
        ))}
      </div>
      <h2 className="text-3xl font-semibold tracking-tight leading-tight mb-3 bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
        Every visitor answered.<br />Every lead captured.
      </h2>
      <p className="text-zinc-400 text-[15px] leading-relaxed max-w-md mb-6">
        Saim talks to your website visitors day and night, learns what they need, and hands you their contact details.
      </p>
      <ul className="space-y-2.5">
        {["Live on your site in 5 minutes", "Free plan, no card needed", "Read every conversation in your dashboard"].map((t) => (
          <li key={t} className="flex items-center gap-2.5 text-zinc-300 text-[14px]">
            <span className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-[11px]">✓</span>
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}
