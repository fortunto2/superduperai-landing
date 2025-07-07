#!/usr/bin/env node

/**
 * Script to optimize VEO3 Prompt Generator preview image
 * Usage: node scripts/optimize-veo3-image.js <input-image-path>
 */

/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
/* eslint-disable no-console */
/* eslint-disable import/no-commonjs */
/* eslint-disable @typescript-eslint/no-unused-vars */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const inputPath = process.argv[2];
const outputPath = path.join(__dirname, '../public/images/og/veo3-prompt-generator.webp');

if (!inputPath) {
  console.error('❌ Please provide input image path');
  console.log('Usage: node scripts/optimize-veo3-image.js <input-image-path>');
  process.exit(1);
}

if (!fs.existsSync(inputPath)) {
  console.error('❌ Input file does not exist:', inputPath);
  process.exit(1);
}

console.log('🔄 Optimizing VEO3 preview image...');
console.log('📁 Input:', inputPath);
console.log('📁 Output:', outputPath);

try {
  // Check if ImageMagick is available
  try {
    execSync('convert -version', { stdio: 'ignore' });
    console.log('✅ Using ImageMagick for conversion');
    
    // Convert with ImageMagick
    const command = `convert "${inputPath}" -resize 1200x630^ -gravity center -extent 1200x630 -quality 85 "${outputPath}"`;
    execSync(command, { stdio: 'inherit' });
    
  } catch (error) {
    // Fallback: try with ffmpeg
    try {
      execSync('ffmpeg -version', { stdio: 'ignore' });
      console.log('✅ Using FFmpeg for conversion');
      
      const command = `ffmpeg -i "${inputPath}" -vf "scale=1200:630:force_original_aspect_ratio=increase,crop=1200:630" -quality 85 "${outputPath}" -y`;
      execSync(command, { stdio: 'inherit' });
      
    } catch (ffmpegError) {
      console.error('❌ Neither ImageMagick nor FFmpeg found.');
      console.log('📝 Please install one of the following:');
      console.log('   - ImageMagick: brew install imagemagick');
      console.log('   - FFmpeg: brew install ffmpeg');
      console.log('   - Or use online tools like squoosh.app');
      process.exit(1);
    }
  }
  
  console.log('✅ VEO3 preview image optimized successfully!');
  console.log('📊 File size:', Math.round(fs.statSync(outputPath).size / 1024), 'KB');
  console.log('🎯 Dimensions: 1200x630px (Open Graph standard)');
  console.log('🔧 Quality: 85% (optimized for web)');
  
} catch (error) {
  console.error('❌ Error optimizing image:', error.message);
  process.exit(1);
} 