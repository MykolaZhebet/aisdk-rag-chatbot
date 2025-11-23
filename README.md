This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

Project inspired by youtube: [`
Build a RAG Chatbot from Scratch`](https://www.youtube.com/watch?v=3E5OxozYuA8)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


### Local Ollama models were used:
  @see  https://ollama.com/library/gemma3
   ```ollama run gemma3:4b-it-qat```

   Ollama local model for embedding nomic-embed-text (768 dimensions) https://ollama.com/library/nomic-embed-text:v1.5
  ```ollama run nomic-embed-text:v1.5
  curl http://localhost:11434/api/embeddings -d '{
  "model": "nomic-embed-text:v1.5",
  "prompt": "The sky is blue because of Rayleigh scattering"
}'
  ```

### AI SDK:
   https://ai-sdk.dev/docs/ai-sdk-core/generating-text
   - https://ai-sdk.dev/providers/community-providers/ollama
   - UI elements: https://ai-sdk.dev/elements/overview

- Use Clerk as authentication middleware: https://dashboard.clerk.com/apps/app_33kGQLkjA9LZFu7uSJAXVGBnyMi/instances/ins_33kGQEU34WIILU1f3bvdDCzCgqr


### Drizzle:
Generate custom migration: 
```npx drizzle-kit generate --custom```
Generate migration file for changes in db schema:
```npx drizzle-kit generate```
#### Migrate:
```npx drizzle-kit migrate```
#### Check if ext. vector exists:
```select extname, extversion from pg_extension where extname = 'vector';```

### Packages
- Imagekit for file manipulation and storage

## Services
- https://www.mockmcp.com/ for mocking mcp invokes
- https://www.weatherapi.com for fetching weather forecasts
- imagekit.io for storing and changing images by API
- clerk.com as auth provider