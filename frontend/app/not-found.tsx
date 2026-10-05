import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-50 text-2xl font-bold text-emerald-600 ring-1 ring-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:ring-emerald-900">
        404
      </div>
      <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
        Page not found
      </h1>
      <p className="mt-3 max-w-md text-sm text-slate-600 dark:text-slate-400">
        The policy document, analysis, or page you are looking for doesn&apos;t exist or was relocated.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/">
          <Button size="md">Return Home</Button>
        </Link>
        <Link href="/chat">
          <Button size="md" variant="outline">
            Ask PolicyLens
          </Button>
        </Link>
        <Link href="/policies">
          <Button size="md" variant="outline">
            Policy Vault
          </Button>
        </Link>
      </div>
    </div>
  );
}
