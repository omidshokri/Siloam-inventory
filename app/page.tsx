import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
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
};

type StatProps = {
  label: string;
  value: string;
};

function Stat({ label, value }: StatProps) {
  return (
    <div className="stat-card">
      <p>{label}</p>
      <strong>{value}</strong>
    </div>
  );
}

function money(value: number) {
  return `$${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function numberValue(value: number | null | undefined) {
  return Number(value ?? 0);
}

function netProfit(item: InventoryItem) {
  const salePrice = numberValue(item.sale_price);
  const purchasePrice = numberValue(item.purchase_price);
  const purchaseTax = numberValue(item.purchase_tax_paid);
  const repairCost = numberValue(item.repair_cost);
  const shippingCost = numberValue(item.shipping_cost);
  const platformFees = numberValue(item.platform_fees);
  const sellingFees = numberValue(item.selling_fees);

  return (
    salePrice -
    purchasePrice -
    purchaseTax -
    repairCost -
    shippingCost -
    platformFees -
    sellingFees
  );
}

async function getItems(): Promise<InventoryItem[]> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from("inventory_items")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return (data || []) as InventoryItem[];
}

export default async function Page() {
  const items = await getItems();

  const inStockItems = items.filter((item) => item.status !== "sold");
  const soldItems = items.filter((item) => item.status === "sold");

  const totalSales = soldItems.reduce(
    (sum, item) => sum + numberValue(item.sale_price),
    0
  );

  const totalProfit = soldItems.reduce(
    (sum, item) => sum + netProfit(item),
    0
  );

  const TAX_RATE = 0.25;
  const estimatedTax = totalProfit > 0 ? totalProfit * TAX_RATE : 0;
  const profitAfterTax = totalProfit - estimatedTax;

  const salesTaxCollected = soldItems.reduce(
    (sum, item) => sum + numberValue(item.sales_tax_collected),
    0
  );

  const pieChartData = [
    { name: "Profit", value: totalProfit },
    { name: "Estimated Tax", value: estimatedTax },
    { name: "After Tax", value: profitAfterTax },
    { name: "Sales Tax Collected", value: salesTaxCollected },
  ];

  const barChartData = items.map((item) => {
    const profit = item.status === "sold" ? netProfit(item) : 0;

    return {
      name: item.name || "Item",
      purchase: numberValue(item.purchase_price),
      profit,
      estimatedProfitTax: profit > 0 ? profit * TAX_RATE : 0,
      salesTaxCollected: numberValue(item.sales_tax_collected),
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
                + Add
              </Link>

              <Link href="/api/export" className="secondary-btn">
                Export
              </Link>
            </div>
          </div>

          <div className="stats-grid">
            <Stat label="Inventory" value={money(0)} />
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
                        Cost: {money(numberValue(item.purchase_price))} · Status:{" "}
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

                        <Link
                          href={`/items/${item.id}/sell`}
                          className="edit-btn"
                        >
                          Edit Sale
                        </Link>
                      </>
                    ) : (
                      <Link
                        href={`/items/${item.id}/sell`}
                        className="sell-btn"
                      >
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
