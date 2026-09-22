import type { ReactNode } from "react";
import { useId } from "react";
import { Button } from "./Button";

type Props = {
  title: string;
  description?: string;
  icon?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  className?: string;
  children?: ReactNode;
};

export function EmptyState({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className = "",
  children,
}: Props) {
  const titleId = useId();
  const descriptionId = useId();

  return (
    <div
      role="status"
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      className={`flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-slate-300 bg-slate-50/60 p-10 text-center dark:border-slate-700 dark:bg-slate-900/50 ${className}`}
    >
      {icon && (
        <div
          aria-hidden="true"
          className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-500 shadow-sm ring-1 ring-slate-200 dark:bg-slate-950 dark:text-slate-400 dark:ring-slate-800"
        >
          {icon}
        </div>
      )}

      <div className="flex flex-col items-center gap-1.5">
        <h3 id={titleId} className="text-lg font-semibold text-slate-900 dark:text-slate-50">
          {title}
        </h3>
        {description && (
          <p id={descriptionId} className="max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
            {description}
          </p>
        )}
      </div>

      {children}

      {(actionLabel || secondaryActionLabel) && (
        <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:gap-3">
          {actionLabel && (
            <Button variant="primary" size="sm" onClick={onAction}>
              {actionLabel}
            </Button>
          )}
          {secondaryActionLabel && (
            <Button variant="outline" size="sm" onClick={onSecondaryAction}>
              {secondaryActionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}