"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = { href: string; label: string };

const navItems: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/chat", label: "Ask PolicyLens" },
  { href: "/policies", label: "Policies" },
  { href: "/dashboard", label: "Dashboard" },
];

function BrandMark() {
  return (
    <div
      aria-hidden
      className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10"
    >
      <svg viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px]">
        <path
          d="M5 12l4 4L19 6"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function DesktopNav({ pathname }: { pathname: string }) {
  return (
    <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
      {navItems.map((item) => {
        const active =
          item.href === "/"
            ? pathname === "/"
            : pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            className={[
              "inline-flex h-9 items-center rounded-full px-4 text-sm font-medium transition-colors",
              active
                ? "bg-slate-100 text-slate-950 dark:bg-slate-800 dark:text-slate-50"
                : "text-slate-600 hover:text-slate-950 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-50 dark:hover:bg-slate-900",
            ].join(" ")}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function MobileNav({ pathname }: { pathname: string }) {
  return (
    <nav
      className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-1 border-t border-slate-200/70 px-6 py-2 sm:px-10 lg:px-16 dark:border-slate-800/70"
      aria-label="Mobile"
    >
      {navItems.map((item) => {
        const active =
          item.href === "/"
            ? pathname === "/"
            : pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            className={[
              "inline-flex h-9 flex-1 items-center justify-center rounded-full px-3 text-sm font-medium transition-colors",
              active
                ? "bg-slate-100 text-slate-950 dark:bg-slate-800 dark:text-slate-50"
                : "text-slate-600 hover:text-slate-950 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-50 dark:hover:bg-slate-900",
            ].join(" ")}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function Navbar({
  health,
}: {
  health?: { status: "ok" | "degraded"; service: string } | null;
}) {
  const pathname = usePathname() ?? "/";
  const isHome = pathname === "/";

  return (
    <header
      className={[
        "sticky top-0 z-40 w-full border-b backdrop-blur",
        isHome
          ? "border-transparent bg-transparent"
          : "border-slate-200/70 bg-white/80 dark:border-slate-800/70 dark:bg-slate-950/70",
      ].join(" ")}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6 sm:px-10 lg:px-16">
        <Link href="/" className="flex items-center gap-2.5 group">
          <BrandMark />
          <span className="text-lg font-semibold tracking-tight text-slate-950 dark:text-slate-50 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
            PolicyLens
          </span>
        </Link>

        <DesktopNav pathname={pathname} />

        <div className="flex items-center gap-3">
          <div
            className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1.5 text-xs text-slate-600 shadow-sm sm:flex dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-300"
            aria-live="polite"
          >
            <span
              className={[
                "h-2 w-2 rounded-full",
                health?.status === "ok"
                  ? "bg-emerald-500"
                  : health?.status === "degraded"
                    ? "bg-amber-500 animate-pulse"
                    : "bg-slate-400",
              ].join(" ")}
              aria-hidden
            />
            {health?.status === "ok"
              ? "API connected"
              : health?.status === "degraded"
                ? "API degraded"
                : "Demo workspace"}
          </div>

          <Link
            href="/chat"
            className="hidden sm:inline-flex h-9 items-center justify-center rounded-full bg-slate-950 px-4 text-sm font-medium text-white transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
          >
            Ask PolicyLens
          </Link>
        </div>
      </div>

      <div className="md:hidden">
        <MobileNav pathname={pathname} />
      </div>
    </header>
  );
}
