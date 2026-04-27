import Link from "next/link";
import { PlusCircle, Download } from "lucide-react";
import { createServerSupabase } from "@/lib/supabase-server";
import { itemCost, money, netProfit } from "@/lib/calculations";
import type { InventoryItem } from "@/lib/types";
import PieChartBreakdown from "@/components/PieChartBreakdown";
import BarChartProfit from "@/components/BarChartProfit";

const TAX_RATE = 0.25;

export default async function DashboardPage() {
  const supabase = createServerSupabase();

  const { data } = await supabase
    .from("inventory_items")
    .select("*")
    .order("created_at", { ascending: false });

  const items = (data ?? []) as InventoryItem[];

  const soldItems = items.filter((item) => item.status === "sold");
  const inStockItems = items.filter((item) => item.status === "in_stock");

  const inventoryValue = inStockItems.reduce((sum, item) => sum + itemCost(item), 0);
  const totalSales = soldItems.reduce((sum, item) => sum + Number(item.sale_price ?? 0), 0);
  const totalProfit = soldItems.reduce((sum, item) => sum + netProfit(item), 0);
  const salesTaxCollected = soldItems.reduce(
    (sum, item) => sum + Number(item.sales_tax_collected ?? 0),
    0
  );

  const estimatedTax = totalProfit * TAX_RATE;
  const profitAfterTax = totalProfit - estimatedTax;

  const pieChartData = [
    {
      name: "Purchase Price",
      value: items.reduce((sum, item) => sum + Number(item.purchase_price ?? 0), 0),
    },
    { name: "Profit", value: totalProfit },
    { name: "Estimated Profit Tax", value: estimatedTax },
    { name: "Sales Tax Collected", value: salesTaxCollected },
  ];

  const barChartData = items.map((item) => {
    const profit = item.status === "sold" ? netProfit(item) : 0;

    return {
      name: item.name || "Item",
      purchase: Number(item.purchase_price ?? 0),
      profit,
      estimatedProfitTax: profit * TAX_RATE,
      salesTaxCollected: Number(item.sales_tax_collected ?? 0),
    };
  });

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
                <PlusCircle size={18} /> Add
              </Link>

              <a href="/api/export" className="secondary-btn">
                <Download size={18} /> Export
              </a>
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

        <section className="section-card">
          <div className="charts-grid">
            <div className="chart-box">
              <h2>Business Breakdown</h2>
              <PieChartBreakdown data={pieChartData} />
            </div>

            <div className="chart-box">
              <h2>Item Comparison</h2>
              <BarChartProfit data={barChartData} />
            </div>
          </div>
        </section>

        <section className="section-card">
          <h2>Inventory Items</h2>

          <div className="item-list">
            {items.length === 0 ? (
              <p className="empty-state">No items yet. Add your first purchase.</p>
            ) : (
              items.map((item) => (
                <div key={item.id} className="item-row">
                  <Link href={`/items/${item.id}`} className="item-title-link">
                    <div>
                      <p className="serial">
                        {item.inventory_number || item.serial_number || "No inventory number"}
                      </p>

                      <h3>{item.name}</h3>

                      <p className="muted">
                        Cost: {money(itemCost(item))} • Status:{" "}
                        {item.status.replace("_", " ")}
                      </p>
                    </div>
                  </Link>

                  {item.status === "in_stock" ? (
                    <Link href={`/items/${item.id}/sell`} className="sell-btn">
                      Mark as Sold
                    </Link>
                  ) : (
                    <div className="item-actions">
                      <span className="profit-pill">
                        Profit {money(netProfit(item))}
                      </span>

                      <Link href={`/items/${item.id}/sell`} className="edit-btn">
                        Edit Sale
                      </Link>
                    </div>
                  )}
                </div>
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
