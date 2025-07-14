# Universal File Routes Documentation

## Overview

The universal file routes system provides a flexible way to track any type of AI-generated file using their unique fileId, not just VEO3 videos. This system complements the existing generation-based routes.

## Route Structure

### File-based Routes (NEW)
- **Pattern**: `/[locale]/file/[fileId]`
- **Purpose**: Track individual files by their SuperDuperAI fileId
- **Example**: `/en/file/accbc432-3652-4417-b68e-e10fc9a0bc69`

### Generation-based Routes (EXISTING)
- **Pattern**: `/[locale]/veo3-status/[generationId]`
- **Purpose**: Track entire generations (multiple files)
- **Example**: `/en/veo3-status/sunset_test_1752530193`

## When to Use Which Route

### Use File Routes When:
- ✅ You have a specific fileId from SuperDuperAI
- ✅ You want to track a single file's progress
- ✅ You're integrating with external systems using fileIds
- ✅ You need direct links to individual files

### Use Generation Routes When:
- ✅ You want to track multiple files from one order
- ✅ You have payment/session context
- ✅ You want to see the complete generation overview
- ✅ You're working with user-facing interfaces

## File Types Supported

The universal file routes support all SuperDuperAI file types:

- **Video** (`video`): VEO3 video generations
- **Image** (`image`): Image generations
- **Audio** (`audio`): Audio generations
- **Other** (`other`): Any other file type

## Technical Implementation

### Components
- **Page**: `src/app/[locale]/file/[fileId]/page.tsx`
- **Client**: `src/components/file/file-status-client.tsx`
- **OpenGraph**: `src/app/[locale]/file/[fileId]/opengraph-image.tsx`
- **Utilities**: `src/lib/file-utils.ts`

### API Endpoints
- **File Status**: `GET /api/file/[fileId]` - Proxy to SuperDuperAI
- **Generation Status**: `GET /api/generate-veo3?generationId=[id]` - Local generation data

### Validation
- **FileId**: Must be valid UUID format
- **GenerationId**: Must follow pattern (veo3_, api_test_, sunset_test_)

## Usage Examples

### Get File Status URL
```typescript
import { getFileStatusUrl } from '@/lib/file-utils';

const fileUrl = getFileStatusUrl('accbc432-3652-4417-b68e-e10fc9a0bc69', 'en');
// Returns: /en/file/accbc432-3652-4417-b68e-e10fc9a0bc69
```

### Find Generation by FileId
```typescript
import { findGenerationByFileId } from '@/lib/file-utils';

const generationId = await findGenerationByFileId('accbc432-3652-4417-b68e-e10fc9a0bc69');
// Returns: sunset_test_1752530193
```

### Get All FileIds from Generation
```typescript
import { getFileIdsFromGeneration } from '@/lib/file-utils';

const fileIds = await getFileIdsFromGeneration('sunset_test_1752530193');
// Returns: ['accbc432-3652-4417-b68e-e10fc9a0bc69', 'a95c000d-e4cd-4b12-a5fa-60eb627f6027']
```

## Real Examples

### Current Test Files
```
📁 Video Files:
- accbc432-3652-4417-b68e-e10fc9a0bc69 (Sunset over mountains)
- a95c000d-e4cd-4b12-a5fa-60eb627f6027 (Sunset over mountains)
- ee184177-4c87-4cc6-afeb-fe8fdb8affae (Magical forest)
- 29f92fd6-15eb-4ec9-96ed-b0382b384e82 (Test prompt)

📦 Generations:
- sunset_test_1752530193 (2 videos)
- api_test_1752530245580 (1 video)
- test_real_veo3 (1 video)
```

### URL Examples
```
🔗 File Routes:
http://localhost:3000/en/file/accbc432-3652-4417-b68e-e10fc9a0bc69
http://localhost:3000/en/file/a95c000d-e4cd-4b12-a5fa-60eb627f6027
http://localhost:3000/en/file/ee184177-4c87-4cc6-afeb-fe8fdb8affae

🔗 Generation Routes:
http://localhost:3000/en/veo3-status/sunset_test_1752530193
http://localhost:3000/en/veo3-status/api_test_1752530245580
```

## Features

### File Status Page Features
- ✅ Real-time status updates (auto-refresh every 5s)
- ✅ File type detection with appropriate icons
- ✅ Generation details (prompt, resolution, duration)
- ✅ Task progress tracking
- ✅ Download links when ready
- ✅ Copy fileId and URLs to clipboard
- ✅ Error handling and retry functionality
- ✅ Responsive design

### SEO & Metadata
- ✅ Dynamic metadata generation
- ✅ OpenGraph images
- ✅ Proper robots.txt handling (noindex for status pages)
- ✅ Structured data ready

## Future Enhancements

### Planned Features
- [ ] Batch file operations
- [ ] File collections/playlists
- [ ] Advanced filtering and search
- [ ] File sharing and permissions
- [ ] Analytics and usage tracking
- [ ] WebSocket real-time updates
- [ ] File preview/thumbnail generation

### Integration Opportunities
- [ ] Webhook notifications
- [ ] External API integrations
- [ ] CDN optimization
- [ ] Advanced caching strategies
- [ ] Multi-tenant support

## Migration Guide

### From Generation-only to Hybrid Approach

If you're currently using only generation routes, you can gradually adopt file routes:

1. **Keep existing generation routes** for user-facing interfaces
2. **Add file routes** for API integrations and direct file access
3. **Use utilities** to convert between formats as needed
4. **Update documentation** to reflect both approaches

### Best Practices
- Use generation routes for user workflows
- Use file routes for API integrations
- Validate IDs before routing
- Handle errors gracefully
- Implement proper caching strategies 