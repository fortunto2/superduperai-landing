# AI Model Selection Feature

## Overview

Added support for 2 AI models in the VEO3 Prompt Generator with dynamic character limits and model-specific optimizations.

## Supported Models

### GPT-4.1
- **Best Quality**: Highest quality output with maximum character limits
- **Character Limits**: 500 (short) / 1000 (medium) / 2000 (long)
- **Use Case**: When you need the highest quality enhancements
- **System Messages**: Supported

### o4-mini
- **Fast & Efficient**: Good balance of speed and quality
- **Character Limits**: 400 (short) / 800 (medium) / 1500 (long)
- **Use Case**: Default choice for most users (fast and efficient)
- **System Messages**: Supported

**Note**: Reasoning models (o1-mini, o1-preview) are temporarily not available.

## UI Features

### Model Selector
- Horizontal layout with 2 model cards
- Each card shows model name and description
- Visual indication of selected model
- Default selection: o4-mini

### Dynamic Character Limits
- Character limits update based on selected model
- Real-time display of target vs actual characters
- Color-coded status indicators:
  - ✓ Green: Within character limit
  - ⚠ Amber: Over character limit

### Enhanced Information Display
- Shows model name and version used
- Displays character count with limit
- Status indicator for limit compliance

### Prompt History
- Stores model information with each prompt
- Displays model badge in history entries
- Allows loading previous prompts with model settings

## Technical Implementation

### API Endpoint Updates
- Added model parameter to `/api/enhance-prompt`
- Model-specific configuration for character limits and tokens
- Both models support system messages
- Simplified model handling (no special cases)

### Component Updates
- New model selection state management
- Dynamic character limit calculation
- Enhanced UI components for model selection
- Updated history functionality with model tracking

## Usage

1. **Select Model**: Choose between o4-mini (default) or GPT-4.1
2. **Choose Length**: Select short/medium/long with dynamic character limits
3. **Generate**: Create basic prompt using the form
4. **Enhance**: AI enhancement will use selected model and length
5. **Review**: Check character count and limit compliance
6. **History**: Access previous prompts with model information

## Best Practices

- **o4-mini**: Default choice for most users (fast & efficient)
- **GPT-4.1**: Use when you need maximum quality and character limits
- **Character Limits**: Stay within limits for optimal performance
- **Model Switching**: Try different models to compare results

## Model Comparison

| Feature | o4-mini | GPT-4.1 |
|---------|---------|---------|
| Speed | Fast | Moderate |
| Quality | Good | Best |
| Short Limit | 400 chars | 500 chars |
| Medium Limit | 800 chars | 1000 chars |
| Long Limit | 1500 chars | 2000 chars |
| Use Case | Daily use | High quality |

## Environment Variables Required

```env
AZURE_OPENAI_RESOURCE_NAME=your-resource-name
AZURE_OPENAI_API_KEY=your-api-key
```

Note: The model is selected by the user in the UI and passed directly to the API. No deployment name configuration needed. 