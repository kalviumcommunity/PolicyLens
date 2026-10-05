"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";

const ROLES = [
  { id: "compliance", label: "Compliance & Risk", icon: "⚖️" },
  { id: "support", label: "Support Operations", icon: "🎧" },
  { id: "legal", label: "Legal & Contracts", icon: "📜" },
  { id: "product", label: "Product & Policy", icon: "🚀" },
];

export default function SignupPage() {
  const router = useRouter();
  const { signup, quickDemoLogin } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("compliance");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Password strength calculation
  const getPasswordStrength = () => {
    if (!password) return { score: 0, label: "Empty", color: "bg-slate-200" };
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 10) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 1) return { score: 1, label: "Weak", color: "bg-rose-500" };
    if (score === 2) return { score: 2, label: "Fair", color: "bg-amber-500" };
    if (score === 3) return { score: 3, label: "Good", color: "bg-blue-500" };
    return { score: 4, label: "Strong", color: "bg-emerald-500" };
  };

  const strength = getPasswordStrength();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError("Please provide your full name.");
      return;
    }
    if (!email || !email.includes("@")) {
      setError("Please provide a valid work email.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!agreeTerms) {
      setError("You must agree to the Terms of Service to create an account.");
      return;
    }

    setLoading(true);
    try {
      await signup({
        email,
        password,
        full_name: fullName.trim(),
        role,
      });
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async () => {
    setDemoLoading(true);
    setError(null);
    try {
      await quickDemoLogin("compliance");
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Demo registration failed.");
    } finally {
      setDemoLoading(false);
    }
  };

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
          Create your PolicyLens account
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
          Start grounding support answers and detecting policy risk in minutes.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-8 shadow-xl shadow-slate-900/5 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
          {error && (
            <Alert
              tone="danger"
              title="Signup error"
              message={error}
              className="mb-6"
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Full Name
              </label>
              <Input
                name="fullName"
                type="text"
                required
                placeholder="Sarah Chen"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Work Email
              </label>
              <Input
                name="email"
                type="email"
                required
                placeholder="sarah@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Primary Role / Department
              </label>
              <div className="grid grid-cols-2 gap-2">
                {ROLES.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    className={`flex items-center gap-2 rounded-xl border p-2.5 text-xs font-medium transition-all text-left ${
                      role === r.id
                        ? "border-emerald-500 bg-emerald-50/70 text-emerald-900 ring-1 ring-emerald-500 dark:bg-emerald-950/50 dark:text-emerald-200 dark:border-emerald-400"
                        : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/80"
                    }`}
                  >
                    <span>{r.icon}</span>
                    <span className="truncate">{r.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Password
              </label>
              <Input
                name="password"
                type="password"
                required
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {password && (
                <div className="mt-2 space-y-1">
                  <div className="flex h-1.5 w-full gap-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className={`h-full flex-1 transition-all ${
                          step <= strength.score ? strength.color : "bg-transparent"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>Password strength</span>
                    <span className="font-semibold">{strength.label}</span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Confirm Password
              </label>
              <Input
                name="confirmPassword"
                type="password"
                required
                placeholder="Repeat your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div className="pt-1">
              <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-600 dark:text-slate-400">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-900"
                />
                <span>
                  I agree to the{" "}
                  <span className="underline cursor-pointer">Terms of Service</span> and{" "}
                  <span className="underline cursor-pointer">Privacy Policy</span>.
                </span>
              </label>
            </div>

            <Button
              type="submit"
              size="lg"
              loading={loading}
              className="w-full justify-center shadow-md shadow-slate-950/10 dark:shadow-none"
            >
              Create Account
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-slate-400 dark:bg-slate-950 dark:text-slate-500">
                Or skip registration
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={() => {
                quickDemoLogin("compliance");
                router.push("/dashboard");
              }}
              className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 text-left text-xs font-medium text-slate-700 transition-all hover:border-emerald-300 hover:bg-emerald-50/50 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-200"
            >
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-100 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  CL
                </span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">Sarah Chen (Compliance Lead)</span>
              </div>
              <Badge tone="active">Instant Access</Badge>
            </button>

            <button
              type="button"
              onClick={() => {
                quickDemoLogin("support");
                router.push("/dashboard");
              }}
              className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 text-left text-xs font-medium text-slate-700 transition-all hover:border-emerald-300 hover:bg-emerald-50/50 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-200"
            >
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-100 text-[10px] font-bold text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                  SO
                </span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">Alex Rivera (Support Lead)</span>
              </div>
              <Badge tone="info">Instant Access</Badge>
            </button>

            <button
              type="button"
              onClick={() => {
                quickDemoLogin("legal");
                router.push("/dashboard");
              }}
              className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 text-left text-xs font-medium text-slate-700 transition-all hover:border-emerald-300 hover:bg-emerald-50/50 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-200"
            >
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-purple-100 text-[10px] font-bold text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                  GC
                </span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">Elena Rostova (General Counsel)</span>
              </div>
              <Badge tone="default">Instant Access</Badge>
            </button>
          </div>

          <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
