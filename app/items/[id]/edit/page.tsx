"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase-browser";

export default function EditItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [supabase] = useState(() => createBrowserSupabase());
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    inventory_number: "",
    category: "MacBook",
    serial_number: "",
    vendor: "",
    purchase_date: "",
    purchase_price: "",
    purchase_tax_paid: "",
    repair_cost: "0",
    shipping_cost: "0",
    platform_fees: "0",
  });

  useEffect(() => {
    async function loadItem() {
      const { data, error } = await supabase
        .from("inventory_items")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        alert(error.message);
        return;
      }

      setForm({
        name: data.name || "",
        inventory_number: data.inventory_number || "",
        category: data.category || "MacBook",
        serial_number: data.serial_number || "",
        vendor: data.vendor || "",
        purchase_date: data.purchase_date || "",
        purchase_price: String(data.purchase_price ?? ""),
        purchase_tax_paid: String(data.purchase_tax_paid ?? ""),
        repair_cost: String(data.repair_cost ?? "0"),
        shipping_cost: String(data.shipping_cost ?? "0"),
        platform_fees: String(data.platform_fees ?? "0"),
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
        name: form.name,
        inventory_number: form.inventory_number,
        category: form.category,
        serial_number: form.serial_number,
        vendor: form.vendor,
        purchase_date: form.purchase_date || null,
        purchase_price: Number(form.purchase_price || 0),
        purchase_tax_paid: Number(form.purchase_tax_paid || 0),
        repair_cost: Number(form.repair_cost || 0),
        shipping_cost: Number(form.shipping_cost || 0),
        platform_fees: Number(form.platform_fees || 0),
      })
      .eq("id", id);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    router.push(`/items/${id}`);
    router.refresh();
  }

  return (
    <main className="app-shell">
      <div className="apple-container">
        <Link href={`/items/${id}`} className="back-link">
          ← Back to Item
        </Link>

        <section className="hero-card">
          <div className="hero-top">
            <div>
              <p className="eyebrow">Edit inventory item</p>
              <h1>Edit Item</h1>
              <p className="muted">Update purchase details and product information.</p>
            </div>

            <button form="edit-item-form" disabled={loading} className="primary-btn">
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>

          <form id="edit-item-form" onSubmit={submit} className="form-grid">
            <Field label="Product name" value={form.name} onChange={(v) => updateField("name", v)} />
            <Field label="Inventory number" value={form.inventory_number} onChange={(v) => updateField("inventory_number", v)} />

            <CategoryField value={form.category} onChange={(v) => updateField("category", v)} />

            <Field label="Serial number" value={form.serial_number} onChange={(v) => updateField("serial_number", v)} />
            <Field label="Vendor / store" value={form.vendor} onChange={(v) => updateField("vendor", v)} />
            <Field label="Purchase date" type="date" value={form.purchase_date} onChange={(v) => updateField("purchase_date", v)} />
            <Field label="Purchase price" type="number" value={form.purchase_price} onChange={(v) => updateField("purchase_price", v)} />
            <Field label="Purchase tax paid" type="number" value={form.purchase_tax_paid} onChange={(v) => updateField("purchase_tax_paid", v)} />
            <Field label="Repair cost" type="number" value={form.repair_cost} onChange={(v) => updateField("repair_cost", v)} />
            <Field label="Shipping cost" type="number" value={form.shipping_cost} onChange={(v) => updateField("shipping_cost", v)} />
            <Field label="Platform fees" type="number" value={form.platform_fees} onChange={(v) => updateField("platform_fees", v)} />
          </form>
        </section>
      </div>
    </main>
  );
}

function CategoryField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const categories = [
    "MacBook",
    "iMac / Mac mini",
    "iPhone",
    "iPad",
    "Apple Watch",
    "AirPods",
    "Apple Pencil",
    "Magic Keyboard / Keyboard",
    "Mouse / Trackpad",
    "Monitor / Display",
    "PlayStation",
    "Nintendo",
    "Xbox",
    "Laptop - Windows",
    "Printer",
    "Camera / Drone",
    "Accessories",
    "Other",
  ];

  return (
    <label className="field">
      <span>Category</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
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
