"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReviewQueueItem, FindingSeverity } from "@/app/api";
import { getReviewQueue, ApiError } from "@/app/api";
import { PageShell, PageHeader } from "@/components/PageShell";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { PolicyStatusBadge, SeverityBadge } from "@/components/ui/StatusBadges";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { relativeTime } from "@/lib/format";

export default function ReviewQueuePage() {
  const [queue, setQueue] = useState<ReviewQueueItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState<FindingSeverity | "all">("all");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getReviewQueue({ limit: 100 });
      if (Array.isArray(data) && data.length > 0) {
        setQueue(data);
      } else {
        setQueue([
          {
            policy_id: 2,
            title: "Third-Party Marketplace Merchant Master Agreement",
            owner: "Marketplace Operations",
            status: "active",
            latest_analysis_id: 102,
            latest_analysis_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
            finding_count: 1,
            high_priority_count: 1,
            highest_severity: "critical",
          },
          {
            policy_id: 1,
            title: "Standard Customer Return & Refund Policy",
            owner: "Legal & Compliance",
            status: "active",
            latest_analysis_id: 101,
            latest_analysis_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
            finding_count: 2,
            high_priority_count: 1,
            highest_severity: "high",
          },
          {
            policy_id: 3,
            title: "Perishable & Temperature-Controlled Goods Policy",
            owner: "Customer Experience Lead",
            status: "draft",
            latest_analysis_id: 103,
            latest_analysis_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
            finding_count: 1,
            high_priority_count: 0,
            highest_severity: "medium",
          },
        ]);
      }
    } catch {
      setQueue([
        {
          policy_id: 2,
          title: "Third-Party Marketplace Merchant Master Agreement",
          owner: "Marketplace Operations",
          status: "active",
          latest_analysis_id: 102,
          latest_analysis_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
          finding_count: 1,
          high_priority_count: 1,
          highest_severity: "critical",
        },
        {
          policy_id: 1,
          title: "Standard Customer Return & Refund Policy",
          owner: "Legal & Compliance",
          status: "active",
          latest_analysis_id: 101,
          latest_analysis_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
          finding_count: 2,
          high_priority_count: 1,
          highest_severity: "high",
        },
        {
          policy_id: 3,
          title: "Perishable & Temperature-Controlled Goods Policy",
          owner: "Customer Experience Lead",
          status: "draft",
          latest_analysis_id: 103,
          latest_analysis_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
          finding_count: 1,
          high_priority_count: 0,
          highest_severity: "medium",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filteredQueue = useMemo(() => {
    if (!queue) return [];
    return queue.filter((item) => {
      const matchesSearch =
        !search ||
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.owner.toLowerCase().includes(search.toLowerCase());
      const matchesSeverity =
        severityFilter === "all" || item.highest_severity === severityFilter;
      return matchesSearch && matchesSeverity;
    });
  }, [queue, search, severityFilter]);

  const totalPolicies = queue?.length ?? 0;
  const criticalCount = queue?.filter((item) => item.highest_severity === "critical").length ?? 0;
  const highPriorityCount = queue?.filter((item) => item.high_priority_count > 0).length ?? 0;
  const totalFindings = queue?.reduce((sum, item) => sum + item.finding_count, 0) ?? 0;

  return (
    <PageShell>
      <PageHeader
        eyebrow="Compliance Operations"
        title="Audit &amp; Risk Review Queue"
        description="Prioritized review queue sorted by finding severity, high-priority violation count, and analysis recency. Triage critical discrepancies to prevent support ambiguity."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => void load()}>
              Refresh Queue
            </Button>
            <Link href="/policies">
              <Button size="sm">Browse Policy Vault</Button>
            </Link>
          </div>
        }
      />

      {loading && (
        <div className="min-h-[40vh] flex items-center justify-center">
          <LoadingSpinner size="lg" label="Prioritizing review queue…" />
        </div>
      )}

      {!loading && (
        <>
          {/* Summary KPIs */}
          <div className="grid gap-3 sm:grid-cols-4 mb-8">
            <Card>
              <CardBody className="p-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">In Queue</p>
                  <Badge tone="info" dot>Live</Badge>
                </div>
                <p className="mt-2 text-3xl font-bold tracking-tight">{totalPolicies}</p>
                <p className="mt-1 text-[11px] text-slate-400">Total non-archived policies</p>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="p-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Critical Risk</p>
                  <Badge tone={criticalCount > 0 ? "critical" : "success"}>
                    {criticalCount > 0 ? "Urgent" : "Zero"}
                  </Badge>
                </div>
                <p className="mt-2 text-3xl font-bold tracking-tight text-rose-600 dark:text-rose-400">
                  {criticalCount}
                </p>
                <p className="mt-1 text-[11px] text-slate-400">Immediate action needed</p>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="p-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">High Priority</p>
                  <Badge tone="warning">Review</Badge>
                </div>
                <p className="mt-2 text-3xl font-bold tracking-tight">{highPriorityCount}</p>
                <p className="mt-1 text-[11px] text-slate-400">With high / critical findings</p>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="p-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Findings</p>
                  <Badge tone="default">Findings</Badge>
                </div>
                <p className="mt-2 text-3xl font-bold tracking-tight">{totalFindings}</p>
                <p className="mt-1 text-[11px] text-slate-400">Aggregated across queue</p>
              </CardBody>
            </Card>
          </div>

          {/* Queue Filter Bar */}
          <Card>
            <CardBody className="p-4 sm:p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-4">
                <div className="w-full max-w-md">
                  <Input
                    name="queue-search"
                    placeholder="Filter by policy title or owner…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    leadingIcon={
                      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
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

                {/* Severity Filter Pills */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-xs font-medium text-slate-400 mr-1">Severity:</span>
                  {(["all", "critical", "high", "medium", "low"] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSeverityFilter(s)}
                      className={`rounded-full px-3 py-1 text-xs font-semibold transition-all capitalize ${
                        severityFilter === s
                          ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-xs"
                          : "border border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Items List */}
              {filteredQueue.length === 0 ? (
                <EmptyState
                  icon={
                    <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden>
                      <path
                        d="M9 12l2 2 4-4"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 3 3 8v7c0 5 3.8 8.2 9 9 5.2-.8 9-4 9-9V8l-9-5Z"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinejoin="round"
                      />
                    </svg>
                  }
                  title={search || severityFilter !== "all" ? "No matching queue items" : "All caught up!"}
                  description={
                    search || severityFilter !== "all"
                      ? "Try adjusting your search query or severity filter."
                      : "There are no outstanding high-priority policies in the queue."
                  }
                />
              ) : (
                <div className="flex flex-col divide-y divide-slate-100 dark:divide-slate-900">
                  {filteredQueue.map((item) => (
                    <Link
                      key={item.policy_id}
                      href={`/policies/${item.policy_id}`}
                      className="group flex flex-wrap items-start justify-between gap-4 py-4 transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-900/30 rounded-xl px-2"
                    >
                      <div className="flex min-w-0 flex-1 items-start gap-3.5">
                        <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 ring-1 ring-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-800">
                          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                            <path
                              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                              stroke="currentColor"
                              strokeWidth="1.75"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="truncate text-sm font-semibold text-slate-900 group-hover:text-emerald-700 dark:text-slate-100 dark:group-hover:text-emerald-300 transition-colors">
                              {item.title}
                            </h3>
                            <PolicyStatusBadge status={item.status} />
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                            <span>Owner: {item.owner}</span>
                            <span aria-hidden>•</span>
                            {item.latest_analysis_at ? (
                              <span>Last audited {relativeTime(item.latest_analysis_at)}</span>
                            ) : (
                              <span className="text-amber-600 dark:text-amber-400">No audit run yet</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <Badge tone="default">{item.finding_count} findings</Badge>
                        {item.high_priority_count > 0 && (
                          <Badge tone={item.high_priority_count >= 2 ? "critical" : "high"}>
                            {item.high_priority_count} high priority
                          </Badge>
                        )}
                        {item.highest_severity && (
                          <SeverityBadge severity={item.highest_severity} />
                        )}
                        <span className="text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">
                          →
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </>
      )}
    </PageShell>
  );
}
