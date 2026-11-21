"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import type { AuthChangeEvent } from "@supabase/supabase-js";
import Link from "next/link";
import Logo from "@/app/components/Logo";

const LockIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" className="text-slate-500 shrink-0">
    <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
  </svg>
);

const EyeOpen = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" className="text-slate-500 hover:text-slate-900 transition-colors shrink-0">
    <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M2.036 12c2.018-4.596 6.273-7.5 10.964-7.5 4.69 0 8.946 2.904 10.964 7.5-2.018 4.596-6.273 7.5-10.964 7.5-4.69 0-8.946-2.904-10.964-7.5z" />
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const EyeOff = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" className="text-slate-500 hover:text-slate-900 transition-colors shrink-0">
    <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
  </svg>
);

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [visible, setVisible] = useState(false);
  const [tokenReady, setTokenReady] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 50);

    const errorParam = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");
    const code = searchParams.get("code");

    if (errorParam || errorDescription) {
      setError(
        errorDescription ||
          "This password reset link is invalid or has expired. Please request a new link."
      );
      return;
    }

    const initAuth = async () => {
      const sb = getSupabase();
      if (code) {
        const { error: exchangeErr } = await sb.auth.exchangeCodeForSession(code);
        if (exchangeErr) {
          setError(
            "Failed to verify reset token: " +
              exchangeErr.message +
              ". Please request a new link."
          );
        } else {
          setTokenReady(true);
        }
      } else {
        const { data } = await sb.auth.getSession();
        if (data.session) {
          setTokenReady(true);
        }
      }
    };
    initAuth();

    const {
      data: { subscription },
    } = getSupabase().auth.onAuthStateChange((event: AuthChangeEvent) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
        setTokenReady(true);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [searchParams]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError("");
    setSuccess("");

    if (!password) {
      setError("Please enter your new password.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const { error: updateErr } = await getSupabase().auth.updateUser({
      password,
    });
    setLoading(false);

    if (updateErr) {
      setError(updateErr.message);
    } else {
      setSuccess("Your password has been updated successfully! Redirecting...");
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f8fc] text-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
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
          <span className="font-semibold text-lg tracking-tight text-slate-900">Saim</span>
        </Link>

        {/* Card Container */}
        <div className="relative bg-white rounded-[32px] p-8 sm:p-10 shadow-[0_1px_2px_rgba(15,23,42,0.05),0_8px_24px_-14px_rgba(15,23,42,0.18)] border border-slate-200">
          <div className="absolute inset-0 rounded-[32px] pointer-events-none border border-slate-100 " />

          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-medium tracking-tight text-slate-900 mb-3">
              Set new password
            </h1>
            <p className="text-slate-500 text-xs sm:text-[13px] leading-relaxed max-w-sm mx-auto font-normal">
              Enter a strong password below to update your account access.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* New Password Input */}
            <div className="relative flex items-center w-full bg-slate-50 shadow-[inset_0_1px_2px_rgba(15,23,42,0.06)] border border-slate-200 focus-within:border-blue-500/40 focus-within:ring-2 focus-within:ring-blue-500/10 rounded-full px-4 py-1 transition-all overflow-hidden">
              <div className="pl-1">
                <LockIcon />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New password (min. 8 characters)"
                className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 outline-none px-3 py-3 font-normal"
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

            {/* Confirm Password Input */}
            <div className="space-y-2">
              <div className="relative flex items-center w-full bg-slate-50 shadow-[inset_0_1px_2px_rgba(15,23,42,0.06)] border border-slate-200 focus-within:border-blue-500/40 focus-within:ring-2 focus-within:ring-blue-500/10 rounded-full px-4 py-1 transition-all overflow-hidden">
                <div className="pl-1">
                  <LockIcon />
                </div>
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 outline-none px-3 py-3 font-normal"
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
                <p className="text-red-600 text-xs px-4">Passwords don't match</p>
              )}
              {confirmPassword && confirmPassword === password && (
                <p className="text-emerald-600 text-xs px-4">Passwords match</p>
              )}
            </div>

            {/* Error / Success Notifications */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-700 text-xs rounded-2xl px-4 py-3 text-center">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-xs rounded-2xl px-4 py-3 text-center">
                {success}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-white hover:bg-slate-50 active:scale-[0.99] shadow-sm text-slate-900 font-medium py-3.5 px-6 rounded-full text-sm transition-all duration-200 border border-slate-200 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <svg className="animate-spin h-4 w-4 text-slate-900" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              ) : (
                "Update Password"
              )}
            </button>
          </form>

          {/* Footer Back Link */}
          <div className="text-center pt-5 text-xs text-slate-500">
            <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f7f8fc] flex items-center justify-center text-slate-500 text-sm">
          Loading...
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
