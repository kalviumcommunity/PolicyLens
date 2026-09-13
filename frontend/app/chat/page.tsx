"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { ChatResponse } from "@/app/api";
import { sendQuery, ApiError } from "@/app/api";
import { mockSendQuery, CHAT_MOCK_NOTE } from "@/lib/chat-mock";
import { PageShell, PageHeader } from "@/components/PageShell";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";
import { EmptyState } from "@/components/ui/EmptyState";
import { ChatMessage, type ChatMessageData } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";

const SUGGESTIONS: string[] = [
  "Can I return this product after 15 days?",
  "Is this product eligible for a refund?",
  "Does this seller allow replacement?",
  "What is the return window for electronics?",
];

function makeId() {
  return (
    Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
  );
}

function WelcomeCard({ onPick }: { onPick: (q: string) => void }) {
  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <EmptyState
        icon={
          <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden>
            <path
              d="M12 3 3 8v7c0 5 3.8 8.2 9 9 5.2-.8 9-4 9-9V8l-9-5Z"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinejoin="round"
            />
            <path
              d="m9 12 2 2 4-4"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        }
        title="Ask PolicyLens a grounded question."
        description="Every response cites the exact policy section it came from, so support teams can trust — and verify — each answer."
        actionLabel="Paste return question"
        onAction={() => onPick("What is the return window for electronics?")}
      />

      <div className="grid w-full gap-3 sm:grid-cols-2">
        {SUGGESTIONS.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => onPick(q)}
            className="group rounded-2xl border border-slate-200 bg-white/80 p-4 text-left transition-all hover:border-emerald-300 hover:shadow-sm dark:border-slate-800 dark:bg-slate-950/60 hover:dark:border-emerald-900"
          >
            <div className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 group-hover:bg-emerald-50 group-hover:text-emerald-700 dark:bg-slate-800 dark:text-slate-400 dark:group-hover:bg-emerald-950/50 dark:group-hover:text-emerald-300">
                <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" aria-hidden>
                  <path
                    d="M21 21l-4.35-4.35M17 10.5A6.5 6.5 0 1 1 4 10.5a6.5 6.5 0 0 1 13 0Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <p className="text-sm leading-6 text-slate-800 group-hover:text-slate-950 dark:text-slate-200 dark:group-hover:text-white">
                {q}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const useMock = useMemo(() => true, []);

  const runQuery = useCallback(
    async (questionRaw: string) => {
      const question = questionRaw.trim();
      if (!question) return;
      if (loading) return;

      setLastError(null);

      const userMsg: ChatMessageData = {
        id: makeId(),
        role: "user",
        content: question,
        createdAt: Date.now(),
        state: "done",
      };
      const placeholderId = makeId();
      const assistantPlaceholder: ChatMessageData = {
        id: placeholderId,
        role: "assistant",
        content: "",
        createdAt: Date.now(),
        state: "sending",
      };

      setMessages((prev) => [...prev, userMsg, assistantPlaceholder]);
      setLoading(true);

      try {
        let chat: ChatResponse;
        try {
          chat = await sendQuery(question);
        } catch (e) {
          if (e instanceof ApiError && e.status === 501 && useMock) {
            chat = await mockSendQuery(question);
          } else {
            throw e;
          }
        }

        setMessages((prev) =>
          prev.map((m) =>
            m.id === placeholderId
              ? {
                  ...m,
                  content: chat.answer,
                  state: "done",
                  response: chat,
                }
              : m
          )
        );
      } catch (err) {
        const msg =
          err instanceof Error
            ? err.message
            : "Unknown error while generating response.";
        setLastError(msg);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === placeholderId
              ? {
                  ...m,
                  content:
                    "PolicyLens could not generate a grounded answer for this question.",
                  state: "error",
                  error: msg,
                }
              : m
          )
        );
      } finally {
        setLoading(false);
      }
    },
    [loading, useMock]
  );

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const hasMessages = messages.length > 0;

  return (
    <PageShell maxWidth="4xl" className="py-6 sm:py-8">
      <PageHeader
        eyebrow="Ask PolicyLens"
        title="Policy-grounded answers, with sources attached."
        description="Ask a question about returns, refunds, seller agreements, or eligibility. Every answer includes the exact policy section it came from so you can trust and verify."
        actions={
          <Link
            href="/policies"
            className="hidden sm:inline-flex h-10 items-center justify-center rounded-full border border-slate-300 px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"
          >
            Browse all policies →
          </Link>
        }
      />

      <Card className="flex min-h-[62vh] flex-col">
        <CardBody className="flex min-h-[62vh] flex-1 flex-col gap-5 p-4 sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="active" dot>
              Sources attached
            </Badge>
            <Badge tone="info">3 indexed sources</Badge>
            {useMock && (
              <Badge tone="warning">
                Demo mode — mock responses
              </Badge>
            )}
          </div>

          {useMock && (
            <Alert tone="info" message={CHAT_MOCK_NOTE} />
          )}

          {lastError && (
            <Alert
              tone="danger"
              title="Previous request failed"
              message={lastError}
              action={{ label: "Retry", onClick: () => setLastError(null) }}
            />
          )}

          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto pr-1"
            style={{ maxHeight: "58vh" }}
          >
            {!hasMessages ? (
              <WelcomeCard onPick={runQuery} />
            ) : (
              <div className="flex flex-col gap-6 py-2">
                {messages.map((m) => (
                  <ChatMessage key={m.id} message={m} />
                ))}
              </div>
            )}
          </div>

          <ChatInput
            onSubmit={(q) => {
              if (q === "__STOP__") {
                setLoading(false);
                return;
              }
              void runQuery(q);
            }}
            loading={loading}
            suggestions={!hasMessages ? undefined : SUGGESTIONS}
            onSuggestion={(s) => void runQuery(s)}
          />
        </CardBody>
      </Card>

      <div className="mt-5 flex flex-col items-start justify-between gap-3 rounded-2xl border border-dashed border-slate-200 bg-white/60 p-4 text-xs text-slate-500 sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-400">
        <p>
          Demo mode: answers are generated from mock policy data. Replace{" "}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] dark:bg-slate-900">
            sendQuery
          </code>{" "}
          in{" "}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] dark:bg-slate-900">
            app/api.ts
          </code>{" "}
          with a real{" "}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] dark:bg-slate-900">
            POST /api/chat
          </code>{" "}
          call once the backend RAG endpoint is available.
        </p>
        <div className="flex items-center gap-2">
          <Link
            href="/policies"
            className="inline-flex h-7 items-center rounded-full border border-slate-200 bg-white px-3 font-medium text-slate-600 hover:text-emerald-700 transition-colors dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:text-emerald-300"
          >
            View policy library →
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
