"use client";

import { useEffect, useState } from "react";

import { getPolicies, type Policy } from "./api";

function statusLabel(status: Policy["status"]) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export default function Home() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getPolicies()
      .then(setPolicies)
      .catch(() => setError("The PolicyLens API is not reachable. Start the backend on port 8000."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="shell">
      <header className="topbar">
        <div className="brand"><span className="brand-mark">P</span><span>PolicyLens</span></div>
        <span className="connection"><span className={`connection-dot ${error ? "offline" : ""}`} /> {error ? "API offline" : "Workspace connected"}</span>
      </header>
      <main className="content">
        <section className="intro">
          <div>
            <p className="eyebrow">POLICY INTELLIGENCE</p>
            <h1>See what your policies actually cover.</h1>
            <p className="lede">Review policy health, spot gaps, and keep every decision grounded in the rules that shape your organization.</p>
          </div>
          <button className="primary-button" type="button">+ New policy</button>
        </section>

        <section className="metric-grid" aria-label="Policy summary">
          <div className="metric"><span>Total policies</span><strong>{loading ? "--" : policies.length}</strong><small>Across your workspace</small></div>
          <div className="metric"><span>Active coverage</span><strong>{loading ? "--" : policies.filter((policy) => policy.status === "active").length}</strong><small>Currently in effect</small></div>
          <div className="metric accent"><span>Last review</span><strong>Today</strong><small>Keep your lens current</small></div>
        </section>

        <section className="policy-section">
          <div className="section-heading"><div><p className="eyebrow">YOUR LIBRARY</p><h2>Policies</h2></div><button className="text-button" type="button">View all <span>{"->"}</span></button></div>
          {error && <div className="alert">{error}</div>}
          {loading && <div className="empty-state">Loading your policy library...</div>}
          {!loading && !error && policies.length === 0 && <div className="empty-state"><strong>Your policy library is ready.</strong><span>Create your first policy to start analyzing coverage.</span></div>}
          {!loading && !error && policies.length > 0 && <div className="policy-list">{policies.map((policy) => <article className="policy-row" key={policy.id}><div className="policy-icon">{policy.title.slice(0, 1).toUpperCase()}</div><div className="policy-copy"><h3>{policy.title}</h3><p>{policy.description || "No description yet."}</p></div><span className={`status status-${policy.status}`}>{statusLabel(policy.status)}</span><span className="version">v{policy.version}</span><span className="row-arrow">{"->"}</span></article>)}</div>}
        </section>
      </main>
    </div>
  );
}
