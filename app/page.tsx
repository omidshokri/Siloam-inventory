export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";
import { PlusCircle, Download } from "lucide-react";
import { createServerSupabase } from "@/lib/supabase-server";
import { money, netProfit, itemCost } from "@/lib/calculations";
import PieChartBreakdown from "@/components/PieChartBreakdown";
import BarChartProfit from "@/components/BarChartProfit";
import LogoutButton from "../components/LogoutButton";
import type { InventoryItem } from "@/types/inventory";

export default async function DashboardPage() {
  const supabase = createServerSupabase();

  const { data } = await supabase
    .from("inventory_items")
    .select("*")
    .order("created_at", { ascending: false });

  const items = (data || []) as InventoryItem[];

  const inStockItems = items.filter((item) => item.status !== "sold");
  const soldItems = items.filter((item) => item.status === "sold");

  const inventoryValue = inStockItems.reduce(
    (sum, item) => sum + itemCost(item),
    0
  );

  const totalSales = soldItems.reduce(
    (sum, item) => sum + Number(item.sale_price ?? 0),
    0
  );

  const totalProfit = soldItems.reduce(
    (sum, item) => sum + netProfit(item),
    0
  );

  const TAX_RATE = 0.25;
  const estimatedTax = totalProfit > 0 ? totalProfit * TAX_RATE : 0;
  const profitAfterTax = totalProfit - estimatedTax;

  const pieChartData = [
    { name: "Inventory", value: inventoryValue },
    { name: "Profit", value: totalProfit },
    { name: "Sales Tax Collected", value: estimatedTax },
  ];

  const barChartData = items.map((item) => ({
    name: item.name || "Item",
    cost: itemCost(item),
    profit: netProfit(item),
  }));

  return (
    <main className="app-shell">
      <div className="apple-container">
        <section className="hero-card">
          <div className="hero-top">
            <div>
              <p className="eyebrow">Small business tracker</p>
              <h1>Siloam Inventory</h1>
            </div>

            <div className="actions">
              <Link href="/items/new" className="primary-btn">
                <PlusCircle size={18} />
                Add
              </Link>

              <Link href="/export" className="secondary-btn">
                <Download size={18} />
                Export
              </Link>

              <LogoutButton />
            </div>
          </div>

          <div className="stats-grid">
            <Stat label="Inventory" value={money(inventoryValue)} />
            <Stat label="Sales" value={money(totalSales)} />
            <Stat label="Profit" value={money(totalProfit)} />
            <Stat label="Estimated Tax" value={money(estimatedTax)} />
            <Stat label="After Tax" value={money(profitAfterTax)} />
            <Stat label="Items in Stock" value={String(inStockItems.length)} />
          </div>
        </section>

          ...
</section>
<InventoryFilters items={items} />
        <section className="section-card">
          <h2>Inventory Items</h2>

          <div className="item-list">
            {items.length === 0 ? (
              <p className="empty-state">No items yet. Add your first purchase.</p>
            ) : (
              items.map((item) => (
                <Link
                  key={item.id}
                  href={`/items/${item.id}`}
                  className="item-row"
                >
                  <div>
                    <p className="serial">
                      {(item as any).inventory_number ||
                        item.serial_number ||
                        "No inventory number"}
                    </p>

                    <h3>{item.name || "Item"}</h3>

                    <p className="muted">
                      Cost: {money(itemCost(item))} · Status:{" "}
                      {item.status || "in_stock"}
                    </p>
                  </div>

                  <strong>{money(netProfit(item))}</strong>
                </Link>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="stat-card">
      <p>{label}</p>
      <strong>{value}</strong>
    </div>
  );
}
