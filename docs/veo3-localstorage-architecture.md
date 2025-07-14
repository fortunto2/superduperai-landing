# VEO3 LocalStorage Architecture

## Overview

The VEO3 video generation system has been redesigned to use localStorage for data persistence instead of filesystem storage. This change makes the system compatible with read-only production environments like Vercel and Cloudflare Workers.

## Key Benefits

- ✅ **Production Compatible**: No filesystem dependencies
- ✅ **Multi-File Support**: Handle multiple file IDs via comma separation
- ✅ **Universal Routes**: Support both generation and individual file routes
- ✅ **Real-time Updates**: Live status checking via SuperDuperAI API
- ✅ **Client-side Storage**: Data persists in browser localStorage

## Architecture Components

### 1. Payment Flow (`/api/create-checkout`)

```typescript
// Simplified API - no filesystem operations
POST /api/create-checkout
{
  "priceId": "price_xxx",
  "quantity": 1 | 3
}

Response:
{
  "sessionId": "cs_xxx",
  "url": "https://checkout.stripe.com/xxx"
}
```

### 2. LocalStorage Data Structure

```typescript
interface GenerationData {
  generationId: string;        // Stripe session ID
  sessionId?: string;          // Same as generationId
  prompt: string;              // User's prompt
  videoCount: number;          // 1 or 3
  createdAt: string;           // ISO timestamp
  fileIds: string[];           // SuperDuperAI file IDs
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;            // 0-100
  videos: Array<{
    fileId: string;
    url?: string;
    thumbnailUrl?: string;
    status: 'pending' | 'processing' | 'completed' | 'error';
  }>;
}
```

### 3. Storage Key Format

```javascript
// localStorage key
`veo3_generation_${generationId}`

// Example
veo3_generation_cs_test_xxx
```

### 4. Status Page Routes

#### Generation Status
```
/[locale]/veo3-status/[generationId]
```
- Handles Stripe session IDs
- Supports comma-separated file IDs
- Auto-creates localStorage entries

#### Universal File Route
```
/[locale]/file/[fileId]
```
- Direct file ID access
- Individual file status
- Type detection (video/image/audio)

## Implementation Details

### Payment Component (`veo3-payment-buttons.tsx`)

```typescript
const handlePayment = async (type: 'single' | 'triple') => {
  // Create Stripe checkout
  const { sessionId, url } = await createCheckout();
  
  // Save to localStorage
  const generationData = {
    generationId: sessionId,
    sessionId: sessionId,
    prompt: prompt.trim(),
    videoCount: type === 'single' ? 1 : 3,
    createdAt: new Date().toISOString(),
    fileIds: [],
    status: 'pending',
    progress: 0,
    videos: []
  };
  
  localStorage.setItem(`veo3_generation_${sessionId}`, JSON.stringify(generationData));
  
  // Redirect to Stripe
  window.location.href = url;
};
```

### Status Client (`veo3-status-client.tsx`)

```typescript
// Load from localStorage
const loadGenerationData = () => {
  const stored = localStorage.getItem(`veo3_generation_${generationId}`);
  return stored ? JSON.parse(stored) : null;
};

// Parse file IDs from URL
const parseFileIds = (genId: string): string[] => {
  if (genId.includes(',')) {
    return genId.split(',').map(id => id.trim()).filter(Boolean);
  }
  return genId.length > 10 && !genId.startsWith('veo3_') ? [genId] : [];
};

// Check file status via API
const checkFileStatus = async (fileId: string) => {
  const response = await fetch(`/api/file/${fileId}`);
  return response.json();
};
```

## Multi-File Support

### URL Formats

```bash
# Single file
/en/veo3-status/cm5gkpxz4000008l6dxrg8xhk

# Multiple files (comma-separated)
/en/veo3-status/cm5gkpxz4000008l6dxrg8xhk,cm5gkpxz4000008l6dxrg8xhl,cm5gkpxz4000008l6dxrg8xhm

# Universal file route
/en/file/cm5gkpxz4000008l6dxrg8xhk
```

### Processing Logic

