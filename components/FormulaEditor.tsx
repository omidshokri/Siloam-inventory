"use client";

import { useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase-browser";

const availableFields = [
  "purchase_price",
  "purchase_tax_paid",
  "repair_cost",
  "shipping_cost",
  "platform_fees",
  "sale_price",
  "sales_tax_collected",
  "selling_fees",
];

export default function FormulaEditor({ formulas }: { formulas: any[] }) {
  const [supabase] = useState(() => createBrowserSupabase());
  const [rows, setRows] = useState(formulas);
  const [savingId, setSavingId] = useState<string | null>(null);

  function updateLocal(id: string, field: string, value: any) {
    setRows((current) =>
      current.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  }

  async function addFormula() {
    setSavingId("new");

    const { data, error } = await supabase
      .from("custom_formulas")
      .insert({
        name: "New Formula",
        formula: "purchase_price + purchase_tax_paid",
        scope: "item",
        format: "money",
        enabled: true,
        sort_order: rows.length + 1,
      })
      .select()
      .single();

    setSavingId(null);

    if (error) {
      alert(error.message);
      return;
    }

    setRows([...(rows || []), data]);
  }

  async function saveFormula(row: any) {
    setSavingId(row.id);

    const { error } = await supabase
      .from("custom_formulas")
      .update({
        name: row.name,
        formula: row.formula,
        scope: row.scope,
        format: row.format,
        enabled: Boolean(row.enabled),
        sort_order: Number(row.sort_order || 0),
      })
      .eq("id", row.id);

    setSavingId(null);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Formula saved");
  }

  async function deleteFormula(id: string) {
    if (!confirm("Delete this formula?")) return;

    setSavingId(id);

    const { error } = await supabase
      .from("custom_formulas")
      .delete()
      .eq("id", id);

    setSavingId(null);

    if (error) {
      alert(error.message);
      return;
    }

    setRows(rows.filter((row) => row.id !== id));
  }

  return (
    <section className="section-card">
      <div className="hero-top">
        <div>
          <h2>Formula List</h2>
          <p className="muted">Create custom calculations for items and dashboards.</p>
        </div>

        <button
          type="button"
          className="primary-btn"
          onClick={addFormula}
          disabled={savingId === "new"}
        >
          {savingId === "new" ? "Adding..." : "Add Formula"}
        </button>
      </div>

      <div className="formula-help">
        <p className="muted">Available fields</p>
        <div className="formula-tags">
          {availableFields.map((field) => (
            <code key={field}>{field}</code>
          ))}
        </div>
      </div>

      <div className="formula-editor-list">
        {rows.map((row) => (
          <div key={row.id} className="formula-card">
            <div className="formula-card-top">
              <label className="field">
                <span>Name</span>
                <input
                  value={row.name || ""}
                  onChange={(e) => updateLocal(row.id, "name", e.target.value)}
                />
              </label>

              <label className="field">
                <span>Order</span>
                <input
                  type="number"
                  value={row.sort_order ?? 0}
                  onChange={(e) =>
                    updateLocal(row.id, "sort_order", e.target.value)
                  }
                />
              </label>
            </div>

            <label className="field">
              <span>Formula</span>
              <textarea
                value={row.formula || ""}
                onChange={(e) => updateLocal(row.id, "formula", e.target.value)}
              />
            </label>

            <div className="formula-card-grid">
              <label className="field">
                <span>Scope</span>
                <select
                  value={row.scope || "item"}
                  onChange={(e) => updateLocal(row.id, "scope", e.target.value)}
                >
                  <option value="item">Item</option>
                  <option value="dashboard">Dashboard</option>
                </select>
              </label>

              <label className="field">
                <span>Format</span>
                <select
                  value={row.format || "money"}
                  onChange={(e) => updateLocal(row.id, "format", e.target.value)}
                >
                  <option value="money">Money</option>
                  <option value="number">Number</option>
                  <option value="percent">Percent</option>
                </select>
              </label>

              <label className="formula-toggle">
                <input
                  type="checkbox"
                  checked={Boolean(row.enabled)}
                  onChange={(e) =>
                    updateLocal(row.id, "enabled", e.target.checked)
                  }
                />
                Enabled
              </label>
            </div>

            <div className="actions">
              <button
                type="button"
                className="primary-btn"
                onClick={() => saveFormula(row)}
                disabled={savingId === row.id}
              >
                {savingId === row.id ? "Saving..." : "Save"}
              </button>

              <button
                type="button"
                className="danger-btn"
                onClick={() => deleteFormula(row.id)}
                disabled={savingId === row.id}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
