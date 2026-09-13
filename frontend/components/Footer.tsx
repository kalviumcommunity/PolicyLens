import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto w-full border-t border-slate-200/70 bg-white/50 py-10 text-sm text-slate-500 backdrop-blur dark:border-slate-800/70 dark:bg-slate-950/50 dark:text-slate-400">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 sm:px-10 lg:grid lg:grid-cols-4 lg:gap-6 lg:px-16">
        <div className="lg:col-span-2 flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm">
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
                <path
                  d="M5 12l4 4L19 6"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-base font-semibold text-slate-950 dark:text-slate-50">
              PolicyLens
            </span>
          </div>
          <p className="max-w-md leading-6">
            Clear answers. Grounded in policy. PolicyLens surfaces policy-grounded
            answers, source context, and response quality signals for e-commerce teams.
          </p>
          <p className="text-xs mt-1 opacity-80">
            Demo workspace — responses are generated for evaluation purposes.
          </p>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-900 dark:text-slate-200 mb-4">
            Product
          </h3>
          <ul className="flex flex-col gap-2.5">
            <li>
              <Link href="/chat" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
                Ask PolicyLens
              </Link>
            </li>
            <li>
              <Link href="/policies" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
                Policy library
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
                Dashboard &amp; insights
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-900 dark:text-slate-200 mb-4">
            Resources
          </h3>
          <ul className="flex flex-col gap-2.5">
            <li>
              <Link
                href="/#policy-flow"
                className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
              >
                How it works
              </Link>
            </li>
            <li>
              <Link
                href="/#metrics"
                className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
              >
                Signal metrics
              </Link>
            </li>
            <li>
              <Link
                href="/#policy-flow"
                className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
              >
                Data sources
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-10 flex w-full max-w-6xl flex-col items-start justify-between gap-4 border-t border-slate-200/70 px-6 pt-6 sm:flex-row sm:items-center sm:px-10 lg:px-16 dark:border-slate-800/70">
        <p className="text-xs">
          &copy; {year} PolicyLens. Clear answers. Grounded in policy.
        </p>
        <div className="flex items-center gap-2 text-xs">
          <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
          <span>3 active sources • policies indexed &amp; searchable</span>
        </div>
      </div>
    </footer>
  );
}