```typescript
// Auto-detect file IDs from generationId
useEffect(() => {
  if (generationData && generationData.fileIds.length === 0) {
    const fileIds = parseFileIds(generationId);
    if (fileIds.length > 0) {
      const updatedData = {
        ...generationData,
        fileIds,
        videoCount: fileIds.length,
      };
      saveGenerationData(updatedData);
    }
  }
}, [generationData, generationId]);
```

## Status Updates

### Real-time Monitoring

```typescript
// Auto-refresh every 5 seconds for processing videos
useEffect(() => {
  if (generationData?.status === 'processing') {
    const interval = setInterval(() => {
      refreshStatus();
    }, 5000);
    return () => clearInterval(interval);
  }
}, [generationData]);
```

### Progress Calculation

```typescript
const updateVideoStatuses = async (data: GenerationData) => {
  const updatedVideos = await Promise.all(
    data.fileIds.map(async (fileId) => {
      const fileStatus = await checkFileStatus(fileId);
      return {
        fileId,
        status: fileStatus.status,
        url: fileStatus.url,
        thumbnailUrl: fileStatus.thumbnailUrl,
      };
    })
  );

  const completedCount = updatedVideos.filter(v => v.status === 'completed').length;
  const progress = (completedCount / data.videoCount) * 100;
  
  return { ...data, videos: updatedVideos, progress };
};
```

## API Integration

### File Status Endpoint

```typescript
// /api/file/[id]/route.ts
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  
  // Proxy to SuperDuperAI API
  const response = await fetch(`${SUPERDUPERAI_URL}/api/v1/file/${id}`, {
    headers: {
      'Authorization': `Bearer ${SUPERDUPERAI_TOKEN}`,
    },
  });
  
  return response.json();
}
```

### SuperDuperAI Response Format

```json
{
  "id": "cm5gkpxz4000008l6dxrg8xhk",
  "status": "completed",
  "url": "https://superduperai.co/file/xxx.mp4",
  "thumbnailUrl": "https://superduperai.co/file/xxx.jpg",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

## Testing

### Test Scenarios

1. **Fresh Payment Flow**
   - Create new generation via payment
   - Verify localStorage creation
   - Check redirect to status page

2. **Direct File Access**
   - Access `/en/file/[fileId]` directly
   - Verify API status checking
   - Check auto-refresh behavior

3. **Multi-File Support**
   - Access comma-separated file IDs
   - Verify individual file tracking
   - Check progress calculation

### Test File

Use `test-multi-file-status.html` for comprehensive testing:

```bash
# Open in browser
open test-multi-file-status.html
```

## Migration Notes

### From Filesystem to localStorage

1. **Removed Dependencies**
   - `fs/promises` filesystem operations
   - `.veo3-generations/` directory
   - File-based persistence

2. **Added Features**
   - localStorage persistence
   - Multi-file URL support
   - Universal file routes
   - Real-time API integration

3. **Maintained Compatibility**
   - Same UI/UX experience
   - Identical status page functionality
   - Preserved webhook integration

## Troubleshooting

### Common Issues

1. **localStorage Not Available**
   ```typescript
   // Check localStorage availability
   if (typeof localStorage === 'undefined') {
     console.error('localStorage not available');
     return;
   }
   ```

2. **File ID Parsing Errors**
   ```typescript
   // Validate file ID format
   const isValidFileId = (id: string) => {
     return id.length > 10 && /^[a-zA-Z0-9_-]+$/.test(id);
   };
   ```

3. **API Rate Limits**
   ```typescript
   // Implement exponential backoff
   const checkFileStatusWithRetry = async (fileId: string, retries = 3) => {
     for (let i = 0; i < retries; i++) {
       try {
         return await checkFileStatus(fileId);
       } catch (error) {
         if (i === retries - 1) throw error;
         await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
       }
     }
   };
   ```

## Future Enhancements

1. **Database Integration**
   - Move from localStorage to database
   - Server-side session management
   - Cross-device synchronization

2. **Enhanced Multi-File Support**
   - Batch operations
   - Parallel processing
   - Queue management

3. **Advanced Status Features**
   - WebSocket real-time updates
   - Push notifications
   - Email status updates

## Conclusion

The localStorage-based architecture provides a robust, production-ready solution for VEO3 video generation status tracking. It eliminates filesystem dependencies while maintaining full functionality and adding new features like multi-file support.

The system is now ready for deployment in any environment, including serverless platforms with read-only filesystems. 