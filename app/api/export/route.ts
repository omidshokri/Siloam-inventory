import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";

export async function GET() {
  const supabase = createServerSupabase();

  const { data, error } = await supabase
    .from("inventory_items")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const items = data ?? [];

  // CSV Header
  const headers = [
    "Name",
    "Purchase Price",
    "Sale Price",
    "Profit",
    "Sales Tax",
    "Status",
    "Date",
  ];

  const rows = items.map((item) => {
    const profit =
      (item.sale_price || 0) -
      (item.purchase_price || 0) -
      (item.purchase_tax_paid || 0) -
      (item.repair_cost || 0) -
      (item.shipping_cost || 0) -
      (item.platform_fees || 0) -
      (item.selling_fees || 0);

    return [
      item.name,
      item.purchase_price,
      item.sale_price,
      profit,
      item.sales_tax_collected,
      item.status,
      item.sale_date || item.created_at,
    ].join(",");
  });

  const csv = [headers.join(","), ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=inventory.csv",
    },
  });
}
