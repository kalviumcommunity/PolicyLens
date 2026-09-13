import type { ChatResponse } from "@/app/api";

type MockEntry = {
  keywords: string[];
  response: ChatResponse;
};

const RETURN_30_DAYS: ChatResponse = {
  answer:
    "Returns are allowed within 30 days of delivery for most products in unopened, original packaging. " +
    "The customer is responsible for return shipping unless the item arrived damaged or defective. " +
    "A refund will be processed to the original payment method within 5–7 business days after the " +
    "warehouse confirms the returned item.",
  confidence: 0.96,
  grounded: true,
  sources: [
    {
      title: "Return Policy",
      section: "Electronics → Section 4: Return Window",
      snippet:
        "All electronics may be returned within 30 calendar days of delivery, provided the item remains " +
        "in unopened, original packaging with all accessories included.",
      relevance: 0.94,
    },
    {
      title: "Return Policy",
      section: "Section 6: Refund Processing",
      snippet:
        "Refunds are issued to the original payment method and typically take 5–7 business days " +
        "following confirmation of receipt at our returns facility.",
      relevance: 0.78,
    },
  ],
  related_policy_ids: [1],
};

const SELLER_REPLACEMENT: ChatResponse = {
  answer:
    "Seller-level replacement is determined by the individual seller agreement. Most sellers on " +
    "the platform offer a 14-day replacement window for defective units. Replacement eligibility is " +
    "subject to the seller verifying manufacturing defect rather than customer misuse. You can open a " +
    "replacement request from the order details page; seller approval typically happens within " +
    "48 hours.",
  confidence: 0.9,
  grounded: true,
  sources: [
    {
      title: "Seller Agreement #SA-204",
      section: "Clause 7.2: Replacement Obligations",
      snippet:
        "Seller shall, at its option, replace any product that demonstrates a manufacturing " +
        "defect within fourteen (14) days of customer receipt, provided such defect is not caused " +
        "by improper installation, misuse, or normal wear and tear.",
      relevance: 0.91,
    },
    {
      title: "Product Catalog — Warranty Summary",
      section: "SKU Warranty Column",
      snippet:
        "Replacement (14d) — Seller administered — subject to manufacturing defect verification.",
      relevance: 0.65,
    },
  ],
  related_policy_ids: [2, 3],
};

const LOW_CONFIDENCE: ChatResponse = {
  answer:
    "PolicyLens did not find a direct policy that answers this question with high confidence. The " +
    "closest references below may still be useful. For a definitive answer, please escalate this case to " +
    "a support agent with the seller and policy ID shown.",
  confidence: 0.42,
  grounded: false,
  sources: [
    {
      title: "Return Policy",
      section: "Exceptions (partial match)",
      snippet: "Exceptions to the standard return window require explicit written approval.",
      relevance: 0.34,
    },
  ],
  related_policy_ids: [],
};

const REFUND_ELIGIBLE: ChatResponse = {
  answer:
    "This product is eligible for a refund if returned within the applicable return window " +
    "and in the condition required by the return policy. Final-sale items, personalized goods, " +
    "and perishables are explicitly excluded from refunds. Please review the sources below to confirm " +
    "eligibility for your specific SKU.",
  confidence: 0.93,
  grounded: true,
  sources: [
    {
      title: "Return Policy",
      section: "Section 2: Refund Eligibility",
      snippet:
        "A product is eligible for refund when (a) it is returned within the published return window, " +
        "(b) it is not marked Final Sale / Personalized / Perishable, and (c) condition requirements are met.",
      relevance: 0.93,
    },
    {
      title: "Return Policy",
      section: "Appendix A: Excluded Categories",
      snippet:
        "Final sale, personalized, and perishable SKUs are non-refundable unless the order item arrives damaged.",
      relevance: 0.81,
    },
  ],
  related_policy_ids: [1],
};

const MOCK_ENTRIES: MockEntry[] = [
  { keywords: ["return", "30", "30 day", "30 days", "return window"], response: RETURN_30_DAYS },
  { keywords: ["replace", "replacement", "seller", "defect", "seller agreement"], response: SELLER_REPLACEMENT },
  { keywords: ["refund", "money back", "eligible", "refundable"], response: REFUND_ELIGIBLE },
];

const GENERIC: ChatResponse = {
  answer:
    "Based on the current policy sources, here is what PolicyLens found. Review the source snippets " +
    "below to verify the answer applies to your specific product, seller, and region. If the " +
    "situation is unclear, escalate to a support agent with these sources attached.",
  confidence: 0.78,
  grounded: true,
  sources: [
    {
      title: "Return Policy",
      section: "General Provisions",
      snippet:
        "Customer returns and refunds are governed by the standard return window and condition " +
        "documented for each product category and seller.",
      relevance: 0.72,
    },
    {
      title: "Seller Agreement",
      section: "Customer Support Commitments",
      snippet:
        "Seller will respond to written support inquiries within two business days and " +
        "resolve or escalate within five business days.",
      relevance: 0.58,
    },
  ],
  related_policy_ids: [1, 2],
};

function score(question: string, keywords: string[]): number {
  const q = question.toLowerCase();
  return keywords.reduce((acc, kw) => acc + (q.includes(kw.toLowerCase()) ? 1 : 0), 0);
}

function pickBest(question: string): ChatResponse {
  const withScores = MOCK_ENTRIES.map((entry) => ({
    entry,
    s: score(question, entry.keywords),
  }));
  withScores.sort((a, b) => b.s - a.s);
  if (withScores[0]?.s > 0) {
    return withScores[0].entry.response;
  }
  if (question.trim().split(/\s+/).length <= 2) {
    return LOW_CONFIDENCE;
  }
  return GENERIC;
}

export async function mockSendQuery(question: string): Promise<ChatResponse> {
  await new Promise((resolve) => setTimeout(resolve, 900 + Math.random() * 900));
  if (Math.random() < 0.02) {
    throw new Error("Simulated transient failure");
  }
  const base = pickBest(question);
  return {
    ...base,
    confidence: Math.max(
      0.3,
      Math.min(0.99, base.confidence + (Math.random() * 0.08 - 0.04))
    ),
  };
}

export const CHAT_MOCK_NOTE =
  "Using temporary mock responses for UI development — replace with real POST /api/chat when backend RAG endpoint is available.";
