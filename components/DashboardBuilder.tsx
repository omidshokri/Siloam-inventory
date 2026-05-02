"use client";

import { useState } from "react";

export default function DashboardBuilder() {
  const [title, setTitle] = useState("");
  const [formula, setFormula] = useState("");
  const [type, setType] = useState("metric");
  const [saving, setSaving] = useState(false);

  async function addBlock() {
    if (!title.trim()) {
      alert("Please enter a title");
      return;
    }

    if (type === "metric" && !formula.trim()) {
      alert("Please enter a formula");
      return;
    }

    setSaving(true);

    const res = await fetch("/api/dashboard-blocks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title.trim(),
        formula: type === "metric" ? formula.trim() : "",
        block_type: type,
      }),
    });

    const result = await res.json();

    setSaving(false);

    if (res.ok) {
      alert("Added ✅");
      setTitle("");
      setFormula("");
      setType("metric");
    } else {
      alert(result.error || "Error ❌");
    }
  }

  return (
    <section className="section-card">
      <div className="hero-top">
        <div>
          <h2>Create Block</h2>
          <p className="muted">Add a new card to your home dashboard.</p>
        </div>
      </div>

      <div className="builder-card">
        <label className="field">
          <span>Title</span>
          <input
            placeholder="Example: Total Profit"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>

        <label className="field">
          <span>Type</span>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="metric">Metric</option>
            <option value="text">Text</option>
            <option value="date">Date</option>
          </select>
        </label>

        {type === "metric" && (
          <label className="field">
            <span>Formula</span>
            <input
              placeholder="Example: sale_price - purchase_price"
              value={formula}
              onChange={(e) => setFormula(e.target.value)}
            />
          </label>
        )}

        <button
          type="button"
          className="primary-btn"
          onClick={addBlock}
          disabled={saving}
        >
          {saving ? "Adding..." : "Add Block"}
        </button>
      </div>
    </section>
  );
}
