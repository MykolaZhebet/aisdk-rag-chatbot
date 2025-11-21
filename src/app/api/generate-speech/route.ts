import { config } from "dotenv";
import { ollama } from 'ollama-ai-provider-v2';
import { experimental_generateSpeech as generateSpeech } from "ai";
import { Experimental_SpeechResult as SpeechResult } from "ai";
import { GeneratedFile } from 'ai';
import { openai } from "@ai-sdk/openai";
import { NextResponse } from 'next/server';
config({ path: ".env.local" });

export async function POST(req: Request) { 
    try {
        const { text } = await req.json();

        // const audio: SpeechResult = await generateSpeech({
        const { audio }: {audio: GeneratedFile} = await generateSpeech({
            model: (ollama?.speechModel
                        ? ollama?.speechModel(process.env.AUDIO_GENERATION_MODEL!)
                        : openai.speech("gpt-4.1-mini")
            ),
            text,
        })

        return new Response(audio.uint8Array.buffer as ArrayBuffer, {
            headers: { 'Content-Type': 'application/octet-stream' },
        });
    } catch (error) { 
        console.error("Error generation speech:", error);
        return new Response("Failed to generate speech",{status: 500});
    }
}
