"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase-browser";

export default function SellItemPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const supabase = createBrowserSupabase();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    sale_price: "",
    sales_tax_collected: "0",
    selling_fees: "0",
    sale_date: new Date().toISOString().slice(0, 10),
    payment_method: "Cash",
  });

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from("inventory_items")
      .update({
        status: "sold",
        sale_price: Number(form.sale_price || 0),
        sales_tax_collected: Number(form.sales_tax_collected || 0),
        selling_fees: Number(form.selling_fees || 0),
        sale_date: form.sale_date,
        payment_method: form.payment_method,
      })
      .eq("id", params.id);

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
      <h1 className="mb-1 text-2xl font-bold">Mark as sold</h1>
      <p className="mb-6 text-sm text-slate-500">Enter the sale details. Sales tax collected is tracked separately from profit.</p>
      <form onSubmit={submit} className="space-y-4 rounded-2xl border bg-white p-4 shadow-sm">
        <Input label="Sale price" name="sale_price" type="number" step="0.01" value={form.sale_price} onChange={update} required />
        <Input label="Sales tax collected from buyer" name="sales_tax_collected" type="number" step="0.01" value={form.sales_tax_collected} onChange={update} />
        <Input label="Selling fees" name="selling_fees" type="number" step="0.01" value={form.selling_fees} onChange={update} />
        <Input label="Sale date" name="sale_date" type="date" value={form.sale_date} onChange={update} />
        <Input label="Payment method" name="payment_method" value={form.payment_method} onChange={update} />
        <button disabled={loading} className="w-full rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white disabled:opacity-50">
          {loading ? "Saving..." : "Save sale"}
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
