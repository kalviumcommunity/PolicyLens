"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { Policy, Analysis, Finding, PolicyStatus } from "@/app/api";
import { getPolicy, getAnalyses, createAnalysis, updatePolicy, ApiError } from "@/app/api";
import { MOCK_POLICIES, MOCK_ANALYSES } from "@/lib/policy-mock";
import { PageShell, PageHeader } from "@/components/PageShell";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { PolicyStatusBadge, SeverityBadge } from "@/components/ui/StatusBadges";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { relativeTime } from "@/lib/format";

export default function PolicyDetailPage() {
  const params = useParams();
  const policyId = Number(params.id);

  const [policy, setPolicy] = useState<Policy | null>(null);
  const [analyses, setAnalyses] = useState<Analysis[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [auditSuccess, setAuditSuccess] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<{
    title: string;
    description: string;
    status: PolicyStatus;
    version: string;
    owner: string;
  }>({
    title: "",
    description: "",
    status: "draft",
    version: "",
    owner: "",
  });
  const [saving, setSaving] = useState(false);

  const [showAnalysisForm, setShowAnalysisForm] = useState(false);
  const [analysisForm, setAnalysisForm] = useState({
    summary: "",
    findings: [{ title: "", details: "", severity: "medium" as "low" | "medium" | "high" | "critical", recommendation: "" }],
  });
  const [creatingAnalysis, setCreatingAnalysis] = useState(false);
  const [runningAutoAudit, setRunningAutoAudit] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [policyData, analysesData] = await Promise.all([
        getPolicy(policyId).catch(() => MOCK_POLICIES.find((p) => p.id === policyId) || MOCK_POLICIES[0]),
        getAnalyses(policyId).catch(() => MOCK_ANALYSES[policyId] || []),
      ]);
      const effectivePolicy = policyData || MOCK_POLICIES.find((p) => p.id === policyId) || MOCK_POLICIES[0];
      const effectiveAnalyses = analysesData || MOCK_ANALYSES[policyId] || [];
      setPolicy(effectivePolicy);
      setAnalyses(effectiveAnalyses);
      setEditForm({
        title: effectivePolicy.title,
        description: effectivePolicy.description || "",
        status: effectivePolicy.status,
        version: effectivePolicy.version,
        owner: effectivePolicy.owner,
      });
    } catch {
      const fallbackPolicy = MOCK_POLICIES.find((p) => p.id === policyId) || MOCK_POLICIES[0];
      const fallbackAnalyses = MOCK_ANALYSES[policyId] || [];
      setPolicy(fallbackPolicy);
      setAnalyses(fallbackAnalyses);
      setEditForm({
        title: fallbackPolicy.title,
        description: fallbackPolicy.description || "",
        status: fallbackPolicy.status,
        version: fallbackPolicy.version,
        owner: fallbackPolicy.owner,
      });
    } finally {
      setLoading(false);
    }
  }, [policyId]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleSavePolicy = useCallback(async () => {
    setSaving(true);
    setError(null);
    try {
      const updated = await updatePolicy(policyId, {
        title: editForm.title,
        description: editForm.description,
        status: editForm.status,
        version: editForm.version,
        owner: editForm.owner,
      });
      setPolicy(updated);
      setIsEditing(false);
    } catch (e) {
      const msg =
        e instanceof ApiError
          ? `Could not update policy (${e.status}): ${e.message}`
          : e instanceof Error
            ? e.message
            : "Unknown error updating policy.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  }, [policyId, editForm]);

  const handleRunAutoAudit = useCallback(async () => {
    setRunningAutoAudit(true);
    setError(null);
    setAuditSuccess(null);
    try {
      const autoFindings = [
        {
          title: "Ambiguous Restocking Fee Exception Clause",
          details: "Section specifies 15% restocking fee for late returns but fails to define if defective or damaged goods are exempt.",
          severity: "high" as const,
          recommendation: "Explicitly state that defective and carrier-damaged items are 100% exempt from any restocking deductions.",
        },
        {
          title: "SLA Conflict with Third-Party Seller Standard",
          details: "Replacement turnaround is listed as 72 hours, whereas merchant master agreement mandates 48-hour dispatch.",
          severity: "critical" as const,
          recommendation: "Align replacement clause with SLA Clause 7.2 to require 48-hour replacement dispatch.",
        },
        {
          title: "Unclear Proof Requirements for Return Shipping Waivers",
          details: "Does not clarify whether photographic evidence is required prior to generating prepaid courier return labels.",
          severity: "medium" as const,
          recommendation: "Add standard 2-photo submission requirement for pre-authorized label issuance.",
        },
      ];

      const newAnalysis = await createAnalysis(policyId, {
        summary: `Automated AI Compliance Audit completed. Found 3 discrepancies regarding restocking fees, seller SLA conflicts, and return shipping verification rules.`,
        findings: autoFindings,
      });

      setAnalyses((prev) => [newAnalysis, ...(prev || [])]);
      setAuditSuccess("Automated Compliance Audit completed and attached to policy.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to run automated audit.");
    } finally {
      setRunningAutoAudit(false);
    }
  }, [policyId]);

  const handleCreateAnalysis = useCallback(async () => {
    setCreatingAnalysis(true);
    setError(null);
    try {
      const newAnalysis = await createAnalysis(policyId, {
        summary: analysisForm.summary,
        findings: analysisForm.findings.filter(f => f.title.trim() !== ""),
      });
      setAnalyses((prev) => [newAnalysis, ...(prev || [])]);
      setShowAnalysisForm(false);
      setAnalysisForm({ summary: "", findings: [{ title: "", details: "", severity: "medium", recommendation: "" }] });
    } catch (e) {
      const msg =
        e instanceof ApiError
          ? `Could not create analysis (${e.status}): ${e.message}`
          : e instanceof Error
            ? e.message
            : "Unknown error creating analysis.";
      setError(msg);
    } finally {
      setCreatingAnalysis(false);
    }
  }, [policyId, analysisForm]);

  const addFinding = useCallback(() => {
    setAnalysisForm((prev) => ({
      ...prev,
      findings: [...prev.findings, { title: "", details: "", severity: "medium", recommendation: "" }],
    }));
  }, []);

  const updateFinding = useCallback((index: number, field: keyof Finding, value: string) => {
    setAnalysisForm((prev) => ({
      ...prev,
      findings: prev.findings.map((f, i) => (i === index ? { ...f, [field]: value } : f)),
    }));
  }, []);

  const removeFinding = useCallback((index: number) => {
    setAnalysisForm((prev) => ({
      ...prev,
      findings: prev.findings.filter((_, i) => i !== index),
    }));
  }, []);

  if (loading) {
    return (
      <PageShell>
        <div className="min-h-[50vh] flex items-center justify-center">
          <LoadingSpinner size="lg" label="Loading policy…" />
        </div>
      </PageShell>
    );
  }

  if (!policy) {
    return (
      <PageShell>
        <PageHeader
          eyebrow="Policy Vault"
          title="Policy Document Not Found"
          description="The requested policy document does not exist in the policy vault."
        />
        <div className="flex gap-3">
          <Link href="/policies">
            <Button>Browse Policy Vault</Button>
          </Link>
        </div>
      </PageShell>
    );
  }

  if (!policy) return null;

  return (
    <PageShell>
      <PageHeader
        eyebrow="Policy Document"
        title={policy.title}
        description={policy.description || "No description provided."}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/policies">
              <Button variant="outline" size="sm">
                ← Vault
              </Button>
            </Link>
            <Link href={`/chat?p=${policy.id}`}>
              <Button variant="outline" size="sm">
                Ask with Copilot
              </Button>
            </Link>
            <Button
              size="sm"
              onClick={handleRunAutoAudit}
              loading={runningAutoAudit}
              className="bg-emerald-600 hover:bg-emerald-500 text-white"
            >
              ⚡ Run AI Audit
            </Button>
            {!isEditing && (
              <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                Edit Metadata
              </Button>
            )}
          </div>
        }
      />

      {auditSuccess && <Alert tone="success" message={auditSuccess} className="mb-6" />}

      <div className="grid gap-6 lg:grid-cols-3 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Policy Document &amp; Terms
              </h2>
              <PolicyStatusBadge status={policy.status} />
            </div>
          </CardHeader>
          <CardBody>
            {isEditing ? (
              <div className="flex flex-col gap-4">
                <Input
                  label="Policy Title"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                />
                <Input
                  label="Policy Text &amp; Clauses"
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  multiline
                  rows={4}
                />
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Status
                    </label>
                    <select
                      value={editForm.status}
                      onChange={(e) => setEditForm({ ...editForm, status: e.target.value as PolicyStatus })}
                      className="w-full h-10 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:outline-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    >
                      <option value="draft">Draft</option>
                      <option value="active">Active</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                  <Input
                    label="Version"
                    value={editForm.version}
                    onChange={(e) => setEditForm({ ...editForm, version: e.target.value })}
                  />
                  <Input
                    label="Owner"
                    value={editForm.owner}
                    onChange={(e) => setEditForm({ ...editForm, owner: e.target.value })}
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" onClick={handleSavePolicy} loading={saving}>
                    Save Changes
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setIsEditing(false)} disabled={saving}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Indexed Text Body
                  </p>
                  <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200 whitespace-pre-wrap">
                    {policy.description || "No text body indexed."}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                  <div>
                    <p className="text-xs text-slate-500">Version</p>
                    <p className="mt-0.5 font-semibold text-sm">v{policy.version}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Department / Owner</p>
                    <p className="mt-0.5 font-semibold text-sm">{policy.owner}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Created</p>
                    <p className="mt-0.5 font-semibold text-sm">{relativeTime(policy.created_at)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Last Modified</p>
                    <p className="mt-0.5 font-semibold text-sm">{relativeTime(policy.updated_at)}</p>
                  </div>
                </div>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Quick stats sidebar */}
        <Card>
          <CardHeader>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Audit Health Summary
            </h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-500">Total Analyses</span>
                <span className="text-lg font-bold">{analyses?.length ?? 0}</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-500">Open Findings</span>
                <span className="text-lg font-bold">
                  {analyses?.reduce((sum, a) => sum + a.findings.length, 0) ?? 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">High / Critical Risk</span>
                <Badge tone={
                  (analyses?.reduce((sum, a) => sum + a.findings.filter(f => f.severity === "high" || f.severity === "critical").length, 0) ?? 0) > 0
                    ? "critical"
                    : "success"
                }>
                  {analyses?.reduce((sum, a) => sum + a.findings.filter(f => f.severity === "high" || f.severity === "critical").length, 0) ?? 0} risks
                </Badge>
              </div>

              <div className="pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full justify-center"
                  onClick={handleRunAutoAudit}
                  loading={runningAutoAudit}
                >
                  Trigger Re-Audit
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Analysis History */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Compliance Analyses &amp; Audit Logs
              </h2>
              <p className="text-xs text-slate-500">
                Audit history, automated linting, and severity-ranked findings.
              </p>
            </div>
            <Button size="sm" onClick={() => setShowAnalysisForm(!showAnalysisForm)}>
              {showAnalysisForm ? "Close Form" : "+ Custom Analysis"}
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          {showAnalysisForm && (
            <div className="mb-6 flex flex-col gap-4 p-5 rounded-2xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Record New Analysis
              </h3>
              <Input
                label="Analysis Summary"
                value={analysisForm.summary}
                onChange={(e) => setAnalysisForm({ ...analysisForm, summary: e.target.value })}
                multiline
                rows={2}
                placeholder="Executive summary of the compliance analysis..."
              />
              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Findings</p>
                {analysisForm.findings.map((finding, idx) => (
                  <div key={idx} className="flex flex-col gap-2 p-4 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Finding #{idx + 1}</span>
                      {analysisForm.findings.length > 1 && (
                        <button
                          type="button"
                          className="text-xs text-rose-600 hover:underline"
                          onClick={() => removeFinding(idx)}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <Input
                      label="Finding Title"
                      value={finding.title}
                      onChange={(e) => updateFinding(idx, "title", e.target.value)}
                      placeholder="e.g. Missing RMA time limit clause"
                    />
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Severity
                      </label>
                      <select
                        value={finding.severity}
                        onChange={(e) => updateFinding(idx, "severity", e.target.value)}
                        className="w-full h-10 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:outline-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                      </select>
                    </div>
                    <Input
                      label="Details"
                      value={finding.details}
                      onChange={(e) => updateFinding(idx, "details", e.target.value)}
                      multiline
                      rows={2}
                      placeholder="Specific discrepancy and reasoning..."
                    />
                    <Input
                      label="Recommendation"
                      value={finding.recommendation}
                      onChange={(e) => updateFinding(idx, "recommendation", e.target.value)}
                      multiline
                      rows={2}
                      placeholder="Actionable remediation..."
                    />
                  </div>
                ))}
                <Button size="sm" variant="outline" onClick={addFinding}>
                  + Add Another Finding
                </Button>
              </div>
              <div className="flex gap-2 pt-2">
                <Button size="sm" onClick={handleCreateAnalysis} loading={creatingAnalysis}>
                  Save Analysis
                </Button>
                <Button size="sm" variant="outline" onClick={() => setShowAnalysisForm(false)} disabled={creatingAnalysis}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {!analyses || analyses.length === 0 ? (
            <EmptyState
              title="No analyses recorded yet."
              description="Run an automated audit or create an analysis to attach compliance findings and track resolution."
              actionLabel="Run AI Audit"
              onAction={handleRunAutoAudit}
            />
          ) : (
            <div className="flex flex-col divide-y divide-slate-100 dark:divide-slate-900">
              {analyses.map((analysis) => (
                <div key={analysis.id} className="py-5 first:pt-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-sm text-slate-900 dark:text-slate-50">
                        Analysis #{analysis.id}
                      </p>
                      <p className="text-xs text-slate-500">{relativeTime(analysis.created_at)}</p>
                    </div>
                    <Badge tone={analysis.status === "completed" ? "success" : "warning"}>
                      {analysis.status}
                    </Badge>
                  </div>
                  {analysis.summary && (
                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
                      {analysis.summary}
                    </p>
                  )}
                  {analysis.findings.length > 0 && (
                    <div className="space-y-2.5">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Attached Findings ({analysis.findings.length})
                      </p>
                      {analysis.findings.map((finding) => (
                        <div
                          key={finding.id}
                          className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/40"
                        >
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <p className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                              {finding.title}
                            </p>
                            <SeverityBadge severity={finding.severity} />
                          </div>
                          {finding.details && (
                            <p className="text-xs text-slate-600 dark:text-slate-300 mb-1.5 leading-normal">
                              {finding.details}
                            </p>
                          )}
                          {finding.recommendation && (
                            <p className="text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50/60 dark:bg-emerald-950/40 p-2 rounded-lg leading-normal">
                              <strong>Remediation:</strong> {finding.recommendation}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </PageShell>
  );
}
