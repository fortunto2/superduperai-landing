# VEO3 Moodboard Feature

## Overview
The VEO3 Prompt Generator now supports visual moodboard references to enhance AI-generated prompts with visual context from uploaded images.

## Features

### Image Upload
- **Drag & Drop**: Upload up to 3 images via drag-and-drop interface
- **File Browser**: Click to browse and select image files
- **Formats**: Supports all standard image formats (JPEG, PNG, WebP, etc.)
- **Base64 Encoding**: Images are converted to base64 for API transmission

### Visual Tagging System
Each uploaded image can be tagged with multiple categories:
- **👤 Character**: Character appearance, expressions, clothing, personality traits
- **🎨 Style**: Visual style, artistic approach, cinematography, aesthetic
- **🏞️ Background**: Environments, settings, locations, background elements
- **💡 Lighting**: Lighting conditions, mood, time of day, atmospheric effects
- **🎭 Mood**: Emotional tone, atmosphere, feeling
- **⚡ Action**: Movements, activities, dynamics, interactions

### Smart Integration
- **Description Field**: Optional custom descriptions for specific focus areas
- **Influence Weight**: Adjustable slider (0.1-1.0) to control image impact
- **Section Mapping**: Tags automatically map to VEO3 prompt sections
- **Multi-modal AI**: GPT-4.1 analyzes images alongside text prompts

## API Integration

### Request Structure
```json
{
  "prompt": "...",
  "moodboard": {
    "enabled": true,
    "images": [
      {
        "id": "img-1",
        "base64": "...",
        "tags": ["character", "style"],
        "description": "Focus on the lighting setup",
        "weight": 0.8
      }
    ]
  }
}
```

### Response Enhancement
The API response includes moodboard metadata:
```json
{
  "metadata": {
    "moodboard": {
      "enabled": true,
      "imageCount": 2,
      "tags": ["character", "style", "lighting"],
      "totalWeight": 1.6
    }
  }
}
```

## User Experience

### Enable/Disable Toggle
- Simple toggle switch to enable moodboard functionality
- Counter shows current images (e.g., "2/3 images")
- Disabled by default to keep interface clean

### Visual Feedback
- Real-time preview of uploaded images
- Color-coded tag buttons with icons
- Weight visualization with slider
- Remove button for each image

### Instructions Panel
Built-in tips panel explains:
- How to tag images effectively
- Weight system usage
- Best practices for mixing image types
- VEO3 section mapping

## Technical Implementation

### Components
- `MoodboardUploader`: Main component handling image upload and management
- `SimpleVeo3Generator`: Integration with existing prompt builder
- Enhanced API route with multimodal support

### State Management
- React hooks for image state management
- Proper TypeScript interfaces for type safety
- Efficient re-rendering with useCallback

### AI Processing
- Multimodal prompt construction
- Visual element extraction
- Smart section allocation based on tags
- Weight-based influence calculation

## Use Cases

### Character References
Upload character photos to influence:
- Physical appearance descriptions
- Clothing and style details
- Facial expressions and poses
- Personality traits

### Style References
Upload style examples to guide:
- Visual aesthetic choices
- Color palette selection
- Artistic approach
- Cinematographic style

### Environment References
Upload location photos for:
- Background setting details
- Architectural elements
- Natural environments
- Atmospheric conditions

### Lighting References
Upload lighting examples for:
- Mood and atmosphere
- Time of day settings
- Dramatic lighting effects
- Color temperature

## Best Practices

### Image Selection
1. **High Quality**: Use clear, well-lit reference images
2. **Relevant Focus**: Choose images that match your intended tags
3. **Variety**: Mix different types of references
4. **Specificity**: Use detailed descriptions for unique elements

### Tagging Strategy
1. **Multiple Tags**: Use 2-3 relevant tags per image
2. **Primary Focus**: Set higher weight for most important images
3. **Complementary**: Ensure tags complement each other
4. **Section Awareness**: Consider which VEO3 sections need enhancement

### Weight Distribution
1. **Primary Reference**: Set main image to 1.0 weight
2. **Supporting Images**: Use 0.6-0.8 for secondary references
3. **Subtle Influences**: Use 0.3-0.5 for background elements
4. **Balance**: Avoid overweighting single aspects

## Future Enhancements

### Planned Features
- **URL Support**: Direct image URL input
- **Batch Upload**: Multiple file selection
- **Image Cropping**: Focus area selection
- **Style Transfer**: AI-powered style extraction
- **Template Gallery**: Pre-made moodboard templates

### Advanced Integration
- **Face Detection**: Automatic character tagging
- **Scene Analysis**: AI-powered tag suggestions
- **Color Extraction**: Automatic palette generation
- **Composition Analysis**: Camera angle suggestions

## Troubleshooting

### Common Issues
1. **Large Files**: Compress images if upload fails
2. **Format Support**: Ensure using supported image formats
3. **Browser Compatibility**: Modern browsers required for drag-and-drop
4. **API Limits**: Respect token limits with high-resolution images

### Performance Tips
1. **Optimize Images**: Use reasonable file sizes (< 2MB)
2. **Limit Count**: Maximum 3 images for best performance
3. **Clear Cache**: Remove unused images to free memory
4. **Batch Processing**: Upload all images before enhancement 