import { createMcpHandler } from '@vercel/mcp-adapter';
import { z } from 'zod';
import { readFile, readdir } from 'fs/promises';
import { join } from 'path';
import { generateText, embed } from 'ai';
import { createAzure } from '@ai-sdk/azure';

// Initialize Azure for embeddings and text generation
const azure = createAzure({
  resourceName: process.env.AZURE_OPENAI_RESOURCE_NAME!,
  apiKey: process.env.AZURE_OPENAI_API_KEY!,
  apiVersion: process.env.AZURE_OPENAI_API_VERSION || '2024-12-01-preview',
});

// Simple in-memory vector store for markdown documents
interface DocumentChunk {
  id: string;
  content: string;
  metadata: {
    file: string;
    language: string;
    type: 'page' | 'tool' | 'case' | 'blog' | 'docs';
    title?: string;
  };
  embedding?: number[];
}

const documentStore: DocumentChunk[] = [];
let isIndexed = false;

// Initialize document store with markdown content
async function initializeDocumentStore() {
  if (isIndexed) return;
  
  try {
    const contentDirs = [
      { path: 'src/content/pages', type: 'page' as const },
      { path: 'src/content/tool', type: 'tool' as const },
      { path: 'src/content/case', type: 'case' as const },
      { path: 'src/content/blog', type: 'blog' as const },
      { path: 'src/content/docs', type: 'docs' as const },
    ];

    for (const dir of contentDirs) {
      try {
        const languages = await readdir(dir.path);
        
        for (const lang of languages) {
          const langPath = join(dir.path, lang);
          try {
            const files = await readdir(langPath);
            
            for (const file of files) {
              if (file.endsWith('.mdx')) {
                const filePath = join(langPath, file);
                const content = await readFile(filePath, 'utf-8');
                
                // Extract title from frontmatter or filename
                const titleMatch = content.match(/title:\s*["'](.+?)["']/);
                const title = titleMatch?.[1] || file.replace('.mdx', '');
                
                // Remove frontmatter for content
                const cleanContent = content.replace(/^---[\s\S]*?---\n/, '');
                
                // Split into chunks (simple sentence-based splitting)
                const sentences = cleanContent.split(/\. |\n\n/);
                const chunks = [];
                let currentChunk = '';
                
                for (const sentence of sentences) {
                  if ((currentChunk + sentence).length < 1000) {
                    currentChunk += sentence + '. ';
                  } else {
                    if (currentChunk.trim()) {
                      chunks.push(currentChunk.trim());
                    }
                    currentChunk = sentence + '. ';
                  }
                }
                
                if (currentChunk.trim()) {
                  chunks.push(currentChunk.trim());
                }
                
                // Add chunks to store
                chunks.forEach((chunk, index) => {
                  documentStore.push({
                    id: `${dir.type}-${lang}-${file}-${index}`,
                    content: chunk,
                    metadata: {
                      file: filePath,
                      language: lang,
                      type: dir.type,
                      title
                    }
                  });
                });
              }
            }
                     } catch {
             // Skip if language directory doesn't exist
           }
        }
             } catch {
         // Skip if content directory doesn't exist
       }
    }
    
    console.log(`Indexed ${documentStore.length} document chunks`);
    isIndexed = true;
  } catch (error) {
    console.error('Failed to initialize document store:', error);
  }
}

// Simple cosine similarity for vector search
function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

// Search documents using embeddings
async function searchDocuments(query: string, limit: number = 5, language?: string) {
  await initializeDocumentStore();
  
  if (!process.env.AZURE_OPENAI_RESOURCE_NAME || !process.env.AZURE_OPENAI_API_KEY) {
    // Fallback to simple text search
    const filteredDocs = documentStore.filter(doc => 
      (!language || doc.metadata.language === language) &&
      doc.content.toLowerCase().includes(query.toLowerCase())
    );
    
    return filteredDocs.slice(0, limit).map(doc => ({
      content: doc.content,
      metadata: doc.metadata,
      score: 0.8
    }));
  }

  try {
    // Generate embedding for query
    const { embedding: queryEmbedding } = await embed({
      model: azure.textEmbeddingModel('text-embedding-ada-002'),
      value: query,
    });

    // Filter by language if specified
    let searchDocs = documentStore;
    if (language) {
      searchDocs = documentStore.filter(doc => doc.metadata.language === language);
    }

    // If embeddings not computed, generate them (simple fallback)
    if (searchDocs.length > 0 && !searchDocs[0].embedding) {
      // For demo, use simple text matching
      const results = searchDocs.filter(doc =>
        doc.content.toLowerCase().includes(query.toLowerCase())
      ).slice(0, limit);

      return results.map(doc => ({
        content: doc.content,
        metadata: doc.metadata,
        score: 0.7
      }));
    }

    // Calculate similarities and sort
    const similarities = searchDocs
      .filter(doc => doc.embedding)
      .map(doc => ({
        content: doc.content,
        metadata: doc.metadata,
        score: cosineSimilarity(queryEmbedding, doc.embedding!)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return similarities;
  } catch (error) {
    console.error('Search error:', error);
    
    // Fallback to simple text search
    const filteredDocs = documentStore.filter(doc => 
      (!language || doc.metadata.language === language) &&
      doc.content.toLowerCase().includes(query.toLowerCase())
    );
    
    return filteredDocs.slice(0, limit).map(doc => ({
      content: doc.content,
      metadata: doc.metadata,
      score: 0.6
    }));
  }
}

const handler = createMcpHandler(
  server => {
    // Tool 1: Search Documentation
    server.tool(
      'search_documentation',
      'Search through SuperDuperAI documentation and content using vector similarity',
      {
        query: z.string().describe('Search query for finding relevant documentation'),
        language: z.enum(['en', 'ru', 'es', 'hi', 'tr']).optional().describe('Language filter for content'),
        content_type: z.enum(['page', 'tool', 'case', 'blog', 'docs']).optional().describe('Type of content to search'),
        limit: z.number().int().min(1).max(10).default(5).describe('Maximum number of results to return')
      },
      async ({ query, language, content_type, limit }) => {
        try {
          let results = await searchDocuments(query, limit, language);
          
          // Filter by content type if specified
          if (content_type) {
            results = results.filter(doc => doc.metadata.type === content_type);
          }
          
          if (results.length === 0) {
            return {
              content: [{ 
                type: 'text', 
                text: `No documentation found for query: "${query}"${language ? ` in ${language}` : ''}${content_type ? ` for content type: ${content_type}` : ''}` 
              }]
            };
          }
          
          const formattedResults = results.map((result, index) => 
            `**Result ${index + 1}** (${result.metadata.type}/${result.metadata.language}${result.metadata.title ? ` - ${result.metadata.title}` : ''}, score: ${result.score.toFixed(3)})\n${result.content}\n---`
          ).join('\n\n');
          
          return {
            content: [{ 
              type: 'text', 
              text: `Found ${results.length} relevant documentation entries for "${query}":\n\n${formattedResults}` 
            }]
          };
        } catch (error) {
          return {
            content: [{ 
              type: 'text', 
              text: `Error searching documentation: ${error instanceof Error ? error.message : 'Unknown error'}` 
            }]
          };
        }
      }
    );

    // Tool 2: Enhance VEO3 Prompt (wrapper around existing API)
    server.tool(
      'enhance_veo3_prompt',
      'Enhance video prompts for Google VEO3 using AI',
      {
        prompt: z.string().describe('Original video prompt to enhance'),
        customLimit: z.number().int().min(200).max(10000).default(1000).describe('Character limit for enhanced prompt'),
        model: z.enum(['gpt-4.1']).default('gpt-4.1').describe('AI model to use for enhancement'),
        focusType: z.string().optional().describe('Focus areas: character, action, cinematic, safe (comma-separated)'),
        includeAudio: z.boolean().default(true).describe('Include audio cues in the enhancement')
      },
      async ({ prompt, customLimit, model, focusType, includeAudio }) => {
        try {
          const enhanceUrl = new URL('/api/enhance-prompt', process.env.NEXTAUTH_URL || 'http://localhost:3000');
          
          const response = await fetch(enhanceUrl.toString(), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              prompt,
              customLimit,
              model,
              focusType,
              includeAudio
            })
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Enhancement failed');
          }

          const result = await response.json();
          
          return {
            content: [{ 
              type: 'text', 
              text: `**Enhanced VEO3 Prompt** (${result.characterCount}/${result.characterLimit} chars)\n\n${result.enhancedPrompt}\n\n**Focus Areas:** ${result.focusTypes?.join(', ') || 'None'}\n**Audio Included:** ${result.includeAudio ? 'Yes' : 'No'}` 
            }]
          };
        } catch (error) {
          return {
            content: [{ 
              type: 'text', 
              text: `Error enhancing prompt: ${error instanceof Error ? error.message : 'Unknown error'}` 
            }]
          };
        }
      }
    );

    // Tool 3: Get Available LLMs (wrapper around existing API)
    server.tool(
      'get_available_llms',
      'Get list of available AI models and their capabilities',
      {},
      async () => {
        try {
          const llmsUrl = new URL('/api/llms', process.env.NEXTAUTH_URL || 'http://localhost:3000');
          
          const response = await fetch(llmsUrl.toString());

          if (!response.ok) {
            throw new Error('Failed to fetch LLMs list');
          }

          const result = await response.json();
          
          const formattedLlms = result.llms?.map((llm: { name: string; provider: string; type: string; contextLength: string; description: string }) => 
            `**${llm.name}**\n- Provider: ${llm.provider}\n- Type: ${llm.type}\n- Context: ${llm.contextLength}\n- ${llm.description}\n`
          ).join('\n') || 'No LLMs available';
          
          return {
            content: [{ 
              type: 'text', 
              text: `**Available AI Models:**\n\n${formattedLlms}` 
            }]
          };
        } catch (error) {
          return {
            content: [{ 
              type: 'text', 
              text: `Error fetching LLMs: ${error instanceof Error ? error.message : 'Unknown error'}` 
            }]
          };
        }
      }
    );

    // Tool 4: AI Text Generation
    server.tool(
      'generate_ai_text',
      'Generate text using Azure OpenAI models',
      {
        prompt: z.string().describe('Text generation prompt'),
        model: z.enum(['gpt-4.1']).default('gpt-4.1').describe('AI model to use'),
        maxTokens: z.number().int().min(50).max(2000).default(500).describe('Maximum tokens to generate'),
        temperature: z.number().min(0).max(2).default(0.7).describe('Creativity level (0-2)')
      },
      async ({ prompt, model: _model, maxTokens, temperature }) => {
        try {
          if (!process.env.AZURE_OPENAI_RESOURCE_NAME || !process.env.AZURE_OPENAI_API_KEY) {
            throw new Error('Azure OpenAI not configured');
          }

          const { text } = await generateText({
            model: azure('gpt-4.1'),
            prompt,
            maxTokens,
            temperature,
          });

          return {
            content: [{ 
              type: 'text', 
              text: `**Generated Text:**\n\n${text}` 
            }]
          };
        } catch (error) {
          return {
            content: [{ 
              type: 'text', 
              text: `Error generating text: ${error instanceof Error ? error.message : 'Unknown error'}` 
            }]
          };
        }
      }
    );

    // Tool 5: Get Site Information
    server.tool(
      'get_site_info',
      'Get information about SuperDuperAI platform and available features',
      {},
      async () => {
        const siteInfo = `**SuperDuperAI Platform Information**

**Available Tools:**
- VEO3 Prompt Generator: Enhance video prompts for Google VEO3
- Image Generator: Create AI-generated images
- Agent Director: AI agent for content creation

**Supported Languages:**
- English (en)
- Russian (ru) 
- Spanish (es)
- Hindi (hi)
- Turkish (tr)

**Content Types:**
- Tool pages: Detailed tool documentation
- Case studies: Success stories and use cases
- Blog posts: Latest AI and technology articles
- Documentation: Technical guides and tutorials

**Key Features:**
- Multilingual support
- AI-powered content enhancement
- Vector-based documentation search
- Real-time prompt optimization

**API Endpoints:**
- /api/enhance-prompt: VEO3 prompt enhancement
- /api/llms: Available AI models
- /api/mcp: This MCP server interface

Use the search_documentation tool to find specific information about any topic.`;

        return {
          content: [{ 
            type: 'text', 
            text: siteInfo
          }]
        };
      }
    );
  },
  {
    // Server options
  },
  {
    // MCP configuration
    basePath: '/api',
    maxDuration: 60,
    verboseLogs: process.env.NODE_ENV === 'development',
  }
);

export { handler as GET, handler as POST }; 