#!/usr/bin/env node
/* eslint-disable no-console, no-unused-vars */

/**
 * Redis Analytics Script for SuperDuperAI
 * 
 * Usage:
 * node scripts/redis-analytics.js
 * node scripts/redis-analytics.js --stats
 * node scripts/redis-analytics.js --prompts
 * node scripts/redis-analytics.js --prompts --limit 10
 * node scripts/redis-analytics.js --delete cs_live_xxx
 */

const { createClient } = require('redis');

// Parse command line arguments
const args = process.argv.slice(2);
const command = args[0] || 'stats';
const limit = parseInt(args.find(arg => arg.startsWith('--limit='))?.split('=')[1] || '20');
const sessionId = args.find(arg => arg.startsWith('--delete='))?.split('=')[1];

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

async function getStats() {
  try {
    console.log('\n📊 PROMPT ANALYTICS STATISTICS\n');
    
    // Get all prompt keys
    const promptKeys = await client.keys('prompt:*');
    console.log(`📝 Total prompts: ${promptKeys.length}`);
    
    if (promptKeys.length === 0) {
      console.log('No prompts found in Redis');
      return;
    }
    
    // Get all prompts data
    const prompts = [];
    for (const key of promptKeys) {
      try {
        const data = await client.get(key);
        if (data) {
          const promptData = JSON.parse(data);
          const sessionId = key.replace('prompt:', '');
          prompts.push({
            sessionId,
            prompt: promptData.prompt,
            length: promptData.prompt.length,
            timestamp: promptData.timestamp
          });
        }
      } catch (error) {
        console.warn(`⚠️ Failed to get data for key: ${key}`);
      }
    }
    
    // Calculate statistics
    const totalCharacters = prompts.reduce((sum, p) => sum + p.length, 0);
    const avgLength = Math.round(totalCharacters / prompts.length);
    
    // Find extremes
    const longestPrompt = prompts.reduce((max, p) => p.length > max.length ? p : max, { length: 0 });
    const shortestPrompt = prompts.reduce((min, p) => p.length < min.length ? p : min, { length: Infinity });
    
    // Group by length ranges
    const lengthRanges = {
      '0-100': 0,
      '101-500': 0,
      '501-1000': 0,
      '1001-2000': 0,
      '2000+': 0
    };
    
    prompts.forEach(p => {
      if (p.length <= 100) lengthRanges['0-100']++;
      else if (p.length <= 500) lengthRanges['101-500']++;
      else if (p.length <= 1000) lengthRanges['501-1000']++;
      else if (p.length <= 2000) lengthRanges['1001-2000']++;
      else lengthRanges['2000+']++;
    });
    
    console.log(`📊 Total characters: ${totalCharacters.toLocaleString()}`);
    console.log(`📊 Average length: ${avgLength} characters`);
    console.log(`📊 Longest prompt: ${longestPrompt.length} characters`);
    console.log(`📊 Shortest prompt: ${shortestPrompt.length} characters`);
    
    console.log('\n📈 LENGTH DISTRIBUTION:');
    Object.entries(lengthRanges).forEach(([range, count]) => {
      const percentage = ((count / prompts.length) * 100).toFixed(1);
      console.log(`  ${range} chars: ${count} prompts (${percentage}%)`);
    });
    
    if (longestPrompt.length > 0) {
      console.log('\n🏆 LONGEST PROMPT:');
      console.log(`  Session: ${longestPrompt.sessionId}`);
      console.log(`  Length: ${longestPrompt.length} characters`);
      console.log(`  Preview: ${longestPrompt.prompt.substring(0, 100)}...`);
      console.log(`  Date: ${new Date(longestPrompt.timestamp).toLocaleString()}`);
    }
    
    if (shortestPrompt.length < Infinity) {
      console.log('\n🥇 SHORTEST PROMPT:');
      console.log(`  Session: ${shortestPrompt.sessionId}`);
      console.log(`  Length: ${shortestPrompt.length} characters`);
      console.log(`  Text: "${shortestPrompt.prompt}"`);
      console.log(`  Date: ${new Date(shortestPrompt.timestamp).toLocaleString()}`);
    }
    
  } catch (error) {
    console.error('❌ Error getting stats:', error);
  }
}

async function getPrompts() {
  try {
    console.log(`\n📝 RECENT PROMPTS (showing ${limit})\n`);
    
    // Get all prompt keys
    const promptKeys = await client.keys('prompt:*');
    
    if (promptKeys.length === 0) {
      console.log('No prompts found in Redis');
      return;
    }
    
    // Sort by timestamp (newest first)
    const prompts = [];
    for (const key of promptKeys) {
      try {
        const data = await client.get(key);
        if (data) {
          const promptData = JSON.parse(data);
          const sessionId = key.replace('prompt:', '');
          prompts.push({
            sessionId,
            prompt: promptData.prompt,
            length: promptData.prompt.length,
            timestamp: promptData.timestamp
          });
        }
      } catch (_error) {
        console.warn(`⚠️ Failed to get data for key: ${key}`);
      }
    }
    
    // Sort by timestamp (newest first)
    prompts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Show limited results
    const limitedPrompts = prompts.slice(0, limit);
    
    limitedPrompts.forEach((prompt, index) => {
      console.log(`${index + 1}. [${prompt.length} chars] ${prompt.sessionId}`);
      console.log(`   Date: ${new Date(prompt.timestamp).toLocaleString()}`);
      console.log(`   Preview: ${prompt.prompt.substring(0, 80)}${prompt.prompt.length > 80 ? '...' : ''}`);
      console.log('');
    });
    
    if (prompts.length > limit) {
      console.log(`... and ${prompts.length - limit} more prompts`);
    }
    
  } catch (error) {
    console.error('❌ Error getting prompts:', error);
  }
}

async function deletePrompt(sessionId) {
  try {
    if (!sessionId) {
      console.error('❌ Session ID is required for deletion');
      return;
    }
    
    const key = `prompt:${sessionId}`;
    const exists = await client.exists(key);
    
    if (!exists) {
      console.log(`❌ Prompt not found for session: ${sessionId}`);
      return;
    }
    
    await client.del(key);
    console.log(`✅ Deleted prompt for session: ${sessionId}`);
    
  } catch (error) {
    console.error('❌ Error deleting prompt:', error);
  }
}

async function main() {
  await connectRedis();
  
  try {
    switch (command) {
      case '--stats':
      case 'stats':
        await getStats();
        break;
        
      case '--prompts':
      case 'prompts':
        await getPrompts();
        break;
        
      case '--delete':
        await deletePrompt(sessionId);
        break;
        
      default:
        console.log('Usage:');
        console.log('  node scripts/redis-analytics.js --stats');
        console.log('  node scripts/redis-analytics.js --prompts');
        console.log('  node scripts/redis-analytics.js --prompts --limit=10');
        console.log('  node scripts/redis-analytics.js --delete=cs_live_xxx');
        break;
    }
  } finally {
    await client.quit();
    console.log('\n👋 Disconnected from Redis');
  }
}

main().catch(console.error); 