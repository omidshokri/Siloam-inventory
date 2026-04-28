// @ts-nocheck

import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const mimeType = file.type || "image/jpeg";
    const imageUrl = `data:${mimeType};base64,${base64}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `
Extract purchase/product information from this image.

Return ONLY valid JSON with this exact structure:
{
  "category": "",
  "serial_number": "",
  "vendor": "",
  "purchase_date": "",
  "purchase_price": 0,
  "purchase_tax_paid": 0,
  "repair_cost": 0,
  "shipping_cost": 0,
  "platform_fees": 0,
  "notes": ""
}

If something is not visible, use "" or 0.
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

    const text = response.choices[0]?.message?.content || "{}";
    const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
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
