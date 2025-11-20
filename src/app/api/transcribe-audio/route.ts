import { experimental_transcribe as transcribe} from "ai";
import { config } from "dotenv";
import { ollama } from 'ollama-ai-provider-v2';
config({ path: ".env.local" });
export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const audioFile = formData.get('audio') as File
        if (!audioFile) { 
            return new Response('No audio file provided', {status: 400});
        }
        //Read file raw binary data to the buffer
        const arrayBuffer = await audioFile.arrayBuffer();
        //Create uint8 array from file content
        const uint8Array = new Uint8Array(arrayBuffer);

        const transcript = await transcribe({
            model: ollama.transcriptionModel(process.env.TRANSCRIBE_MODEL!),
            audio: uint8Array,
        })

        return Response.json(transcript);
    } catch (err) {
        console.error('Error transcribing audio', err);
        return new Response('Failed to transcribe audio', {status: 500});
    }
}