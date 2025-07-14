# SuperDuperAI MCP Server Guide

## Overview

This Next.js application has been configured as an MCP (Model Context Protocol) server, providing AI agents with tools to:

1. **Search Documentation** - Vector-based search through all markdown content
2. **Enhance VEO3 Prompts** - AI-powered video prompt enhancement
3. **Get Available LLMs** - List of available AI models
4. **Generate AI Text** - Direct text generation using Azure OpenAI
5. **Get Site Information** - Platform overview and capabilities

## Setup

### 1. Install Dependencies

The MCP adapter is already installed:
```bash
pnpm add @vercel/mcp-adapter @modelcontextprotocol/sdk
```

### 2. Environment Variables

Make sure you have these environment variables set in `.env.local`:

```bash
# Azure OpenAI Configuration (required for AI features)
AZURE_OPENAI_RESOURCE_NAME=your-resource-name
AZURE_OPENAI_API_KEY=your-api-key
AZURE_OPENAI_API_VERSION=2024-12-01-preview

# Optional: Base URL for internal API calls
NEXTAUTH_URL=http://localhost:3000
```

### 3. Start the Server

```bash
pnpm dev
```

The MCP server will be available at:
- HTTP Transport: `http://localhost:3000/api/mcp`
- SSE Transport: `http://localhost:3000/api/mcp/mcp`

## Claude Desktop Configuration

Add this to your Claude Desktop configuration (`~/.claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "superduperai": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "http://localhost:3000/api/mcp"
      ]
    }
  }
}
```

## Available Tools

### 1. search_documentation

Search through SuperDuperAI documentation using vector similarity.

**Parameters:**
- `query` (string): Search query
- `language` (optional): Language filter ('en', 'ru', 'es', 'hi', 'tr')
- `content_type` (optional): Content type filter ('page', 'tool', 'case', 'blog', 'docs')
- `limit` (optional): Maximum results (1-10, default: 5)

**Example:**
```typescript
{
  "query": "VEO3 video generation",
  "language": "en",
  "content_type": "tool",
  "limit": 3
}
```

### 2. enhance_veo3_prompt

Enhance video prompts for Google VEO3.

**Parameters:**
- `prompt` (string): Original video prompt
- `customLimit` (optional): Character limit (200-10000, default: 1000)
- `model` (optional): AI model ('gpt-4.1')
- `focusType` (optional): Focus areas ('character', 'action', 'cinematic', 'safe')
- `includeAudio` (optional): Include audio cues (default: true)

**Example:**
```typescript
{
  "prompt": "A cat playing with a ball",
  "customLimit": 1500,
  "focusType": "character,action",
  "includeAudio": true
}
```

### 3. get_available_llms

Get list of available AI models and their capabilities.

**Parameters:** None

### 4. generate_ai_text

Generate text using Azure OpenAI models.

**Parameters:**
- `prompt` (string): Text generation prompt
- `model` (optional): AI model ('gpt-4.1')
- `maxTokens` (optional): Maximum tokens (50-2000, default: 500)
- `temperature` (optional): Creativity level (0-2, default: 0.7)

**Example:**
```typescript
{
  "prompt": "Write a short story about AI",
  "maxTokens": 1000,
  "temperature": 0.8
}
```

### 5. get_site_info

Get information about SuperDuperAI platform and features.

**Parameters:** None

## Vector Search Implementation

The MCP server includes a simple vector search implementation:

1. **Document Indexing**: Automatically indexes all `.mdx` files from `src/content/`
2. **Text Chunking**: Splits documents into ~1000 character chunks
3. **Fallback Search**: Uses text matching when embeddings are not available
4. **Multilingual Support**: Filters by language when specified

## API Integration

The MCP server acts as a wrapper around existing Next.js API routes:

- `/api/enhance-prompt` - VEO3 prompt enhancement
- `/api/llms` - Available models list

This allows AI agents to access all platform functionality through the MCP protocol.

## Development

### Adding New Tools

To add new MCP tools, edit `src/app/api/[transport]/route.ts`:

```typescript
server.tool(
  'new_tool_name',
  'Tool description',
  {
    // Zod schema for parameters
    param: z.string().describe('Parameter description')
  },
  async ({ param }) => {
    // Tool implementation
    return {
      content: [{ 
        type: 'text', 
        text: 'Tool result' 
      }]
    };
  }
);
```

### Testing

Test the MCP server using Claude Desktop or any MCP-compatible client:

1. Start the development server: `pnpm dev`
2. Configure your MCP client to connect to `http://localhost:3000/api/mcp`
3. Use the available tools through the client interface

## Troubleshooting

### Common Issues

1. **No documents found**: Check that `.mdx` files exist in `src/content/` directories
2. **AI features not working**: Verify Azure OpenAI environment variables
3. **Connection issues**: Ensure the development server is running on port 3000

### Logs

Enable verbose logging in development by setting `verboseLogs: true` in the MCP configuration.

### Performance

For production deployment:
- Consider implementing Redis for document caching
- Use proper vector database (Pinecone, Weaviate) for better search
- Implement rate limiting for external access 