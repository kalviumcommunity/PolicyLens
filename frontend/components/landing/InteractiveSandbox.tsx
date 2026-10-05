"use client";

import { useState } from "react";
import Link from "next/link";

type Scenario = {
  id: string;
  title: string;
  question: string;
  category: string;
  policyTitle: string;
  policySection: string;
  clauseExcerpt: string;
  highlightedSpan: string;
  clauseSuffix: string;
  points: { icon: string; label: string; text: string }[];
  verdict: "Denied" | "Approved" | "Replacement SLA";
  verdictTone: "danger" | "success" | "warning";
  confidence: number;
  latency: string;
};

const SCENARIOS: Scenario[] = [
  {
    id: "electronic-return",
    title: "45-Day Return",
    question: "Can customer return opened wireless headphones 45 days after delivery?",
    category: "Return Policy",
    policyTitle: "Customer Return Policy v2.4",
    policySection: "§4.1 Electronics Return Window",
    clauseExcerpt: "Consumer electronics must be initiated for return within ",
    highlightedSpan: "30 calendar days of delivery in unopened packaging. 31–60 days requires authorization and 15% restocking fee.",
    clauseSuffix: " Opened in-ear items are non-returnable.",
    points: [
      { icon: "🛑", label: "Window Exceeded", text: "Standard 30-day window passed (45 days elapsed)." },
      { icon: "⚠️", label: "Hygiene Regulation", text: "Opened in-ear audio items are non-returnable." },
      { icon: "📋", label: "Override Option", text: "Manager exception requires 15% restocking fee." },
    ],
    verdict: "Denied",
    verdictTone: "danger",
    confidence: 0.98,
    latency: "142ms",
  },
  {
    id: "seller-sla",
    title: "Seller 14d SLA",
    question: "Customer received defective blender from marketplace seller 8 days ago. What SLA applies?",
    category: "Seller Agreement",
    policyTitle: "Merchant Master Agreement #SA-204",
    policySection: "§7.2 Defect Replacement SLA",
    clauseExcerpt: "Marketplace sellers must ",
    highlightedSpan: "replace defective units within 14 days of receipt, dispatching replacement within 48 hours.",
    clauseSuffix: " Seller covers all return freight.",
    points: [
      { icon: "✅", label: "Eligible Window", text: "Claim submitted on Day 8 (within 14-day SLA)." },
      { icon: "⏱️", label: "48h Dispatch", text: "Merchant must dispatch replacement within 48 hours." },
      { icon: "📦", label: "Zero Cost", text: "Return shipping covered 100% by seller." },
    ],
    verdict: "Approved",
    verdictTone: "success",
    confidence: 0.96,
    latency: "168ms",
  },
  {
    id: "perishable-refund",
    title: "Perishable Food",
    question: "Can customer get a refund for artisanal cheese spoiled by courier transit delay?",
    category: "Perishable Policy",
    policyTitle: "Perishable Goods Policy",
    policySection: "Appendix B: Transit Exceptions",
    clauseExcerpt: "Perishable items spoiled due to ",
    highlightedSpan: "transit carrier delays exceeding SLA qualify for full refund with photo proof within 24 hours.",
    clauseSuffix: " Physical return waived.",
    points: [
      { icon: "✅", label: "Carrier Delay Covered", text: "Transit delay breach qualifies for 100% refund." },
      { icon: "📸", label: "Photo Evidence", text: "Requires photo verification submitted within 24h." },
      { icon: "♻️", label: "Physical Return Waived", text: "No return shipping required." },
    ],
    verdict: "Approved",
    verdictTone: "success",
    confidence: 0.97,
    latency: "135ms",
  },
];

export function InteractiveSandbox() {
  const [activeScenarioId, setActiveScenarioId] = useState(SCENARIOS[0].id);
  const current = SCENARIOS.find((s) => s.id === activeScenarioId) ?? SCENARIOS[0];

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-950">
      {/* Top Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 bg-slate-50/80 px-4 py-3 sm:px-6 dark:border-slate-800 dark:bg-slate-900/70">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-rose-400" />
            <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </div>
          <span className="ml-2 text-xs font-bold text-slate-700 dark:text-slate-300">
            Live Policy Grounding Inspector
          </span>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-1">
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setActiveScenarioId(s.id)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                activeScenarioId === s.id
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-xs"
                  : "text-slate-600 hover:bg-slate-200/60 dark:text-slate-400 dark:hover:bg-slate-800"
              }`}
            >
              {s.title}
            </button>
          ))}
        </div>
      </div>

      {/* Query Bar */}
      <div className="border-b border-slate-100 bg-slate-50/40 p-4 sm:px-6 dark:border-slate-900 dark:bg-slate-950/40">
        <div className="flex items-start gap-3">
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-emerald-500 text-[11px] font-bold text-white shadow-xs">
            Q
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Incoming Customer Case</p>
            <p className="mt-0.5 text-sm font-semibold text-slate-900 dark:text-slate-100">
              &ldquo;{current.question}&rdquo;
            </p>
          </div>
          <Link
            href={`/chat?q=${encodeURIComponent(current.question)}`}
            className="hidden sm:inline-flex h-7 items-center rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700 hover:border-emerald-500 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            Open in Copilot →
          </Link>
        </div>
      </div>

      {/* Main Split Body */}
      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-200/80 dark:divide-slate-800">
        {/* Left Pane: Grounded Source Document */}
        <div className="p-5 sm:p-6 flex flex-col justify-between bg-slate-50/30 dark:bg-slate-900/20">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                📄 {current.policyTitle}
              </span>
              <span className="rounded-full bg-slate-200/70 px-2 py-0.5 text-[10px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                {current.policySection}
              </span>
            </div>

            <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 font-mono text-xs leading-relaxed text-slate-600 shadow-inner dark:border-slate-800/80 dark:bg-slate-900/60 dark:text-slate-300">
              <span>{current.clauseExcerpt}</span>
              <mark className="rounded bg-emerald-100/90 px-1 py-0.5 font-semibold text-emerald-950 ring-1 ring-emerald-400/40 dark:bg-emerald-950/80 dark:text-emerald-200 dark:ring-emerald-700">
                {current.highlightedSpan}
              </mark>
              <span>{current.clauseSuffix}</span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
              ✓ 100% cited clause
            </span>
            <span>Retrieved in {current.latency}</span>
          </div>
        </div>

        {/* Right Pane: PolicyLens Grounded Output */}
        <div className="p-5 sm:p-6 flex flex-col justify-between bg-white dark:bg-slate-950">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                    current.verdictTone === "danger"
                      ? "bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300"
                      : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300"
                  }`}
                >
                  Verdict: {current.verdict}
                </span>
              </div>

              {/* Confidence Meter Badge */}
              <div className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950/60 dark:border-emerald-800 dark:text-emerald-300">
                {Math.round(current.confidence * 100)}% Confidence
              </div>
            </div>

            {/* Crisp Point Breakdown */}
            <div className="space-y-2">
              {current.points.map((pt, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50/70 p-2.5 text-xs dark:border-slate-900 dark:bg-slate-900/40"
                >
                  <span className="text-sm">{pt.icon}</span>
                  <div className="min-w-0 flex-1">
                    <span className="font-bold text-slate-900 dark:text-slate-100">{pt.label}: </span>
                    <span className="text-slate-600 dark:text-slate-300">{pt.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-900 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Source: <strong className="font-semibold text-slate-700 dark:text-slate-300">{current.category}</strong>
            </span>
            <Link
              href="/chat"
              className="text-xs font-bold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400"
            >
              Ask custom query →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
