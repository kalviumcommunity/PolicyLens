import type { PolicyStatus, FindingSeverity } from "@/app/api";
import { Badge } from "./Badge";

export function PolicyStatusBadge({ status }: { status: PolicyStatus }) {
  const labels: Record<PolicyStatus, string> = {
    active: "Active",
    draft: "Draft",
    archived: "Archived",
  };
  return (
    <Badge tone={status} dot>
      {labels[status]}
    </Badge>
  );
}

export function SeverityBadge({ severity }: { severity: FindingSeverity }) {
  const labels: Record<FindingSeverity, string> = {
    low: "Low",
    medium: "Medium",
    high: "High",
    critical: "Critical",
  };
  return (
    <Badge tone={severity} dot>
      {labels[severity]}
    </Badge>
  );
}

export function ConfidenceBadge({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(1, value));
  let tone: "success" | "warning" | "danger" = "success";
  if (pct < 0.6) tone = "danger";
  else if (pct < 0.85) tone = "warning";
  return (
    <Badge tone={tone} dot>
      {Math.round(pct * 100)}% confidence
    </Badge>
  );
}
