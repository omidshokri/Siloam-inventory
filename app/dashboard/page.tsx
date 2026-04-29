export const dynamic = "force-dynamic";
export const revalidate = 0;

import { createServerSupabase } from "@/lib/supabase-server";
import { itemCost, money, netProfit } from "@/lib/calculations";

const formulaLabels: Record<string, string> = {
  inventoryValue: "Inventory Value",
  totalSales: "Total Sales",
  totalProfit: "Total Profit",
  estimatedTax: "Estimated Tax",
  profitAfterTax: "Profit After Tax",
  itemsInStock: "Items in Stock",
  soldItems: "Sold Items",
  totalItems: "Total Items",
};

function formatValue(value: number, format: string) {
  if (format === "money") return money(value);
  if (format === "percent") return `${value.toFixed(2)}%`;
  return String(value);
}

export default async function DashboardPage() {
  const supabase = createServerSupabase();

  const { data: itemsData } = await supabase
    .from("inventory_items")
    .select("*");

  const { data: widgetsData } = await supabase
    .from("dashboard_widgets")
    .select("*")
    .eq("enabled", true)
    .order("sort_order", { ascending: true });

  const items = itemsData || [];
  const widgets = widgetsData || [];

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

  const estimatedTax = totalProfit > 0 ? totalProfit * 0.25 : 0;
  const profitAfterTax = totalProfit - estimatedTax;

  const values: Record<string, number> = {
    inventoryValue,
    totalSales,
    totalProfit,
    estimatedTax,
    profitAfterTax,
    itemsInStock: inStockItems.length,
    soldItems: soldItems.length,
    totalItems: items.length,
  };

  return (
    <main className="app-shell">
      <div className="apple-container">
        <section className="hero-card">
          <p className="eyebrow">Custom dashboard</p>
          <h1>Dashboard</h1>
          <p className="muted">
            These cards are controlled by your dashboard widgets.
          </p>
        </section>

        <section className="section-card">
          <div className="stats-grid">
            {widgets.map((widget) => (
              <div key={widget.id} className="stat-card">
                <p>{widget.title}</p>
                <strong>
                  {formatValue(values[widget.formula_key] ?? 0, widget.format)}
                </strong>
                <small className="muted">
                  {formulaLabels[widget.formula_key] || widget.formula_key}
                </small>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
