"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Policy, Analysis, Finding } from "@/app/api";
import { getPolicies, getAnalyses, ApiError } from "@/app/api";
import { PageShell, PageHeader } from "@/components/PageShell";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { LoadingScreen } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import {
  PolicyStatusBadge, SeverityBadge, ConfidenceBadge } from "@/components/ui/StatusBadges";
import { relativeTime } from "@/lib/format";
import {
  getQueryAnalytics,
  getQueryVolumeStats,
  type QueryAnalytics,
  type QueryVolumeStats,
  type QueryTrend,
} from "@/lib/chat-mock";

type EnrichedAnalysis = Analysis & { policy: Policy };

function findBar(max: number, val: number, tone: string) {
  const pct = max === 0 ? 0 : Math.max(2, Math.round((val / max) * 100));
  const colors: Record<string, string> = {
    active: "bg-emerald-500",
    draft: "bg-amber-500",
    archived: "bg-slate-400",
    critical: "bg-rose-600",
    high: "bg-orange-500",
    medium: "bg-amber-500",
    low: "bg-slate-400",
  };
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-900">
      <div
        className={`h-full ${colors[tone] ?? "bg-slate-400"}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function TrendIndicator({ trend, delta }: { trend: QueryTrend; delta: number }) {
  const color =
    trend === "rising"
      ? "text-rose-600 dark:text-rose-400"
      : trend === "falling"
        ? "text-emerald-600 dark:text-emerald-400"
        : "text-slate-500 dark:text-slate-400";
  const arrow =
    trend === "rising" ? "↑" : trend === "falling" ? "↓" : "→";
  const sign = delta > 0 ? "+" : "";
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold ${color}`}>
      <span>{arrow}</span>
      <span>{sign}{delta} this week</span>
    </span>
  );
}

function CategoryBadge({ category }: { category: QueryAnalytics["category"] }) {
  const map: Record<QueryAnalytics["category"], { label: string; tone: "info" | "active" | "draft" | "warning" | "default" }> = {
    returns: { label: "Returns", tone: "info" },
    refunds: { label: "Refunds", tone: "active" },
    replacements: { label: "Replacements", tone: "draft" },
    seller: { label: "Seller", tone: "warning" },
    other: { label: "Other", tone: "default" },
  };
  const cfg = map[category];
  return <Badge tone={cfg.tone}>{cfg.label}</Badge>;
}

