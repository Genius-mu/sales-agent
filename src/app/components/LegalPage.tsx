import Link from "next/link";
import Logo from "@/app/components/Logo";

/** Contact details shown on every policy page. Change them here once. */
export const LEGAL = {
  business: "Saim",
  operator: "Mustapha Abefe Adegbite",
  location: "Lagos, Nigeria",
  email: "adegbitemustapha73@gmail.com",
  updated: "21 November 2026",
};

const LINKS = [
  { href: "/terms", label: "Terms of Service" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/refunds", label: "Refund Policy" },
];

export default function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f7f8fc] text-slate-900 font-sans antialiased">
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-3xl mx-auto px-5 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Logo size={26} className="w-[26px] h-[26px]" />
            <span className="font-bold text-[16px]">Saim</span>
          </Link>
          <Link href="/" className="text-[14px] text-slate-600 hover:text-slate-900">← Back to site</Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-5 py-10 sm:py-14">
        <h1 className="text-[32px] sm:text-[40px] font-bold tracking-tight mb-2">{title}</h1>
        <p className="text-slate-500 text-[14px] mb-10">Last updated: {LEGAL.updated}</p>
        <article className="legal-prose">{children}</article>

        <nav className="mt-14 pt-6 border-t border-slate-200 flex flex-wrap gap-x-6 gap-y-2 text-[14px]">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="text-slate-600 hover:text-slate-900 underline-offset-2 hover:underline">
              {l.label}
            </Link>
          ))}
        </nav>
      </main>
    </div>
  );
}

/** Small row of policy links for page footers. */
export function LegalLinks({ className = "" }: { className?: string }) {
  return (
    <span className={`flex flex-wrap items-center gap-x-4 gap-y-1 ${className}`}>
      {LINKS.map((l) => (
        <Link key={l.href} href={l.href} className="hover:underline underline-offset-2">
          {l.label}
        </Link>
      ))}
    </span>
  );
}
