"use client";

import Link from "next/link";
import { useState } from "react";

export default function ExportPage() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [type, setType] = useState("all");

  const exportUrl = `/api/export?from=${from}&to=${to}&type=${type}`;

  return (
    <main className="app-shell">
      <div className="apple-container">
        <Link href="/" className="back-link">
          ← Back to Dashboard
        </Link>

        <section className="hero-card">
          <p className="eyebrow">Export data</p>
          <h1>Export Inventory</h1>
          <p className="muted">
            Choose date range and what type of records you want to export.
          </p>

          <div className="form-grid">
            <label className="field">
              <span>From date</span>
              <input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
            </label>

            <label className="field">
              <span>To date</span>
              <input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </label>

            <label className="field">
              <span>Export type</span>
              <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="all">All products</option>
                <option value="purchases">Purchases</option>
                <option value="sales">Sales / Sold items</option>
                <option value="stock">Items in stock</option>
              </select>
            </label>
          </div>

          <div className="actions">
            <a href={exportUrl} className="primary-btn">
              Download CSV
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
