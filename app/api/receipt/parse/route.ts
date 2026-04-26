import { NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";

const ParsedReceipt = z.object({
  product_name: z.string().default(""),
  purchase_date: z.string().default(""),
  vendor: z.string().default(""),
  subtotal: z.number().default(0),
  purchase_tax_paid: z.number().default(0),
  total_paid: z.number().default(0),
  notes: z.string().default(""),
});

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("receipt");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing receipt file" }, { status: 400 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "OPENAI_API_KEY is not configured" }, { status: 500 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const base64 = bytes.toString("base64");
  const mimeType = file.type || "image/jpeg";

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You extract structured purchase data from reseller receipts/screenshots. Return only valid JSON with keys: product_name, purchase_date, vendor, subtotal, purchase_tax_paid, total_paid, notes. Use numbers only for money values. If unknown, use empty string or 0.",
      },
      {
        role: "user",
        content: [
          { type: "text", text: "Parse this receipt or purchase screenshot." },
          { type: "image_url", image_url: { url: `data:${mimeType};base64,${base64}` } },
        ],
      },
    ],
    response_format: { type: "json_object" },
  });

  const text = completion.choices[0]?.message?.content ?? "{}";
  const parsed = ParsedReceipt.parse(JSON.parse(text));

  return NextResponse.json(parsed);
}
