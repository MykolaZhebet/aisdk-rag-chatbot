import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { config } from "dotenv";
config({ path: ".env.local" });

export const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: parseInt(process.env.EMBEDDING_CHUNK_SIZE!),//150 characters. For production use 500 or 1000 characters
    // chunkSize: 150,//150 characters. For production use 500 or 1000 characters
    chunkOverlap: 20,//20 common symbols between two consequtive chunks of text
    separators: [" "],
});

export async function chunkContent(content: string) { 
    return await textSplitter.splitText(content.trim());
}

