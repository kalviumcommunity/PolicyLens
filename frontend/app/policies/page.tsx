"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { Policy, PolicyStatus } from "@/app/api";
import { getPolicies, ApiError } from "@/app/api";
import { PageShell, PageHeader } from "@/components/PageShell";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { LoadingScreen, Skeleton } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { PolicyStatusBadge } from "@/components/ui/StatusBadges";
import { relativeTime } from "@/lib/format";

const STATUS_FILTERS: { value: PolicyStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "draft", label: "Draft" },
  { value: "archived", label: "Archived" },
];

function PolicyRowSkeleton() {
  return (
    <div className="flex w-full items-start gap-4 rounded-2xl p-4">
      <Skeleton className="h-10 w-10 flex-shrink-0 rounded-xl" />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-5 w-1/2 rounded-lg" />
        <Skeleton className="h-4 w-4/5 rounded-lg" />
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
}

function PolicyIcon() {
  return (
    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:ring-emerald-900">
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
        <path
          d="M7 4h10l4 4v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinejoin="round"
        />
        <path
          d="M17 4v4h4M9 12h7M9 16h7M9 8h3"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

function PolicyRow({ policy }: { policy: Policy }) {
  return (
    <Link
      href={`/policies/${policy.id}`}
      className="group flex w-full items-start gap-4 rounded-2xl border border-transparent p-4 transition-all hover:border-slate-200 hover:bg-white/70 hover:shadow-sm dark:hover:border-slate-800 dark:hover:bg-slate-950/50"
    >
      <PolicyIcon />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="truncate text-base font-semibold text-slate-900 group-hover:text-emerald-700 dark:text-slate-100 dark:group-hover:text-emerald-300 transition-colors">
            {policy.title}
          </h3>
        </div>
        {policy.description ? (
          <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            {policy.description}
          </p>
        ) : (
          <p className="mt-1 text-sm italic leading-6 text-slate-400 dark:text-slate-500">
            No description provided.
          </p>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <PolicyStatusBadge status={policy.status} />
          <Badge tone="default">v{policy.version}</Badge>
          <Badge tone="info">Owner: {policy.owner}</Badge>
          <span className="text-xs text-slate-500 dark:text-slate-400 ml-auto">
            Updated {relativeTime(policy.updated_at)}
          </span>
        </div>
      </div>
      <span
        aria-hidden
        className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-slate-400 opacity-0 transition-all group-hover:opacity-100 dark:text-slate-500"
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
          <path
            d="M9 6l6 6-6 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </Link>
  );
}

export default function PoliciesPage() {
  const [status, setStatus] = useState<PolicyStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [policies, setPolicies] = useState<Policy[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(search.trim()), 350);
    return () => window.clearTimeout(id);
  }, [search]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPolicies({
        status: status === "all" ? undefined : status,
        search: debounced || undefined,
        limit: 100,
      });
      setPolicies(data);
    } catch (e) {
      const msg =
        e instanceof ApiError
          ? `Could not load policies (${e.status}): ${e.message}`
          : e instanceof Error
            ? e.message
            : "Unknown error loading policies. Is the backend running at http://localhost:8000?";
      setError(msg);
      setPolicies(null);
    } finally {
      setLoading(false);
    }
  }, [status, debounced]);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) void load();
    });
    return () => {
      cancelled = true;
    };
  }, [load]);

  const total = policies?.length ?? 0;
  const active = policies?.filter((p) => p.status === "active").length ?? 0;
  const drafts = policies?.filter((p) => p.status === "draft").length ?? 0;

  return (
    <PageShell>
      <PageHeader
        eyebrow="Policy library"
        title="Policies, agreements &amp; catalog rules."
        description="All indexed policy sources searchable from the backend GET /api/policies endpoint. Open a policy to see its analysis history and severity-tagged findings."
        actions={
          <Link
            href="/chat"
          >
            <Button size="md">
              Ask PolicyLens
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
                <path
                  d="M21 21l-4.35-4.35M17 10.5A6.5 6.5 0 1 1 4 10.5a6.5 6.5 0 0 1 13 0Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </Button>
          </Link>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3 mb-8">
        {[
          { label: "Total policies", value: total, tone: "default" as const },
          { label: "Active", value: active, tone: "active" as const },
          { label: "Drafts", value: drafts, tone: "draft" as const },
        ].map((m) => (
          <Card key={m.label}>
            <CardBody className="p-5 sm:p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500 dark:text-slate-400">{m.label}</p>
                <Badge tone={m.tone} dot>{m.label}</Badge>
              </div>
              <p className="mt-2 text-3xl font-semibold tracking-tight">
                {loading ? "—" : m.value}
              </p>
            </CardBody>
          </Card>
        ))}
      </div>

      <Card>
        <CardBody className="p-4 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="w-full max-w-md">
              <Input
                name="policy-search"
                placeholder="Search policies by title…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                leadingIcon={
                  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
                    <path
                      d="M21 21l-4.35-4.35M17 10.5A6.5 6.5 0 1 1 4 10.5a6.5 6.5 0 0 1 13 0Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                }
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {STATUS_FILTERS.map((f) => {
                const active = f.value === status;
                return (
                  <button
                    key={f.value}
                    type="button"
                    onClick={() => setStatus(f.value)}
                    className={[
                      "inline-flex h-9 items-center rounded-full px-4 text-sm font-medium transition-colors",
                      active
                        ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                        : "border border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900",
                    ].join(" ")}
                  >
                    {f.label}
                  </button>
                );
              })}
              <Button variant="outline" size="sm" onClick={() => void load()}>
                Refresh
              </Button>
            </div>
          </div>
        </CardBody>

        <div className="border-t border-slate-200 dark:border-slate-800 px-4 py-1 sm:px-6">
          {error && (
            <div className="py-4">
              <Alert
                tone="danger"
                title="Could not load policies"
                message={
                  <>
                    {error}
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => void load()}
                      >
                        Try again
                      </Button>
                      <Link href="/chat">
                        <Button size="sm" variant="outline">
                          Ask about policies instead
                        </Button>
                      </Link>
                    </div>
                  </>
                }
              />
            </div>
          )}

          {loading && (
            <div className="flex flex-col divide-y divide-slate-100 dark:divide-slate-900">
              {Array.from({ length: 5 }).map((_, i) => (
                <PolicyRowSkeleton key={i} />
              ))}
            </div>
          )}

          {!loading && !error && policies && policies.length === 0 && (
            <div className="py-6">
              <EmptyState
                icon={
                  <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden>
                    <path
                      d="M7 4h10l4 4v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9 12h6M9 16h4"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                    />
                  </svg>
                }
                title={debounced ? "No policies match your search." : "No policies yet."}
                description={
                  debounced
                    ? "Try a different search term or clear the status filter to see more."
                    : "Policies are managed via POST /api/policies. Create your first policy or seed demo data to see it here."
                }
                actionLabel={debounced ? "Clear filters" : undefined}
                onAction={
                  debounced
                    ? () => {
                        setSearch("");
                        setStatus("all");
                      }
                    : undefined
                }
              />
            </div>
          )}

          {!loading && !error && policies && policies.length > 0 && (
            <div className="flex flex-col divide-y divide-slate-100 dark:divide-slate-900 py-1">
              {policies.map((p) => (
                <PolicyRow key={p.id} policy={p} />
              ))}
            </div>
          )}
        </div>
      </Card>

      <div className="mt-6 text-xs text-slate-500 dark:text-slate-400">
        Data from <code className="rounded bg-slate-100 px-1.5 py-0.5 dark:bg-slate-900">GET /api/policies</code>
        {" "}with filters mapped to query params: status, search, limit.
      </div>
    </PageShell>
  );
}
