---
title: "Image Generation API"
description: "Complete guide to SuperDuperAI's image generation API. Generate high-quality images from text descriptions with multiple AI models."
date: "2024-12-01"
slug: "image-generation"
locale: "en"
category: "api"
order: 1
seo:
  title: "Image Generation API | SuperDuperAI Developer Guide"
  description: "Learn how to generate stunning images using SuperDuperAI's API. Multiple AI models, flexible pricing, and production-ready examples."
  keywords:
    - image generation API
    - AI image API
    - text to image
    - image to image
    - developer guide
---

---
title: "Image Generation API"
description: "Complete guide to SuperDuperAI's image generation API. Generate high-quality images from text descriptions with multiple AI models."
date: "2024-12-01"
slug: "image-generation"
locale: "en"
category: "api"
order: 1
seo:
  title: "Image Generation API | SuperDuperAI Developer Guide"
  description: "Learn how to generate stunning images using SuperDuperAI's API. Multiple AI models, flexible pricing, and production-ready examples."
  keywords:
    - image generation API
    - AI image API
    - text to image
    - image to image
    - developer guide
---

# Image Generation API

Generate high-quality images from text descriptions using state-of-the-art AI models. Choose from 10 different models based on your needs and budget.

### 🎨 Text-to-Image

Create images from text descriptions • 6 models available • $1.00-$3.00 per image

  ### ✏️ Image-to-Image

Edit and enhance existing images • 4 models available • Advanced inpainting

  ### 💰 Flexible Pricing

From $1 budget models to $3 premium quality • No VIP required options

  ### ⚡ Fast Generation

~2 minutes generation time • CDN delivery • Auto quality optimization

## Quick Start

### Basic Setup
```typescript
const API_BASE = 'https://editor.superduperai.co/api/v1';
const headers = {
  'Authorization': `Bearer ${your_api_token}`,
  'Content-Type': 'application/json'
};
```

### Generate Your First Image
```typescript
const generateImage = async (prompt: string) => {
  const response = await fetch(`${API_BASE}/file/generate-image`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      config: {
        prompt: prompt,
        generation_config_name: 'comfyui/flux', // Free model
        params: {
          width: 1024,
          height: 1024,
          quality: 'hd'
        }
      }
    })
  });
  
  const [fileData] = await response.json(); // Returns array
  return fileData.id;
};

// Wait for generation to complete
const waitForImage = async (fileId: string) => {
  while (true) {
    const response = await fetch(`${API_BASE}/file/${fileId}`, { headers });
    const status = await response.json();
    
    if (status.url) return status.url; // Ready!
    if (status.error) throw new Error(status.error);
    
    await new Promise(r => setTimeout(r, 2000)); // Wait 2 seconds
  }
};

// Complete workflow
const imageUrl = await generateImage("A beautiful sunset over mountains");
const finalUrl = await waitForImage(imageUrl);
console.log('Generated image:', finalUrl);
```

## Available Models

### 💰 Budget-Friendly (No VIP Required)

Perfect for testing, prototyping, and cost-effective production use.

| Model | Type | Price | Best For |
|-------|------|-------|----------|
| `comfyui/flux` | Text-to-Image | **$1.00** | General images, testing |
| `comfyui/flux/inpainting` | Image Editing | **$1.00** | Photo editing, object removal |

### 🔥 Premium Models (VIP Required)

Higher quality results for professional applications.

| Model | Type | Price | Best For |
|-------|------|-------|----------|
| `fal-ai/flux-pro/v1.1-ultra` | Text-to-Image | $1.00 | Fast generation |
| `google-cloud/imagen3` | Text-to-Image | $1.50 | Balanced quality/cost |
| `google-cloud/imagen4` | Text-to-Image | $2.00 | Latest technology |
| `azure-openai/gpt-image-1` | Text-to-Image | $2.00 | OpenAI quality |
| `google-cloud/imagen3-edit` | Image Editing | $2.00 | Professional editing |
| `fal-ai/flux-pro/kontext` | Image Editing | $2.00 | Context-aware edits |
| `azure-openai/gpt-image-1-edit` | Image Editing | $2.50 | Premium editing |
| `google-cloud/imagen4-ultra` | Text-to-Image | **$3.00** | Highest quality |

## Real-time Updates

### Polling Method (Recommended)

The standard approach for tracking generation progress:

```typescript
const pollForCompletion = async (fileId: string, timeout = 300000) => {
  const startTime = Date.now();
  
  while (Date.now() - startTime  setTimeout(r, 2000)); // Poll every 2 seconds
  }
  
  throw new Error('Generation timeout');
};
```

### Server-Sent Events (SSE)

⚠️ **Note**: SSE connections may experience timeouts (error 524). Use as enhancement to polling, not replacement.

