import { NextResponse } from "next/server";
import { demoTutorEngine } from "@/lib/tutor-engine";
import type { LearningQuestion, YearLevel } from "@/lib/types";

type RequestBody = {
  questionText?: string;
  level?: YearLevel;
  imageDataUrl?: string;
  imageName?: string;
};

type GeminiResponse = {
  output_text?: string;
  outputs?: Array<{ type?: string; text?: string }>;
};

const yearLevels = new Set([
  "Prep",
  ...Array.from({ length: 12 }, (_, index) => `Year ${index + 1}`),
]);

export async function POST(request: Request) {
  const body = (await request.json()) as RequestBody;
  const level = yearLevels.has(body.level ?? "") ? body.level! : "Year 7";
  const questionText = body.questionText?.trim() ?? "";

  if (!questionText && !isAllowedImage(body.imageDataUrl)) {
    return NextResponse.json(
      { error: "Add a maths question or a supported image." },
      { status: 400 },
    );
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    const fallback = await demoTutorEngine.analyseQuestion({
      questionText,
      subject: "Mathematics",
      level,
      imageName: body.imageName,
    });
    return NextResponse.json({
      ...fallback,
      note: `${fallback.note} Live AI is ready but has not been enabled by the developer.`,
    });
  }

  try {
    const input: Array<Record<string, string>> = [
      {
        type: "text",
        text: [
          `Year level: ${level}.`,
          "You are SolvePath, an Australian mathematics tutor for Prep to Year 12.",
          "Identify the exact maths question from the supplied text or image.",
          "Teach without revealing the final answer in the hints.",
          "Keep language age-appropriate for the supplied year level.",
          "Never infer or repeat student names, school names, IDs, or other personal information visible in an image.",
          questionText ? `Question: ${questionText}` : "Read the mathematics question from the image.",
        ].join(" "),
      },
    ];
    if (body.imageDataUrl) {
      const image = parseImageDataUrl(body.imageDataUrl);
      if (!image) {
        return NextResponse.json(
          { error: "Use a PNG, JPEG, or WebP image." },
          { status: 400 },
        );
      }
      input.push({
        type: "image",
        data: image.data,
        mime_type: image.mimeType,
      });
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/interactions",
      {
        method: "POST",
        headers: {
          "x-goog-api-key": apiKey,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: process.env.GEMINI_MODEL ?? "gemini-3.6-flash",
          input,
          response_format: {
            type: "text",
            mime_type: "application/json",
            schema: {
              type: "object",
              required: [
                "topic",
                "prompt",
                "acceptedAnswers",
                "hints",
                "explanation",
              ],
              properties: {
                topic: { type: "string" },
                prompt: { type: "string" },
                acceptedAnswers: {
                  type: "array",
                  minItems: 1,
                  items: { type: "string" },
                },
                hints: {
                  type: "array",
                  minItems: 2,
                  maxItems: 5,
                  items: { type: "string" },
                },
                explanation: { type: "string" },
              },
            },
          },
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`Gemini returned ${response.status}`);
    }

    const raw = (await response.json()) as GeminiResponse;
    const outputText =
      raw.output_text ??
      raw.outputs?.find((item) => item.type === "text")?.text;

    if (!outputText) throw new Error("AI response did not contain text.");

    const generated = JSON.parse(outputText) as Pick<
      LearningQuestion,
      "topic" | "prompt" | "acceptedAnswers" | "hints" | "explanation"
    >;
    const question: LearningQuestion = {
      id: `ai-${crypto.randomUUID()}`,
      subject: "Mathematics",
      level,
      kind: "short-answer",
      source: body.imageDataUrl ? "uploaded" : "generated",
      ...generated,
    };

    return NextResponse.json({
      question,
      matchedAsSample: false,
      note: body.imageDataUrl
        ? "Gemini read the image and prepared guided working."
        : "Gemini analysed the question and prepared guided working.",
    });
  } catch {
    const fallback = await demoTutorEngine.analyseQuestion({
      questionText,
      subject: "Mathematics",
      level,
      imageName: body.imageName,
    });
    return NextResponse.json({
      ...fallback,
      note: `${fallback.note} Live analysis failed, so SolvePath safely used a built-in example.`,
    });
  }
}

function parseImageDataUrl(value: string) {
  const match = value.match(
    /^data:(image\/(?:png|jpeg|webp));base64,([A-Za-z0-9+/=]+)$/,
  );
  if (!match) return null;
  return {
    mimeType: match[1],
    data: match[2],
  };
}

function isAllowedImage(value?: string) {
  if (!value || value.length > 12_000_000) return false;
  return /^data:image\/(png|jpeg|webp);base64,/.test(value);
}
