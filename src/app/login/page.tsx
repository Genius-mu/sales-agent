"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import Link from "next/link";
import Logo from "@/app/components/Logo";
import DeviceMockup from "@/app/components/DeviceMockup";
import TagButton from "@/app/components/TagButton";

type Mode = "login" | "signup" | "forgot";

const MailIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" className="text-slate-400 shrink-0">
    <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
);

const LockIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" className="text-slate-400 shrink-0">
    <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
  </svg>
);

const EyeOpen = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" className="text-slate-400 hover:text-slate-700 transition-colors shrink-0">
    <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M2.036 12c2.018-4.596 6.273-7.5 10.964-7.5 4.69 0 8.946 2.904 10.964 7.5-2.018 4.596-6.273 7.5-10.964 7.5-4.69 0-8.946-2.904-10.964-7.5z" />
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const EyeOff = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" className="text-slate-400 hover:text-slate-700 transition-colors shrink-0">
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
      sub: "Your leads are waiting.",
      btn: "Log in",
    },
    signup: {
      h: "Create your free agent",
      sub: "No card needed. Live in 5 minutes.",
      btn: "Create free account",
    },
    forgot: {
      h: "Reset password",
      sub: "We'll email you a reset link.",
      btn: "Send reset link",
    },
  };

  const field =
    "relative flex items-center w-full bg-white border-2 border-slate-900 rounded-2xl px-4 shadow-[2px_3px_0_#0f172a] focus-within:shadow-[2px_3px_0_#2563eb] focus-within:border-blue-600 transition-all";
  const input =
    "w-full bg-transparent text-[15px] text-slate-900 placeholder-slate-400 outline-none px-3 py-3.5";

  return (
    <div className="min-h-screen bg-[#f7f8fc] text-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      <style>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 1000px #ffffff inset !important;
          -webkit-text-fill-color: #0f172a !important;
          transition: background-color 50000s ease-in-out 0s !important;
        }
      `}</style>

      {/* Pastel background + dots */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-40 -left-32 w-[520px] h-[520px] bg-blue-200/50 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 -right-32 w-[520px] h-[520px] bg-pink-200/40 rounded-full blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.35]" style={{ backgroundImage: "radial-gradient(#cbd5e1 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
      </div>

      <div className="relative z-10 w-full max-w-6xl my-auto grid lg:grid-cols-2 gap-10 items-center">
        <AuthShowcase />

        <div
          className="relative w-full max-w-[440px] mx-auto"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <Link href="/" className="flex items-center justify-center gap-2 mb-6">
            <Logo size={32} className="w-8 h-8 shrink-0" />
            <span className="font-bold text-lg tracking-tight">Saim</span>
          </Link>

          <div className="relative bg-white rounded-[28px] p-7 sm:p-9 border-2 border-slate-900 shadow-[6px_7px_0_#0f172a]">
            {/* Log in / Sign up tabs */}
            {mode !== "forgot" && (
              <div className="relative grid grid-cols-2 p-1 mb-7 rounded-2xl bg-slate-100 border-2 border-slate-900">
                <span
                  className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-xl bg-yellow-300 border-2 border-slate-900 shadow-[2px_2px_0_#0f172a] transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                  style={{ transform: mode === "signup" ? "translateX(100%)" : "translateX(0)", left: 4 }}
                  aria-hidden="true"
                />
                {(["login", "signup"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => switchMode(m)}
                    className={`relative z-10 py-2.5 text-[14px] font-bold rounded-xl transition-colors ${mode === m ? "text-slate-900" : "text-slate-500 hover:text-slate-800"}`}
                  >
                    {m === "login" ? "Log in" : "Sign up"}
                  </button>
                ))}
              </div>
            )}

            <div key={mode} className="form-swap">
              <div className="text-center mb-7">
                <h1 className="text-[28px] font-bold tracking-tight mb-1.5">{titles[mode].h}</h1>
                <p className="text-slate-500 text-[14px]">{titles[mode].sub}</p>
              </div>

              <div className="space-y-4">
                <div className={field}>
                  <MailIcon />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    placeholder="Email address"
                    autoComplete="email"
                    className={input}
                  />
                </div>

                {mode !== "forgot" && (
                  <div className={field}>
                    <LockIcon />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                      placeholder="Password"
                      autoComplete={mode === "signup" ? "new-password" : "current-password"}
                      className={input}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password visibility">
                      {showPassword ? <EyeOff /> : <EyeOpen />}
                    </button>
                  </div>
                )}

                {mode === "signup" && password.length > 0 && password.length < 8 && (
                  <p className="text-slate-500 text-xs px-2 -mt-2">At least 8 characters ({8 - password.length} more)</p>
                )}

                {mode === "signup" && (
                  <div className="space-y-2">
                    <div className={field}>
                      <LockIcon />
                      <input
                        type={showConfirm ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                        placeholder="Confirm password"
                        autoComplete="new-password"
                        className={input}
                      />
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)} aria-label="Toggle confirm password visibility">
                        {showConfirm ? <EyeOff /> : <EyeOpen />}
                      </button>
                    </div>
                    {confirmPassword && confirmPassword !== password && (
                      <p className="text-red-600 text-xs px-2">Passwords don&apos;t match</p>
                    )}
                    {confirmPassword && confirmPassword === password && (
                      <p className="text-green-700 text-xs px-2">Passwords match ✓</p>
                    )}
                  </div>
                )}

                {mode === "login" && (
                  <div className="flex items-center justify-between px-1">
                    <label className="flex items-center gap-2 text-[13px] text-slate-600 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded accent-blue-600 cursor-pointer"
                      />
                      Remember me
                    </label>
                    <button type="button" onClick={() => switchMode("forgot")} className="text-[13px] font-medium text-blue-600 hover:text-blue-700">
                      Forgot password?
                    </button>
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 border-2 border-red-500 text-red-700 text-[13px] rounded-2xl px-4 py-3 text-center">{error}</div>
                )}
                {success && (
                  <div className="bg-green-50 border-2 border-green-600 text-green-800 text-[13px] rounded-2xl px-4 py-3 text-center">{success}</div>
                )}

                {/* Matching pair: right-slanted submit, left-slanted Google */}
                <div className="pt-2 space-y-3">
                  <TagButton onClick={handleSubmit} disabled={loading} variant="primary" slant="right" fullWidth height={50}>
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
                    <TagButton onClick={handleGoogleAuth} variant="secondary" slant="left" fullWidth height={50}>
                      <GoogleIcon />
                      <span>Continue with Google</span>
                    </TagButton>
                  )}
                </div>

                {mode === "forgot" && (
                  <p className="text-center pt-1 text-[13px] text-slate-500">
                    Remember it?{" "}
                    <button onClick={() => switchMode("login")} className="font-semibold text-blue-600 hover:text-blue-700">
                      Log in
                    </button>
                  </p>
                )}
              </div>
            </div>
          </div>

          <p className="text-center text-slate-500 text-xs mt-6">
            By continuing you agree to our Terms of Service &amp; Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}

function AuthShowcase() {
  return (
    <div className="hidden lg:block text-center">
      <div className="relative mx-auto w-full max-w-[520px] mb-8">
        <DeviceMockup />
      </div>
      <h2 className="text-[34px] font-bold tracking-tight leading-tight mb-2">Every visitor answered.</h2>
      <p className="text-slate-500 text-[16px]">Live in 5 minutes. Free to start.</p>
    </div>
  );
}
