"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useCallback, type FormEvent } from "react";
import type { AuthResponse } from "@/app/api";
import { signup, ApiError } from "@/app/api";
import { mockSignup } from "@/app/api";
import { PageShell, PageHeader } from "@/components/PageShell";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

const AUTH_MOCK_NOTE =
  "Using temporary mock auth for UI development — replace signup() in app/api.ts with real POST /api/auth/signup when the backend auth endpoint is available.";

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const [created, setCreated] = useState<AuthResponse | null>(null);
  const [agree, setAgree] = useState(false);

  const onSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (loading) return;
      setLastError(null);

      if (!email.trim() || !password) {
        setLastError("Please enter your email and password.");
        return;
      }
      if (password !== confirmPassword) {
        setLastError("Passwords do not match.");
        return;
      }
      if (password.length < 6) {
        setLastError("Password must be at least 6 characters.");
        return;
      }
      if (!agree) {
        setLastError("Please agree to the terms to continue.");
        return;
      }

      setLoading(true);
      try {
        let result: AuthResponse;
        try {
          result = await signup({
            email: email.trim(),
            password,
            full_name: fullName.trim() || undefined,
          });
        } catch (e) {
          if (e instanceof ApiError && e.status === 501) {
            result = await mockSignup({
              email: email.trim(),
              password,
              full_name: fullName.trim() || undefined,
            });
          } else {
            throw e;
          }
        }
        setCreated(result);
        setTimeout(() => router.push("/dashboard"), 1500);
      } catch (err) {
        const msg =
          err instanceof ApiError
            ? err.message
            : err instanceof Error
              ? err.message
              : "Could not create your account. Please try again.";
        setLastError(msg);
      } finally {
        setLoading(false);
      }
    },
    [loading, email, password, confirmPassword, agree, fullName, router]
  );

  return (
    <PageShell maxWidth="md" className="py-10 sm:py-16">
      <PageHeader
        eyebrow="Create account"
        title="Join PolicyLens."
        description="Create your account to start reviewing grounded policy answers, tracking analysis history, and collaborating with your team."
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
              title="Could not create account"
              message={lastError}
              className="mb-6"
            />
          )}

          {created ? (
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
                  Welcome, {created.user.full_name ?? created.user.email}!
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Your account is ready. Taking you to your dashboard…
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="flex flex-col gap-5">
              <Input
                name="fullName"
                type="text"
                label="Full name"
                placeholder="Jane Doe (optional)"
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />

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
                placeholder="At least 6 characters"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                hint="Minimum 6 characters. Use a strong password for production."
              />

              <Input
                name="confirmPassword"
                type="password"
                label="Confirm password"
                placeholder="Re-enter your password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                error={
                  confirmPassword && password !== confirmPassword
                    ? "Passwords do not match."
                    : undefined
                }
              />

              <label className="inline-flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-400 dark:border-slate-600"
                />
                <span>
                  I agree to the PolicyLens terms of service and privacy policy.
                </span>
              </label>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                disabled={!email.trim() || !password || !confirmPassword || !agree}
                className="w-full"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <LoadingSpinner size="sm" />
                    Creating account…
                  </span>
                ) : (
                  "Create account"
                )}
              </Button>

              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center" aria-hidden>
                  <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-3 text-xs text-slate-500 dark:bg-slate-950/75 dark:text-slate-400">
                    already have an account?
                  </span>
                </div>
              </div>

              <Link href="/login">
                <Button type="button" variant="outline" size="lg" className="w-full">
                  Sign in instead
                </Button>
              </Link>
            </form>
          )}
        </CardBody>
      </Card>

      <div className="mt-6 flex flex-col items-center gap-3 text-xs text-slate-500 sm:flex-row sm:justify-between dark:text-slate-400">
        <p>
          Demo signup accepts any valid email + 6+ char password. No email is actually sent.
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
            href="/policies"
            className="hover:text-emerald-700 transition-colors dark:hover:text-emerald-300"
          >
            Browse policies
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
