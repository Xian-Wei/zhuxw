import { HfInference } from "@huggingface/inference";
import { HuggingFaceStream, StreamingTextResponse } from "ai";

const Hf = new HfInference(process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY);

export const runtime = "edge";

function buildPrompt(
  messages: { content: string; role: "system" | "user" | "assistant" }[],
) {
  return messages
    .map(({ content, role }) => {
      if (role === "user") {
        return `${content}<|endoftext|>`;
      }
    })
    .join("");
}

export default async function POST(req: Request) {
  // Extract the `messages` from the body of the request
  const { messages } = await req.json();

  const response = await Hf.textGenerationStream({
    model: "HuggingFaceH4/zephyr-7b-beta",
    inputs: buildPrompt(messages),
    parameters: {
      max_new_tokens: 1000,
      // @ts-ignore (this is a valid parameter specifically in OpenAssistant models)
      typical_p: 0.2,
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
