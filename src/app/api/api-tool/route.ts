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
    getWeather: tool({
        description: 'Get the weather for a location',
        inputSchema: z.object({
            city: z.string().describe('The city to get the weather for')
        }),
        execute: async ({ city }) => {
            console.log('AI tool invoke: try to fetch weather for city:', city);

            const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${city}`);
            const data = await response.json();
            const weatherData = {
                location: {
                    name: data.location.name,
                    country: data.location.country,
                    localtime: data.location.localtime,
                },
                current: {
                    temp_c: data.curent.temp_c,
                    condition: {
                        text: data.current.condition.text,
                        codoe: data.current.condition.code
                    }
                }
            }
            return weatherData

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
            stopWhen: stepCountIs(2),
            messages: convertToModelMessages(messages),
        });

        return result.toUIMessageStreamResponse();
    } catch (error) {
        console.log('Error streaming text', error);
        return new Response('Failed to stream text', {status: 500})
    }
}