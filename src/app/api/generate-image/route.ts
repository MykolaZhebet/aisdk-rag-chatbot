import { experimental_generateImage as generateImage } from "ai";
import { config } from "dotenv";
import { ollama } from 'ollama-ai-provider-v2';
config({ path: ".env.local" });

export async function POST(req: Request) { 
    const { prompt } = await req.json();

    try {
        const { image } = await generateImage({
            // model: ollama.imageModel(process.env.IMAGE_MODEL!),
            //Ollama provider doesn't support image generation yet
            model: ollama.imageModel(process.env.IMAGE_MODEL!),
            prompt: prompt,
            size: '100x100',
        });
        return Response.json(image.base64);
    } catch (err) { 
        console.error('Error generate image', err);
        return new Response('Failed to generate image', {status: 500})
    }
}