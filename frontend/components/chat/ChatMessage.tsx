import type { ChatResponse } from "@/app/api";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EvidencePanel } from "./EvidencePanel";

export type ChatMessageData = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
  state?: "sending" | "streaming" | "done" | "error";
  error?: string;
  response?: ChatResponse;
};

function UserAvatar() {
  return (
    <div
      aria-hidden
      className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-700 shadow-sm ring-1 ring-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700"
    >
      <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5">
        <path
          d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21a8 8 0 0 1 16 0"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

function AssistantAvatar() {
  return (
    <div
      aria-hidden
      className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm ring-1 ring-emerald-200 dark:ring-emerald-900"
    >
      <svg viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px]">
        <path
          d="M5 12l4 4L19 6"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function TimeStamp({ ts }: { ts: number }) {
  const d = new Date(ts);
  return (
    <time
      dateTime={d.toISOString()}
      className="text-[11px] text-slate-400 dark:text-slate-500"
    >
      {d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
    </time>
  );
}

export function ChatMessage({ message }: { message: ChatMessageData }) {
  const isUser = message.role === "user";
  const isLoading = message.state === "sending" || message.state === "streaming";

  return (
    <div
      className={[
        "flex w-full items-start gap-3 sm:gap-4",
        isUser ? "flex-row-reverse" : "",
      ].join(" ")}
    >
      {isUser ? <UserAvatar /> : <AssistantAvatar />}

      <div
        className={[
          "flex w-full max-w-[85%] flex-col gap-2",
          isUser ? "items-end" : "items-start",
        ].join(" ")}
      >
        <div className="flex items-center gap-2">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {isUser ? "You" : "PolicyLens"}
          </p>
          <TimeStamp ts={message.createdAt} />
        </div>

        <div
          className={[
            "rounded-3xl px-4 sm:px-5 py-3.5 shadow-sm",
            "text-[15px] leading-7",
            isUser
              ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950 rounded-tr-md"
              : "border border-slate-200 bg-white/90 text-slate-800 dark:border-slate-800 dark:bg-slate-950/75 dark:text-slate-100 rounded-tl-md",
          ].join(" ")}
        >
          {isLoading ? (
            <div className="flex items-center gap-3 py-1">
              <LoadingSpinner size="sm" />
              <span className="text-sm opacity-80">
                {message.state === "streaming"
                  ? "Generating grounded answer…"
                  : "Sending question…"}
              </span>
            </div>
          ) : message.state === "error" ? (
            <div className="flex flex-col gap-1">
              <p className="font-medium text-rose-700 dark:text-rose-300">
              Unable to generate a response
            </p>
              {message.error && (
              <p className="text-sm opacity-80">{message.error}</p>
            )}
            </div>
          ) : (
            <p className="whitespace-pre-wrap break-words">{message.content}</p>
          )}
        </div>

        {!isUser && message.response && message.state !== "sending" && (
          <EvidencePanel response={message.response} />
        )}
      </div>
    </div>
  );
}
