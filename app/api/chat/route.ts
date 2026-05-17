import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";

const hf = createOpenAI({
  baseURL: "https://api-inference.huggingface.co/v1",
  apiKey: process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY ?? "",
});

export const runtime = "edge";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: hf("mistralai/Mistral-7B-Instruct-v0.1"),
    messages,
  });

  return result.toUIMessageStreamResponse();
}
