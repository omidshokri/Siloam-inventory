import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase-server";

export default async function LookupPage({
  params,
}: {
  params: { code: string };
}) {
  const supabase = createServerSupabase();

  const code = params.code;

  const { data, error } = await supabase
    .from("inventory_items")
    .select("*")
    .eq("inventory_number", code)
    .single();

  if (error || !data) {
    return (
      <div style={{ padding: 40 }}>
        <h2>Item not found</h2>
        <p>{code}</p>
      </div>
    );
  }

  redirect(`/items/${data.id}`);
}
