# VEO3 Prompt Generator Preview Image

This is the Open Graph preview image for the VEO3 Prompt Generator tool page.
It will be shown when someone shares a link to the VEO3 Prompt Generator on social media.

## Current Status
✅ **Configured**: All language versions (EN, ES, RU, HI, TR) are configured to use this image
✅ **Placeholder**: Currently using a temporary placeholder image
🔄 **Ready to Replace**: You can now replace this with your actual screenshot

## How to Replace the Image

### Option 1: Automatic Optimization (Recommended)
1. Save your screenshot anywhere on your computer
2. Run the optimization script:
   ```bash
   node scripts/optimize-veo3-image.js /path/to/your/screenshot.png
   ```
3. The script will automatically:
   - Resize to 1200x630px (Open Graph standard)
   - Convert to WebP format
   - Optimize for web (85% quality)
   - Replace the current file

### Option 2: Manual Replacement
1. Convert your screenshot to WebP format:
   - **Online tools**: squoosh.app, tinypng.com, cloudconvert.com
   - **Command line**: `cwebp -q 85 screenshot.png -o veo3-prompt-generator.webp`
   - **ImageMagick**: `convert screenshot.png -quality 85 veo3-prompt-generator.webp`

2. Resize to 1200x630px (Open Graph standard dimensions)

3. Replace this file: `public/images/og/veo3-prompt-generator.webp`

## Technical Details
- **Dimensions**: 1200x630px (Open Graph standard)
- **Format**: WebP (optimized for web)
- **Quality**: 85% (good balance of quality and file size)
- **Max file size**: Aim for under 100KB for fast loading

## What Pages Use This Image
- `/en/tool/veo3-prompt-generator` (English)
- `/es/tool/veo3-prompt-generator` (Spanish)
- `/ru/tool/veo3-prompt-generator` (Russian)
- `/hi/tool/veo3-prompt-generator` (Hindi)
- `/tr/tool/veo3-prompt-generator` (Turkish)

## Testing
After replacing the image, you can test it by:
1. Sharing a link to the VEO3 Prompt Generator on social media
2. Using Facebook's Sharing Debugger: https://developers.facebook.com/tools/debug/
3. Using Twitter's Card Validator: https://cards-dev.twitter.com/validator

## File Structure
```
public/images/og/
├── home-banner.webp              # Home page OG image
├── veo3-prompt-generator.webp    # VEO3 tool OG image (THIS FILE)
└── veo3-prompt-generator-README.md # This instruction file
```

---

**Note**: After replacing the image, you may need to clear social media caches or wait a few minutes for the new image to appear in social media previews.

