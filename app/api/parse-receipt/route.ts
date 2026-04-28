import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json(
        { error: "No image provided" },
        { status: 400 }
      );
    }

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `
Extract the following information from this receipt:

- Product name
- Serial number (if available)
- Category (Laptop, Phone, Accessory, etc.)
- Purchase price
- Tax paid

Return the result as JSON like this:
{
  "name": "",
  "serial": "",
  "category": "",
  "price": "",
  "tax": ""
}
              `,
            },
            {
              type: "input_image",
              image_url: {
                url: image,
              },
            },
          ],
        },
      ],
    });

    const outputText =
      response.output_text ||
      JSON.stringify(response.output[0]?.content || "");

    return NextResponse.json({
      success: true,
      data: outputText,
    });
  } catch (error: any) {
    console.error("Error parsing receipt:", error);

    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
