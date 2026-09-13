"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Policy, Analysis, Finding } from "@/app/api";
import { getPolicy, getAnalyses, ApiError } from "@/app/api";
import { PageShell, PageHeader } from "@/components/PageShell";
import { Card, CardBody, CardHeader, CardDivider } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { LoadingScreen } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import {
  PolicyStatusBadge, SeverityBadge } from "@/components/ui/StatusBadges";
import { formatDate, formatDateTime, relativeTime } from "@/lib/format";

function BackLink() {
  return (
    <Link
      href="/policies"
      className="inline-flex h-9 items-center rounded-full border border-slate-300 px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"
    >
      ← Back to policies
    </Link>
  );
}

function FindingCard({ f }: { f: Finding }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white/80 p-4 transition-all hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950/60">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {f.title}
            </h4>
            <SeverityBadge severity={f.severity} />
          </div>
        </div>
      </div>
      {f.details && (
        <div className="mt-3 rounded-xl border-l-2 border-slate-200 pl-3 text-[13px] leading-6 text-slate-700 dark:border-slate-700 dark:text-slate-200">
          {f.details}
        </div>
      )}
      {f.recommendation && (
        <div className="mt-3 rounded-xl bg-emerald-50 p-3 text-[13px] leading-6 text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200">
          <p className="text-[11px] font-semibold uppercase tracking-wider mb-1 opacity-80">
            Recommendation
          </p>
          {f.recommendation}
        </div>
      )}
    </article>
  );
}

function AnalysisCard({ a }: { a: Analysis }) {
  const critical = a.findings.filter((f) => f.severity === "critical").length;
  const high = a.findings.filter((f) => f.severity === "high").length;
  const med = a.findings.filter((f) => f.severity === "medium").length;

  return (
    <Card>
      <CardBody className="p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              Analysis #{a.id}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {relativeTime(a.created_at)} · {formatDateTime(a.created_at)}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={a.status === "completed" ? "success" : "warning"}>
              {a.status}
            </Badge>
            {critical > 0 && (
              <Badge tone="critical">{critical} critical</Badge>
            )}
            {high > 0 && <Badge tone="high">{high} high</Badge>}
            {med > 0 && <Badge tone="medium">{med} medium</Badge>}
          </div>
        </div>

        {a.summary && (
          <>
            <CardDivider />
            <div className="rounded-xl bg-slate-50 p-4 text-sm leading-7 text-slate-800 dark:bg-slate-900 dark:text-slate-200">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1 dark:text-slate-400">
              Summary
            </p>
            {a.summary}
            </div>
          </>
        )}

        {a.findings.length > 0 && (
          <>
            <CardDivider />
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              Findings ({a.findings.length})
            </p>
              <div className="grid gap-3">
                {a.findings.map((f) => (
                  <FindingCard key={f.id} f={f} />
                ))}
              </div>
            </div>
          </>
        )}

        {a.findings.length === 0 && (
          <p className="text-sm italic text-slate-500 dark:text-slate-400">
            No findings attached.
          </p>
        )}
      </CardBody>
    </Card>
  );
}

