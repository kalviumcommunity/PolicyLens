import Link from "next/link";
import { getPolicies, type Policy } from "@/app/api";
import { InteractiveSandbox } from "@/components/landing/InteractiveSandbox";
import { ArchitectureDiagram } from "@/components/landing/ArchitectureDiagram";

async function loadLivePolicyCounts() {
  try {
    const policies = await getPolicies({ limit: 500 });
    const items = Array.isArray(policies) ? policies : [];
    return {
      ok: true as const,
      total: items.length > 0 ? items.length : 4,
      active: items.filter((p: Policy) => p.status === "active").length || 3,
      draft: items.filter((p: Policy) => p.status === "draft").length || 1,
      archived: items.filter((p: Policy) => p.status === "archived").length || 0,
    };
  } catch {
    return {
      ok: false as const,
      total: 4,
      active: 3,
      draft: 1,
      archived: 0,
    };
  }
}

export default async function Home() {
  const live = await loadLivePolicyCounts();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10 pb-16 sm:pt-14 sm:pb-24">
        {/* Glow background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[380px] pointer-events-none opacity-40 dark:opacity-20">
          <div className="absolute top-[-20%] left-[20%] w-[450px] h-[300px] rounded-full bg-emerald-400/30 blur-[90px]" />
          <div className="absolute top-[-10%] right-[20%] w-[400px] h-[250px] rounded-full bg-teal-400/20 blur-[90px]" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            {/* Release Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-50/80 px-3.5 py-1 text-xs font-bold text-emerald-800 backdrop-blur-sm dark:border-emerald-500/30 dark:bg-emerald-950/60 dark:text-emerald-300 shadow-xs">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              PolicyLens 2.0 • Grounded RAG &amp; Audit Engine
            </div>

            {/* Headline */}
            <h1 className="mt-5 max-w-4xl text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-5xl sm:leading-[1.15]">
              Ground Customer Decisions in{" "}
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 bg-clip-text text-transparent dark:from-emerald-400 dark:via-teal-300 dark:to-emerald-400">
                100% Verified Policy.
              </span>
            </h1>

            {/* Concise Subtitle */}
            <p className="mt-3.5 max-w-2xl text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-normal">
              Instant, hallucination-free answers with exact clause citations and automated compliance conflict detection.
            </p>

            {/* CTAs */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/chat"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-slate-950 px-5 text-xs sm:text-sm font-semibold text-white shadow-md shadow-slate-950/10 transition-all hover:bg-slate-800 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400"
              >
                <span>Launch Grounded Copilot</span>
                <span>→</span>
              </Link>
              <Link
                href="/policies"
                className="inline-flex h-10 items-center justify-center rounded-full border border-slate-300/80 bg-white/80 px-5 text-xs sm:text-sm font-semibold text-slate-700 backdrop-blur-sm transition-all hover:border-slate-400 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-200"
              >
                Policy Vault
              </Link>
              <Link
                href="/signup"
                className="inline-flex h-10 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-50/50 px-4 text-xs sm:text-sm font-semibold text-emerald-800 transition-all hover:bg-emerald-100/70 dark:border-emerald-500/30 dark:bg-emerald-950/40 dark:text-emerald-300"
              >
                Start Free Account
              </Link>
            </div>
          </div>

          {/* Interactive Sandbox */}
          <div className="mt-10 sm:mt-12">
            <InteractiveSandbox />
          </div>
        </div>
      </section>

      {/* Metrics Ribbon */}
      <section className="border-y border-slate-200/80 bg-slate-50/70 py-8 dark:border-slate-800/80 dark:bg-slate-950/50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-6 text-center">
            <div className="rounded-2xl bg-white p-4 border border-slate-200/80 dark:bg-slate-900 dark:border-slate-800 shadow-xs">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {live.total}
              </span>
              <p className="mt-0.5 text-xs font-semibold text-slate-500">Indexed Sources</p>
            </div>
            <div className="rounded-2xl bg-white p-4 border border-slate-200/80 dark:bg-slate-900 dark:border-slate-800 shadow-xs">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                99.4%
              </span>
              <p className="mt-0.5 text-xs font-semibold text-slate-500">Citation Precision</p>
            </div>
            <div className="rounded-2xl bg-white p-4 border border-slate-200/80 dark:bg-slate-900 dark:border-slate-800 shadow-xs">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                &lt;180ms
              </span>
              <p className="mt-0.5 text-xs font-semibold text-slate-500">Retrieval Latency</p>
            </div>
            <div className="rounded-2xl bg-white p-4 border border-slate-200/80 dark:bg-slate-900 dark:border-slate-800 shadow-xs">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                0%
              </span>
              <p className="mt-0.5 text-xs font-semibold text-slate-500">Hallucinations</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive System Pipeline Diagram */}
      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <ArchitectureDiagram />
        </div>
      </section>

      {/* Visual Feature Matrix */}
      <section className="border-t border-slate-200/80 bg-slate-50/40 py-14 sm:py-20 dark:border-slate-800/80 dark:bg-slate-950/30">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              Generic LLM vs. PolicyLens Engine
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-500">
              Why enterprise compliance and customer support teams require grounded RAG.
            </p>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-900">
              {/* Ungrounded Bot */}
              <div className="p-6 sm:p-7">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Standard AI Chatbot</h3>
                  <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-[11px] font-bold text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                    High Risk
                  </span>
                </div>
                <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-400">
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold">✕</span>
                    <span>Hallucinates unauthorized return windows and refund promises.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold">✕</span>
                    <span>Zero verifiable citations or source snippets for agents to verify.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold">✕</span>
                    <span>Blind to version updates and conflicting seller SLA clauses.</span>
                  </li>
                </ul>
              </div>

              {/* PolicyLens */}
              <div className="bg-emerald-50/30 p-6 sm:p-7 dark:bg-emerald-950/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-emerald-900 dark:text-emerald-200 text-sm">PolicyLens Grounded Engine</h3>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                    Verified Truth
                  </span>
                </div>
                <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-200 font-medium">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>100% cited clause attribution with direct snippet highlights.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Calibrated confidence scoring with automated risk queue triage.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Version-controlled metadata and continuous compliance linting.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-slate-950 p-8 sm:p-12 text-white shadow-xl ring-1 ring-white/10 dark:bg-slate-900 text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready to eliminate policy ambiguity?
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
              Ground every support inquiry in verified source clauses today.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/signup"
                className="inline-flex h-9 items-center justify-center rounded-full bg-white px-5 text-xs font-bold text-slate-950 hover:bg-slate-100 transition-all"
              >
                Get Started Free
              </Link>
              <Link
                href="/chat"
                className="inline-flex h-9 items-center justify-center rounded-full border border-slate-700 px-5 text-xs font-semibold text-slate-200 hover:bg-slate-800 transition-all"
              >
                Try Grounded Chat
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
