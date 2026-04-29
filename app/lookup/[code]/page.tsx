export const dynamic = "force-dynamic";
export const revalidate = 0;

import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase-server";

export default async function LookupPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const cleanCode = decodeURIComponent(code).trim();

  const supabase = createServerSupabase();

  const { data } = await supabase
    .from("inventory_items")
    .select("id, inventory_number, serial_number")
    .or(
      `inventory_number.eq.${cleanCode},serial_number.eq.${cleanCode},inventory_number.ilike.%${cleanCode}%`
    )
    .limit(1)
    .maybeSingle();

  if (!data) {
    return (
      <main className="app-shell">
        <div className="apple-container">
          <section className="hero-card">
            <h1>Item not found</h1>
            <p className="muted">{cleanCode}</p>
          </section>
        </div>
      </main>
    );
  }

  redirect(`/items/${data.id}`);
}
