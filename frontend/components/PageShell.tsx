import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "full";
};

const maxWidthClasses: Record<NonNullable<Props["maxWidth"]>, string> = {
  sm: "max-w-screen-sm",
  md: "max-w-screen-md",
  lg: "max-w-screen-lg",
  xl: "max-w-screen-xl",
  "2xl": "max-w-screen-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
  "6xl": "max-w-6xl",
  full: "max-w-full",
};

export function PageShell({
  children,
  className = "",
  maxWidth = "6xl",
}: Props) {
  return (
    <main
      className={[
        "mx-auto flex w-full flex-1 flex-col px-6 py-8 sm:px-10 lg:px-16",
        maxWidthClasses[maxWidth],
        className,
      ].join(" ")}
    >
      {children}
    </main>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className = "",
}: {
  eyebrow?: string;
  title: string;
  description?: string | ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between",
        className,
      ].join(" ")}
    >
      <div className="flex flex-col gap-3">
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400">
            {eyebrow}
          </p>
        )}
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl dark:text-slate-50">
          {title}
        </h1>
        {description && (
          <div className="max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
            {description}
          </div>
        )}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2 sm:justify-end">{actions}</div>}
    </div>
  );
}
