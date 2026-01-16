 'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Copy, Check, Settings, Code, Zap } from 'lucide-react';

// Типы данных
interface Model {
  id: string;
  name: string;
  type: 'text-to-image' | 'image-to-image' | 'text-to-video' | 'image-to-video' | 'video-enhancement';
  price: number;
  priceUnit: 'per_image' | 'per_second';
  vipRequired: boolean;
  provider: string;
  description: string;
}

interface APIConfig {
  language: 'typescript' | 'python' | 'curl';
  model: string;
  fetchMethod: 'polling' | 'sse';
  apiType: 'image' | 'video';
  category: string;
}

interface InteractiveAPIDocsProps {
  apiType?: 'image' | 'video';
}

// Данные моделей (реальные из документации)
const imageModels: Model[] = [
  // Text-to-Image модели
  {
    id: 'comfyui/flux',
    name: 'ComfyUI Flux',
    type: 'text-to-image',
    price: 1.00,
    priceUnit: 'per_image',
    vipRequired: false,
    provider: 'ComfyUI',
    description: 'Budget-friendly general image generation'
  },
  {
    id: 'fal-ai/flux-pro/v1.1-ultra',
    name: 'Flux Pro Ultra',
    type: 'text-to-image',
    price: 1.00,
    priceUnit: 'per_image',
    vipRequired: true,
    provider: 'FAL AI',
    description: 'Fast high-quality generation'
  },
  {
    id: 'google-cloud/imagen3',
    name: 'Google Imagen 3',
    type: 'text-to-image',
    price: 1.50,
    priceUnit: 'per_image',
    vipRequired: true,
    provider: 'Google Cloud',
    description: 'Balanced quality and cost'
  },
  {
    id: 'google-cloud/imagen4',
    name: 'Google Imagen 4',
    type: 'text-to-image',
    price: 2.00,
    priceUnit: 'per_image',
    vipRequired: true,
    provider: 'Google Cloud',
    description: 'Latest Google technology'
  },
  {
    id: 'azure-openai/gpt-image-1',
    name: 'GPT-Image-1',
    type: 'text-to-image',
    price: 2.00,
    priceUnit: 'per_image',
    vipRequired: true,
    provider: 'Azure OpenAI',
    description: 'OpenAI image generation'
  },
  {
    id: 'google-cloud/imagen4-ultra',
    name: 'Google Imagen 4 Ultra',
    type: 'text-to-image',
    price: 3.00,
    priceUnit: 'per_image',
    vipRequired: true,
    provider: 'Google Cloud',
    description: 'Highest quality image generation'
  },
  
  // Image-to-Image модели (редактирование)
  {
    id: 'comfyui/flux/inpainting',
    name: 'ComfyUI Flux Inpainting',
    type: 'image-to-image',
    price: 1.00,
    priceUnit: 'per_image',
    vipRequired: false,
    provider: 'ComfyUI',
    description: 'Budget-friendly image editing and inpainting'
  },
  {
    id: 'google-cloud/imagen3-edit',
    name: 'Google Imagen 3 Edit',
    type: 'image-to-image',
    price: 2.00,
    priceUnit: 'per_image',
    vipRequired: true,
    provider: 'Google Cloud',
    description: 'Professional image editing'
  },
  {
    id: 'fal-ai/flux-pro/kontext',
    name: 'Flux Pro Kontext',
    type: 'image-to-image',
    price: 2.00,
    priceUnit: 'per_image',
    vipRequired: true,
    provider: 'FAL AI',
    description: 'Context-aware image editing'
  },
  {
    id: 'azure-openai/gpt-image-1-edit',
    name: 'GPT-Image-1 Edit',
    type: 'image-to-image',
    price: 2.50,
    priceUnit: 'per_image',
    vipRequired: true,
    provider: 'Azure OpenAI',
    description: 'Premium image editing capabilities'
  }
];

