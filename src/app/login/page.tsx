"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 50);

    // Redirect if already logged in
    async function checkSession() {
      const {
        data: { session },
      } = await getSupabase().auth.getSession();
      if (session) router.push("/dashboard");
    }
    checkSession();
  }, []);

  const handleSubmit = async () => {
    setError("");
    setSuccess("");
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);

    if (mode === "signup") {
      const { data, error: signUpError } = await getSupabase().auth.signUp({
        email,
        password,
      });
      if (signUpError) {
        setError(signUpError.message);
      } else if (data.user) {
        // Create a business row for the new user
        await getSupabase()
          .from("businesses")
          .insert({
            user_id: data.user.id,
            name: email.split("@")[0], // default name from email
            agent_persona: "friendly and professional",
            plan: "free",
          });
        setSuccess(
          "Account created! Check your email to confirm, then log in.",
        );
      }
    } else {
      const { error: signInError } =
        await getSupabase().auth.signInWithPassword({ email, password });
      if (signInError) {
        setError(signInError.message);
      } else {
        router.push("/dashboard");
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-4">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[400px] bg-blue-600/8 rounded-full blur-[120px]" />
      </div>

      <div
        className="relative z-10 w-full max-w-sm"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
        }}
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-10">
          <div className="w-8 h-8 rounded-xl bg-blue-500 flex items-center justify-center text-white font-bold text-sm">
            S
          </div>
          <span className="font-semibold text-lg tracking-tight">
            SalesAgent
          </span>
        </div>

        {/* Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          <h1 className="text-2xl font-bold mb-1">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="text-zinc-500 text-sm mb-8">
            {mode === "login"
              ? "Sign in to your dashboard"
              : "Start your 14-day free trial"}
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="you@company.com"
                className="w-full bg-zinc-800 border border-zinc-700 focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="••••••••"
                className="w-full bg-zinc-800 border border-zinc-700 focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 outline-none transition-colors"
              />
            </div>

            {error && (
              <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5">
                {error}
              </p>
            )}

            {success && (
              <p className="text-green-400 text-xs bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-2.5">
                {success}
              </p>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white font-semibold py-2.5 rounded-xl text-sm transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
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
                  {mode === "login" ? "Signing in..." : "Creating account..."}
                </>
              ) : mode === "login" ? (
                "Sign in →"
              ) : (
                "Create account →"
              )}
            </button>
          </div>
        </div>

        {/* Toggle mode */}
        <p className="text-center text-zinc-500 text-sm mt-6">
          {mode === "login"
            ? "Don't have an account?"
            : "Already have an account?"}{" "}
          <button
            onClick={() => {
              setMode(mode === "login" ? "signup" : "login");
              setError("");
              setSuccess("");
            }}
            className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
          >
            {mode === "login" ? "Sign up free" : "Sign in"}
          </button>
        </p>

        <p className="text-center text-zinc-600 text-xs mt-4">
          By continuing you agree to our Terms of Service
        </p>
      </div>
    </div>
  );
}
