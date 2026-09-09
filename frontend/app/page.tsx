const metrics = [
  { label: "Policies indexed", value: "1,200+" },
  { label: "Answer confidence", value: "98%" },
  { label: "Avg. lookup time", value: "< 2s" },
];

const steps = [
  {
    title: "Ingest policy sources",
    description: "Collect product policies, seller agreements, and return rules into one clean pipeline.",
  },
  {
    title: "Retrieve grounded context",
    description: "Fetch the exact policy snippets needed to answer a customer question accurately.",
  },
  {
    title: "Explain the answer",
    description: "Show source context alongside the response so teams can verify every recommendation.",
  },
];

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.16),_transparent_30%),linear-gradient(180deg,_#f8fafc_0%,_#ffffff_100%)] px-6 py-10 text-slate-950 dark:bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.22),_transparent_28%),linear-gradient(180deg,_#020617_0%,_#0f172a_100%)] dark:text-slate-50 sm:px-10 lg:px-16">
      <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center gap-10 lg:gap-14">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm text-slate-600 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-300">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          PolicyLens demo workspace
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-6">
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Ground every customer answer in the right policy.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              PolicyLens helps teams search policy sources, retrieve the right context, and respond with clear evidence instead of guesswork.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="#policy-flow"
                className="inline-flex h-12 items-center justify-center rounded-full bg-slate-950 px-6 text-sm font-medium text-white transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
              >
                Explore the flow
              </a>
              <a
                href="#metrics"
                className="inline-flex h-12 items-center justify-center rounded-full border border-slate-300 px-6 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"
              >
                View signal metrics
              </a>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white/85 p-6 shadow-[0_20px_80px_-35px_rgba(15,23,42,0.45)] backdrop-blur dark:border-slate-800 dark:bg-slate-950/75">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Policy snapshot
            </p>
            <div className="mt-5 space-y-4">
              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900">
                <p className="text-sm text-slate-500 dark:text-slate-400">Customer question</p>
                <p className="mt-1 font-medium text-slate-950 dark:text-slate-50">
                  Can I return this item after 45 days?
                </p>
              </div>
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/40">
                <p className="text-sm text-emerald-700 dark:text-emerald-300">Recommended answer</p>
                <p className="mt-1 text-slate-700 dark:text-slate-200">
                  Returns are allowed within 30 days for unopened items. Exceptions require seller approval.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div id="metrics" className="grid gap-4 sm:grid-cols-3">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950/75"
            >
              <p className="text-sm text-slate-500 dark:text-slate-400">{metric.label}</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight">{metric.value}</p>
            </div>
          ))}
        </div>

        <div id="policy-flow" className="grid gap-4 lg:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950/75"
            >
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Step {index + 1}
              </p>
              <h2 className="mt-3 text-xl font-semibold">{step.title}</h2>
              <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">{step.description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
