"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { getHealth, type HealthStatus } from "@/app/api";
import { UserProfileModal } from "@/components/UserProfileModal";

type NavItem = { href: string; label: string };

const navItems: NavItem[] = [
  { href: "/", label: "Overview" },
  { href: "/chat", label: "Grounded Chat" },
  { href: "/policies", label: "Policy Vault" },
  { href: "/review-queue", label: "Review Queue" },
  { href: "/dashboard", label: "Analytics" },
];

function BrandMark() {
  return (
    <div
      aria-hidden
      className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20 ring-1 ring-emerald-400/40"
    >
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
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
              "inline-flex h-9 items-center rounded-full px-4 text-sm font-medium transition-all",
              active
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-sm"
                : "text-slate-600 hover:text-slate-950 hover:bg-slate-100/80 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800/60",
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
  health: propHealth,
}: {
  health?: HealthStatus | null;
}) {
  const pathname = usePathname() ?? "/";
  const { user, logout, setIsProfileModalOpen } = useAuth();
  const [health, setHealth] = useState<HealthStatus | null>(propHealth ?? null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    getHealth()
      .then((res) => {
        if (mounted) setHealth(res);
      })
      .catch(() => {
        if (mounted) setHealth(null);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/70 bg-white/80 backdrop-blur-md dark:border-slate-800/70 dark:bg-slate-950/80 transition-colors">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <BrandMark />
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-50 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                PolicyLens
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Intelligence Engine
              </span>
            </div>
          </Link>

          {/* Center Nav */}
          <DesktopNav pathname={pathname} />

          {/* Right side controls */}
          <div className="flex items-center gap-3">
            {/* Health indicator */}
            <div
              className="hidden items-center gap-2 rounded-full border border-slate-200/80 bg-slate-50/80 px-3 py-1 text-xs text-slate-600 shadow-xs lg:flex dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300"
              title={health?.status === "ok" ? "Backend connected" : "Backend offline (mock active)"}
            >
              <span
                className={[
                  "h-2 w-2 rounded-full",
                  health?.status === "ok"
                    ? "bg-emerald-500 ring-2 ring-emerald-500/20 animate-pulse"
                    : "bg-emerald-500",
                ].join(" ")}
              />
              <span className="font-medium text-[11px]">
                {health?.status === "ok" ? "API Online" : "Sandbox Active"}
              </span>
            </div>

            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 rounded-full border border-slate-200 bg-white p-1 pr-3 text-xs font-medium text-slate-700 shadow-xs transition-all hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-[11px] font-bold text-white uppercase shadow-xs">
                    {user.full_name ? user.full_name.charAt(0) : user.email.charAt(0)}
                  </div>
                  <span className="max-w-[120px] truncate hidden sm:inline font-semibold">
                    {user.full_name || user.email.split("@")[0]}
                  </span>
                  <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-slate-400">
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {userDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setUserDropdownOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl backdrop-blur-md z-20 dark:border-slate-800 dark:bg-slate-950">
                      <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-900">
                        <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                          {user.full_name}
                        </p>
                        <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold truncate">
                          {user.roleTitle}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                      </div>

                      <div className="py-1">
                        <button
                          type="button"
                          onClick={() => {
                            setUserDropdownOpen(false);
                            setIsProfileModalOpen(true);
                          }}
                          className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50/50 hover:bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-950/40 dark:hover:bg-emerald-950/70"
                        >
                          <span>👤 View Profile &amp; Dummy Data</span>
                          <span className="text-[10px] font-bold">→</span>
                        </button>
                        <Link
                          href="/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900"
                        >
                          Analytics Dashboard
                        </Link>
                        <Link
                          href="/policies"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900"
                        >
                          Policy Vault
                        </Link>
                        <Link
                          href="/review-queue"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900"
                        >
                          Audit Review Queue
                        </Link>
                      </div>

                      <div className="pt-1 border-t border-slate-100 dark:border-slate-900">
                        <button
                          type="button"
                          onClick={() => {
                            setUserDropdownOpen(false);
                            logout();
                          }}
                          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30"
                        >
                          Sign out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="hidden sm:inline-flex h-9 items-center justify-center rounded-full border border-slate-300/80 px-4 text-xs font-semibold text-slate-700 transition-all hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex h-9 items-center justify-center rounded-full bg-slate-950 px-4 text-xs font-semibold text-white shadow-xs transition-all hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 dark:border-slate-800 dark:text-slate-300"
              aria-label="Toggle navigation"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                {mobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="border-t border-slate-200 bg-white/95 px-4 py-3 md:hidden dark:border-slate-800 dark:bg-slate-950/95">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => {
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={[
                      "flex h-9 items-center rounded-xl px-3 text-sm font-medium transition-colors",
                      active
                        ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-50 font-semibold"
                        : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-900",
                    ].join(" ")}
                  >
                    {item.label}
                  </Link>
                );
              })}
              {user ? (
                <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-900 flex flex-col gap-2 px-1">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsProfileModalOpen(true);
                    }}
                    className="flex h-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold dark:bg-emerald-950 dark:text-emerald-300"
                  >
                    👤 View Profile ({user.full_name})
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex h-9 items-center justify-center rounded-xl border border-rose-200 text-xs font-bold text-rose-600"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="mt-2 flex flex-col gap-2 pt-2 border-t border-slate-100 dark:border-slate-900">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex h-9 items-center justify-center rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:text-slate-300"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex h-9 items-center justify-center rounded-xl bg-slate-950 text-xs font-semibold text-white dark:bg-white dark:text-slate-950"
                  >
                    Get Started Free
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
      <UserProfileModal />
    </>
  );
}
