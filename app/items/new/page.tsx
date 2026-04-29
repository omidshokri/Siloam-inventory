export const dynamic = "force-dynamic";
export const revalidate = 0;
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase-browser";

export default function NewItemPage() {
  const router = useRouter();
  const [supabase] = useState(() => createBrowserSupabase());
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const [form, setForm] = useState({
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

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handlePhotoUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setAiLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/parse-receipt", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    setAiLoading(false);

    if (!response.ok) {
      alert(result.error || "AI could not read this image.");
      return;
    }

    setForm((prev) => ({
      ...prev,
      category: result.category || prev.category,
      serial_number: result.serial_number || prev.serial_number,
      vendor: result.vendor || prev.vendor,
      purchase_date: result.purchase_date || prev.purchase_date,
      purchase_price: String(result.purchase_price || prev.purchase_price || ""),
      purchase_tax_paid: String(result.purchase_tax_paid || prev.purchase_tax_paid || ""),
      repair_cost: String(result.repair_cost || prev.repair_cost || "0"),
      shipping_cost: String(result.shipping_cost || prev.shipping_cost || "0"),
      platform_fees: String(result.platform_fees || prev.platform_fees || "0"),
    }));
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const serialTail = form.serial_number
      ? form.serial_number.slice(-4).toUpperCase()
      : "NOSN";

    const today = new Date().toISOString().slice(0, 10).replaceAll("-", "");
    const inventoryNumber = `INV-${today}-${serialTail}`;
    const autoName = `${form.category} - SN ${serialTail}`;

    const { error } = await supabase.from("inventory_items").insert({
      name: autoName,
      inventory_number: inventoryNumber,
      category: form.category,
      serial_number: form.serial_number,
      vendor: form.vendor,
      purchase_date: form.purchase_date || null,
      purchase_price: Number(form.purchase_price || 0),
      purchase_tax_paid: Number(form.purchase_tax_paid || 0),
      repair_cost: Number(form.repair_cost || 0),
      shipping_cost: Number(form.shipping_cost || 0),
      platform_fees: Number(form.platform_fees || 0),
      status: "in_stock",
    });
if (error) {
  alert(error.message);
  console.error(error);
  return;
}

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
        <Link href="/" className="back-link">
          ← Back to Dashboard
        </Link>

        <section className="hero-card">
          <div className="hero-top">
            <div>
              <p className="eyebrow">Inventory purchase</p>
              <h1>Add Purchase</h1>
              <p className="muted">
                Upload a receipt or screenshot, and AI will try to fill the form.
              </p>
            </div>

            <button form="purchase-form" disabled={loading} className="primary-btn">
              {loading ? "Saving..." : "Save item"}
            </button>
          </div>

          <div className="ai-upload-box">
            <label className="upload-btn">
              {aiLoading ? "Reading image..." : "Upload Photo / Receipt"}
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                hidden
              />
            </label>
            <p className="muted">
              Check the fields before saving. AI may not always read everything perfectly.
            </p>
          </div>

          <form id="purchase-form" onSubmit={submit} className="form-grid">
            <CategoryField
              value={form.category}
              onChange={(v) => updateField("category", v)}
            />

            <Field
              label="Serial number"
              value={form.serial_number}
              onChange={(v) => updateField("serial_number", v)}
            />

            <Field
              label="Vendor / store"
              value={form.vendor}
              onChange={(v) => updateField("vendor", v)}
            />

            <Field
              label="Purchase date"
              type="date"
              value={form.purchase_date}
              onChange={(v) => updateField("purchase_date", v)}
            />

            <Field
              label="Purchase price"
              type="number"
              value={form.purchase_price}
              onChange={(v) => updateField("purchase_price", v)}
            />

            <Field
              label="Purchase tax paid"
              type="number"
              value={form.purchase_tax_paid}
              onChange={(v) => updateField("purchase_tax_paid", v)}
            />

            <Field
              label="Repair cost"
              type="number"
              value={form.repair_cost}
              onChange={(v) => updateField("repair_cost", v)}
            />

            <Field
              label="Shipping cost"
              type="number"
              value={form.shipping_cost}
              onChange={(v) => updateField("shipping_cost", v)}
            />

            <Field
              label="Platform fees at purchase"
              type="number"
              value={form.platform_fees}
              onChange={(v) => updateField("platform_fees", v)}
            />
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
