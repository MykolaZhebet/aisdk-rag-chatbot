CREATE TABLE "documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"embedding" vector(786)
);
--> statement-breakpoint
CREATE INDEX "embedding Index" ON "documents" USING hnsw ("embedding" vector_cosine_ops);