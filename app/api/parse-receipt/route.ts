import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

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

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text:
                "Extract purchase/product information from this image. Return only valid JSON. If something is not visible, use an empty string or 0. Categories must be one of: MacBook, iMac / Mac mini, iPhone, iPad, Apple Watch, AirPods, Apple Pencil, Magic Keyboard / Keyboard, Mouse / Trackpad, Monitor / Display, PlayStation, Nintendo, Xbox, Laptop - Windows, Printer, Camera / Drone, Accessories, Other.",
            },
            {
              type: "input_image",
              image_url: `data:${mimeType};base64,${base64}`,
            },
          ],
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "purchase_extract",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              category: { type: "string" },
              serial_number: { type: "string" },
              vendor: { type: "string" },
              purchase_date: { type: "string" },
              purchase_price: { type: "number" },
              purchase_tax_paid: { type: "number" },
              repair_cost: { type: "number" },
              shipping_cost: { type: "number" },
              platform_fees: { type: "number" },
              notes: { type: "string" },
            },
            required: [
              "category",
              "serial_number",
              "vendor",
              "purchase_date",
              "purchase_price",
              "purchase_tax_paid",
              "repair_cost",
              "shipping_cost",
              "platform_fees",
              "notes",
            ],
          },
        },
      },
    });

    const text = response.output_text;
    const parsed = JSON.parse(text);

    return NextResponse.json(parsed);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || "Failed to parse image" },
      { status: 500 }
    );
  }
}
