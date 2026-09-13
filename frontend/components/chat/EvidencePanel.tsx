import { useState } from "react";
import type { ChatSource, ChatResponse } from "@/app/api";
import { Badge } from "@/components/ui/Badge";
import { ConfidenceBadge } from "@/components/ui/StatusBadges";
import { SourceCitation } from "./SourceCitation";

export function EvidencePanel({
  response,
  compact = false,
}: {
  response: ChatResponse;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(!compact);
  const sources: ChatSource[] = response.sources ?? [];
  const count = sources.length;

  return (
    <div className="mt-4 rounded-2xl border border-emerald-200/70 bg-emerald-50/60 dark:border-emerald-900/50 dark:bg-emerald-950/20">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 rounded-t-2xl px-4 py-3.5 text-left"
      >
        <div className="flex items-center gap-3">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-emerald-700 shadow-sm ring-1 ring-emerald-200 dark:bg-slate-950 dark:text-emerald-300 dark:ring-emerald-900">
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
              <path
                d="M4 6h16M4 12h10M4 18h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M17.5 8.5 21 12l-3.5 3.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <div className="flex flex-col gap-0.5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800 dark:text-emerald-300">
              {response.grounded ? "Grounded in policy" : "Low grounding — partial match"}
            </p>
            <p className="text-sm text-emerald-900/80 dark:text-emerald-200/80">
              {count === 0
                ? "No source citations attached"
                : count === 1
                  ? "Based on 1 source"
                  : `Based on ${count} sources`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ConfidenceBadge value={response.confidence} />
          <span
            className="grid h-7 w-7 place-items-center rounded-full text-slate-500 transition-transform dark:text-slate-300"
            aria-hidden
            style={{ transform: open ? "rotate(180deg)" : "" }}
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
              <path
                d="m6 9 6 6 6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </button>

      {open && (
        <div className="border-t border-emerald-200/60 p-4 pt-4 space-y-3 dark:border-emerald-900/50">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={response.grounded ? "active" : "warning"}>
              {response.grounded ? "Answer grounded" : "Not fully grounded"}
            </Badge>
            {count > 0 && (
              <Badge tone="default">{count} source{count > 1 ? "s" : ""}</Badge>
            )}
            {(response.related_policy_ids ?? []).length > 0 && (
              <Badge tone="info">
                Related policy #{response.related_policy_ids?.join(", #")}
              </Badge>
            )}
          </div>

          {sources.length > 0 ? (
            <div className="grid gap-3">
              {sources.map((s, i) => (
                <SourceCitation
                  key={i}
                  source={s}
                  index={i + 1}
                  policyHref={
                    typeof s.policy_id === "number"
                      ? `/policies/${s.policy_id}`
                      : undefined
                  }
                />
              ))}
            </div>
          ) : (
            <p className="rounded-xl border border-dashed border-emerald-300 bg-white/50 p-4 text-xs leading-5 text-emerald-900/70 dark:border-emerald-800 dark:bg-slate-950/50 dark:text-emerald-200/80">
              This answer has no specific source citations. Treat it as a general guidance only and
              escalate to an agent if unsure.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
