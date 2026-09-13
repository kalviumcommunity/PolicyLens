import Link from "next/link";
import type { ChatSource } from "@/app/api";
import { Badge } from "@/components/ui/Badge";

function PolicyIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4 flex-shrink-0"
      aria-hidden="true"
    >
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
  );
}

export function SourceCitation({
  source,
  index,
  policyHref,
}: {
  source: ChatSource;
  index: number;
  policyHref?: string;
}) {
  const rel =
    typeof source.relevance === "number"
      ? Math.round(source.relevance * 100)
      : null;
  return (
    <article className="group relative rounded-2xl border border-slate-200 bg-white/80 p-4 transition-all hover:border-emerald-300 hover:shadow-sm dark:border-slate-800 dark:bg-slate-950/60 hover:dark:border-emerald-900">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-start gap-2.5">
          <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:ring-emerald-900 font-semibold text-[11px]">
            {index}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-100">
                <span className="text-emerald-700 dark:text-emerald-400">
                  <PolicyIcon />
                </span>
                <span className="truncate">{source.title}</span>
              </div>
              {policyHref && (
                <Link
                  href={policyHref}
                  className="inline-flex h-6 items-center rounded-full border border-slate-200 bg-white px-2.5 text-[10px] font-medium text-slate-600 hover:border-emerald-300 hover:text-emerald-700 transition-colors dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-emerald-800 dark:hover:text-emerald-300"
                >
                  View policy →
                </Link>
              )}
            </div>
            {source.section && (
              <p className="mt-1 text-[11px] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {source.section}
              </p>
            )}
            <blockquote className="mt-2 border-l-2 border-emerald-200 pl-3 text-[13px] leading-6 text-slate-700 dark:border-emerald-900/80 dark:text-slate-200">
              “{source.snippet}”
            </blockquote>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          {rel !== null && (
            <Badge tone={rel >= 80 ? "success" : rel >= 60 ? "warning" : "danger"} className="text-[10px] px-2 py-0.5">
              {rel}% match
            </Badge>
          )}
        </div>
      </div>
    </article>
  );
}
