"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";

const links = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/analytics", label: "Analytics" },
  { href: "/dashboard/conversations", label: "Conversations" },
  { href: "/dashboard/setup", label: "Setup" },
  { href: "/dashboard/embed", label: "Embed" },
  { href: "/dashboard/billing", label: "Billing" },
];

export default function DashboardNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const {
        data: { session },
      } = await getSupabase().auth.getSession();
      setEmail(session?.user?.email || "");
    }
    loadUser();
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const signOut = async () => {
    await getSupabase().auth.signOut();
    router.push("/login");
  };

  const initials = email ? email[0].toUpperCase() : "U";

  return (
    <>
      <nav className="sticky top-0 z-40 border-b border-zinc-800 bg-[#080809]/90 backdrop-blur-xl">
        <div className="flex items-center justify-between px-5 md:px-8 py-3.5">
          {/* Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center text-white text-xs font-bold shadow-sm shadow-blue-500/30">
              <Link href="/">S</Link>
            </div>
            <span className="text-white font-bold text-sm tracking-tight">
              SalesAgent
            </span>
          </div>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-0.5">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    active
                      ? "bg-zinc-800 text-white"
                      : "text-zinc-500 hover:text-white hover:bg-zinc-800/60"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2.5">
            {/* Email — hidden on small */}
            {email && (
              <span className="text-zinc-600 text-xs hidden lg:block truncate max-w-[160px]">
                {email}
              </span>
            )}

            {/* Sign out — hidden on mobile */}
            <button
              onClick={signOut}
              className="hidden md:block text-xs text-zinc-500 hover:text-white border border-zinc-800 hover:border-zinc-700 px-3 py-1.5 rounded-lg transition-all"
            >
              Sign out
            </button>

            {/* Avatar */}
            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {initials}
            </div>

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMenuOpen((p) => !p)}
              className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
              aria-label="Toggle menu"
            >
              <span
                className={`block w-4 h-0.5 bg-zinc-400 transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
              />
              <span
                className={`block w-4 h-0.5 bg-zinc-400 transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`block w-4 h-0.5 bg-zinc-400 transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
              />
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
        >
          <div className="px-4 pb-4 pt-1 border-t border-zinc-800/60 space-y-1">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? "bg-zinc-800 text-white"
                      : "text-zinc-500 hover:text-white hover:bg-zinc-800/60"
                  }`}
                >
                  {active && (
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                  )}
                  {link.label}
                </Link>
              );
            })}

            {/* Divider */}
            <div className="h-px bg-zinc-800/60 my-2" />

            {/* Email + sign out in mobile menu */}
            {email && (
              <p className="px-4 py-1 text-zinc-600 text-xs truncate">
                {email}
              </p>
            )}
            <button
              onClick={signOut}
              className="w-full text-left px-4 py-2.5 rounded-xl text-sm text-zinc-400 hover:text-red-400 hover:bg-red-500/5 transition-all font-medium"
            >
              Sign out
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
