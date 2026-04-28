import Link from "next/link";
import { PlusCircle, Download } from "lucide-react";
import { createServerSupabase } from "@/lib/supabase-server";
import { money, itemCost, netProfit } from "@/lib/calculations";
import PieChartBreakdown from "@/components/PieChartBreakdown";
import BarChartProfit from "@/components/BarChartProfit";

type InventoryItem = {
  id: string;
  name: string;
  category?: string | null;
  serial_number?: string | null;
  inventory_number?: string | null;
  status?: string | null;
  purchase_price?: number | null;
  purchase_tax_paid?: number | null;
  repair_cost?: number | null;
  shipping_cost?: number | null;
  platform_fees?: number | null;
  sale_price?: number | null;
  sales_tax_collected?: number | null;
  selling_fees?: number | null;
  sale_date?: string | null;
  created_at?: string | null;
};

const TAX_RATE = 0.25;

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="stat-card">
      <p>{label}</p>
      <strong>{value}</strong>
    </div>
  );
}

export default async function DashboardPage() {
  const supabase = createServerSupabase();

  const { data, error } = await supabase
    .from("inventory_items")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
  }

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

  const estimatedTax = totalProfit > 0 ? totalProfit * TAX_RATE : 0;
  const profitAfterTax = totalProfit - estimatedTax;

  const salesTaxCollected = soldItems.reduce(
    (sum, item) => sum + Number(item.sales_tax_collected ?? 0),
    0
  );

  const pieChartData = [
    { name: "Purchase Price", value: inventoryValue },
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
      estimatedProfitTax: profit > 0 ? profit * TAX_RATE : 0,
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
                <PlusCircle size={18} />
                Add
              </Link>

              <a href="/api/export" className="secondary-btn">
                <Download size={18} />
                Export
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
                        {item.inventory_number ||
                          item.serial_number ||
                          "No inventory number"}
                      </p>

                      <h3>{item.name}</h3>

                      <p className="muted">
                        Cost: {money(Number(item.purchase_price ?? 0))} · Status:{" "}
                        {item.status || "in stock"}
                      </p>
                    </div>
                  </Link>

                  <div className="item-actions">
                    {item.status === "sold" ? (
                      <>
                        <span className="profit-pill">
                          Profit {money(netProfit(item))}
                        </span>

                        <Link href={`/items/${item.id}/sell`} className="edit-btn">
                          Edit Sale
                        </Link>
                      </>
                    ) : (
                      <Link href={`/items/${item.id}/sell`} className="sell-btn">
                        Mark as Sold
                      </Link>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