const videoModels: Model[] = [
  // Text-to-Video модели
  {
    id: 'google-cloud/veo2-text2video',
    name: 'Google VEO2 Text-to-Video',
    type: 'text-to-video',
    price: 2.00,
    priceUnit: 'per_second',
    vipRequired: true,
    provider: 'Google Cloud',
    description: 'Text-to-video generation'
  },
  {
    id: 'azure-openai/sora',
    name: 'OpenAI Sora',
    type: 'text-to-video',
    price: 2.00,
    priceUnit: 'per_second',
    vipRequired: true,
    provider: 'Azure OpenAI',
    description: 'Premium text-to-video generation'
  },
  {
    id: 'google-cloud/veo3-text2video',
    name: 'Google VEO3 Text-to-Video',
    type: 'text-to-video',
    price: 3.00,
    priceUnit: 'per_second',
    vipRequired: true,
    provider: 'Google Cloud',
    description: 'Latest text-to-video technology'
  },
  
  // Image-to-Video модели
  {
    id: 'comfyui/ltx',
    name: 'ComfyUI LTX',
    type: 'image-to-video',
    price: 0.40,
    priceUnit: 'per_second',
    vipRequired: false,
    provider: 'ComfyUI',
    description: 'Budget-friendly image animation'
  },
  {
    id: 'fal-ai/kling-video/v2.1/standard/image-to-video',
    name: 'Kling Video 2.1 Standard',
    type: 'image-to-video',
    price: 1.00,
    priceUnit: 'per_second',
    vipRequired: true,
    provider: 'FAL AI',
    description: 'Standard quality image animation'
  },
  {
    id: 'fal-ai/minimax/video-01/image-to-video',
    name: 'Minimax Video-01',
    type: 'image-to-video',
    price: 1.20,
    priceUnit: 'per_second',
    vipRequired: true,
    provider: 'FAL AI',
    description: 'High-quality image animation'
  },
  {
    id: 'google-cloud/veo2',
    name: 'Google VEO2 Image-to-Video',
    type: 'image-to-video',
    price: 2.00,
    priceUnit: 'per_second',
    vipRequired: true,
    provider: 'Google Cloud',
    description: 'Professional image animation'
  },
  {
    id: 'fal-ai/kling-video/v2.1/pro/image-to-video',
    name: 'Kling Video 2.1 Pro',
    type: 'image-to-video',
    price: 2.00,
    priceUnit: 'per_second',
    vipRequired: true,
    provider: 'FAL AI',
    description: 'Premium image animation'
  },
  {
    id: 'google-cloud/veo3',
    name: 'Google VEO3 Image-to-Video',
    type: 'image-to-video',
    price: 3.00,
    priceUnit: 'per_second',
    vipRequired: true,
    provider: 'Google Cloud',
    description: 'Latest image animation technology'
  },
  
  // Video Enhancement модели
  {
    id: 'comfyui/lip-sync',
    name: 'ComfyUI Lip Sync',
    type: 'video-enhancement',
    price: 0.40,
    priceUnit: 'per_second',
    vipRequired: false,
    provider: 'ComfyUI',
    description: 'Budget-friendly lip synchronization'
  }
];

