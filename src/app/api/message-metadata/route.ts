import { streamText, UIMessage, convertToModelMessages } from 'ai';
import { config } from "dotenv";
import { ollama } from 'ollama-ai-provider-v2';
config({ path: ".env.local" });
import type { MyUIMessage } from './types';
export async function POST(req: Request) {
    try {
        //Array of all history
        const { messages }: { messages: MyUIMessage[] } = await req.json();
    
        const result = streamText({
            model: ollama(process.env.CHAT_MODEL!),
            // system: 'You are a helpuful assistant',
            messages: convertToModelMessages(messages)
        });

        result.usage.then((usage) => {
            console.log(
                {
                    inputTokens: usage.inputTokens,
                    outputTokens: usage.outputTokens,
                    totalTokens: usage.totalTokens
                }

            );
        });

        return result.toUIMessageStreamResponse({
            messageMetadata: ({ part }) => {
                if(part.type === 'start') {
                    return {
                        createdAt: Date.now()
                    }
                }

                if (part.type === 'finish') {
                    console.log('metadata_tokens:' + part.totalUsage);
                    return {
                        totalTokens: part.totalUsage.totalTokens,
                    }
                }
            }
        });
    } catch (error) {
        console.log('Error streaming text', error);
        return new Response('Failed to stream text', {status: 500})
    }
}