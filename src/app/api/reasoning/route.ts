import { streamText, UIMessage, convertToModelMessages } from 'ai';
import { config } from "dotenv";
import { ollama } from 'ollama-ai-provider-v2';
config({ path: ".env.local" });

export async function POST(req: Request) {
    try {
        //Array of all history
        const { messages }: { messages: UIMessage[] } = await req.json();
    
        const result = streamText({
            model: ollama(process.env.CHAT_MODEL!),
            // system: 'You are a helpuful assistant',
            messages: convertToModelMessages(messages),
            providerOptions: {
                ollama: {
                    reasoningSummary: "auto",//"concise" for shorter summary
                    rasoningEffort: 'low'//"medium", "high"
                }
            }
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
            sendReasoning: true
        });
    } catch (error) {
        console.log('Error streaming text', error);
        return new Response('Failed to stream text', {status: 500})
    }
}