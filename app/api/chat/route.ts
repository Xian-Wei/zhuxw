import { createGroq } from "@ai-sdk/groq";
import { streamText } from "ai";

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY ?? "",
});

export const runtime = "edge";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: groq("llama-3.3-70b-versatile"),
    messages,
  });

  return result.toTextStreamResponse();
}
