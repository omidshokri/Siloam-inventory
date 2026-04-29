export const dynamic = "force-dynamic";
export const revalidate = 0;

import { createServerSupabase } from "@/lib/supabase-server";
import InventoryFilters from "@/components/InventoryFilters";

export default async function ProductsPage() {
  const supabase = createServerSupabase();

  const { data } = await supabase
    .from("inventory_items")
    .select("*")
    .order("created_at", { ascending: false });

  const items = data || [];

  return (
    <main className="app-shell">
      <div className="apple-container">
        <InventoryFilters items={items} />
      </div>
    </main>
  );
}
