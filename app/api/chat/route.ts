import { createGroq } from "@ai-sdk/groq";
import { streamText, convertToModelMessages, UIMessage } from "ai";

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY ?? "",
});

export const runtime = "edge";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = await streamText({
    model: groq("llama-3.3-70b-versatile"),
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
