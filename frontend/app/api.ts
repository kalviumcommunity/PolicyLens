export type PolicyStatus = "draft" | "active" | "archived";

export type FindingSeverity = "low" | "medium" | "high" | "critical";

export type Policy = {
  id: number;
  title: string;
  description: string;
  status: PolicyStatus;
  version: string;
  owner: string;
  created_at: string;
  updated_at: string;
};

export type PolicyCreate = {
  title: string;
  description?: string;
  status?: PolicyStatus;
  version?: string;
  owner: string;
};

export type PolicyUpdate = {
  title?: string;
  description?: string;
  status?: PolicyStatus;
  version?: string;
  owner?: string;
};

export type Finding = {
  id: number;
  title: string;
  details: string;
  severity: FindingSeverity;
  recommendation: string;
};

export type FindingCreate = {
  title: string;
  details?: string;
  severity?: FindingSeverity;
  recommendation?: string;
};

export type Analysis = {
  id: number;
  policy_id: number;
  status: string;
  summary: string;
  created_at: string;
  findings: Finding[];
};

export type AnalysisCreate = {
  summary?: string;
  findings?: FindingCreate[];
};

export type HealthStatus = {
  status: "ok" | "degraded";
  service: string;
};

export type ListPoliciesParams = {
  status?: PolicyStatus;
  search?: string;
  limit?: number;
  offset?: number;
};

export type ChatSource = {
  policy_id?: number;
  title: string;
  section?: string;
  snippet: string;
  relevance?: number;
};

export type ChatResponse = {
  answer: string;
  confidence: number;
  grounded: boolean;
  sources: ChatSource[];
  related_policy_ids?: number[];
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

function buildQuery(params: Record<string, string | number | boolean | undefined>): string {
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && v !== ""
  ) as [string, string | number | boolean][];
  if (entries.length === 0) return "";
  return "?" + entries.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join("&");
}

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiUrl}${path}`, {
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    ...init,
  });
  if (!response.ok) {
    let body: string;
    try {
      const json = await response.json();
      body = typeof json.detail === "string" ? json.detail : JSON.stringify(json);
    } catch {
      body = response.statusText;
    }
    throw new ApiError(body || `Request failed with status ${response.status}`, response.status);
  }
  return (await response.json()) as T;
}

export async function getHealth(): Promise<HealthStatus> {
  return request<HealthStatus>("/health");
}

export async function getPolicies(params: ListPoliciesParams = {}): Promise<Policy[]> {
  return request<Policy[]>(`/api/policies${buildQuery({
    status: params.status,
    search: params.search,
    limit: params.limit,
    offset: params.offset,
  })}`);
}

export async function getPolicy(policyId: number): Promise<Policy> {
  return request<Policy>(`/api/policies/${policyId}`);
}

export async function createPolicy(payload: PolicyCreate): Promise<Policy> {
  return request<Policy>("/api/policies", { method: "POST", body: JSON.stringify(payload) });
}

export async function updatePolicy(policyId: number, payload: PolicyUpdate): Promise<Policy> {
  return request<Policy>(`/api/policies/${policyId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function getAnalyses(policyId: number): Promise<Analysis[]> {
  return request<Analysis[]>(`/api/policies/${policyId}/analyses`);
}

export async function createAnalysis(
  policyId: number,
  payload: AnalysisCreate
): Promise<Analysis> {
  return request<Analysis>(`/api/policies/${policyId}/analyses`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function sendQuery(question: string): Promise<ChatResponse> {
  void question;
  throw new ApiError(
    "POST /api/chat endpoint is not yet implemented in the backend. " +
      "A temporary mock response is being used for UI development. " +
      "Swap this implementation to request('/api/chat', { method: 'POST', body: JSON.stringify({ question }) }) " +
      "once the backend RAG/chat endpoint is available.",
    501
  );
}

export function getApiBaseUrl(): string {
  return apiUrl;
}

export { ApiError };
