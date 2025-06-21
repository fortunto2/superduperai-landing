# AI Model Selection Feature

## Overview

Added support for multiple AI models in the VEO3 Prompt Generator with dynamic character limits and model-specific optimizations.

## Supported Models

### GPT-4o
- **Best Quality**: Highest quality output with maximum character limits
- **Character Limits**: 500 (short) / 1000 (medium) / 2000 (long)
- **Use Case**: When you need the highest quality enhancements
- **System Messages**: Supported

### GPT-4o Mini
- **Fast & Efficient**: Good balance of speed and quality
- **Character Limits**: 400 (short) / 800 (medium) / 1500 (long)
- **Use Case**: Default choice for most users
- **System Messages**: Supported

### o1-mini
- **Reasoning Model**: Advanced reasoning capabilities
- **Character Limits**: 300 (short) / 600 (medium) / 1200 (long)
- **Use Case**: Complex prompts requiring logical reasoning
- **System Messages**: Not supported (uses single prompt approach)

### o1-preview
- **Advanced Reasoning**: Most advanced reasoning model
- **Character Limits**: 400 (short) / 800 (medium) / 1600 (long)
- **Use Case**: Most complex prompts requiring deep reasoning
- **System Messages**: Not supported (uses single prompt approach)

## UI Features

### Model Selector
- Grid layout with 2x2 model cards
- Each card shows model name and description
- Visual indication of selected model

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
- Automatic handling of system message compatibility
- o1 models use single prompt approach (no system messages)

### Component Updates
- New model selection state management
- Dynamic character limit calculation
- Enhanced UI components for model selection
- Updated history functionality with model tracking

## Usage

1. **Select Model**: Choose from the 4 available models based on your needs
2. **Choose Length**: Select short/medium/long with dynamic character limits
3. **Generate**: Create basic prompt using the form
4. **Enhance**: AI enhancement will use selected model and length
5. **Review**: Check character count and limit compliance
6. **History**: Access previous prompts with model information

## Best Practices

- **GPT-4o Mini**: Default choice for most users (good balance)
- **GPT-4o**: Use when you need maximum quality and character limits
- **o1-mini**: Use for prompts requiring logical reasoning
- **o1-preview**: Use for most complex reasoning tasks
- **Character Limits**: Stay within limits for optimal performance
- **Model Switching**: Try different models to compare results

## Environment Variables Required

```env
AZURE_OPENAI_RESOURCE_NAME=your-resource-name
AZURE_OPENAI_API_KEY=your-api-key
AZURE_OPENAI_DEPLOYMENT_NAME=your-deployment-name
```

Note: The deployment name should match the model you want to use as the default deployment. 