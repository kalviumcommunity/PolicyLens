import type { Policy, Analysis } from "@/app/api";

export const MOCK_POLICIES: Policy[] = [
  {
    id: 1,
    title: "Standard Customer Return & Refund Policy",
    description: "Governs general customer return eligibility, refund processing windows, and shipping cost responsibilities across electronics, apparel, and home goods.",
    status: "active",
    version: "2.4",
    owner: "Legal & Compliance",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: 2,
    title: "Third-Party Marketplace Merchant Master Agreement",
    description: "Defines seller fulfillment SLAs, replacement mandates for defective merchandise, and customer dispute resolution requirements.",
    status: "active",
    version: "3.1",
    owner: "Marketplace Operations",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
  {
    id: 3,
    title: "Perishable & Temperature-Controlled Goods Policy",
    description: "Guidelines and exception criteria for perishable grocery items, temperature breach claims, and courier transit liability waivers.",
    status: "draft",
    version: "1.2",
    owner: "Customer Experience Lead",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
  },
  {
    id: 4,
    title: "High-Value Luxury & Electronics Warranty Guidelines",
    description: "Specialized serial-number verification protocols, anti-fraud return checks, and mandatory certified technician inspection for high-value items.",
    status: "active",
    version: "1.0",
    owner: "Fraud & Security Operations",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
  },
];

export const MOCK_ANALYSES: Record<number, Analysis[]> = {
  1: [
    {
      id: 101,
      policy_id: 1,
      status: "completed",
      summary: "Compliance audit verified return window alignment. Flagged 2 discrepancies regarding restock fee definitions and holiday extension ambiguity.",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
      findings: [
        {
          id: 1,
          title: "Ambiguous Restocking Fee Exception Clause",
          details: "Section specifies 15% restocking fee for late returns but fails to define if defective or damaged goods are exempt.",
          severity: "high",
          recommendation: "Explicitly state that defective and carrier-damaged items are 100% exempt from any restocking deductions.",
        },
        {
          id: 2,
          title: "Unclear Proof Requirements for Return Shipping Waivers",
          details: "Does not clarify whether photographic evidence is required prior to generating prepaid courier return labels.",
          severity: "medium",
          recommendation: "Add standard 2-photo submission requirement for pre-authorized label issuance.",
        },
      ],
    },
  ],
  2: [
    {
      id: 102,
      policy_id: 2,
      status: "completed",
      summary: "Seller SLA audit identified critical timeline mismatch between customer-facing support promise and merchant dispatch window.",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
      findings: [
        {
          id: 3,
          title: "SLA Conflict with Merchant Dispatch Standard",
          details: "Replacement turnaround in Section 4 is listed as 72 hours, whereas merchant master agreement mandates 48-hour dispatch.",
          severity: "critical",
          recommendation: "Align replacement clause with SLA Clause 7.2 to require 48-hour replacement dispatch.",
        },
      ],
    },
  ],
  3: [
    {
      id: 103,
      policy_id: 3,
      status: "completed",
      summary: "Perishable goods policy reviewed for courier delay liabilities. Missing explicit 24h reporting threshold.",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
      findings: [
        {
          id: 4,
          title: "Missing Strict Time Limit on Spoilage Claims",
          details: "Clause allows refund claims without specifying that spoilage reports must be filed within 24 hours of delivery.",
          severity: "medium",
          recommendation: "Incorporate strict 24-hour photo evidence submission deadline.",
        },
      ],
    },
  ],
};
