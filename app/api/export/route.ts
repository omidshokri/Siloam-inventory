import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";

export async function GET(req: Request) {
  const supabase = createServerSupabase();

  const { searchParams } = new URL(req.url);

  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const type = searchParams.get("type") || "all";

  let query = supabase
    .from("inventory_items")
    .select("*")
    .order("created_at", { ascending: false });

  // 📅 فیلتر تاریخ
  if (from) {
    query = query.gte("created_at", from);
  }

  if (to) {
    query = query.lte("created_at", to);
  }

  // 📦 فیلتر نوع
  if (type === "purchases") {
    query = query.eq("status", "in_stock");
  }

  if (type === "sales") {
    query = query.eq("status", "sold");
  }

  if (type === "stock") {
    query = query.eq("status", "in_stock");
  }

  const { data, error } = await query;

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
      item.purchase_tax_paid,
      item.status,
      item.created_at,
    ];
  });

  const csv =
    [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=inventory.csv",
    },
  });
}
