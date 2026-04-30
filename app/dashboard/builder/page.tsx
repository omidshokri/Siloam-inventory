export const dynamic = "force-dynamic";
export const revalidate = 0;

import { createServerSupabase } from "@/lib/supabase-server";
import DashboardBuilder from "@/components/DashboardBuilder";

export default async function DashboardBuilderPage() {
  const supabase = createServerSupabase();

  const { data } = await supabase
    .from("dashboard_blocks")
    .select("*")
    .order("y", { ascending: true })
    .order("x", { ascending: true });

  return (
    <main className="app-shell">
      <div className="apple-container">
        <section className="hero-card">
          <p className="eyebrow">Dashboard builder</p>
          <h1>Build Your Home</h1>
          <p className="muted">
            Create and organize blocks for your custom dashboard.
          </p>
        </section>

        <DashboardBuilder blocks={data || []} />
      </div>
    </main>
  );
}