export default function PolicyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [policyId, setPolicyId] = useState<number | null>(null);
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [analyses, setAnalyses] = useState<Analysis[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFoundState, setNotFoundState] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void params.then((p) => {
      if (cancelled) return;
      const id = Number(p.id);
      if (!Number.isFinite(id) || id <= 0 || !Number.isInteger(id)) {
        setNotFoundState(true);
        return;
      }
      setPolicyId(id);
    });
    return () => {
      cancelled = true;
    };
  }, [params]);

  const load = useCallback(async () => {
    if (policyId === null) return;
    setLoading(true);
    setError(null);
    try {
      const [p, a] = await Promise.all([getPolicy(policyId), getAnalyses(policyId)]);
      setPolicy(p);
      setAnalyses(a);
    } catch (e) {
      if (e instanceof ApiError && e.status === 404) {
        setNotFoundState(true);
        return;
      }
      const msg =
        e instanceof ApiError
          ? `Backend error (${e.status}): ${e.message}`
          : e instanceof Error
            ? e.message
            : "Could not load policy. Is the backend running at http://localhost:8000?";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [policyId]);

  useEffect(() => {
    void load();
  }, [load]);

  const findingsBreakdown = useMemo(() => {
    if (!analyses) return null;
    const all = analyses.flatMap((a) => a.findings);
    return {
      total: all.length,
      critical: all.filter((f) => f.severity === "critical").length,
      high: all.filter((f) => f.severity === "high").length,
      medium: all.filter((f) => f.severity === "medium").length,
      low: all.filter((f) => f.severity === "low").length,
    };
  }, [analyses]);

  if (notFoundState) {
    return (
      <PageShell>
        <div className="mb-6">
          <BackLink />
        </div>
        <EmptyState
          icon={
            <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden>
              <path
                d="M9.75 3h4.5a2 2 0 0 1 2 2v1h-8.5v-1a2 2 0 0 1 2-2Zm-2.5 3h9.5l1 15a1 1 0 0 1-1 1H8.25a1 1 0 0 1-1-1l1-15Z"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinejoin="round"
              />
            </svg>
          }
          title="Policy not found"
          description="This policy ID does not exist or was removed. Try another ID or browse the full policy library."
          actionLabel="Browse policies"
          onAction={() => {
            if (typeof window !== "undefined") {
              window.location.href = "/policies";
            }
          }}
        />
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="mb-6">
        <BackLink />
      </div>

      {error && (
        <Alert
          className="mb-6"
          tone="danger"
          title="Could not load policy data"
          message={
            <>
              {error}
              <div className="mt-2 flex flex-wrap gap-2">
                <Button size="sm" variant="ghost" onClick={() => void load()}>
                  Try again
                </Button>
                <Link href="/policies">
                  <Button size="sm" variant="outline">
                    Back to policies
                  </Button>
                </Link>
              </div>
            </>
          }
        />
      )}

      {loading && <LoadingScreen label="Loading policy…" />}

      {!loading && !error && policy && (
        <>
          <PageHeader
          eyebrow="Policy details"
          title={policy.title}
          description={
            policy.description
              ? policy.description
              : "No description has been set for this policy yet."
          }
          actions={
            <Link href={`/chat?p=${policy.id}`}>
              <Button size="md">
                Ask about this policy
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

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
              <CardBody className="p-5">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Status
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <PolicyStatusBadge status={policy.status} />
                </div>
              </CardBody>
            </Card>
            <Card>
              <CardBody className="p-5">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Version
                </p>
                <p className="mt-2 text-xl font-semibold">v{policy.version}</p>
              </CardBody>
            </Card>
            <Card>
              <CardBody className="p-5">
                <p className="text-xs text-slate-500 dark:text-slate-400">Owner</p>
                <p className="mt-2 text-xl font-semibold truncate">{policy.owner}</p>
              </CardBody>
            </Card>
            <Card>
              <CardBody className="p-5">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Last updated
                </p>
                <p className="mt-2 text-base font-semibold">
                  {relativeTime(policy.updated_at)}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Created {formatDate(policy.created_at)}
                </p>
              </CardBody>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-semibold">Policy body</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    The full description &amp; scope of this policy document.
                  </p>
                </CardHeader>
                <CardBody className="pt-0">
                  {policy.description ? (
                    <div className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-900">
                      <pre className="whitespace-pre-wrap break-words font-sans text-[14px] leading-7 text-slate-800 dark:text-slate-200">
                        {policy.description}
                      </pre>
                    </div>
                  ) : (
                    <p className="text-sm italic text-slate-500 dark:text-slate-400">
                      No description has been set for this policy.
                    </p>
                  )}
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold">Analysis history</h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {analyses?.length
                          ? `${analyses.length} analysis${analyses.length > 1 ? "es" : ""}`
                          : "No analyses yet"}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => void load()}>
                      Refresh
                    </Button>
                  </div>
                </CardHeader>
                <CardBody className="pt-0">
                  {analyses && analyses.length === 0 ? (
                    <EmptyState
                      icon={
                        <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden>
                          <path
                            d="M9 12h6M9 16h6M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
                            stroke="currentColor"
                            strokeWidth="1.75"
                            strokeLinejoin="round"
                          />
                        </svg>
                      }
                      title="No analyses yet."
                      description="Policy analyses are stored via POST /api/policies/{policy.id}/analyses. Once saved, they'll appear here with their findings."
                    />
                  ) : (
                    <div className="flex flex-col gap-4">
                      {analyses?.map((a) => (
                        <AnalysisCard key={a.id} a={a} />
                      ))}
                    </div>
                  )}
                </CardBody>
              </Card>
            </div>

            <div className="flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-semibold">Findings breakdown</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Across all analyses
                  </p>
                </CardHeader>
                <CardBody className="pt-0">
                  {!findingsBreakdown || findingsBreakdown.total === 0 ? (
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      No findings recorded yet.
                    </p>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 dark:bg-slate-900">
                        <span className="text-sm text-slate-700 dark:text-slate-200">
                          Total findings
                        </span>
                        <span className="text-lg font-semibold">
                          {findingsBreakdown.total}
                        </span>
                      </div>
                      {[
                        { k: "critical", label: "Critical", tone: "critical" as const, count: findingsBreakdown.critical },
                        { k: "high", label: "High", tone: "high" as const, count: findingsBreakdown.high },
                        { k: "medium", label: "Medium", tone: "medium" as const, count: findingsBreakdown.medium },
                        { k: "low", label: "Low", tone: "low" as const, count: findingsBreakdown.low },
                      ].map((r) => (
                        <div key={r.k} className="flex items-center justify-between gap-3">
                          <SeverityBadge severity={r.k as Finding["severity"]} />
                          <span className="text-lg font-semibold tabular-nums">
                            {r.count}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardBody>
              </Card>

              <Card>
                <CardBody className="p-5">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    Quick actions
                  </h3>
                  <div className="mt-4 flex flex-col gap-2">
                    <Link href={`/chat?p=${policy.id}`}>
                      <Button
                      variant="primary"
                      size="sm"
                      className="w-full"
                    >
                      Ask about this policy
                    </Button>
                  </Link>
                    <Link href="/policies">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        Browse all policies
                      </Button>
                    </Link>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </>
      )}

      <div className="mt-10 text-xs text-slate-500 dark:text-slate-400">
        Data from{" "}
        <code className="rounded bg-slate-100 px-1.5 py-0.5 dark:bg-slate-900">
          GET /api/policies/{policy?.id ?? policyId ?? "id"}
        </code>{" "}
        &amp;{" "}
        <code className="rounded bg-slate-100 px-1.5 py-0.5 dark:bg-slate-900">
          GET /api/policies/{policy?.id ?? policyId ?? "id"}/analyses
        </code>
        .
      </div>
    </PageShell>
  );
}
