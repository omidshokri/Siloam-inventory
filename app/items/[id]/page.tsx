"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase-browser";

export default function ItemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [supabase] = useState(() => createBrowserSupabase());
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(false);

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

      setItem(data);
    }

    loadItem();
  }, [id, supabase]);

  async function deleteItem() {
    const ok = confirm(
      "Are you sure you want to delete this item? This cannot be undone."
    );

    if (!ok) return;

    setLoading(true);

    const { error } = await supabase
      .from("inventory_items")
      .delete()
      .eq("id", id);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/");
    router.refresh();
  }

  if (!item) {
    return (
      <main className="app-shell">
        <div className="apple-container">
          <p>Loading...</p>
        </div>
      </main>
    );
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
              <p className="eyebrow">Item details</p>
              <h1>{item.name}</h1>
              <p className="muted">
                {item.inventory_number || "No inventory number"} •{" "}
                {item.status?.replace("_", " ")}
              </p>
            </div>

<div className="actions">
  <Link href={`/items/${item.id}/edit`} className="secondary-btn">
    Edit Item
  </Link>

  <Link href={`/items/${item.id}/sell`} className="primary-btn">
    {item.status === "sold" ? "Edit Sale" : "Mark as Sold"}
  </Link>

  <button
    type="button"
    onClick={deleteItem}
    disabled={loading}
    className="danger-btn"
  >
    {loading ? "Deleting..." : "Delete"}
  </button>
<Link href={`/items/${item.id}/label`} className="secondary-btn">
  Print Label
</Link>
</div>
          </div>

          <div className="detail-grid">
            <Detail label="Category" value={item.category} />
            <Detail label="Serial number" value={item.serial_number} />
            <Detail label="Vendor / store" value={item.vendor} />
            <Detail label="Purchase date" value={item.purchase_date} />
            <Detail label="Purchase price" value={`$${item.purchase_price ?? 0}`} />
            <Detail label="Purchase tax paid" value={`$${item.purchase_tax_paid ?? 0}`} />
            <Detail label="Repair cost" value={`$${item.repair_cost ?? 0}`} />
            <Detail label="Shipping cost" value={`$${item.shipping_cost ?? 0}`} />
            <Detail label="Platform fees" value={`$${item.platform_fees ?? 0}`} />

            {item.status === "sold" && (
              <>
                <Detail label="Sale price" value={`$${item.sale_price ?? 0}`} />
                <Detail
                  label="Sales tax collected"
                  value={`$${item.sales_tax_collected ?? 0}`}
                />
                <Detail label="Selling fees" value={`$${item.selling_fees ?? 0}`} />
                <Detail label="Sale date" value={item.sale_date} />
                <Detail label="Payment method" value={item.payment_method} />
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function Detail({ label, value }: { label: string; value: any }) {
  return (
    <div className="detail-card">
      <p>{label}</p>
      <strong>{value || "—"}</strong>
    </div>
  );
}