export default function DashboardPage() {
  const router = useRouter();
  const [policies, setPolicies] = useState<Policy[] | null>(null);
  const [analyses, setAnalyses] = useState<EnrichedAnalysis[] | null>(null);
  const [queryStats, setQueryStats] = useState<QueryVolumeStats | null>(null);
  const [queryAnalytics, setQueryAnalytics] = useState<QueryAnalytics[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [allPolicies, qStats, qAnalytics] = await Promise.all([
        getPolicies({ limit: 100 }),
        getQueryVolumeStats(),
        getQueryAnalytics(),
      ]);
      setPolicies(allPolicies);
      setQueryStats(qStats);
      setQueryAnalytics(qAnalytics);

      if (allPolicies.length === 0) {
        setAnalyses([]);
        return;
      }
      const analysesResults = await Promise.all(
        allPolicies.map(async (policy) => {
          try {
            const list = await getAnalyses(policy.id);
            return list.map((a) => ({ ...a, policy }));
          } catch (_e) {
            return [] as EnrichedAnalysis[];
          }
        })
      );
      const merged = analysesResults
        .flat()
        .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
      setAnalyses(merged);
    } catch (e) {
      const msg =
        e instanceof ApiError
          ? `Backend error (${e.status}): ${e.message}`
          : e instanceof Error
            ? e.message
            : "Could not load dashboard data. Is the backend running at http://localhost:8000?";
      setError(msg);
      setPolicies(null);
      setAnalyses(null);
      setQueryStats(null);
      setQueryAnalytics(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const stats = useMemo(() => {
    if (policies === null) return null;
    const statuses = { active: 0, draft: 0, archived: 0 };
    policies.forEach((p) => {
      statuses[p.status] += 1;
    });

    let totalFindings = 0;
    const sev = { critical: 0, high: 0, medium: 0, low: 0 };
    const ownerCounts = new Map<string, number>();
    policies.forEach((p) => {
      ownerCounts.set(p.owner, (ownerCounts.get(p.owner) ?? 0) + 1);
    });

    if (analyses) {
      const all: Finding[] = analyses.flatMap((a) => a.findings);
      totalFindings = all.length;
      all.forEach((f) => {
        sev[f.severity] += 1;
      });
    }
    const policiesAnalyzed =
      analyses === null
        ? 0
        : new Set(analyses.map((a) => a.policy.id)).size;
    const maxStatus = Math.max(1, ...Object.values(statuses));
    const maxSev = Math.max(1, ...Object.values(sev));
    const topOwners = [...ownerCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return {
      total: policies.length,
      statuses,
      totalAnalyses: analyses?.length ?? 0,
      policiesAnalyzed,
      totalFindings,
      sev,
      topOwners,
      maxStatus,
      maxSev,
    };
  }, [policies, analyses]);

  return (
    <PageShell>
      <PageHeader
        eyebrow="Dashboard"
        title="Insights at a glance."
        description="A quick snapshot of indexed policies, their status breakdown, and findings severity — all aggregated from existing endpoints."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => void load()}>
              Refresh
            </Button>
            <Link href="/policies">
              <Button size="sm">Browse policies</Button>
            </Link>
          </div>
        }
      />

      {error && (
        <Alert
          className="mb-6"
          tone="danger"
          title="Could not load dashboard"
          message={
            <>
              {error}
              <div className="mt-2 flex flex-wrap gap-2">
                <Button size="sm" variant="ghost" onClick={() => void load()}>
                  Try again
                </Button>
                <Link href="/chat">
                  <Button size="sm" variant="outline">
                    Ask PolicyLens
                  </Button>
                </Link>
              </div>
            </>
          }
        />
      )}

      {loading && <LoadingScreen label="Loading dashboard…" />}

      {!loading && !error && stats && (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
              <CardBody className="p-5 sm:p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                      Policies
                    </p>
                    <p className="mt-2 text-3xl font-semibold tracking-tight">
                      {stats.total}
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {stats.policiesAnalyzed} with analyses
                    </p>
                  </div>
                  <Badge tone="info" dot>
                    Live
                  </Badge>
                </div>
              </CardBody>
            </Card>
            <Card>
              <CardBody className="p-5 sm:p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                      Analyses
                    </p>
                    <p className="mt-2 text-3xl font-semibold tracking-tight">
                      {stats.totalAnalyses}
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Total across policies
                    </p>
                  </div>
                  <Badge tone="success">
                    {stats.total === 0
                      ? "No data"
                      : Math.round((stats.policiesAnalyzed / Math.max(1, stats.total)) * 100)}% coverage
                  </Badge>
                </div>
              </CardBody>
            </Card>
            <Card>
              <CardBody className="p-5 sm:p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                      Findings
                    </p>
                    <p className="mt-2 text-3xl font-semibold tracking-tight">
                      {stats.totalFindings}
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {stats.sev.critical + stats.sev.high} high + critical
                    </p>
                  </div>
                  {stats.sev.critical > 0 ? (
                    <Badge tone="critical">{stats.sev.critical} critical</Badge>
                  ) : (
                    <Badge tone="active">All clear</Badge>
                  )}
                </div>
              </CardBody>
            </Card>
            <Card>
              <CardBody className="p-5 sm:p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                      Owners
                    </p>
                    <p className="mt-2 text-3xl font-semibold tracking-tight">
                      {stats.topOwners.length}
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Distinct policy owners
                    </p>
                  </div>
                  <Badge tone="info">{stats.topOwners[0]?.[0] ?? "—"}</Badge>
                </div>
              </CardBody>
            </Card>
          </div>

          {queryStats && (
            <>
              <div className="flex flex-col gap-1 mb-3">
                <h2 className="text-lg font-semibold">Customer query analytics</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Volume, confidence, and trend signals from PolicyLens chat interactions.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                <Card>
                  <CardBody className="p-5 sm:p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                          Total queries
                        </p>
                        <p className="mt-2 text-3xl font-semibold tracking-tight">
                          {queryStats.total.toLocaleString()}
                        </p>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          {queryStats.last7d.toLocaleString()} in last 7 days
                        </p>
                      </div>
                      <Badge tone="active" dot>
                        Live
                      </Badge>
                    </div>
                  </CardBody>
                </Card>
                <Card>
                  <CardBody className="p-5 sm:p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                          Last 24h
                        </p>
                        <p className="mt-2 text-3xl font-semibold tracking-tight">
                          {queryStats.last24h.toLocaleString()}
                        </p>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          Questions answered today
                        </p>
                      </div>
                      <Badge tone="info">
                        {Math.round(queryStats.last24h / 24)}/hr avg
                      </Badge>
                    </div>
                  </CardBody>
                </Card>
                <Card>
                  <CardBody className="p-5 sm:p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                          Avg confidence
                        </p>
                        <p className="mt-2 text-3xl font-semibold tracking-tight">
                          {Math.round(queryStats.avgConfidence * 100)}%
                        </p>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          Across all grounded answers
                        </p>
                      </div>
                      <ConfidenceBadge value={queryStats.avgConfidence} />
                    </div>
                  </CardBody>
                </Card>
                <Card>
                  <CardBody className="p-5 sm:p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                          Low confidence
                        </p>
                        <p className="mt-2 text-3xl font-semibold tracking-tight">
                          {queryStats.lowConfidenceCount}
                        </p>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          Answers needing human review
                        </p>
                      </div>
                      {queryStats.lowConfidenceCount > 0 ? (
                        <Badge tone="warning">Review</Badge>
                      ) : (
                        <Badge tone="success">All clear</Badge>
                      )}
                    </div>
                  </CardBody>
                </Card>
              </div>
            </>
          )}

          <div className="grid gap-6 lg:grid-cols-3 mb-8">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Status breakdown</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Policy distribution across statuses.
                </p>
              </CardHeader>
              <CardBody className="pt-0">
                {stats.total === 0 ? (
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    No policies yet.
                  </p>
                ) : (
                  <div className="flex flex-col gap-4">
                    {[
                      { k: "active" as const, label: "Active", tone: "active" as const },
                      { k: "draft" as const, label: "Draft", tone: "draft" as const },
                      { k: "archived" as const, label: "Archived", tone: "archived" as const },
                    ].map((r) => (
                      <div key={r.k} className="flex flex-col gap-2">
                        <div className="flex items-center justify-between text-sm">
                          <PolicyStatusBadge status={r.k} />
                          <span className="font-semibold tabular-nums">
                            {stats.statuses[r.k]}
                          </span>
                        </div>
                        {findBar(stats.maxStatus, stats.statuses[r.k], r.k)}
                      </div>
                    ))}
                  </div>
                )}
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Findings severity</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Across all analyses.
                </p>
              </CardHeader>
              <CardBody className="pt-0">
                {stats.totalFindings === 0 ? (
                  <EmptyState
                    title="No findings yet."
                    description="Once findings are attached to analyses, they will be summarised here."
                  />
                ) : (
                  <div className="flex flex-col gap-4">
                    {[
                      { k: "critical" as const, label: "Critical" },
                      { k: "high" as const, label: "High" },
                      { k: "medium" as const, label: "Medium" },
                      { k: "low" as const, label: "Low" },
                    ].map((r) => (
                      <div key={r.k} className="flex flex-col gap-2">
                        <div className="flex items-center justify-between text-sm">
                          <SeverityBadge severity={r.k} />
                          <span className="font-semibold tabular-nums">
                            {stats.sev[r.k]}
                          </span>
                        </div>
                        {findBar(stats.maxSev, stats.sev[r.k], r.k)}
                      </div>
                    ))}
                  </div>
                )}
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Top policy owners</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Count of policies per owner.
                </p>
              </CardHeader>
              <CardBody className="pt-0">
                {stats.topOwners.length === 0 ? (
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    No data yet.
                  </p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {stats.topOwners.map(([owner, count]) => (
                      <div
                        key={owner}
                        className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-semibold text-slate-700 ring-1 ring-slate-200 dark:bg-slate-950 dark:text-slate-200 dark:ring-slate-800">
                            {owner.slice(0, 1).toUpperCase()}
                          </span>
                          <span className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">
                            {owner}
                          </span>
                        </div>
                        <span className="text-sm font-semibold tabular-nums">
                          {count}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardBody>
            </Card>
          </div>

          {queryAnalytics && (
            <Card className="mb-8">
              <CardHeader>
                <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">Common customer questions</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      The most-asked policy questions this period — click any to open in the grounded chat.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone="info">
                      {queryAnalytics.reduce((sum, q) => sum + q.count, 0).toLocaleString()} total asks
                    </Badge>
                    <Link href="/chat">
                      <Button size="sm" variant="outline">
                        Open chat
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="pt-0">
                {queryAnalytics.length === 0 ? (
                  <EmptyState
                    title="No question data yet."
                    description="Once customers start asking PolicyLens questions, trends and common queries will show up here."
                  />
                ) : (
                  <div className="flex flex-col divide-y divide-slate-100 dark:divide-slate-900">
                    {queryAnalytics.map((q, idx) => (
                      <Link
                        key={q.question}
                        href={`/chat?q=${encodeURIComponent(q.question)}`}
                        className="group flex flex-wrap items-start justify-between gap-4 py-4 transition-colors"
                      >
                        <div className="flex min-w-0 flex-1 items-start gap-3">
                          <div className="mt-0.5 inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:ring-emerald-900 font-semibold text-sm">
                            {idx + 1}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="truncate text-sm font-semibold text-slate-900 group-hover:text-emerald-700 dark:text-slate-100 dark:group-hover:text-emerald-300 transition-colors">
                                {q.question}
                              </p>
                            </div>
                            <div className="mt-2 flex flex-wrap items-center gap-2">
                              <CategoryBadge category={q.category} />
                              <TrendIndicator trend={q.trend} delta={q.trendDelta} />
                              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                Last asked {relativeTime(q.lastAsked)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge tone="default" className="tabular-nums">
                            {q.count.toLocaleString()} asks
                          </Badge>
                          <ConfidenceBadge value={q.avgConfidence} />
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardBody>
            </Card>
          )}

          <Card>
            <CardHeader>
              <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Recent analyses</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Newest analyses across every policy, with attached findings.
                  </p>
                </div>
                <Badge tone="info">
                  {analyses?.length ?? 0} total
                </Badge>
              </div>
            </CardHeader>
            <CardBody className="pt-0">
              {!analyses || analyses.length === 0 ? (
                <EmptyState
                  icon={
                    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden>
                      <path
                        d="M7 3h10l4 4v14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"
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
                  title="No analyses yet."
                  description="Analyses are written via POST /api/policies/:id/analyses with findings attached. Once written, they appear here."
                  actionLabel="Browse policies"
                  onAction={() => router.push("/policies")}
                />
              ) : (
                <div className="flex flex-col divide-y divide-slate-100 dark:divide-slate-900">
                  {analyses.slice(0, 10).map((a) => {
                    const crit = a.findings.filter((f) => f.severity === "critical" || f.severity === "high").length;
                    return (
                      <Link
                        key={a.id}
                        href={`/policies/${a.policy.id}`}
                        className="group flex flex-wrap items-start justify-between gap-4 py-4"
                      >
                        <div className="flex min-w-0 flex-1 items-start gap-3">
                          <div className="mt-0.5 inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 ring-1 ring-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-800">
                            <svg viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px]">
                              <path
                                d="M9 11l3 3L22 4"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"
                                stroke="currentColor"
                                strokeWidth="1.75"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="truncate text-sm font-semibold text-slate-900 group-hover:text-emerald-700 dark:text-slate-100 dark:group-hover:text-emerald-300 transition-colors">
                                {a.policy.title}
                              </p>
                              <PolicyStatusBadge status={a.policy.status} />
                            </div>
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                              Analysis #{a.id} · {relativeTime(a.created_at)}
                            </p>
                            {a.summary && (
                              <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                                {a.summary}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge tone={a.status === "completed" ? "success" : "warning"}>
                            {a.status}
                          </Badge>
                          <Badge tone="default">{a.findings.length} findings</Badge>
                          {crit > 0 && (
                            <Badge tone={crit >= 2 ? "critical" : "high"}>
                              {crit} risk
                            </Badge>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </CardBody>
          </Card>
        </>
      )}

      <div className="mt-8 text-xs text-slate-500 dark:text-slate-400">
        Aggregated on the client from{" "}
        <code className="rounded bg-slate-100 px-1.5 py-0.5 dark:bg-slate-900">
          GET /api/policies
        </code>
        , per-policy{" "}
        <code className="rounded bg-slate-100 px-1.5 py-0.5 dark:bg-slate-900">
          GET /api/policies/:id/analyses
        </code>
        , and query-volume analytics. Add a dedicated{" "}
        <code className="rounded bg-slate-100 px-1.5 py-0.5 dark:bg-slate-900">
          /api/dashboard/stats
        </code>{" "}
        endpoint for performance on large datasets.
      </div>
    </PageShell>
  );
}
