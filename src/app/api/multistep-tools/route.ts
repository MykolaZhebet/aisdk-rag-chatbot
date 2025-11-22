import {
    streamText,
    UIMessage,
    InferUITools,
    UIDataTypes,
    convertToModelMessages,
    tool,
    stepCountIs,
} from 'ai';
import { config } from "dotenv";
import z from 'zod';
import { ollama } from 'ollama-ai-provider-v2';
config({ path: ".env.local" });

const tools = {
    getLocation: tool({
        description: 'Get location of the user',
        inputSchema: z.object({
            name: z.string().describe('The name of the user')
        }),
        execute: async({ name }) => {
            if ('Bruce Wayne' === name) {
                return 'Gothm';
            } else if ('Clark Kent' === name) {
                return 'Metropolis'
            } else {
                return 'Unknown location';
            }
        }
    }),
    getWeather: tool({
        description: 'Get the weather for a location',
        inputSchema: z.object({
            city: z.string().describe('The city to get the weather for')
        }),
        execute: async ({ city }) => {
            console.log('AI tool invoke: try to fetch weather for city:', city);
            if (city === 'city One') {
                return '70F and cloudy'
            } else if (city === 'city Two') {
                return '80F and sunny'
            } else {
                return `Unknown weather for city ${city}`
            }
        }
    })
}

export type ChatTools = InferUITools<typeof tools>;
export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>
export async function POST(req: Request) {
    try {
        console.log('INIT post request for tools ');
        //Array of all history
        //ChatMessage type is needed to be sure that UIMessage support tools
        const { messages }: { messages: ChatMessage[] } = await req.json();
    
        const result = streamText({
            model: ollama(process.env.CHAT_MODEL!),
            tools,
            //Declare stop and return result after 1)calling weather tool and
            //2)processing result and returning to the user - needed because text should be returned as is
            stopWhen: stepCountIs(3),
            messages: convertToModelMessages(messages),
        });

        return result.toUIMessageStreamResponse();
    } catch (error) {
        console.log('Error streaming text', error);
        return new Response('Failed to stream text', {status: 500})
    }
}