export const dynamic = "force-dynamic";
export const revalidate = 0;

import BottomNav from "@/components/BottomNav";
import Link from "next/link";
import { PlusCircle, Download } from "lucide-react";
import { createServerSupabase } from "@/lib/supabase-server";
import { money, netProfit, itemCost } from "@/lib/calculations";
import PieChartBreakdown from "@/components/PieChartBreakdown";
import BarChartProfit from "@/components/BarChartProfit";
import LogoutButton from "../components/LogoutButton";

export default async function DashboardPage() {
  const supabase = createServerSupabase();

  const { data } = await supabase
    .from("inventory_items")
    .select("*")
    .order("created_at", { ascending: false });

  const items = data || [];

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
    { name: "Tax", value: estimatedTax },
  ];

  const barChartData = items.map((item) => ({
    name: item.name || "Item",
    cost: itemCost(item),
    profit: netProfit(item),
  }));

  return (
    <main className="app-shell">
      <div className="apple-container">

        {/* 🔝 Header */}
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
            <Stat label="Tax" value={money(estimatedTax)} />
            <Stat label="After Tax" value={money(profitAfterTax)} />
            <Stat label="In Stock" value={String(inStockItems.length)} />
          </div>
        </section>

        {/* 📊 Charts */}
        <section className="section-card">
          <div className="charts-grid">
            <div className="chart-box">
              <h2>Breakdown</h2>
              <PieChartBreakdown data={pieChartData} />
            </div>

            <div className="chart-box">
              <h2>Comparison</h2>
              <BarChartProfit data={barChartData} />
            </div>
          </div>
        </section>

        {/* 🔍 Filters + List */}

      </div>
<BottomNav />
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
