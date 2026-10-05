"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { Policy, PolicyStatus, PolicyCreate } from "@/app/api";
import { getPolicies, createPolicy, ApiError } from "@/app/api";
import { MOCK_POLICIES } from "@/lib/policy-mock";
import { PageShell, PageHeader } from "@/components/PageShell";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/LoadingSpinner";
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
      className="group flex w-full items-start gap-4 rounded-2xl border border-transparent p-4 transition-all hover:border-slate-200 hover:bg-white/70 hover:shadow-xs dark:hover:border-slate-800 dark:hover:bg-slate-900/60"
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

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createForm, setCreateForm] = useState<PolicyCreate>({
    title: "",
    description: "",
    status: "draft",
    version: "1.0",
    owner: "",
  });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(search.trim()), 300);
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
      if (Array.isArray(data) && data.length > 0) {
        setPolicies(data);
      } else {
        const filteredMock = MOCK_POLICIES.filter((p) => {
          const matchStatus = status === "all" || p.status === status;
          const matchSearch = !debounced || p.title.toLowerCase().includes(debounced.toLowerCase());
          return matchStatus && matchSearch;
        });
        setPolicies(filteredMock);
      }
    } catch {
      const filteredMock = MOCK_POLICIES.filter((p) => {
        const matchStatus = status === "all" || p.status === status;
        const matchSearch = !debounced || p.title.toLowerCase().includes(debounced.toLowerCase());
        return matchStatus && matchSearch;
      });
      setPolicies(filteredMock);
    } finally {
      setLoading(false);
    }
  }, [status, debounced]);

  const handleCreatePolicy = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!createForm.title.trim()) {
      setError("Policy title is required.");
      return;
    }
    if (!createForm.owner.trim()) {
      setError("Policy owner is required.");
      return;
    }

    setCreating(true);
    setError(null);
    try {
      const newPolicy = await createPolicy(createForm);
      setPolicies((prev) => [newPolicy, ...(prev || [])]);
      setShowCreateForm(false);
      setCreateForm({
        title: "",
        description: "",
        status: "draft",
        version: "1.0",
        owner: "",
      });
    } catch (e) {
      const msg =
        e instanceof ApiError
          ? `Could not create policy (${e.status}): ${e.message}`
          : e instanceof Error
            ? e.message
            : "Unknown error creating policy.";
      setError(msg);
    } finally {
      setCreating(false);
    }
  }, [createForm]);

  const exportPolicies = useCallback(() => {
    if (!policies || policies.length === 0) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(policies, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `policylens-export-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }, [policies]);

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
        eyebrow="Policy Vault"
        title="Knowledge Base &amp; Regulatory Rules"
        description="Search, version, and manage all organizational policies and agreements. Open any policy to inspect analysis history, findings, and compliance severity tags."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="md"
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="shadow-xs"
            >
              {showCreateForm ? "Close form" : "+ New policy"}
            </Button>
            <Button
              size="md"
              variant="outline"
              onClick={exportPolicies}
              disabled={!policies || policies.length === 0}
            >
              Export JSON
            </Button>
            <Link href="/chat">
              <Button size="md" variant="outline">
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
          </div>
        }
      />

      {showCreateForm && (
        <Card className="mb-8 border-emerald-500/30 bg-emerald-50/10 dark:border-emerald-500/20 dark:bg-emerald-950/10">
          <CardBody className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Create New Policy Document
              </h2>
              <span className="text-xs text-slate-500">Will be indexed into the knowledge vault</span>
            </div>
            <form onSubmit={handleCreatePolicy} className="flex flex-col gap-4">
              <Input
                label="Policy Title"
                value={createForm.title}
                onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                placeholder="e.g. Return Policy (Electronics &amp; Peripherals)"
                required
              />
              <Input
                label="Policy Description &amp; Summary"
                value={createForm.description}
                onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                multiline
                rows={3}
                placeholder="Detailed policy text, clauses, terms, and conditions..."
              />
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Status
                  </label>
                  <select
                    value={createForm.status}
                    onChange={(e) => setCreateForm({ ...createForm, status: e.target.value as PolicyStatus })}
                    className="w-full h-10 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:outline-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <Input
                  label="Version"
                  value={createForm.version}
                  onChange={(e) => setCreateForm({ ...createForm, version: e.target.value })}
                  placeholder="1.0"
                />
                <Input
                  label="Owner / Department"
                  value={createForm.owner}
                  onChange={(e) => setCreateForm({ ...createForm, owner: e.target.value })}
                  placeholder="e.g. Legal &amp; Compliance"
                  required
                />
              </div>
              <div className="flex gap-2 pt-2">
                <Button type="submit" size="sm" loading={creating}>
                  Create &amp; Index Policy
                </Button>
                <Button size="sm" variant="outline" onClick={() => setShowCreateForm(false)} disabled={creating}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      )}

      {/* Metric Cards */}
      <div className="grid gap-3 sm:grid-cols-3 mb-8">
        {[
          { label: "Total policies", value: total, tone: "default" as const },
          { label: "Active in Production", value: active, tone: "active" as const },
          { label: "Drafts in Review", value: drafts, tone: "draft" as const },
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

      {/* Main Filter & Table Card */}
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
                      "inline-flex h-9 items-center rounded-full px-4 text-xs font-semibold transition-all",
                      active
                        ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950 shadow-xs"
                        : "border border-slate-300/80 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900",
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
          {loading && (
            <div className="flex flex-col divide-y divide-slate-100 dark:divide-slate-900">
              {Array.from({ length: 4 }).map((_, i) => (
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
                title={debounced ? "No policies match your search." : "No policies in vault."}
                description={
                  debounced
                    ? "Try a different search term or reset the status filter."
                    : "Create your first policy or seed demo data to begin grounding queries."
                }
                actionLabel={debounced ? "Clear filters" : "Create first policy"}
                onAction={
                  debounced
                    ? () => {
                        setSearch("");
                        setStatus("all");
                      }
                    : () => setShowCreateForm(true)
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
    </PageShell>
  );
}
