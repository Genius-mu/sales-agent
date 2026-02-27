"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";

const links = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/analytics", label: "Analytics" },
  { href: "/dashboard/setup", label: "Setup" },
  { href: "/dashboard/embed", label: "Embed" },
  { href: "/dashboard/billing", label: "Billing" },
];

export default function DashboardNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [email, setEmail] = useState("");

  useEffect(() => {
    async function loadUser() {
      const {
        data: { session },
      } = await getSupabase().auth.getSession();
      setEmail(session?.user?.email || "");
    }
    loadUser();
  }, []);

  const signOut = async () => {
    await getSupabase().auth.signOut();
    router.push("/login");
  };

  const initials = email ? email[0].toUpperCase() : "U";

  return (
    <nav className="flex items-center justify-between px-8 py-4 border-b border-zinc-800 bg-zinc-950">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
          S
        </div>
        <span className="text-white font-semibold text-sm tracking-tight">
          SalesAgent
        </span>
      </div>

      <div className="flex items-center gap-1">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                active
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        {email && (
          <span className="text-zinc-500 text-xs hidden md:block">{email}</span>
        )}
        <button
          onClick={signOut}
          className="text-xs text-zinc-500 hover:text-white border border-zinc-800 hover:border-zinc-700 px-3 py-1.5 rounded-lg transition-all"
        >
          Sign out
        </button>
        <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
          {initials}
        </div>
      </div>
    </nav>
  );
}
