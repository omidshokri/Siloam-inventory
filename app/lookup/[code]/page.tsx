export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase-server";

export default async function Page({
  params,
}: {
  params: { code: string };
}) {
  try {
    const code = decodeURIComponent(params.code);

    const supabase = createServerSupabase();

    const { data, error } = await supabase
      .from("inventory_items")
      .select("id, inventory_number")
      .ilike("inventory_number", `%${code}%`)
      .limit(1)
      .single();

    if (error || !data) {
      return (
        <div style={{ padding: 20 }}>
          <h2>Item not found</h2>
          <p>{code}</p>
        </div>
      );
    }

    redirect(`/items/${data.id}`);
  } catch (e) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Crash 😬</h2>
        <pre>{String(e)}</pre>
      </div>
    );
  }
}
