import type { ReactNode } from "react";

type Tone = "info" | "success" | "warning" | "danger" | "error";

type Props = {
  title?: string;
  message: string | ReactNode;
  tone?: Tone;
  action?: { label: string; onClick: () => void };
  className?: string;
};

const toneClasses: Record<Tone, string> = {
  info: "border-sky-200 bg-sky-50 text-sky-800 dark:border-sky-900 dark:bg-sky-950/50 dark:text-sky-200",
  success:
    "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200",
  warning:
    "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-200",
  danger:
    "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-200",
  error:
    "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-200",
};

const icons: Record<Tone, ReactNode> = {
  info: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 flex-shrink-0" aria-hidden="true">
      <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z" clipRule="evenodd" />
    </svg>
  ),
  success: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 flex-shrink-0" aria-hidden="true">
      <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
    </svg>
  ),
  warning: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 flex-shrink-0" aria-hidden="true">
      <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
    </svg>
  ),
  danger: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 flex-shrink-0" aria-hidden="true">
      <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z" clipRule="evenodd" />
    </svg>
  ),
  error: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 flex-shrink-0" aria-hidden="true">
      <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z" clipRule="evenodd" />
    </svg>
  ),
};

export function Alert({
  title,
  message,
  tone = "info",
  action,
  className = "",
}: Props) {
  return (
    <div
      role="alert"
      className={[
        "flex items-start gap-3 rounded-2xl border p-4 text-sm",
        toneClasses[tone],
        className,
      ].join(" ")}
    >
      <div className="pt-0.5">{icons[tone]}</div>
      <div className="flex-1 space-y-1">
        {title && <p className="font-semibold">{title}</p>}
        {typeof message === "string" ? <p className="leading-6 opacity-90">{message}</p> : message}
      </div>
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="flex-shrink-0 rounded-full border border-current/30 px-3 py-1 text-xs font-medium hover:bg-white/40 transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