export const InteractiveAPIDocs: React.FC<InteractiveAPIDocsProps> = ({ apiType = 'image' }) => {
  const [config, setConfig] = useState<APIConfig>({
    language: 'typescript',
    model: apiType === 'image' ? 'comfyui/flux' : 'google-cloud/veo2-text2video',
    fetchMethod: 'polling',
    apiType: apiType,
    category: apiType === 'image' ? 'text-to-image' : 'text-to-video'
  });
  
  const [copied, setCopied] = useState(false);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);

  // Получаем текущие модели в зависимости от типа API
  const allModels = config.apiType === 'image' ? imageModels : videoModels;
  const currentModels = allModels.filter(model => model.type === config.category);

  // Получаем доступные категории для текущего типа API
  const getCategories = () => {
    if (config.apiType === 'image') {
      return [
        { id: 'text-to-image', label: '🎨 Generate', description: 'Create from text' },
        { id: 'image-to-image', label: '✏️ Edit', description: 'Process images' }
      ];
    } else {
      return [
        { id: 'text-to-video', label: '📝 From Text', description: 'Create from description' },
        { id: 'image-to-video', label: '🖼️ From Image', description: 'Animate images' },
        { id: 'video-enhancement', label: '🎬 Enhance', description: 'Improve videos' }
      ];
    }
  };

  // Обновляем выбранную модель при изменении категории
  useEffect(() => {
    const defaultModel = currentModels[0];
    if (defaultModel && !currentModels.find(m => m.id === config.model)) {
      setConfig(prev => ({ ...prev, model: defaultModel.id }));
    }
  }, [config.category, currentModels, config.model]);

  // Обновляем selectedModel при изменении выбранной модели
  useEffect(() => {
    const model = currentModels.find(m => m.id === config.model);
    setSelectedModel(model || null);
  }, [config.model, currentModels]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const generateCode = () => {
    const isVideo = config.apiType === 'video';
    const endpoint = isVideo ? 'generate-video' : 'generate-image';
    const prompt = isVideo ? 'A bird flying over a serene lake at sunset' : 'A beautiful sunset over mountains';
    
    switch (config.language) {
      case 'typescript':
        return generateTypeScriptCode(endpoint, prompt, isVideo);
      case 'python':
        return generatePythonCode(endpoint, prompt, isVideo);
      case 'curl':
        return generateCurlCode(endpoint, prompt, isVideo);
      default:
        return '';
    }
  };

  const generateTypeScriptCode = (endpoint: string, prompt: string, isVideo: boolean) => {
    const waitFunction = isVideo ? 'waitForVideo' : 'waitForImage';
    const timeout = isVideo ? '15 * 60 * 1000' : '300000';
    const pollInterval = isVideo ? '5000' : '2000';
    
    return `const API_BASE = 'https://editor.superduperai.co/api/v1';
const headers = {
  'Authorization': 'Bearer YOUR_API_TOKEN',
  'Content-Type': 'application/json'
};

// Generate ${isVideo ? 'video' : 'image'}
const generate${isVideo ? 'Video' : 'Image'} = async (prompt: string) => {
  const response = await fetch(\`\${API_BASE}/file/${endpoint}\`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      config: {
        prompt: prompt,
        generation_config_name: '${config.model}',
        params: {${isVideo ? `
          duration: 8,
          aspect_ratio: '16:9'` : `
          width: 1024,
          height: 1024,
          quality: 'hd'`}
        }
      }
    })
  });
  
  const ${isVideo ? 'fileData' : '[fileData]'} = await response.json();
  return fileData.id;
};

${config.fetchMethod === 'polling' ? `
// Polling method
const ${waitFunction} = async (fileId: string) => {
  const timeout = ${timeout};
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    const response = await fetch(\`\${API_BASE}/file/\${fileId}\`, { headers });
    const status = await response.json();
    
    if (status.url) return status.url;
    if (status.error) throw new Error(status.error);
    
    await new Promise(r => setTimeout(r, ${pollInterval}));
  }
  
  throw new Error('Generation timeout');
};` : `
// Server-Sent Events method
const ${waitFunction} = async (fileId: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const eventSource = new EventSource(\`\${API_BASE}/events/file.\${fileId}\`, {
      headers: { 'Authorization': 'Bearer YOUR_API_TOKEN' }
    });
    
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.url) {
        eventSource.close();
        resolve(data.url);
      }
      if (data.error) {
        eventSource.close();
        reject(new Error(data.error));
      }
    };
    
    eventSource.onerror = () => {
      eventSource.close();
      reject(new Error('SSE connection failed'));
    };
  });
};`}

// Usage
const main = async () => {
  try {
    const ${isVideo ? 'video' : 'image'}Id = await generate${isVideo ? 'Video' : 'Image'}("${prompt}");
    const ${isVideo ? 'video' : 'image'}Url = await ${waitFunction}(${isVideo ? 'video' : 'image'}Id);
    console.log('Generated ${isVideo ? 'video' : 'image'}:', ${isVideo ? 'video' : 'image'}Url);
  } catch (error) {
    console.error('Error:', error);
  }
};

main();`;
  };

  const generatePythonCode = (endpoint: string, prompt: string, isVideo: boolean) => {
    const waitFunction = isVideo ? 'wait_for_video' : 'wait_for_image';
    const timeout = isVideo ? '15 * 60' : '300';
    const pollInterval = isVideo ? '5' : '2';
    
    return `import requests
import json
import time
${config.fetchMethod === 'sse' ? 'import sseclient' : ''}

API_BASE = 'https://editor.superduperai.co/api/v1'
headers = {
    'Authorization': 'Bearer YOUR_API_TOKEN',
    'Content-Type': 'application/json'
}

def generate_${isVideo ? 'video' : 'image'}(prompt):
    response = requests.post(
        f'{API_BASE}/file/${endpoint}',
        headers=headers,
        json={
            'config': {
                'prompt': prompt,
                'generation_config_name': '${config.model}',
                'params': {${isVideo ? `
                    'duration': 8,
                    'aspect_ratio': '16:9'` : `
                    'width': 1024,
                    'height': 1024,
                    'quality': 'hd'`}
                }
            }
        }
    )
    
    data = response.json()
    return data${isVideo ? "['id']" : "[0]['id']"}

${config.fetchMethod === 'polling' ? `
# Polling method
def ${waitFunction}(file_id, timeout=${timeout}):
    start_time = time.time()
    
    while time.time() - start_time < timeout:
        response = requests.get(f'{API_BASE}/file/{file_id}', headers=headers)
        status = response.json()
        
        if status.get('url'):
            return status['url']  # ✅ Generation complete
            
        if status.get('error'):
            raise Exception(status['error'])  # ❌ Generation failed
            
        # Optional: Check progress
        if status.get('progress'):
            print(f"Progress: {status['progress']}%")
            
        time.sleep(${pollInterval})  # Wait ${pollInterval} seconds
    
    raise Exception('Generation timeout')` : `
# Server-Sent Events method
def ${waitFunction}(file_id, timeout=${timeout}):
    """
    Note: Requires 'pip install sseclient-py'
    SSE connections may experience timeouts. Use as enhancement to polling.
    """
    import sseclient
    
    url = f'{API_BASE}/events/file.{file_id}'
    response = requests.get(url, headers=headers, stream=True)
    client = sseclient.SSEClient(response)
    
    start_time = time.time()
    
    try:
        for event in client.events():
            if time.time() - start_time > timeout:
                raise Exception('SSE timeout')
                
            data = json.loads(event.data)
            
            if data.get('url'):
                return data['url']  # ✅ Generation complete
                
            if data.get('error'):
                raise Exception(data['error'])  # ❌ Generation failed
                
            # Optional: Check progress
            if data.get('progress'):
                print(f"Progress: {data['progress']}%")
                
    except Exception as e:
        print(f"SSE connection failed: {e}")
        print("Falling back to polling method...")
        # Fallback to polling
        return ${waitFunction}_polling(file_id, timeout)

def ${waitFunction}_polling(file_id, timeout=${timeout}):
    """Fallback polling method for SSE failures"""
    start_time = time.time()
    
    while time.time() - start_time < timeout:
        response = requests.get(f'{API_BASE}/file/{file_id}', headers=headers)
        status = response.json()
        
        if status.get('url'):
            return status['url']
            
        if status.get('error'):
            raise Exception(status['error'])
            
        time.sleep(${pollInterval})
    
    raise Exception('Generation timeout')`}

# Usage
if __name__ == '__main__':
    try:
        ${isVideo ? 'video' : 'image'}_id = generate_${isVideo ? 'video' : 'image'}("${prompt}")
        print(f'Generated ${isVideo ? 'video' : 'image'} ID: {${isVideo ? 'video' : 'image'}_id}')
        
        ${isVideo ? 'video' : 'image'}_url = ${waitFunction}(${isVideo ? 'video' : 'image'}_id)
        print(f'Generated ${isVideo ? 'video' : 'image'}: {${isVideo ? 'video' : 'image'}_url}')
    except Exception as error:
        print(f'Error: {error}')`;
  };

  const generateCurlCode = (endpoint: string, prompt: string, isVideo: boolean) => {
    const timeout = isVideo ? '900' : '300';
    const pollInterval = isVideo ? '5' : '2';
    
    return `#!/bin/bash

API_BASE="https://editor.superduperai.co/api/v1"
API_TOKEN="YOUR_API_TOKEN"

# Generate ${isVideo ? 'video' : 'image'}
echo "Starting ${isVideo ? 'video' : 'image'} generation..."
RESPONSE=$(curl -s -X POST "$API_BASE/file/${endpoint}" \\
  -H "Authorization: Bearer $API_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "config": {
      "prompt": "${prompt}",
      "generation_config_name": "${config.model}",
      "params": {${isVideo ? `
        "duration": 8,
        "aspect_ratio": "16:9"` : `
        "width": 1024,
        "height": 1024,
        "quality": "hd"`}
      }
    }
  }')

# Extract file ID from response
${isVideo ? 'VIDEO_ID' : 'IMAGE_ID'}=$(echo "$RESPONSE" | jq -r '.${isVideo ? 'id' : '[0].id'}')

if [ "$${isVideo ? 'VIDEO_ID' : 'IMAGE_ID'}" == "null" ] || [ "$${isVideo ? 'VIDEO_ID' : 'IMAGE_ID'}" == "" ]; then
    echo "Error: Failed to get ${isVideo ? 'video' : 'image'} ID"
    echo "Response: $RESPONSE"
    exit 1
fi

echo "Generated ${isVideo ? 'video' : 'image'} ID: $${isVideo ? 'VIDEO_ID' : 'IMAGE_ID'}"

${config.fetchMethod === 'polling' ? `
# Polling method
wait_for_${isVideo ? 'video' : 'image'}() {
    local file_id=$1
    local timeout=${timeout}
    local start_time=$(date +%s)
    
    while true; do
        current_time=$(date +%s)
        elapsed=$((current_time - start_time))
        
        if [ $elapsed -ge $timeout ]; then
            echo "Error: Generation timeout after ${timeout} seconds"
            exit 1
        fi
        
        # Check status
        STATUS=$(curl -s -X GET "$API_BASE/file/$file_id" \\
            -H "Authorization: Bearer $API_TOKEN")
        
        # Check if generation is complete
        URL=$(echo "$STATUS" | jq -r '.url // empty')
        if [ -n "$URL" ] && [ "$URL" != "null" ]; then
            echo "✅ Generation complete!"
            echo "Generated ${isVideo ? 'video' : 'image'}: $URL"
            return 0
        fi
        
        # Check for errors
        ERROR=$(echo "$STATUS" | jq -r '.error // empty')
        if [ -n "$ERROR" ] && [ "$ERROR" != "null" ]; then
            echo "❌ Generation failed: $ERROR"
            exit 1
        fi
        
        # Optional: Show progress
        PROGRESS=$(echo "$STATUS" | jq -r '.progress // empty')
        if [ -n "$PROGRESS" ] && [ "$PROGRESS" != "null" ]; then
            echo "Progress: $PROGRESS%"
        fi
        
        sleep ${pollInterval}
    done
}

# Wait for completion
wait_for_${isVideo ? 'video' : 'image'} "$${isVideo ? 'VIDEO_ID' : 'IMAGE_ID'}"` : `
# Server-Sent Events method
wait_for_${isVideo ? 'video' : 'image'}() {
    local file_id=$1
    local timeout=${timeout}
    
    echo "Connecting to SSE stream..."
    
    # Use curl with --no-buffer for SSE
    timeout $timeout curl -s --no-buffer -X GET \\
        "$API_BASE/events/file.$file_id" \\
        -H "Authorization: Bearer $API_TOKEN" \\
        -H "Accept: text/event-stream" \\
        -H "Cache-Control: no-cache" | \\
    while IFS= read -r line; do
        # Parse SSE data lines
        if [[ $line == data:* ]]; then
            data_content=\${line#data: }
            
            # Check if generation is complete
            url=$(echo "$data_content" | jq -r '.url // empty' 2>/dev/null)
            if [ -n "$url" ] && [ "$url" != "null" ]; then
                echo "✅ Generation complete!"
                echo "Generated ${isVideo ? 'video' : 'image'}: $url"
                return 0
            fi
            
            # Check for errors
            error=$(echo "$data_content" | jq -r '.error // empty' 2>/dev/null)
            if [ -n "$error" ] && [ "$error" != "null" ]; then
                echo "❌ Generation failed: $error"
                return 1
            fi
            
            # Optional: Show progress
            progress=$(echo "$data_content" | jq -r '.progress // empty' 2>/dev/null)
            if [ -n "$progress" ] && [ "$progress" != "null" ]; then
                echo "Progress: $progress%"
            fi
        fi
    done
    
    # If SSE fails, fallback to polling
    echo "SSE connection ended, falling back to polling..."
    wait_for_${isVideo ? 'video' : 'image'}_polling "$file_id"
}

wait_for_${isVideo ? 'video' : 'image'}_polling() {
    local file_id=$1
    local timeout=${timeout}
    local start_time=$(date +%s)
    
    while true; do
        current_time=$(date +%s)
        elapsed=$((current_time - start_time))
        
        if [ $elapsed -ge $timeout ]; then
            echo "Error: Generation timeout"
            exit 1
        fi
        
        STATUS=$(curl -s -X GET "$API_BASE/file/$file_id" \\
            -H "Authorization: Bearer $API_TOKEN")
        
        URL=$(echo "$STATUS" | jq -r '.url // empty')
        if [ -n "$URL" ] && [ "$URL" != "null" ]; then
            echo "Generated ${isVideo ? 'video' : 'image'}: $URL"
            return 0
        fi
        
        ERROR=$(echo "$STATUS" | jq -r '.error // empty')
        if [ -n "$ERROR" ] && [ "$ERROR" != "null" ]; then
            echo "Generation failed: $ERROR"
            exit 1
        fi
        
        sleep ${pollInterval}
    done
}

# Wait for completion using SSE
wait_for_${isVideo ? 'video' : 'image'} "$${isVideo ? 'VIDEO_ID' : 'IMAGE_ID'}"` }`;
  };

  return (
    <div className="space-y-6">
      {/* Configuration Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            API Configuration
          </CardTitle>
          <CardDescription>
            Configure your API request parameters and preview the generated code
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Category Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {config.apiType === 'image' ? 'Image Task Type' : 'Video Task Type'}
            </label>
            <Tabs value={config.category} onValueChange={(value: string) => {
              setConfig(prev => ({ ...prev, category: value }));
              // Выбираем первую модель из новой категории
              const newCategoryModels = allModels.filter(model => model.type === value);
              if (newCategoryModels.length > 0) {
                setConfig(prev => ({ ...prev, model: newCategoryModels[0].id }));
              }
            }}>
              <TabsList className={getCategories().length === 2 ? 'grid w-full grid-cols-2' : getCategories().length === 3 ? 'grid w-full grid-cols-3' : 'grid w-full grid-cols-1'}>
                {getCategories().map(category => (
                  <TabsTrigger key={category.id} value={category.id} className="flex flex-col items-center gap-1 p-3">
                    <span className="text-sm font-medium">{category.label}</span>
                    <span className="text-xs text-muted-foreground">{category.description}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Language Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Programming Language</label>
            <Tabs value={config.language} onValueChange={(value: string) => setConfig(prev => ({ ...prev, language: value as APIConfig['language'] }))}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="typescript" className="flex items-center gap-2">
                  <Code className="w-4 h-4" />
                  TypeScript
                </TabsTrigger>
                <TabsTrigger value="python" className="flex items-center gap-2">
                  <Code className="w-4 h-4" />
                  Python
                </TabsTrigger>
                <TabsTrigger value="curl" className="flex items-center gap-2">
                  <Code className="w-4 h-4" />
                  cURL
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Fetch Method Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Data Fetching Method</label>
            <Tabs value={config.fetchMethod} onValueChange={(value) => setConfig(prev => ({ ...prev, fetchMethod: value as 'polling' | 'sse' }))}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="polling">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Polling (Recommended)
                  </div>
                </TabsTrigger>
                <TabsTrigger value="sse">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Server-Sent Events
                  </div>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Model Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium">AI Model ({currentModels.length} available)</label>
            {currentModels.length > 0 ? (
              <div className="grid grid-cols-1 gap-2">
                {currentModels.map((model) => (
                  <div
                    key={model.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      config.model === model.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setConfig(prev => ({ ...prev, model: model.id }))}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{model.name}</span>
                          {model.vipRequired && (
                            <Badge variant="secondary" className="text-xs">
                              VIP Required
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {model.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          ${model.price.toFixed(2)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {model.priceUnit === 'per_image' ? 'per image' : 'per second'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No models available for this category</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Generated Code */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5" />
                Generated Code
              </CardTitle>
              <CardDescription>
                {selectedModel && (
                  <>
                    Using <strong>{selectedModel.name}</strong> • 
                    ${selectedModel.price.toFixed(2)} {selectedModel.priceUnit === 'per_image' ? 'per image' : 'per second'}
                    {selectedModel.vipRequired && ' • VIP Required'}
                  </>
                )}
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(generateCode())}
              className="flex items-center gap-2"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy Code'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{generateCode()}</code>
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};