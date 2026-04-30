"use client";

import { useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase-browser";

export default function DashboardBuilder({ blocks }: { blocks: any[] }) {
  const [supabase] = useState(() => createBrowserSupabase());
  const [rows, setRows] = useState(blocks);
  const [savingId, setSavingId] = useState<string | null>(null);

  function updateLocal(id: string, field: string, value: any) {
    setRows((current) =>
      current.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  }

  async function saveBlock(row: any) {
    setSavingId(row.id);

    const { error } = await supabase
      .from("dashboard_blocks")
      .update({
        title: row.title,
        block_type: row.block_type,
        formula: row.formula,
        content: row.content,
        format: row.format,
        x: Number(row.x || 0),
        y: Number(row.y || 0),
        w: Number(row.w || 1),
        h: Number(row.h || 1),
        enabled: Boolean(row.enabled),
      })
      .eq("id", row.id);

    setSavingId(null);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Block saved");
  }

  async function addBlock() {
    setSavingId("new");

    const { data, error } = await supabase
      .from("dashboard_blocks")
      .insert({
        title: "New Block",
        block_type: "metric",
        formula: "purchase_price + purchase_tax_paid",
        content: "",
        format: "money",
        x: 0,
        y: rows.length + 1,
        w: 1,
        h: 1,
        enabled: true,
      })
      .select()
      .single();

    setSavingId(null);

    if (error) {
      alert(error.message);
      return;
    }

    setRows([...rows, data]);
  }

  async function deleteBlock(id: string) {
    if (!confirm("Delete this block?")) return;

    setSavingId(id);

    const { error } = await supabase
      .from("dashboard_blocks")
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
          <h2>Blocks</h2>
          <p className="muted">Control what appears on your future home screen.</p>
        </div>

        <button
          type="button"
          className="primary-btn"
          onClick={addBlock}
          disabled={savingId === "new"}
        >
          {savingId === "new" ? "Adding..." : "Add Block"}
        </button>
      </div>

      <div className="builder-preview-grid">
        {rows
          .filter((row) => row.enabled)
          .map((row) => (
            <div
              key={row.id}
              className={`builder-preview-card block-w-${row.w} block-h-${row.h}`}
            >
              <p className="eyebrow">{row.block_type}</p>
              <h3>{row.title}</h3>
              <p className="muted">
                {row.block_type === "text"
                  ? row.content || "Text content"
                  : row.formula || "Formula"}
              </p>
            </div>
          ))}
      </div>

      <div className="builder-list">
        {rows.map((row) => (
          <div key={row.id} className="builder-card">
            <div className="builder-card-top">
              <label className="field">
                <span>Title</span>
                <input
                  value={row.title || ""}
                  onChange={(e) => updateLocal(row.id, "title", e.target.value)}
                />
              </label>

              <label className="field">
                <span>Type</span>
                <select
                  value={row.block_type || "metric"}
                  onChange={(e) =>
                    updateLocal(row.id, "block_type", e.target.value)
                  }
                >
                  <option value="metric">Metric</option>
                  <option value="text">Text</option>
                  <option value="image">Image</option>
                  <option value="date">Date</option>
                </select>
              </label>
            </div>

            <label className="field">
              <span>Formula / Content</span>
              <textarea
                value={row.block_type === "text" ? row.content || "" : row.formula || ""}
                onChange={(e) =>
                  updateLocal(
                    row.id,
                    row.block_type === "text" ? "content" : "formula",
                    e.target.value
                  )
                }
              />
            </label>

            <div className="builder-size-grid">
              <label className="field">
                <span>Format</span>
                <select
                  value={row.format || "money"}
                  onChange={(e) => updateLocal(row.id, "format", e.target.value)}
                >
                  <option value="money">Money</option>
                  <option value="number">Number</option>
                  <option value="percent">Percent</option>
                  <option value="text">Text</option>
                </select>
              </label>

              <label className="field">
                <span>X</span>
                <input
                  type="number"
                  value={row.x ?? 0}
                  onChange={(e) => updateLocal(row.id, "x", e.target.value)}
                />
              </label>

              <label className="field">
                <span>Y</span>
                <input
                  type="number"
                  value={row.y ?? 0}
                  onChange={(e) => updateLocal(row.id, "y", e.target.value)}
                />
              </label>

              <label className="field">
                <span>Width</span>
                <select
                  value={row.w ?? 1}
                  onChange={(e) => updateLocal(row.id, "w", e.target.value)}
                >
                  <option value={1}>Small</option>
                  <option value={2}>Wide</option>
                </select>
              </label>

              <label className="field">
                <span>Height</span>
                <select
                  value={row.h ?? 1}
                  onChange={(e) => updateLocal(row.id, "h", e.target.value)}
                >
                  <option value={1}>Short</option>
                  <option value={2}>Tall</option>
                </select>
              </label>

              <label className="formula-toggle">
                <input
                  type="checkbox"
                  checked={Boolean(row.enabled)}
                  onChange={(e) => updateLocal(row.id, "enabled", e.target.checked)}
                />
                Enabled
              </label>
            </div>

            <div className="actions">
              <button
                type="button"
                className="primary-btn"
                onClick={() => saveBlock(row)}
                disabled={savingId === row.id}
              >
                {savingId === row.id ? "Saving..." : "Save"}
              </button>

              <button
                type="button"
                className="danger-btn"
                onClick={() => deleteBlock(row.id)}
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
