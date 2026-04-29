import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase-server";

export default async function LookupPage({ params }: any) {
  const code = params.code;

  try {
    const supabase = createServerSupabase();

    const { data } = await supabase
      .from("inventory_items")
      .select("*")
      .eq("inventory_number", code)
      .single();

    if (!data) {
      return (
        <div style={{ padding: 40 }}>
          <h2>Item not found</h2>
          <p>{code}</p>
        </div>
      );
    }

    redirect(`/items/${data.id}`);
  } catch (e) {
    return (
      <div style={{ padding: 40 }}>
        <h2>Error loading item</h2>
        <p>{code}</p>
      </div>
    );
  }
}
