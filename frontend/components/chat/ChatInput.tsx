import { useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { Button } from "@/components/ui/Button";

type Props = {
  onSubmit: (value: string) => void;
  loading?: boolean;
  disabled?: boolean;
  placeholder?: string;
  suggestions?: string[];
  onSuggestion?: (s: string) => void;
};

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
      <path
        d="M4 12 20 4M20 4 12 20M20 4l-8 8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
      <rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor" />
    </svg>
  );
}

export function ChatInput({
  onSubmit,
  loading,
  disabled,
  placeholder = "Ask about returns, refunds, seller agreements, policy eligibility…",
  suggestions,
  onSuggestion,
}: Props) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const canSubmit = value.trim().length > 0 && !loading && !disabled;

  function submit(e?: FormEvent) {
    e?.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || loading || disabled) return;
    setValue("");
    onSubmit(trimmed);
    requestAnimationFrame(() => {
      const el = textareaRef.current;
      if (el) {
        el.style.height = "auto";
        el.focus();
      }
    });
  }

  function onKey(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      submit();
    }
  }

  function autosize(el: HTMLTextAreaElement) {
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 200) + "px";
  }

  return (
    <form onSubmit={submit} className="flex w-full flex-col gap-3">
      {suggestions && suggestions.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {suggestions.map((s) => (
            <button
              type="button"
              key={s}
              onClick={() => {
                onSuggestion?.(s);
                setValue(s);
                requestAnimationFrame(() => textareaRef.current?.focus());
              }}
              disabled={loading || disabled}
              className="inline-flex h-8 items-center rounded-full border border-slate-200 bg-white/80 px-3 text-xs font-medium text-slate-700 hover:border-emerald-300 hover:text-emerald-700 transition-colors disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-200 dark:hover:border-emerald-800 dark:hover:text-emerald-300"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div
        className={[
          "flex w-full items-end gap-3 rounded-3xl border border-slate-200 bg-white/90 p-2.5 shadow-sm backdrop-blur transition-colors focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-400/30",
          "dark:border-slate-800 dark:bg-slate-950/75 dark:focus-within:border-emerald-700 dark:focus-within:ring-emerald-700/30",
          disabled ? "opacity-80" : "",
        ].join(" ")}
      >
        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(e) => {
            setValue(e.target.value);
            autosize(e.currentTarget);
          }}
          onKeyDown={onKey}
          className="flex-1 resize-none bg-transparent px-3 py-2 text-[15px] leading-6 text-slate-900 placeholder:text-slate-400 outline-none disabled:cursor-not-allowed dark:text-slate-50 dark:placeholder:text-slate-500"
          style={{ minHeight: "44px", maxHeight: "200px" }}
        />
        <Button
          type={loading ? "button" : "submit"}
          variant={canSubmit ? "secondary" : "outline"}
          size="md"
          disabled={!canSubmit && !loading}
          onClick={
            loading
              ? () => onSubmit("__STOP__")
              : undefined
          }
          iconRight={loading ? undefined : <SendIcon />}
          icon={loading ? <StopIcon /> : undefined}
          aria-label={loading ? "Stop generation" : "Send message"}
        >
          {loading ? "Stop" : "Send"}
        </Button>
      </div>

      <p className="px-2 text-[11px] leading-5 text-slate-500 dark:text-slate-400">
        Press Enter to send, Shift + Enter for a new line. Answers are generated from policy sources — always check the citations.
      </p>
    </form>
  );
}
