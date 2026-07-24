import { NextResponse } from "next/server";
import { getChatGPTUser } from "@/app/chatgpt-auth";

export async function GET() {
  const user = await getChatGPTUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  return NextResponse.json({
    ai: {
      configured: Boolean(process.env.GEMINI_API_KEY),
      provider: "Google Gemini",
      model: process.env.GEMINI_MODEL ?? "gemini-3.6-flash",
      endpoint: "/api/tutor/analyse",
    },
    ocr: {
      configured: Boolean(process.env.GEMINI_API_KEY),
      provider: "Gemini multimodal vision",
      accepted: ["PNG", "JPEG", "WebP"],
      maximumSizeMb: 8,
    },
    storage: {
      configured: false,
      provider: "Not connected",
    },
    authentication: {
      configured: true,
      provider: "ChatGPT sign-in",
    },
  });
}
