import { embed, embedMany } from "ai";
// import { openai } from "@ai-sdk/openai";
import { ollama } from 'ollama-ai-provider-v2';
import { config } from "dotenv";

config({ path: ".env.local" });

export async function generateEmbedding(text: string) { 
    const input = text.replace("\n", " ");

    const { embedding } = await embed({
        // model: ollama.textEmbeddingModel("nomic-embed-text:v1.5")
        model: ollama.textEmbeddingModel(process.env.EMBEDDING_MODEL!),
        value: input
    });

    return embedding;
}

export async function generateEmbeddings(texts: string[]) { 
    const inputs = texts.map((text) => text.replace("\n", " "));

    const { embeddings } = await embedMany({
        model:ollama.textEmbeddingModel(process.env.EMBEDDING_MODEL!),
        values: inputs,
    });

    return embeddings;
}