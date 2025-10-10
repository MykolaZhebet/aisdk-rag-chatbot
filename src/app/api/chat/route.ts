import {
    streamText,
    UIMessage,
    convertToModelMessages,
    tool,
    InferUITools,
    UIDataTypes,
    stepCountIs,
} from "ai";
import { ollama, createOllama } from 'ollama-ai-provider-v2';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { openai, createOpenAI } from "@ai-sdk/openai";
import { z } from "zod";
import { searchDocuments } from "@/lib/search";
import { config } from "dotenv";
config({ path: ".env.local" });

const tools = {
    searchKnowledgeBase: tool({
        description: "Search the knowledge base for relevant information",
        inputSchema: z.object({
            query: z.string().describe("The search query to find relevant documents")
        }),
        execute: async ({ query }) => { 
            try {
                const results = await searchDocuments(query, 3)
                console.log(results);
                if (results.length === 0) { 
                    return "No relevant information found in the knowledge base";
                }

                const formattedResults = results
                    .map((result, index) => `[${index + 1}] ${result.content}`)
                    .join("\n\n");
                
                return formattedResults;            
            } catch (error) {
                console.error("Search error:", error);
                return "Error searching the knowledge base"
            }
        }
    })
};

export type ChatTools = InferUITools<typeof tools>;
export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>;
export async function POST(req: Request) {
    try {

        const { messages }: { messages: ChatMessage[] } = await req.json();
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
            model: ollama(process.env.CHAT_MODEL!),
            // model: lmstudio("qwen2.5-coder-3b-instruct"),
            messages: convertToModelMessages(messages),
            tools,
            system: process.env.SEARCH_TOOL_SYSTEM_PROMPT,
            stopWhen: stepCountIs(2),
        });

        return result.toUIMessageStreamResponse();
    } catch (err) {
        console.error('Error streaming chat completion:', err);
        return new Response("Failed to stream chat completion", {status: 500});
    }

}