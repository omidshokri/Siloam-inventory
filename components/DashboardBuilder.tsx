"use client";

import { useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase-browser";

export default function DashboardBuilder({ blocks }: { blocks: any[] }) {
  const [supabase] = useState(() => createBrowserSupabase());
  const [rows, setRows] = useState(blocks || []);
  const [title, setTitle] = useState("");
  const [formula, setFormula] = useState("");
  const [type, setType] = useState("metric");
  const [saving, setSaving] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);

  function updateLocal(id: string, field: string, value: any) {
    setRows((current) =>
      current.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  }

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

    const { data, error } = await supabase
      .from("dashboard_blocks")
      .insert({
        title: title.trim(),
        block_type: type,
        formula: type === "metric" ? formula.trim() : null,
        content: type !== "metric" ? formula.trim() : null,
        format: type === "metric" ? "money" : "text",
        x: 0,
        y: rows.length,
        w: 1,
        h: 1,
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
    setTitle("");
    setFormula("");
    setType("metric");
  }

  async function saveBlock(row: any) {
    setSavingId(row.id);

    const { error } = await supabase
      .from("dashboard_blocks")
      .update({
        title: row.title,
        block_type: row.block_type,
        formula: row.block_type === "metric" ? row.formula : null,
        content: row.block_type !== "metric" ? row.content : null,
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

    alert("Saved ✅");
  }

  async function deleteBlock(id: string) {
    if (!confirm("Delete this block?")) return;

    setSavingId(id);

    const { error } = await supabase.from("dashboard_blocks").delete().eq("id", id);

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
          <h2>Create Block</h2>
          <p className="muted">Add, edit, disable, or delete dashboard blocks.</p>
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

        <label className="field">
          <span>{type === "metric" ? "Formula" : "Content"}</span>
          <input
            placeholder={
              type === "metric"
                ? "Example: sale_price - purchase_price"
                : "Write content here"
            }
            value={formula}
            onChange={(e) => setFormula(e.target.value)}
          />
        </label>

        <button
          type="button"
          className="primary-btn"
          onClick={addBlock}
          disabled={saving}
        >
          {saving ? "Adding..." : "Add Block"}
        </button>
      </div>

      <div className="builder-list" style={{ marginTop: 24 }}>
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
                  <option value="date">Date</option>
                </select>
              </label>
            </div>

            <label className="field">
              <span>{row.block_type === "metric" ? "Formula" : "Content"}</span>
              <textarea
                value={
                  row.block_type === "metric"
                    ? row.formula || ""
                    : row.content || ""
                }
                onChange={(e) =>
                  updateLocal(
                    row.id,
                    row.block_type === "metric" ? "formula" : "content",
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
