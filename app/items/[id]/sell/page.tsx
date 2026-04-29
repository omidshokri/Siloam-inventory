export const dynamic = "force-dynamic";
export const revalidate = 0;
"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase-browser";

export default function SellPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [supabase] = useState(() => createBrowserSupabase());

  const [loading, setLoading] = useState(false);
  const [itemName, setItemName] = useState("");

  const [form, setForm] = useState({
    sale_price: "",
    sales_tax_collected: "0",
    selling_fees: "0",
    sale_date: new Date().toISOString().slice(0, 10),
    payment_method: "Cash",
  });

  useEffect(() => {
    async function loadItem() {
      const { data, error } = await supabase
        .from("inventory_items")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) return;

      setItemName(data.name || "Item");

      setForm({
        sale_price: String(data.sale_price ?? ""),
        sales_tax_collected: String(data.sales_tax_collected ?? "0"),
        selling_fees: String(data.selling_fees ?? "0"),
        sale_date: data.sale_date || new Date().toISOString().slice(0, 10),
        payment_method: data.payment_method || "Cash",
      });
    }

    loadItem();
  }, [id, supabase]);

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from("inventory_items")
      .update({
        sale_price: Number(form.sale_price || 0),
        sales_tax_collected: Number(form.sales_tax_collected || 0),
        selling_fees: Number(form.selling_fees || 0),
        sale_date: form.sale_date || null,
        payment_method: form.payment_method,
        status: "sold",
      })
      .eq("id", id);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/");
    router.refresh();
  }

  async function returnToInventory() {
    if (!confirm("Return this item back to inventory?")) return;

    setLoading(true);

    const { error } = await supabase
      .from("inventory_items")
      .update({
        sale_price: null,
        sales_tax_collected: 0,
        selling_fees: 0,
        sale_date: null,
        payment_method: null,
        status: "in_stock",
      })
      .eq("id", id);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <main className="app-shell">
      <div className="apple-container">
        <button onClick={() => router.back()} className="back-btn">
          ← Back
        </button>

        <section className="hero-card">
          <div className="hero-top">
            <div>
              <p className="eyebrow">Inventory sale</p>
              <h1>Mark as Sold</h1>
              <p className="muted">{itemName}</p>
            </div>

            <div className="actions">
              <button
                type="button"
                onClick={returnToInventory}
                disabled={loading}
                className="danger-btn"
              >
                Return to Inventory
              </button>

              <button
                form="sale-form"
                disabled={loading}
                className="primary-btn"
              >
                {loading ? "Saving..." : "Save sale"}
              </button>
            </div>
          </div>

          <form id="sale-form" onSubmit={submit} className="form-grid">
            <Field
              label="Sale price"
              type="number"
              value={form.sale_price}
              onChange={(v) => updateField("sale_price", v)}
            />

            <Field
              label="Sales tax collected from buyer"
              type="number"
              value={form.sales_tax_collected}
              onChange={(v) => updateField("sales_tax_collected", v)}
            />

            <Field
              label="Selling fees"
              type="number"
              value={form.selling_fees}
              onChange={(v) => updateField("selling_fees", v)}
            />

            <Field
              label="Sale date"
              type="date"
              value={form.sale_date}
              onChange={(v) => updateField("sale_date", v)}
            />

            <PaymentField
              value={form.payment_method}
              onChange={(v) => updateField("payment_method", v)}
            />
          </form>
        </section>
      </div>
    </main>
  );
}

function PaymentField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const methods = [
    "Cash",
    "Zelle",
    "Venmo",
    "Cash App",
    "Facebook Pay",
    "Card",
    "Other",
  ];

  return (
    <label className="field">
      <span>Payment method</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {methods.map((method) => (
          <option key={method} value={method}>
            {method}
          </option>
        ))}
      </select>
    </label>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <input
        type={type}
        value={value}
        step={type === "number" ? "0.01" : undefined}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
