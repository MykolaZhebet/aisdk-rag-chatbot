import {
    streamText,
    UIMessage,
    InferUITools,
    UIDataTypes,
    convertToModelMessages,
    stepCountIs,
} from 'ai';
import { config } from "dotenv";
import z from 'zod';
import { ollama } from 'ollama-ai-provider-v2';
import { openai } from '@ai-sdk/openai';
config({ path: ".env.local" });

const tools = {
    web_search_preview: openai.tools.webSearch()
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
            model: openai.responses('gpt-5-nano'),
            tools,
            //Declare stop and return result after 1)calling weather tool and
            //2)processing result and returning to the user - needed because text should be returned as is
            stopWhen: stepCountIs(2),
            messages: convertToModelMessages(messages),
        });

        return result.toUIMessageStreamResponse({
            sendSources: true
        });
    } catch (error) {
        console.log('Error streaming text', error);
        return new Response('Failed to stream text', {status: 500})
    }
}