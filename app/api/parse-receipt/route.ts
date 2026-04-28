// @ts-nocheck

import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `
Extract receipt info and return ONLY JSON:

{
  "category": "",
  "vendor": "",
  "purchase_date": "",
  "purchase_price": 0,
  "tax": 0
}
              `,
            },
            {
              type: "input_image",
              image_base64: base64,
            },
          ],
        },
      ],
    });

    const text = response.output_text || "{}";

    return NextResponse.json(JSON.parse(text));
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
