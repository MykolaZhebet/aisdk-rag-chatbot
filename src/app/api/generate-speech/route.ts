import { config } from "dotenv";
import { ollama } from 'ollama-ai-provider-v2';
import { experimental_generateSpeech as generateSpeech } from "ai";
import { Experimental_SpeechResult as SpeechResult } from "ai";
import { GeneratedFile } from 'ai';
config({ path: ".env.local" });

export async function POST(req: Request) { 
    try {
        const { text } = await req.json();

        // const audio: SpeechResult = await generateSpeech({
        const { audio }: {audio: GeneratedFile} = await generateSpeech({
            model: ollama.speechModel(process.env.AUDIO_GENERATION_MODEL!),
            text,
        })

        audio.uint8Array


        return new Response(audio.uint8Array, {
            headers: {
                'Content-Type': audio.mediaType || 'audio/mpeg',
            },
        })
    } catch (error) { 
        console.error("Error generation speech:", error);
        return new Response("Failed to generate speech",{status: 500});
    }
}
