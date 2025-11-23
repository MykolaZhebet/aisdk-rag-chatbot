import { streamText, UIMessage, convertToModelMessages } from 'ai';
import { config } from "dotenv";
import { ollama } from 'ollama-ai-provider-v2';
config({ path: ".env.local" });
import { openai } from './models';
export async function POST(req: Request) {
    try {
        //Array of all history
        const { messages }: { messages: UIMessage[] } = await req.json();
    
        const result = streamText({
            model: openai.languageModel('reasoning'),
            // model: ollama(process.env.CHAT_MODEL!),
            // system: 'You are a helpuful assistant',
            messages: convertToModelMessages(messages),
        });

        return result.toUIMessageStreamResponse();
    } catch (error) {
        console.log('Error streaming text', error);
        return new Response('Failed to stream text', {status: 500})
    }
}

