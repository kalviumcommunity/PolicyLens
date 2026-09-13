import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  loading?: boolean;
};

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-slate-950 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200",
  secondary:
    "bg-emerald-600 text-white hover:bg-emerald-700",
  ghost:
    "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800",
  outline:
    "border border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-9 px-4 text-sm rounded-full",
  md: "h-11 px-5 text-sm rounded-full",
  lg: "h-12 px-6 text-sm rounded-full",
};

export function Button({
  variant = "primary",
  size = "md",
  icon,
  iconLeft,
  iconRight,
  loading,
  className = "",
  disabled,
  children,
  ...rest
}: Props) {
  const leftIcon = icon ?? iconLeft;
  return (
    <button
      disabled={disabled || loading}
      className={[
        "inline-flex items-center justify-center gap-2 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].join(" ")}
      {...rest}
    >
      {loading ? (
        <svg
          className="h-4 w-4 animate-spin"
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
          />
        </svg>
      ) : leftIcon}
      {children}
      {!loading && iconRight}
    </button>
  );
}
