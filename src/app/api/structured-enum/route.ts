import { generateObject } from "ai";
import { config } from "dotenv";
import { ollama } from 'ollama-ai-provider-v2';
config({ path: ".env.local" });
export async function POST(req: Request) {
    try {
    
        const { text } = await req.json();
        console.log('text', text);
        //Enums available only with generateObject
        const result = await generateObject({
            model: ollama(process.env.CHAT_MODEL!),
            output: 'enum',
            enum: ['positive', 'negative', 'neutral'],
            prompt: `Classify the sentiment in this text: "${text}"`
        });
        return result.toJsonResponse();
    } catch (error) { 
        console.error('Error generating sentiment:', error);    
        return new Response('Failed to generate sentiment ', {status: 500});
    }
 }