```typescript
const watchWithSSE = (fileId: string, onUpdate: (data: any) => void) => {
  const eventSource = new EventSource(`${API_BASE}/events/file.${fileId}`, {
    headers: {
      'Authorization': `Bearer ${your_api_token}`
    }
  });
  
  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
    onUpdate(data);
    
    if (data.url || data.error) {
      eventSource.close();
    }
  };
  
  eventSource.onerror = (error) => {
    console.warn('SSE connection failed, falling back to polling');
    eventSource.close();
    // Fallback to polling method
  };
  
  // Cleanup after 5 minutes
  setTimeout(() => {
    eventSource.close();
  }, 300000);
  
  return eventSource;
};

// Usage with fallback
const generateWithRealtime = async (prompt: string) => {
  const imageId = await generateImage(prompt);
  
  // Try SSE first, fallback to polling
  return new Promise((resolve, reject) => {
    let resolved = false;
    
    // SSE attempt
    const sse = watchWithSSE(imageId, (data) => {
      if (data.url && !resolved) {
        resolved = true;
        resolve(data.url);
      }
    });
    
    // Polling fallback after 10 seconds
    setTimeout(async () => {
      if (!resolved) {
        sse.close();
        try {
          const url = await pollForCompletion(imageId);
          if (!resolved) {
            resolved = true;
            resolve(url);
          }
        } catch (error) {
          if (!resolved) {
            resolved = true;
            reject(error);
          }
        }
      }
    }, 10000);
  });
};
```

## Common Use Cases

### 1. Product Mockups
```typescript
const createProductMockup = async (product: string, setting: string) => {
  const prompt = `Professional product photo of ${product} on ${setting}, clean background, studio lighting, high resolution`;
  
  const imageId = await generateImage(prompt);
  return await waitForImage(imageId);
};

// Example
const mockup = await createProductMockup("wireless headphones", "marble surface");
```

### 2. Social Media Content
```typescript
const createSocialPost = async (topic: string, style = "modern") => {
  const prompt = `${style} social media post about ${topic}, vibrant colors, engaging design, square format`;
  
  const response = await fetch(`${API_BASE}/file/generate-image`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      config: {
        prompt,
        generation_config_name: 'google-cloud/imagen3', // Good quality/price balance
        params: {
          width: 1024,
          height: 1024,
          aspect_ratio: '1:1' // Square for social media
        }
      }
    })
  });
  
  const [fileData] = await response.json();
  return await waitForImage(fileData.id);
};
```

### 3. Image Enhancement & Editing
```typescript
const enhanceImage = async (imageId: string, enhancement: string) => {
  const response = await fetch(`${API_BASE}/file/generate-image`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      config: {
        prompt: `Enhance this image: ${enhancement}`,
        generation_config_name: 'comfyui/flux/inpainting', // Budget editing
        references: [imageId], // Reference to existing image
        params: {
          strength: 0.7, // How much to change (0.1-1.0)
          quality: 'hd'
        }
      }
    })
  });
  
  const [fileData] = await response.json();
  return await waitForImage(fileData.id);
};

// Example
const enhanced = await enhanceImage(originalImageId, "improve lighting and colors");
```

## Best Practices

### Model Selection Guide

```typescript
const selectModel = (useCase: string, budget: 'low' | 'medium' | 'high') => {
  const models = {
    low: {
      general: 'comfyui/flux',
      editing: 'comfyui/flux/inpainting'
    },
    medium: {
      general: 'google-cloud/imagen3',
      editing: 'google-cloud/imagen3-edit'
    },
    high: {
      general: 'google-cloud/imagen4-ultra',
      editing: 'azure-openai/gpt-image-1-edit'
    }
  };
  
  const category = useCase.includes('edit') ? 'editing' : 'general';
  return models[budget][category];
};
```

### Optimal Parameters

```typescript
const optimizedGeneration = async (prompt: string, options = {}) => {
  const {
    model = 'comfyui/flux',
    size = 'large',
    quality = 'hd'
  } = options;
  
  const sizes = {
    small: { width: 512, height: 512 },
    medium: { width: 768, height: 768 },
    large: { width: 1024, height: 1024 },
    ultra: { width: 1536, height: 1536 }
  };
  
  return fetch(`${API_BASE}/file/generate-image`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      config: {
        prompt,
        generation_config_name: model,
        params: {
          ...sizes[size],
          quality,
          // Auto-optimization enabled
          enhance: true,
          seed: Math.floor(Math.random() * 1000000) // For reproducible results
        }
      }
    })
  });
};
```

### Error Handling

```typescript
const robustImageGeneration = async (prompt: string, retries = 3) => {
  for (let attempt = 1; attempt  setTimeout(r, 1000 * attempt));
    }
  }
};
```

## Response Format

The API returns an array of file objects:

```typescript
// Response structure
[
  {
    id: "file-id-here",
    image_generation_id: "generation-id",
    image_generation: {
      generation_config: {
        name: "comfyui/flux",
        price_per_generation: 1.0
      }
    },
    url: null, // Initially null, populated when ready
    thumbnail_url: null,
    tasks: [] // Empty when complete
  }
]
```

## Integration Examples

### React Hook
```typescript

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const generate = useCallback(async (prompt: string, model = 'comfyui/flux') => {
    setLoading(true);
    setError(null);
    
    try {
      const imageId = await generateImage(prompt, model);
      const imageUrl = await waitForImage(imageId);
      return imageUrl;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  return { generate, loading, error };
};
```

### Batch Generation
```typescript
const generateBatch = async (prompts: string[], model = 'comfyui/flux') => {
  const generations = prompts.map(prompt => generateImage(prompt, model));
  const imageIds = await Promise.all(generations);
  
  // Wait for all to complete
  const imageUrls = await Promise.all(
    imageIds.map(id => waitForImage(id))
  );
  
  return imageUrls;
};

// Usage
const urls = await generateBatch([
  "Red sports car",
  "Blue mountain landscape", 
  "Modern office interior"
]);
```

  **Ready to start?** Get your API token and begin generating images in minutes!

---

*SuperDuperAI Image Generation API • Multiple models • Flexible pricing • Production ready* 