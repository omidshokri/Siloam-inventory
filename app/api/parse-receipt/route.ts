import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json({ error: "No image" }, { status: 400 });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Extract product name, serial number, category, price, tax from this receipt and return JSON.`,
            },
            {
              type: "image_url",
              image_url: {
                url: image,
              },
            },
          ],
        },
      ],
    });

    return NextResponse.json({
      success: true,
      data: response.choices[0].message.content,
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || "error" },
      { status: 500 }
    );
  }
}
