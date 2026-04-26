"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase-browser";

export default function NewItemPage() {
  const router = useRouter();
  const supabase = createBrowserSupabase();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    category: "Laptop",
    serial_number: "",
    vendor: "",
    purchase_date: "",
    purchase_price: "",
    purchase_tax_paid: "",
    repair_cost: "0",
    shipping_cost: "0",
    platform_fees: "0",
  });

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const payload = {
      ...form,
      purchase_price: Number(form.purchase_price || 0),
      purchase_tax_paid: Number(form.purchase_tax_paid || 0),
      repair_cost: Number(form.repair_cost || 0),
      shipping_cost: Number(form.shipping_cost || 0),
      platform_fees: Number(form.platform_fees || 0),
      status: "in_stock",
    };

    const { error } = await supabase.from("inventory_items").insert(payload);
    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/");
    router.refresh();
  }

  function update(name: string, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  return (
    <main className="mx-auto max-w-xl p-4 pb-24">
      <h1 className="mb-1 text-2xl font-bold">Add purchase</h1>
      <p className="mb-6 text-sm text-slate-500">Enter the item details. Receipt AI parsing is prepared in the API route for the next step.</p>

      <form onSubmit={submit} className="space-y-4 rounded-2xl border bg-white p-4 shadow-sm">
        <Input label="Product name" name="name" value={form.name} onChange={update} required />
        <Input label="Category" name="category" value={form.category} onChange={update} />
        <Input label="Serial number" name="serial_number" value={form.serial_number} onChange={update} />
        <Input label="Vendor / store" name="vendor" value={form.vendor} onChange={update} />
        <Input label="Purchase date" name="purchase_date" type="date" value={form.purchase_date} onChange={update} />
        <Input label="Purchase price before tax" name="purchase_price" type="number" step="0.01" value={form.purchase_price} onChange={update} required />
        <Input label="Purchase tax paid" name="purchase_tax_paid" type="number" step="0.01" value={form.purchase_tax_paid} onChange={update} />
        <Input label="Repair cost" name="repair_cost" type="number" step="0.01" value={form.repair_cost} onChange={update} />
        <Input label="Shipping cost" name="shipping_cost" type="number" step="0.01" value={form.shipping_cost} onChange={update} />
        <Input label="Platform fees at purchase" name="platform_fees" type="number" step="0.01" value={form.platform_fees} onChange={update} />
        <button disabled={loading} className="w-full rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white disabled:opacity-50">
          {loading ? "Saving..." : "Save item"}
        </button>
      </form>
    </main>
  );
}

function Input({ label, name, value, onChange, type = "text", required = false, step }: {
  label: string;
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
  type?: string;
  required?: boolean;
  step?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      <input
        className="w-full rounded-xl border px-3 py-3 outline-none ring-slate-900 focus:ring-2"
        name={name}
        value={value}
        type={type}
        step={step}
        required={required}
        onChange={(event) => onChange(name, event.target.value)}
      />
    </label>
  );
}
