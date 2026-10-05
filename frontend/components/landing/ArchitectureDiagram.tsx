"use client";

import { useState } from "react";

type PipelineStep = {
  id: string;
  stepNumber: string;
  title: string;
  tag: string;
  icon: string;
  summary: string;
  details: string[];
  color: string;
  badgeTone: "info" | "active" | "draft" | "warning";
};

const STEPS: PipelineStep[] = [
  {
    id: "ingest",
    stepNumber: "01",
    title: "Multi-Source Ingestion",
    tag: "Source Connectors",
    icon: "📥",
    summary: "Connect legal PDFs, seller SLAs, and terms.",
    details: ["Automatic document versioning", "Multi-format parser (PDF, Docx, MD)", "Metadata & author tagging"],
    color: "from-blue-500/20 to-cyan-500/20",
    badgeTone: "info",
  },
  {
    id: "indexing",
    stepNumber: "02",
    title: "Semantic Clause Index",
    tag: "Vector & Graph RAG",
    icon: "⚡",
    summary: "Chunk into atomic, searchable rules.",
    details: ["Clause-level embedding index", "Cross-policy conflict linting", "Sub-150ms retrieval latency"],
    color: "from-emerald-500/20 to-teal-500/20",
    badgeTone: "active",
  },
  {
    id: "audit",
    stepNumber: "03",
    title: "Continuous Risk Audit",
    tag: "Automated Linter",
    icon: "🛡️",
    summary: "Detect contradictory SLAs & missing terms.",
    details: ["Critical / High risk triage", "Prioritized review queue", "Automated remediation tips"],
    color: "from-amber-500/20 to-orange-500/20",
    badgeTone: "warning",
  },
  {
    id: "grounding",
    stepNumber: "04",
    title: "Grounded RAG Output",
    tag: "Verified Copilot",
    icon: "🎯",
    summary: "Deliver answers with 100% cited proof.",
    details: ["Exact snippet highlights", "Calibrated confidence score", "Zero-hallucination guarantee"],
    color: "from-purple-500/20 to-pink-500/20",
    badgeTone: "draft",
  },
];

export function ArchitectureDiagram() {
  const [activeStep, setActiveStep] = useState<string>("indexing");
  const selected = STEPS.find((s) => s.id === activeStep) ?? STEPS[1];

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xl dark:border-slate-800 dark:bg-slate-950">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 pb-6 border-b border-slate-100 dark:border-slate-900">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            System Architecture
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
            Real-Time Policy Grounding Pipeline
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>Click any stage to inspect flow</span>
        </div>
      </div>

      {/* 4-Step Interactive Pipeline Diagram */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {STEPS.map((step, idx) => {
          const isSelected = activeStep === step.id;
          return (
            <div key={step.id} className="relative">
              <button
                type="button"
                onClick={() => setActiveStep(step.id)}
                className={`w-full text-left rounded-2xl border p-4 transition-all h-full flex flex-col justify-between ${
                  isSelected
                    ? "border-emerald-500 bg-emerald-50/50 shadow-md ring-2 ring-emerald-500/20 dark:bg-emerald-950/40 dark:border-emerald-400"
                    : "border-slate-200 bg-slate-50/60 hover:bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:bg-slate-900"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-slate-400">
                      STEP {step.stepNumber}
                    </span>
                    <span className="text-lg">{step.icon}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                    {step.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                    {step.summary}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                  <span>{step.tag}</span>
                  <span>{isSelected ? "● Active" : "→"}</span>
                </div>
              </button>

              {/* Connecting arrow for desktop */}
              {idx < STEPS.length - 1 && (
                <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-slate-300 dark:text-slate-700 pointer-events-none text-xs font-bold">
                  ▶
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Active Stage Deep-Dive Visual Inspector */}
      <div className="mt-6 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-5 dark:border-slate-800 dark:bg-slate-900/60">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">{selected.icon}</span>
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                Stage {selected.stepNumber} Execution Inspector
              </span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {selected.title}
              </h4>
            </div>
          </div>
          <span className="rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-3 py-0.5 text-xs font-bold">
            Live Stream Connected
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-3">
          {selected.details.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-2 rounded-xl bg-white border border-slate-200/80 p-3 text-xs font-medium text-slate-800 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-200 shadow-xs"
            >
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white flex-shrink-0">
                ✓
              </span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
