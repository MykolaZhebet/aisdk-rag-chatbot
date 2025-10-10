import { cosineDistance, desc, gt, sql } from "drizzle-orm";
import { db } from "./db-config"; 
import { documents } from "./db-schema";
import { generateEmbedding } from "./embeddings";
import { config } from "dotenv";
config({ path: ".env.local" });

export async function searchDocuments(
    query: string,
    limit: number = 5,
    // threshold: number 0.5,//Minimum similarity score
    threshold: number = Number(process.env.SEARCH_SIMILARITY_MIN_SCORE!),//Minimum similarity score
) {
    const embedding = await generateEmbedding(query);

    //Generate similarity score(cosine distance) between search query and all embedding in DB
    const similarity = sql<number>`1 - (${cosineDistance(documents.embedding, embedding)})`;

    const similarDocuments = await db
        .select({
            id: documents.id,
            content: documents.content,
            similarity,
        })
        .from(documents)
        .where(gt(similarity, threshold))
        .orderBy(desc(similarity))
        .limit(limit);
    
    return similarDocuments;
}