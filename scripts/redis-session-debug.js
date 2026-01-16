#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * Redis Session Debug Script for SuperDuperAI
 * 
 * Usage:
 * node scripts/redis-session-debug.js cs_live_xxx
 * node scripts/redis-session-debug.js cs_live_xxx --fix
 * node scripts/redis-session-debug.js cs_live_xxx --generate
 */

const { createClient } = require('redis');

// Parse command line arguments
const sessionId = process.argv[2];
const shouldFix = process.argv.includes('--fix');
const shouldGenerate = process.argv.includes('--generate');

if (!sessionId) {
  console.log('Usage: node scripts/redis-session-debug.js <sessionId> [--fix] [--generate]');
  process.exit(1);
}

// Redis connection
const redisUrl = process.env.REDIS_URL || 'redis://default:cmGE7trsPdzSwSUviLJXrwgVukdXnaL7@redis-10317.c256.us-east-1-2.ec2.redns.redis-cloud.com:10317';
const client = createClient({ url: redisUrl });

async function connectRedis() {
  try {
    await client.connect();
    console.log('✅ Connected to Redis');
  } catch (error) {
    console.error('❌ Failed to connect to Redis:', error);
    process.exit(1);
  }
}

async function generateVideoWithSuperDuperAI(prompt, duration = 8, resolution = '1280x720', style = 'cinematic') {
  const token = process.env.SUPERDUPERAI_TOKEN;
  if (!token) {
    throw new Error('SUPERDUPERAI_TOKEN environment variable is not set');
  }

  console.log('🎬 Starting VEO3 generation with SuperDuperAI...');
  console.log('📝 Prompt length:', prompt.length, 'characters');
  
  const response = await fetch('https://dev-editor.superduperai.co/api/v1/file/generate-video', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      config: {
        prompt: prompt,
        negative_prompt: '',
        width: 1280,
        height: 720,
        aspect_ratio: '16:9',
        duration: duration,
        seed: Math.floor(Math.random() * 1000000),
        generation_config_name: 'google-cloud/veo3',
        frame_rate: 30,
        batch_size: 1,
        references: []
      }
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error('❌ SuperDuperAI API error:', response.status, errorData);
    throw new Error(`SuperDuperAI API error: ${response.status} ${errorData}`);
  }

  const data = await response.json();
  console.log('✅ VEO3 generation started:', data);
  
  if (!data.id) {
    throw new Error('No fileId returned from SuperDuperAI API');
  }
  
  return data.id;
}

async function debugSession(sessionId) {
  try {
    console.log(`\n🔍 DEBUGGING SESSION: ${sessionId}\n`);
    
    // Check webhook key
    const webhookKey = `webhook:${sessionId}`;
    const webhookData = await client.get(webhookKey);
    console.log(`📊 Webhook data (${webhookKey}):`, webhookData ? JSON.parse(webhookData) : 'NOT FOUND');
    
    // Check session key
    const sessionKey = `session:${sessionId}`;
    const sessionData = await client.get(sessionKey);
    console.log(`🔗 Session data (${sessionKey}):`, sessionData ? JSON.parse(sessionData) : 'NOT FOUND');
    
    // Check prompt key
    const promptKey = `prompt:${sessionId}`;
    const promptData = await client.get(promptKey);
    console.log(`📝 Prompt data (${promptKey}):`, promptData ? JSON.parse(promptData) : 'NOT FOUND');
    
    if (!promptData) {
      console.log('❌ No prompt data found, cannot fix or generate');
      return;
    }
    
    const prompt = JSON.parse(promptData);
    
    // If generate is requested, actually generate the video
    if (shouldGenerate) {
      console.log('\n🎬 GENERATING VIDEO...\n');
      
      try {
        // Update status to processing
        const processingData = {
          status: 'processing',
          timestamp: new Date().toISOString(),
          toolSlug: 'veo3-prompt-generator',
          toolTitle: 'Free VEO3 Viral Prompt Generator'
        };
        await client.setEx(webhookKey, 30 * 24 * 60 * 60, JSON.stringify(processingData));
        console.log('✅ Updated status to processing');
        
        // Generate video
        const fileId = await generateVideoWithSuperDuperAI(prompt.prompt, 8, '1280x720', 'cinematic');
        console.log('🎬 Video generation started with fileId:', fileId);
        
        // Update webhook data with fileId
        const completedData = {
          status: 'processing',
          fileId: fileId,
          timestamp: new Date().toISOString(),
          toolSlug: 'veo3-prompt-generator',
          toolTitle: 'Free VEO3 Viral Prompt Generator'
        };
        
        await client.setEx(webhookKey, 30 * 24 * 60 * 60, JSON.stringify(completedData));
        console.log('✅ Updated webhook data with fileId:', completedData);
        
        // Update session mapping
        const sessionMapping = {
          fileId: fileId,
          timestamp: new Date().toISOString()
        };
        await client.setEx(sessionKey, 30 * 24 * 60 * 60, JSON.stringify(sessionMapping));
        console.log('✅ Updated session mapping:', sessionMapping);
        
        console.log('\n✅ Video generation started! User can now track progress.');
        console.log(`🔗 Status URL: https://superduperai.co/en/file/${fileId}`);
        
      } catch (error) {
        console.error('❌ Failed to generate video:', error);
        
        // Update status to error
        const errorData = {
          status: 'error',
          error: `Failed to start generation: ${error.message}`,
          timestamp: new Date().toISOString(),
          toolSlug: 'veo3-prompt-generator',
          toolTitle: 'Free VEO3 Viral Prompt Generator'
        };
        await client.setEx(webhookKey, 30 * 24 * 60 * 60, JSON.stringify(errorData));
        console.log('❌ Updated status to error');
      }
      
      return;
    }
    
    // If fix is requested and we have prompt but no webhook data
    if (shouldFix && promptData && !webhookData) {
      console.log('\n🔧 FIXING SESSION DATA...\n');
      
      // Create webhook data with error status (since payment was successful but webhook failed)
      const fixedWebhookData = {
        status: 'error',
        error: 'Webhook processing failed - payment completed but generation not started',
        timestamp: new Date().toISOString(),
        toolSlug: 'veo3-prompt-generator',
        toolTitle: 'Free VEO3 Viral Prompt Generator'
      };
      
      // Store webhook data
      await client.setEx(webhookKey, 30 * 24 * 60 * 60, JSON.stringify(fixedWebhookData));
      console.log('✅ Created webhook data:', fixedWebhookData);
      
      // Store session mapping (without fileId since generation failed)
      const sessionMapping = {
        timestamp: new Date().toISOString()
      };
      await client.setEx(sessionKey, 30 * 24 * 60 * 60, JSON.stringify(sessionMapping));
      console.log('✅ Created session mapping:', sessionMapping);
      
      console.log('\n✅ Session fixed! User can now see error status and retry.');
      console.log('\n💡 To actually generate the video, run:');
      console.log(`node scripts/redis-session-debug.js ${sessionId} --generate`);
    }
    
  } catch (error) {
    console.error('❌ Error debugging session:', error);
  }
}

async function main() {
  await connectRedis();
  
  try {
    await debugSession(sessionId);
  } finally {
    await client.quit();
    console.log('\n👋 Disconnected from Redis');
  }
}

main().catch(console.error); 