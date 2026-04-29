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
  const cleanCode = decodeURIComponent(code || "").trim();

  if (!cleanCode) {
    return (
      <div style={{ padding: 40 }}>
        <h2>Missing code</h2>
      </div>
    );
  }

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
      <div style={{ padding: 40 }}>
        <h2>Item not found</h2>
        <p>{cleanCode}</p>
      </div>
    );
  }

  redirect(`/items/${data.id}`);
}
