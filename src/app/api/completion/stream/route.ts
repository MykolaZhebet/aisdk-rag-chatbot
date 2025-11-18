import { streamText } from 'ai';
import { config } from "dotenv";
import { ollama } from 'ollama-ai-provider-v2';
config({ path: ".env.local" });

export async function POST(req: Request) {
    try {

    
    const { prompt } = await req.json();
    const result = streamText({
        model: ollama(process.env.CHAT_MODEL!),
        prompt
    });

        return result.toUIMessageStreamResponse();
    } catch (error) {
        console.log('Error streaming text', error);
        return new Response('Failed to stream text', {status: 500})
    }
}