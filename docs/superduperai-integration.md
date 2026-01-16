# SuperDuperAI Integration Guide

## Overview

This project integrates with SuperDuperAI API for video generation using the VEO3 model. The integration provides a complete payment-to-video-generation workflow.

## Configuration

### Environment Variables

Add these variables to your `.env.local` file:

```env
# SuperDuperAI API Configuration
SUPERDUPERAI_TOKEN=your_superduperai_token
SUPERDUPERAI_URL=https://dev-editor.superduperai.co
```

### Getting SuperDuperAI Token

1. Sign up at [SuperDuperAI](https://dev-editor.superduperai.co)
2. Navigate to API settings
3. Generate a new API token
4. Copy the token to your environment variables

## API Endpoints

### `/api/generate-veo3`

**POST** - Start video generation
```json
{
  "generationId": "veo3_1234567890_abc123",
  "prompt": "A beautiful sunset over mountains",
  "videoCount": 1,
  "status": "processing",
  "progress": 0,
  "createdAt": "2025-01-14T12:00:00Z"
}
```

**GET** - Check generation status
```
GET /api/generate-veo3?generationId=veo3_1234567890_abc123
```

Response:
```json
{
  "success": true,
  "generationId": "veo3_1234567890_abc123",
  "status": "completed",
  "progress": 100,
  "videos": [
    {
      "fileId": "file_abc123",
      "url": "https://example.com/video.mp4",
      "thumbnailUrl": "https://example.com/thumb.jpg"
    }
  ]
}
```

## Video Generation Process

1. **Payment**: User pays via Stripe for video generation credits
2. **Webhook**: Stripe webhook triggers video generation
3. **API Call**: System calls SuperDuperAI API with VEO3 model
4. **Polling**: Status page polls for completion
5. **Download**: User can download completed videos

## SuperDuperAI API Integration

### Video Generation Request

```typescript
const payload = {
  config: {
    prompt: "Your video description",
    negative_prompt: "",
    width: 1280,
    height: 720,
    aspect_ratio: "16:9",
    duration: 5,
    seed: Math.floor(Math.random() * 1000000),
    generation_config_name: "google-cloud/veo3",
    frame_rate: 30,
    batch_size: 1,
    references: []
  }
};

const response = await fetch(`${config.url}/api/v1/file/generate-video`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${config.token}`,
  },
  body: JSON.stringify(payload)
});
```

### File Status Check

```typescript
const response = await fetch(`${config.url}/api/v1/file/${fileId}`, {
  headers: {
    'Authorization': `Bearer ${config.token}`
  }
});
```

## Components

### `SimpleVEO3Generator`

Main component for video generation interface:
- Prompt input
- Payment buttons
- Generation status tracking
- Video preview and download

### `VEO3PaymentButtons`

Stripe payment integration:
- Single video ($1)
- Triple pack ($2)
- Checkout session creation
- Payment success handling

## Development

### Testing Without Payment

In development mode, a test button is available to generate videos without payment:

```tsx
{process.env.NODE_ENV === 'development' && (
  <Button onClick={handleGenerate}>
    Test Generate Video
  </Button>
)}
```

### Status Polling

The system polls generation status every 5 seconds:

```typescript
const pollGenerationStatus = async (generationId: string) => {
  const poll = async () => {
    const response = await fetch(`/api/generate-veo3?generationId=${generationId}`);
    const status = await response.json();
    
    if (status.status === 'completed') {
      // Handle completion
    } else if (status.status === 'processing') {
      setTimeout(poll, 5000); // Continue polling
    }
  };
  
  poll();
};
```

## Error Handling

The system handles various error scenarios:

1. **API Errors**: SuperDuperAI API failures
2. **Validation Errors**: Invalid request data
3. **File Not Found**: Missing generation data
4. **Timeout**: Generation takes too long
5. **Payment Failures**: Stripe payment issues

## File Storage

Generation data is stored in `.veo3-generations/` directory:

```
.veo3-generations/
├── veo3_1234567890_abc123.json
├── veo3_1234567890_def456.json
└── .gitkeep
```

Each file contains:
- Generation metadata
- Status and progress
- Video file IDs and URLs
- Error information (if any)

## Security

- API tokens are server-side only
- No sensitive data exposed to client
- Proper error handling without exposing internals
- Token validation and format checking

## Troubleshooting

### Common Issues

1. **Invalid Token**: Check token format and permissions
2. **API Timeout**: Increase timeout values
3. **File Not Found**: Check file ID format
4. **Payment Webhook**: Verify webhook endpoints

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
```

This will show detailed API request/response logs in the console. 