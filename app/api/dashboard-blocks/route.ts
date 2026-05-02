import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const supabase = createServerSupabase();


const { data: existing } = await supabase
  .from("dashboard_blocks")
  .select("id");

const { data, error } = await supabase
  .from("dashboard_blocks")
  .insert({
    title: body.title,
    block_type: body.block_type,
    formula: body.formula,
    content: body.content,
    format: "money",
    x: 0,
    y: existing?.length || 0,
    w: 1,
    h: 1,
  })
  .select()
  .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Unknown server error" },
      { status: 500 }
    );
  }
}
