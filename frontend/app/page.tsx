import { getPolicies, type Policy } from "./api";

const reviewSteps = [
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

type ReviewTone = "amber" | "red" | "emerald";

const reviewToneStyles: Record<ReviewTone, string> = {
  amber: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
  red: "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300",
  emerald: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
};

const statusStyles: Record<Policy["status"], string> = {
  draft: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
  active: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
  archived: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
};

function formatDate(value: string | Date) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default async function Home() {
  let policies: Policy[] = [];
  let loadError = "";

  try {
    policies = await getPolicies();
  } catch {
    loadError = "We couldn't load live policy data from the backend.";
  }

  const activePolicies = policies.filter((policy) => policy.status === "active");
  const draftPolicies = policies.filter((policy) => policy.status === "draft");
  const archivedPolicies = policies.filter((policy) => policy.status === "archived");
  const latestPolicy = policies[0];

  const metrics = [
    { label: "Policies indexed", value: String(policies.length), detail: "Live records returned from the API." },
    { label: "Active policies", value: String(activePolicies.length), detail: "Policies available for customer answers." },
    { label: "Drafts awaiting review", value: String(draftPolicies.length), detail: "Items that still need approval." },
  ];

  const reviewQueue = [
    {
      label: "Needs approval",
      value: String(draftPolicies.length),
      detail: "Draft policies should be reviewed before they go live.",
      tone: "amber" as ReviewTone,
    },
    {
      label: "Archived records",
      value: String(archivedPolicies.length),
      detail: "Archived entries stay searchable for audit and support teams.",
      tone: "red" as ReviewTone,
    },
    {
      label: "Ready to publish",
      value: String(activePolicies.length),
      detail: "Active policies can be surfaced in the customer answer flow.",
      tone: "emerald" as ReviewTone,
    },
  ];

  const insights = [
    {
      label: "High priority",
      value: String(draftPolicies.length),
      detail: "Draft policies waiting on human review.",
    },
    {
      label: "Active sources",
      value: String(activePolicies.length),
      detail: "Policies ready for customer answers.",
    },
    {
      label: "Latest update",
      value: latestPolicy ? formatDate(latestPolicy.updated_at) : "—",
      detail: latestPolicy ? latestPolicy.title : "No policies loaded yet.",
    },
  ];

  return (
    <main className="flex min-h-screen flex-col bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.16),_transparent_30%),linear-gradient(180deg,_#f8fafc_0%,_#ffffff_100%)] px-6 py-10 text-slate-950 dark:bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.22),_transparent_28%),linear-gradient(180deg,_#020617_0%,_#0f172a_100%)] dark:text-slate-50 sm:px-10 lg:px-16">
      <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center gap-10 lg:gap-14">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm text-slate-600 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-300">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          PolicyLens live frontend
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
                Explore the workflow
              </a>
              <a
                href="#metrics"
                className="inline-flex h-12 items-center justify-center rounded-full border border-slate-300 px-6 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"
              >
                View live metrics
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
                <p className="mt-3 text-xs font-medium uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
                  Connected to the backend API
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
              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{metric.detail}</p>
            </div>
          ))}
        </div>

        <div id="policy-flow" className="grid gap-4 lg:grid-cols-3">
          {reviewSteps.map((step, index) => (
            <div
              key={step.title}
              className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950/75"
            >
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Step {index + 1}</p>
              <h2 className="mt-3 text-xl font-semibold">{step.title}</h2>
              <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950/75 sm:p-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                Policy insights
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                A quick view of what needs attention.
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              This section gives reviewers a simple snapshot of policy health, updates, and support readiness.
            </p>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {insights.map((insight) => (
              <div key={insight.label} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
                <p className="text-sm text-slate-500 dark:text-slate-400">{insight.label}</p>
                <p className="mt-3 text-3xl font-semibold tracking-tight">{insight.value}</p>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{insight.detail}</p>
              </div>
            ))}
          </div>

          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            {latestPolicy
              ? `Most recent update: ${latestPolicy.title} (${formatDate(latestPolicy.updated_at)}).`
              : "No policies returned yet from the backend."}
          </p>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950/75 sm:p-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                Review queue
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                Track what needs action before publishing.
              </h2>
            </div>
            <a
              href="#policy-sources"
              className="inline-flex h-11 items-center justify-center rounded-full border border-slate-300 px-5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"
            >
              Review sources
            </a>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {reviewQueue.map((item) => (
              <div key={item.label} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${reviewToneStyles[item.tone]}`}>
                  {item.label}
                </span>
                <p className="mt-3 text-3xl font-semibold tracking-tight">{item.value}</p>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div id="policy-sources" className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950/75">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Policy sources
            </p>
            <span className="inline-flex w-fit rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
              {loadError ? "Offline" : "Live sources"}
            </span>
          </div>

          {loadError ? (
            <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
              {loadError}
            </p>
          ) : null}

          {policies.length > 0 ? (
            <div className="mt-4 grid gap-3">
              {policies.map((policy) => (
                <article
                  key={policy.id}
                  className="grid gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900 md:grid-cols-[1fr_auto] md:items-center"
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-semibold text-slate-950 dark:text-slate-50">{policy.title}</h3>
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusStyles[policy.status]}`}>
                        {capitalize(policy.status)}
                      </span>
                    </div>
                    <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {policy.description || "No description provided."}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Owner {policy.owner} • Version {policy.version} • Updated {formatDate(policy.updated_at)}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 md:justify-end">
                    <span className="rounded-full bg-white px-3 py-1 dark:bg-slate-950">Policy #{policy.id}</span>
                    <span className="rounded-full bg-white px-3 py-1 dark:bg-slate-950">Created {formatDate(policy.created_at)}</span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900">
              <p className="text-sm font-medium text-slate-950 dark:text-slate-50">No policies found yet.</p>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                Create a seed policy in the backend to populate this dashboard.
              </p>
            </div>
          )}

          <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
            {policies.length} total source{policies.length === 1 ? "" : "s"} • {activePolicies.length} active • {draftPolicies.length} draft
          </p>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 rounded-3xl border border-slate-200 bg-slate-950 px-6 py-5 text-white shadow-sm dark:border-slate-800 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-300">
              Next step
            </p>
            <p className="mt-2 text-lg font-semibold">
              Add your first policy source or mock dataset.
            </p>
          </div>
          <a
            href="#policy-flow"
            className="inline-flex h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-medium text-slate-950 transition-colors hover:bg-slate-100"
          >
            Review the workflow
          </a>
        </div>
      </section>
    </main>
  );
}