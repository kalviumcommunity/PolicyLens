"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/dashboard";

  const { login, quickDemoLogin } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await login({ email, password });
      router.push(redirectUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (role: "compliance" | "support" | "legal") => {
    setDemoLoading(role);
    setError(null);
    try {
      await quickDemoLogin(role);
      router.push(redirectUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Demo login failed.");
    } finally {
      setDemoLoading(null);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-8 shadow-xl shadow-slate-900/5 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
      {error && (
        <Alert
          tone="danger"
          title="Sign in failed"
          message={error}
          className="mb-6"
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Work Email
          </label>
          <Input
            name="email"
            type="email"
            required
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leadingIcon={
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                <path
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            }
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Password
            </label>
            <button
              type="button"
              onClick={() => alert("For this demo environment, any password of 6+ characters is accepted, or click one of the quick demo buttons below.")}
              className="text-xs font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-400"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <Input
              name="password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leadingIcon={
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                  <path
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-600 dark:text-slate-400">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-900"
            />
            Remember this device
          </label>
        </div>

        <Button
          type="submit"
          size="lg"
          loading={loading}
          className="w-full justify-center shadow-md shadow-slate-950/10 dark:shadow-none"
        >
          Sign in to Workspace
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200 dark:border-slate-800" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-3 text-slate-400 dark:bg-slate-950 dark:text-slate-500">
            Or explore with 1-click Demo Roles
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <button
          type="button"
          onClick={() => handleQuickLogin("compliance")}
          disabled={!!demoLoading}
          className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-left text-sm font-medium text-slate-700 transition-all hover:border-emerald-300 hover:bg-emerald-50/50 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:border-emerald-800 dark:hover:bg-emerald-950/20"
        >
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              CL
            </span>
            <div>
              <p className="font-semibold text-xs text-slate-900 dark:text-slate-100">Sarah Chen</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Head of Compliance &amp; Policy</p>
            </div>
          </div>
          <Badge tone="active">{demoLoading === "compliance" ? "Signing in..." : "Demo Login"}</Badge>
        </button>

        <button
          type="button"
          onClick={() => handleQuickLogin("support")}
          disabled={!!demoLoading}
          className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-left text-sm font-medium text-slate-700 transition-all hover:border-emerald-300 hover:bg-emerald-50/50 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:border-emerald-800 dark:hover:bg-emerald-950/20"
        >
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-xs font-bold text-blue-800 dark:bg-blue-950 dark:text-blue-300">
              SO
            </span>
            <div>
              <p className="font-semibold text-xs text-slate-900 dark:text-slate-100">Alex Rivera</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Support Operations Lead</p>
            </div>
          </div>
          <Badge tone="info">{demoLoading === "support" ? "Signing in..." : "Demo Login"}</Badge>
        </button>

        <button
          type="button"
          onClick={() => handleQuickLogin("legal")}
          disabled={!!demoLoading}
          className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-left text-sm font-medium text-slate-700 transition-all hover:border-emerald-300 hover:bg-emerald-50/50 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:border-emerald-800 dark:hover:bg-emerald-950/20"
        >
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-100 text-xs font-bold text-purple-800 dark:bg-purple-950 dark:text-purple-300">
              GC
            </span>
            <div>
              <p className="font-semibold text-xs text-slate-900 dark:text-slate-100">Elena Rostova</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">General Counsel &amp; Legal</p>
            </div>
          </div>
          <Badge tone="default">{demoLoading === "legal" ? "Signing in..." : "Demo Login"}</Badge>
        </button>
      </div>

      <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
        Don&apos;t have an account yet?{" "}
        <Link
          href="/signup"
          className="font-semibold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400"
        >
          Sign up for free
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-400/30">
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
        </div>
        <h2 className="mt-5 text-center text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          Welcome back to PolicyLens
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
          Sign in to access your policy vault, AI grounding, and audit queue.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Suspense
          fallback={
            <div className="min-h-[300px] flex items-center justify-center rounded-3xl border border-slate-200 bg-white/90 p-8 dark:border-slate-800 dark:bg-slate-950/80">
              <LoadingSpinner size="md" label="Loading sign in…" />
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
