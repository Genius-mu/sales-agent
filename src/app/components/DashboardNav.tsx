"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/analytics", label: "Analytics" },
  { href: "/dashboard/setup", label: "Setup" },
  { href: "/dashboard/embed", label: "Embed" },
];

export default function DashboardNav() {
  const pathname = usePathname();

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

      <div className="w-7 h-7 rounded-full bg-zinc-700 flex items-center justify-center text-zinc-300 text-xs font-medium">
        U
      </div>
    </nav>
  );
}
