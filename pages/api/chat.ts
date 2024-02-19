import { HfInference } from "@huggingface/inference";
import { HuggingFaceStream, StreamingTextResponse } from "ai";

const Hf = new HfInference(process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY);

export const runtime = "edge";

function buildPrompt(
  messages: { content: string; role: "system" | "user" | "assistant" }[],
) {
  return messages
    .map(({ content }) => {
      return `[INST¯${content}[/INST]`;
    })
    .join("");
}

export default async function POST(req: Request) {
  // Extract the `messages` from the body of the request
  const { messages } = await req.json();

  const response = await Hf.textGenerationStream({
    model: "mistralai/Mistral-7B-Instruct-v0.1",
    inputs: buildPrompt(messages),
    parameters: {
      max_new_tokens: 1000,
      temperature: 0.2,
      repetition_penalty: 1,
      truncate: 1000,
      return_full_text: false,
    },
  });

  const stream = HuggingFaceStream(response, {
    onStart: async () => {
      console.log("Start");
    },
    onToken: async (token: string) => {
      // console.log(token);
    },
    onCompletion: async (completion: string) => {
      console.log(completion);
    },
  });

  return new StreamingTextResponse(stream);
}
