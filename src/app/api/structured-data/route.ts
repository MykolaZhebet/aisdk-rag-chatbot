import { streamObject } from "ai";
import { config } from "dotenv";
import { ollama } from 'ollama-ai-provider-v2';
import { recipeSchema } from "./schema";
config({ path: ".env.local" });
export async function POST(req: Request) {
    try {
    
        const { dish } = await req.json();
        console.log('dish is', dish);
        const result = streamObject({
            model: ollama(process.env.CHAT_MODEL!),
            // output: 'array',
            schema: recipeSchema,
            prompt: `Generate a recipe for ${dish}`
        });
        return result.toTextStreamResponse();
    } catch (error) { 
        console.error('Error generating json schema of recipe:', error);    
        return new Response('Failed to generate recipe', {status: 500});
    }
 }