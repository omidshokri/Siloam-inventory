"use client";

import { useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase-browser";

const formulas = [
  ["inventoryValue", "Inventory Value"],
  ["totalSales", "Total Sales"],
  ["totalProfit", "Total Profit"],
  ["estimatedTax", "Estimated Tax"],
  ["profitAfterTax", "Profit After Tax"],
  ["itemsInStock", "Items in Stock"],
  ["soldItems", "Sold Items"],
  ["totalItems", "Total Items"],
];

export default function DashboardWidgetEditor({ widgets }: { widgets: any[] }) {
  const supabase = createBrowserSupabase();
  const [rows, setRows] = useState(widgets);
  const [saving, setSaving] = useState(false);

  async function saveRow(row: any) {
    setSaving(true);

    const { error } = await supabase
      .from("dashboard_widgets")
      .update({
        title: row.title,
        formula_key: row.formula_key,
        format: row.format,
        sort_order: Number(row.sort_order || 0),
        enabled: Boolean(row.enabled),
      })
      .eq("id", row.id);

    setSaving(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Saved");
  }

  async function addWidget() {
    setSaving(true);

    const { data, error } = await supabase
      .from("dashboard_widgets")
      .insert({
        title: "New Card",
        formula_key: "totalSales",
        format: "money",
        sort_order: rows.length + 1,
        enabled: true,
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

  function updateLocal(id: string, field: string, value: any) {
    setRows((current) =>
      current.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  }

  return (
    <section className="section-card">
      <div className="hero-top">
        <div>
          <h2>Cards</h2>
          <p className="muted">Change what appears on your dashboard.</p>
        </div>

        <button type="button" className="primary-btn" onClick={addWidget}>
          Add Card
        </button>
      </div>

      <div className="widget-editor-list">
        {rows.map((row) => (
          <div key={row.id} className="widget-editor-card">
            <label>
              Title
              <input
                value={row.title || ""}
                onChange={(e) => updateLocal(row.id, "title", e.target.value)}
              />
            </label>

            <label>
              Formula
              <select
                value={row.formula_key}
                onChange={(e) =>
                  updateLocal(row.id, "formula_key", e.target.value)
                }
              >
                {formulas.map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
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

            <button
              type="button"
              className="secondary-btn"
              onClick={() => saveRow(row)}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
