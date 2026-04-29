// @ts-nocheck

import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function cleanJson(text: string) {
  return text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const mimeType = file.type || "image/jpeg";
    const imageUrl = `data:${mimeType};base64,${base64}`;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `
Read this receipt or product image.

Return ONLY valid JSON. Do not use markdown. Do not use \`\`\`.

Use this exact structure:
{
  "category": "",
  "vendor": "",
  "purchase_date": "",
  "purchase_price": 0,
  "purchase_tax_paid": 0,
  "repair_cost": 0,
  "shipping_cost": 0,
  "platform_fees": 0,
  "serial_number": "",
  "name": "",
  "notes": ""
}

If something is missing, use "" or 0.
              `,
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl,
              },
            },
          ],
        },
      ],
    });

    const raw = response.choices[0]?.message?.content || "{}";
    const cleaned = cleanJson(raw);
    const parsed = JSON.parse(cleaned);

    return NextResponse.json(parsed);
  } catch (error: any) {
    console.error("Parse receipt error:", error);

    return NextResponse.json(
      { error: error.message || "Failed to parse image" },
      { status: 500 }
    );
  }
}
