"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useCallback, type FormEvent } from "react";
import type { AuthResponse } from "@/app/api";
import { login, ApiError } from "@/app/api";
import { mockLogin } from "@/app/api";
import { PageShell, PageHeader } from "@/components/PageShell";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

const AUTH_MOCK_NOTE =
  "Using temporary mock auth for UI development — replace login() in app/api.ts with real POST /api/auth/login when the backend auth endpoint is available.";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const [loggedIn, setLoggedIn] = useState<AuthResponse | null>(null);

  const onSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (loading) return;
      setLastError(null);

      if (!email.trim() || !password) {
        setLastError("Please enter your email and password.");
        return;
      }

      setLoading(true);
      try {
        let result: AuthResponse;
        try {
          result = await login({ email: email.trim(), password });
        } catch (e) {
          if (e instanceof ApiError && e.status === 501) {
            result = await mockLogin({ email: email.trim(), password });
          } else {
            throw e;
          }
        }
        setLoggedIn(result);
        setTimeout(() => router.push("/dashboard"), 1200);
      } catch (err) {
        const msg =
          err instanceof ApiError
            ? err.message
            : err instanceof Error
              ? err.message
              : "Could not sign in. Please try again.";
        setLastError(msg);
      } finally {
        setLoading(false);
      }
    },
    [loading, email, password, router]
  );

  return (
    <PageShell maxWidth="md" className="py-10 sm:py-16">
      <PageHeader
        eyebrow="Sign in"
        title="Welcome back to PolicyLens."
        description="Sign in to access grounded policy answers, your analysis history, and team-level insights."
      />

      <Card>
        <CardBody className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <Badge tone="warning">Demo mode — mock responses</Badge>
          </div>

          <Alert tone="info" message={AUTH_MOCK_NOTE} className="mb-6" />

          {lastError && (
            <Alert
              tone="danger"
              title="Could not sign in"
              message={lastError}
              className="mb-6"
            />
          )}

          {loggedIn ? (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:ring-emerald-900">
                <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7">
                  <path
                    d="M5 12l4 4L19 6"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-950 dark:text-slate-50">
                  Signed in as {loggedIn.user.full_name ?? loggedIn.user.email}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Redirecting to your dashboard…
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="flex flex-col gap-5">
              <Input
                name="email"
                type="email"
                label="Email"
                placeholder="you@company.com"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input
                name="password"
                type="password"
                label="Password"
                placeholder="Enter your password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <label className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-400 dark:border-slate-600"
                    defaultChecked
                  />
                  Remember me
                </label>
                <Link
                  href="/signup"
                  className="text-sm font-medium text-emerald-700 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
                >
                  Create an account →
                </Link>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                disabled={!email.trim() || !password}
                className="w-full"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <LoadingSpinner size="sm" />
                    Signing in…
                  </span>
                ) : (
                  "Sign in"
                )}
              </Button>

              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center" aria-hidden>
                  <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-3 text-xs text-slate-500 dark:bg-slate-950/75 dark:text-slate-400">
                    or
                  </span>
                </div>
              </div>

              <Link href="/">
                <Button type="button" variant="outline" size="lg" className="w-full">
                  Continue as guest
                </Button>
              </Link>
            </form>
          )}
        </CardBody>
      </Card>

      <div className="mt-6 flex flex-col items-center gap-3 text-xs text-slate-500 sm:flex-row sm:justify-between dark:text-slate-400">
        <p>
          Demo credentials are not required — any valid email + 6+ char password works.
        </p>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="hover:text-emerald-700 transition-colors dark:hover:text-emerald-300"
          >
            Back to home
          </Link>
          <span aria-hidden>•</span>
          <Link
            href="/dashboard"
            className="hover:text-emerald-700 transition-colors dark:hover:text-emerald-300"
          >
            View dashboard
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
