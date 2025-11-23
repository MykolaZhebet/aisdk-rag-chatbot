import { embed, embedMany } from "ai";
// import { openai } from "@ai-sdk/openai";
import { ollama } from 'ollama-ai-provider-v2';
import { config } from "dotenv";

config({ path: ".env.local" });
export async function POST(req: Request) {
    // const { text } = await req.json();
    const body = await req.json();
    // const { embedding } = await embed({
    const result = await embed({
        // model: ollama.textEmbeddingModel("nomic-embed-text:v1.5")
        model: ollama.textEmbeddingModel(process.env.EMBEDDING_MODEL!),
        // value: 'A movie about hackers discovering reality in a simulation'
        // value: text
        value: body.texts  
    });


    if (Array.isArray(body.texts)) {
    // const { embedding } = await embed({
        const result = await embedMany({
            // model: ollama.textEmbeddingModel("nomic-embed-text:v1.5")
            model: ollama.textEmbeddingModel(process.env.EMBEDDING_MODEL!),
            // value: 'A movie about hackers discovering reality in a simulation'
            // value: text
            values: body.texts,
            maxParallelCalls: 5,//process 5 embedding at the time
        });    
         return Response.json({
            values: result.values,
            embeddings: result.embeddings,
             usage: result.usage,
            count: result.embeddings.length,
            dimansions: result.embeddings[0].length
        })
    } else {
        // const { embedding } = await embed({
        const result = await embed({
            // model: ollama.textEmbeddingModel("nomic-embed-text:v1.5")
            model: ollama.textEmbeddingModel(process.env.EMBEDDING_MODEL!),
            // value: 'A movie about hackers discovering reality in a simulation'
            // value: text
            value: body.text  
        });
         return Response.json({
            value: result.value,
            embedding: result.embedding,
            usage: result.usage,
            dimansions: result.embedding.length
        })
    }
    // return Response.json({embedding})
    // return Response.json(result)
   
}