import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { createServerSupabase } from "@/lib/supabase-server";
import { itemCost, money, netProfit } from "@/lib/calculations";
import type { InventoryItem } from "@/lib/types";

export default async function DashboardPage() {
  const supabase = createServerSupabase();
  const { data } = await supabase
    .from("inventory_items")
    .select("*")
    .order("created_at", { ascending: false });

  const items = (data ?? []) as InventoryItem[];
  const soldItems = items.filter((item) => item.status === "sold");
  const inStock = items.filter((item) => item.status === "in_stock");

  const inventoryValue = inStock.reduce((sum, item) => sum + itemCost(item), 0);
  const totalSales = soldItems.reduce((sum, item) => sum + Number(item.sale_price ?? 0), 0);
  const totalProfit = soldItems.reduce((sum, item) => sum + netProfit(item), 0);
  const taxCollected = soldItems.reduce((sum, item) => sum + Number(item.sales_tax_collected ?? 0), 0);

  return (
    <main className="mx-auto max-w-5xl p-4 pb-24">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">Small business tracker</p>
          <h1 className="text-2xl font-bold">Siloam Inventory</h1>
        </div>
        <Link href="/items/new" className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white">
          <PlusCircle size={18} /> Add
        </Link>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Inventory value" value={money(inventoryValue)} />
        <Stat label="Total sales" value={money(totalSales)} />
        <Stat label="Net profit" value={money(totalProfit)} />
        <Stat label="Sales tax collected" value={money(taxCollected)} />
      </section>

      <section className="mt-8">
        <h2 className="mb-3 text-lg font-semibold">Items</h2>
        <div className="overflow-hidden rounded-2xl border bg-white">
          {items.length === 0 ? (
            <p className="p-6 text-sm text-slate-500">No items yet. Add your first purchase.</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="border-b p-4 last:border-b-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-medium text-slate-500">{item.sku}</p>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-slate-500">
                      Cost: {money(itemCost(item))} • Status: {item.status.replace("_", " ")}
                    </p>
                  </div>
                  {item.status === "in_stock" ? (
                    <Link href={`/items/${item.id}/sell`} className="rounded-lg border px-3 py-2 text-sm font-medium">
                      Sell
                    </Link>
                  ) : (
                    <span className="rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-700">
                      Profit {money(netProfit(item))}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}
