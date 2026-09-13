import type { HTMLAttributes, ReactNode } from "react";

type Tone =
  | "default"
  | "active"
  | "draft"
  | "archived"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "critical"
  | "high"
  | "medium"
  | "low";

type Props = HTMLAttributes<HTMLSpanElement> & {
  tone?: Tone;
  children: ReactNode;
  dot?: boolean;
};

const toneClasses: Record<Tone, string> = {
  default:
    "border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200",
  active:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300",
  draft:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-300",
  archived:
    "border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",
  success:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300",
  warning:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-300",
  danger:
    "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-300",
  info:
    "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950/50 dark:text-sky-300",
  critical:
    "border-rose-300 bg-rose-100 text-rose-800 dark:border-rose-800 dark:bg-rose-950/70 dark:text-rose-200",
  high:
    "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900 dark:bg-orange-950/50 dark:text-orange-300",
  medium:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-300",
  low:
    "border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",
};

const dotColors: Record<Tone, string> = {
  default: "bg-slate-500 dark:bg-slate-400",
  active: "bg-emerald-500",
  draft: "bg-amber-500",
  archived: "bg-slate-500 dark:bg-slate-400",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-rose-500",
  info: "bg-sky-500",
  critical: "bg-rose-600",
  high: "bg-orange-500",
  medium: "bg-amber-500",
  low: "bg-slate-500 dark:bg-slate-400",
};

export function Badge({
  tone = "default",
  dot,
  className = "",
  children,
  ...rest
}: Props) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium",
        toneClasses[tone],
        className,
      ].join(" ")}
      {...rest}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${dotColors[tone]}`} />}
      {children}
    </span>
  );
}
