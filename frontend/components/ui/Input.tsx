import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

type BaseProps = {
  label?: string;
  hint?: string;
  error?: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
};

type InputProps = InputHTMLAttributes<HTMLInputElement> & BaseProps;
type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & BaseProps;

export function Input({
  label,
  hint,
  error,
  leadingIcon,
  trailingIcon,
  className = "",
  id,
  ...rest
}: InputProps) {
  const inputId = id ?? rest.name;
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {leadingIcon && (
          <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400">
            {leadingIcon}
          </div>
        )}
        <input
          id={inputId}
          className={[
            "w-full h-11 rounded-2xl border border-slate-200 bg-white/90 px-4 text-sm text-slate-900",
            "placeholder:text-slate-400 outline-none transition-colors",
            "focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30",
            "dark:border-slate-700 dark:bg-slate-950/70 dark:text-slate-100 dark:placeholder:text-slate-500",
            leadingIcon ? "pl-10" : "",
            trailingIcon ? "pr-10" : "",
            error
              ? "border-rose-300 focus:border-rose-400 focus:ring-rose-400/30 dark:border-rose-700"
              : "",
            className,
          ].join(" ")}
          {...rest}
        />
        {trailingIcon && (
          <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400">
            {trailingIcon}
          </div>
        )}
      </div>
      {hint && !error && (
        <p className="text-xs text-slate-500 dark:text-slate-400">{hint}</p>
      )}
      {error && <p className="text-xs text-rose-600 dark:text-rose-400">{error}</p>}
    </div>
  );
}

export function Textarea({
  label,
  hint,
  error,
  className = "",
  id,
  ...rest
}: TextareaProps) {
  const inputId = id ?? rest.name;
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={[
          "w-full min-h-[96px] resize-y rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm text-slate-900",
          "placeholder:text-slate-400 outline-none transition-colors",
          "focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30",
          "dark:border-slate-700 dark:bg-slate-950/70 dark:text-slate-100 dark:placeholder:text-slate-500",
          error
            ? "border-rose-300 focus:border-rose-400 focus:ring-rose-400/30 dark:border-rose-700"
            : "",
          className,
        ].join(" ")}
        {...rest}
      />
      {hint && !error && (
        <p className="text-xs text-slate-500 dark:text-slate-400">{hint}</p>
      )}
      {error && <p className="text-xs text-rose-600 dark:text-rose-400">{error}</p>}
    </div>
  );
}
