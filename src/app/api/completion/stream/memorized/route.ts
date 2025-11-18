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
            messages: [
                // {
                //     role: 'system',
                //     content: 'You are a teacher. Focus on practical simple examples',
                // },
                {
                    role: 'system',
                    content: 'Convert user questions about React into code examples. Without extra text before and after answer',
                },
                {
                    role: 'user',
                    content: 'How to toggle a boolean?'
                },
                {
                    role: 'assistant',
                    content: 'const [isOpen, setIsOpen] = useState(false);\n const toggle = () => setIsOpen(!isOpen);'
                },
                ...convertToModelMessages(messages)
            ],
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