import { streamObject } from "ai";
import { config } from "dotenv";
import { ollama } from 'ollama-ai-provider-v2';
import { pokemonSchema } from "./schema";
config({ path: ".env.local" });
export async function POST(req: Request) {
    try {
    
        const { type } = await req.json();
        console.log('type', type);
        const result = streamObject({
            model: ollama(process.env.CHAT_MODEL!),
            output: 'array',
            schema: pokemonSchema,
            prompt: `Generate a list of 5 ${type} type pokemon`
        });
        return result.toTextStreamResponse();
    } catch (error) { 
        console.error('Error generating json schema of pokemonSchema:', error);    
        return new Response('Failed to generate pokemon array', {status: 500});
    }
 }