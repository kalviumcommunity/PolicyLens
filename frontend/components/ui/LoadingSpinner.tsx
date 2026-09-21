type Props = {
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
};

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
};

export function LoadingSpinner({ size = "md", className = "", label }: Props) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={["inline-flex items-center gap-3", className].join(" ")}
    >
      <svg
        className={`${sizeClasses[size]} animate-spin text-slate-400`}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeOpacity="0.25"
          strokeWidth="3"
        />
        <path
          d="M22 12a10 10 0 0 1-10 10"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          className="text-emerald-500"
        />
      </svg>
      {label && (
        <span className="text-sm text-slate-500 dark:text-slate-400">{label}</span>
      )}
    </div>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={[
        "animate-pulse rounded-xl bg-slate-200/70 dark:bg-slate-800",
        className,
      ].join(" ")}
    />
  );
}

export function LoadingScreen({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex min-h-[200px] items-center justify-center py-16">
      <LoadingSpinner size="lg" label={label} />
    </div>
  );
}
