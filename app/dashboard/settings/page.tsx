export const dynamic = "force-dynamic";
export const revalidate = 0;

import { createServerSupabase } from "@/lib/supabase-server";
import DashboardWidgetEditor from "@/components/DashboardWidgetEditor";

export default async function DashboardSettingsPage() {
  const supabase = createServerSupabase();

  const { data } = await supabase
    .from("dashboard_widgets")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <main className="app-shell">
      <div className="apple-container">
        <section className="hero-card">
          <p className="eyebrow">Dashboard settings</p>
          <h1>Customize Cards</h1>
          <p className="muted">Edit titles, formulas, formats, and visibility.</p>
        </section>

        <DashboardWidgetEditor widgets={data || []} />
      </div>
    </main>
  );
}
