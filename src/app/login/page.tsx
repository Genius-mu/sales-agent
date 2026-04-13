"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type Mode = "login" | "signup" | "forgot";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
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
  }, []);

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
      setError("Please enter your email.");
      return;
    }

    if (mode === "forgot") {
      setLoading(true);
      const { error: e } = await getSupabase().auth.resetPasswordForEmail(
        email,
        {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        },
      );
      setLoading(false);
      if (e) setError(e.message);
      else setSuccess("Password reset link sent! Check your email.");
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
        await getSupabase()
          .from("businesses")
          .insert({
            user_id: data.user.id,
            name: email.split("@")[0],
            agent_persona: "friendly and professional",
            plan: "free",
          });
        setSuccess(
          "Account created! Check your email to confirm, then sign in.",
        );
      }
      return;
    }

    // Login
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

  const titles = {
    login: { h: "Welcome back", sub: "Sign in to your dashboard" },
    signup: {
      h: "Create your account",
      sub: "Start your 14-day free trial — no card needed",
    },
    forgot: {
      h: "Reset your password",
      sub: "Enter your email and we'll send you a reset link",
    },
  };

  return (
    <div className="min-h-screen pt-4 bg-[#060608] text-white flex items-center justify-center px-4">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-600/8 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-indigo-600/5 rounded-full blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />
      </div>

      <div
        className="relative z-10 w-full max-w-sm"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(16px)",
          transition:
            "opacity 0.5s cubic-bezier(0.16,1,0.3,1), transform 0.5s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center justify-center gap-2.5 mb-10 group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
            S
          </div>
          <span className="font-black text-lg tracking-tight">Saim</span>
        </Link>

        {/* Card */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-8 backdrop-blur-sm shadow-2xl shadow-black/40">
          {/* Mode tabs — only for login/signup */}
          {mode !== "forgot" && (
            <div className="flex items-center gap-1 p-1 bg-zinc-800/60 rounded-xl mb-6">
              {(["login", "signup"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => switchMode(m)}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all capitalize ${mode === m ? "bg-zinc-700 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"}`}
                >
                  {m === "login" ? "Sign in" : "Sign up"}
                </button>
              ))}
            </div>
          )}

          <h1 className="text-xl font-black mb-1">{titles[mode].h}</h1>
          <p className="text-zinc-500 text-xs mb-6 leading-relaxed">
            {titles[mode].sub}
          </p>

          <div className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="you@company.com"
                className="w-full bg-zinc-800/80 border border-zinc-700 focus:border-blue-500/60 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 outline-none transition-colors focus:bg-zinc-800"
              />
            </div>

            {/* Password */}
            {mode !== "forgot" && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-zinc-400">
                    Password
                  </label>
                  {mode === "login" && (
                    <button
                      onClick={() => switchMode("forgot")}
                      className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    placeholder="••••••••"
                    className="w-full bg-zinc-800/80 border border-zinc-700 focus:border-blue-500/60 rounded-xl px-4 py-2.5 pr-10 text-sm text-white placeholder:text-zinc-600 outline-none transition-colors focus:bg-zinc-800"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    {showPassword ? (
                      <svg
                        width="16"
                        height="16"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          d="M3 3l18 18M10.477 10.477A3 3 0 0 0 13.5 13.5M6.357 6.357A9.98 9.98 0 0 0 3.1 12c1.636 4.096 5.618 7 10.9 7a9.98 9.98 0 0 0 5.64-1.738M9.53 4.64A9.98 9.98 0 0 1 12 4c5.282 0 9.264 2.904 10.9 7a9.967 9.967 0 0 1-2.33 3.57"
                        />
                      </svg>
                    ) : (
                      <svg
                        width="16"
                        height="16"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          d="M2.1 12C3.736 7.904 7.718 5 13 5s9.264 2.904 10.9 7c-1.636 4.096-5.618 7-10.9 7S3.736 16.096 2.1 12Z"
                        />
                        <circle
                          cx="13"
                          cy="12"
                          r="3"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                {mode === "signup" && password && (
                  <div className="mt-1.5 flex items-center gap-1.5">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all ${password.length >= i * 3 ? (i <= 1 ? "bg-red-500" : i <= 2 ? "bg-amber-500" : i <= 3 ? "bg-blue-500" : "bg-emerald-500") : "bg-zinc-700"}`}
                      />
                    ))}
                    <span className="text-xs text-zinc-600 ml-1">
                      {password.length < 4
                        ? "Weak"
                        : password.length < 7
                          ? "Fair"
                          : password.length < 10
                            ? "Good"
                            : "Strong"}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Confirm password for signup */}
            {mode === "signup" && (
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    placeholder="••••••••"
                    className={`w-full bg-zinc-800/80 border rounded-xl px-4 py-2.5 pr-10 text-sm text-white placeholder:text-zinc-600 outline-none transition-colors focus:bg-zinc-800 ${confirmPassword && confirmPassword !== password ? "border-red-500/60 focus:border-red-500/60" : confirmPassword && confirmPassword === password ? "border-emerald-500/60 focus:border-emerald-500/60" : "border-zinc-700 focus:border-blue-500/60"}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    {showConfirm ? (
                      <svg
                        width="16"
                        height="16"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          d="M3 3l18 18M10.477 10.477A3 3 0 0 0 13.5 13.5M6.357 6.357A9.98 9.98 0 0 0 3.1 12c1.636 4.096 5.618 7 10.9 7a9.98 9.98 0 0 0 5.64-1.738M9.53 4.64A9.98 9.98 0 0 1 12 4c5.282 0 9.264 2.904 10.9 7a9.967 9.967 0 0 1-2.33 3.57"
                        />
                      </svg>
                    ) : (
                      <svg
                        width="16"
                        height="16"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          d="M2.1 12C3.736 7.904 7.718 5 13 5s9.264 2.904 10.9 7c-1.636 4.096-5.618 7-10.9 7S3.736 16.096 2.1 12Z"
                        />
                        <circle
                          cx="13"
                          cy="12"
                          r="3"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                {confirmPassword && confirmPassword !== password && (
                  <p className="text-red-400 text-xs mt-1">
                    Passwords don't match
                  </p>
                )}
                {confirmPassword && confirmPassword === password && (
                  <p className="text-emerald-400 text-xs mt-1">
                    ✓ Passwords match
                  </p>
                )}
              </div>
            )}

            {/* Error / Success */}
            {error && (
              <div className="flex items-start gap-2.5 text-red-400 bg-red-500/8 border border-red-500/20 rounded-xl px-4 py-3">
                <svg
                  width="14"
                  height="14"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="shrink-0 mt-0.5"
                >
                  <path
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
                  />
                </svg>
                <p className="text-xs leading-relaxed">{error}</p>
              </div>
            )}
            {success && (
              <div className="flex items-start gap-2.5 text-emerald-400 bg-emerald-500/8 border border-emerald-500/20 rounded-xl px-4 py-3">
                <svg
                  width="14"
                  height="14"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="shrink-0 mt-0.5"
                >
                  <path
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <p className="text-xs leading-relaxed">{success}</p>
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white font-black py-3 rounded-xl text-sm transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  {mode === "login"
                    ? "Signing in..."
                    : mode === "signup"
                      ? "Creating account..."
                      : "Sending link..."}
                </>
              ) : mode === "login" ? (
                "Sign in →"
              ) : mode === "signup" ? (
                "Create account →"
              ) : (
                "Send reset link →"
              )}
            </button>

            {/* Back to login from forgot */}
            {mode === "forgot" && (
              <button
                onClick={() => switchMode("login")}
                className="w-full text-zinc-500 hover:text-zinc-300 text-xs transition-colors text-center"
              >
                <ArrowLeft size={15} color="#fff" className="mr-2" /> Back to sign in
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-zinc-700 text-xs mt-6">
          By continuing you agree to our{" "}
          <span className="text-zinc-500 hover:text-zinc-300 cursor-pointer transition-colors">
            Terms of Service
          </span>{" "}
          and{" "}
          <span className="text-zinc-500 hover:text-zinc-300 cursor-pointer transition-colors">
            Privacy Policy
          </span>
        </p>
      </div>
    </div>
  );
}
