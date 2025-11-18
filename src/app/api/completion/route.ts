import { generateText } from "ai";
import { config } from "dotenv";
import { ollama } from 'ollama-ai-provider-v2';
config({ path: ".env.local" });
export async function POST(req: Request) {
    const { prompt } = await req.json();
    try {
        const { text } = await generateText({
            // model: openapi("gpt-4.1-nanao"),
            model: ollama(process.env.CHAT_MODEL!),
            // prompt: 'Explain what an LLM is in simple terms'
            prompt: prompt
        });
        return Response.json({ text });
    } catch (err) {
        return Response.json({Error: 'Failed to generate text'}, {status: 500})
    }
}