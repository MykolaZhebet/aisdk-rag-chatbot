import { streamText, UIMessage, convertToModelMessages, generateText } from "ai";
import { ollama, createOllama } from 'ollama-ai-provider-v2';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';


import { openai, createOpenAI } from "@ai-sdk/openai";

export async function POST(req: Request) {
    try {

        const { messages }: { messages: UIMessage[] } = await req.json();
        // const ollama = createOpenAI({
        //     baseURL: process.env.OLLAMA_SERVER_URL,
        // });
        // const ollama = createOllama({
        //     // baseURL: process.env.OLLAMA_SERVER_URL
        //     baseURL: 'http://127.0.0.1:1234/v1'
        // });
        // const lmstudio = createOpenAICompatible({
        //     name: 'lmstudio',
        //     baseURL: 'http://localhost:1234/v1',
        // });
        // const model = ollama('phi3');

        const result = streamText({
            // model: openai("gpt-4.1-mini"),
            model: ollama('gemma3:4b-it-qat'),
            // model: ollama('qwen2.5-coder:1.5b'),
            // model: lmstudio("qwen2.5-coder-3b-instruct"),
            messages: convertToModelMessages(messages),
        });
        // const result = generateText({
        // const anotherResult = streamText(

        return result.toUIMessageStreamResponse();
    } catch (err) {
        console.error('Error streaming chat completion:', err);
        return new Response("Failed to stream chat completion", {status: 500});
    }

}