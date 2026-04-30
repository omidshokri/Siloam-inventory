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
  const supabase = createBrowserSupabase();
  const [rows, setRows] = useState(formulas);
  const [saving, setSaving] = useState(false);

  function updateLocal(id: string, field: string, value: any) {
    setRows((current) =>
      current.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  }

  async function addFormula() {
    setSaving(true);

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

    setSaving(false);

    if (error) {
      alert(error.message);
      return;
    }

    setRows([...rows, data]);
  }

  async function saveFormula(row: any) {
    setSaving(true);

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

    setSaving(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Saved");
  }

  async function deleteFormula(id: string) {
    if (!confirm("Delete this formula?")) return;

    const { error } = await supabase
      .from("custom_formulas")
      .delete()
      .eq("id", id);

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
          <p className="muted">
            Use fields like purchase_price, repair_cost, sale_price.
          </p>
        </div>

        <button type="button" className="primary-btn" onClick={addFormula}>
          Add Formula
        </button>
      </div>

      <div className="formula-help">
        <p className="muted">Available fields:</p>
        <div className="formula-tags">
          {availableFields.map((field) => (
            <code key={field}>{field}</code>
          ))}
        </div>
      </div>

      <div className="formula-editor-list">
        {rows.map((row) => (
          <div key={row.id} className="formula-editor-card">
            <label>
              Name
              <input
                value={row.name || ""}
                onChange={(e) => updateLocal(row.id, "name", e.target.value)}
              />
            </label>

            <label>
              Formula
              <textarea
                value={row.formula || ""}
                onChange={(e) => updateLocal(row.id, "formula", e.target.value)}
              />
            </label>

            <label>
              Scope
              <select
                value={row.scope}
                onChange={(e) => updateLocal(row.id, "scope", e.target.value)}
              >
                <option value="item">Item</option>
                <option value="dashboard">Dashboard</option>
              </select>
            </label>

            <label>
              Format
              <select
                value={row.format}
                onChange={(e) => updateLocal(row.id, "format", e.target.value)}
              >
                <option value="money">Money</option>
                <option value="number">Number</option>
                <option value="percent">Percent</option>
              </select>
            </label>

            <label>
              Order
              <input
                type="number"
                value={row.sort_order ?? 0}
                onChange={(e) =>
                  updateLocal(row.id, "sort_order", e.target.value)
                }
              />
            </label>

            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={Boolean(row.enabled)}
                onChange={(e) =>
                  updateLocal(row.id, "enabled", e.target.checked)
                }
              />
              Enabled
            </label>

            <div className="actions">
              <button
                type="button"
                className="secondary-btn"
                onClick={() => saveFormula(row)}
                disabled={saving}
              >
                Save
              </button>

              <button
                type="button"
                className="danger-btn"
                onClick={() => deleteFormula(row.id)}
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
