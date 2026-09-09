export type PolicyStatus = "draft" | "active" | "archived";

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

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function getPolicies(): Promise<Policy[]> {
  const response = await fetch(`${apiUrl}/api/policies`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }
  return response.json() as Promise<Policy[]>;
}
