import {
    streamText,
    UIMessage,
    convertToModelMessages,
    tool,
    stepCountIs,
    experimental_generateImage as generateImage,
    UIDataTypes,
    InferUITools
} from 'ai';
import { z } from 'zod';
import { config } from "dotenv";
import { ollama } from 'ollama-ai-provider-v2';
config({ path: ".env.local" });

const tools = {
    generateImage: tool({
        description: 'Generate an image from a prompt',
        inputSchema: z.object({
            prompt: z.string().describe('The prompt to generate image for')
        }),
        execute: async ({ prompt }) => {
            const { image } = await generateImage({
                model: ollama.imageModel(process.env.IMAGE_MODEL!),
                prompt,
                size: '600x600',
                providerOptions: {
                    ollama: {
                        style: 'vivid',
                        quality: 'hd'
                    }
                }
            })
            return image.base64;
        },
        //this function recieves result of tool execute function
        toModelOutput: (result) => {
            return {
                type: 'content',
                value: [
                    {
                        type: 'text',
                        text: 'generated image in base64'
                    }
                ]
            }
        }
    })
}

export type ChatTools = InferUITools<typeof tools>
export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>
export async function POST(req: Request) {
    try {
        //Array of all history
        const { messages }: { messages: ChatMessage[] } = await req.json();
    
        const result = streamText({
            model: ollama(process.env.CHAT_MODEL!),
            messages: convertToModelMessages(messages),
            tools,
            stopWhen: stepCountIs(2)
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

        return result.toUIMessageStreamResponse();
    } catch (error) {
        console.log('Error streaming text', error);
        return new Response('Failed to stream text', {status: 500})
    }
}