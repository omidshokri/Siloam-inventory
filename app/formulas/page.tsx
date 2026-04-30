export const dynamic = "force-dynamic";
export const revalidate = 0;

import { createServerSupabase } from "@/lib/supabase-server";
import FormulaEditor from "@/components/FormulaEditor";

export default async function FormulasPage() {
  const supabase = createServerSupabase();

  const { data } = await supabase
    .from("custom_formulas")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <main className="app-shell">
      <div className="apple-container">
        <section className="hero-card">
          <p className="eyebrow">Formula engine</p>
          <h1>Custom Formulas</h1>
          <p className="muted">
            Create formulas for item pages, dashboard cards, and future reports.
          </p>
        </section>

        <FormulaEditor formulas={data || []} />
      </div>
    </main>
  );
}
