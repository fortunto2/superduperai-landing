import { createClient } from 'redis';

// Create Redis client
let redis: ReturnType<typeof createClient> | null = null;

async function getRedisClient() {
  if (!redis) {
    redis = createClient({ 
      url: process.env.REDIS_URL 
    });
    await redis.connect();
  }
  return redis;
}

export interface WebhookStatusData {
  status: 'pending' | 'processing' | 'completed' | 'error';
  fileId?: string;
  error?: string;
  timestamp?: string;
  toolSlug?: string;
  toolTitle?: string;
}

// KV Key prefixes for organization
const WEBHOOK_PREFIX = 'webhook:';
const SESSION_PREFIX = 'session:';
const PROMPT_PREFIX = 'prompt:';

// Helper to create webhook key
const getWebhookKey = (sessionId: string) => `${WEBHOOK_PREFIX}${sessionId}`;

// Helper to create session key
const getSessionKey = (sessionId: string) => `${SESSION_PREFIX}${sessionId}`;

// Helper to create prompt key
const getPromptKey = (sessionId: string) => `${PROMPT_PREFIX}${sessionId}`;

// Store webhook status data
export async function storeWebhookStatus(sessionId: string, data: WebhookStatusData): Promise<void> {
  try {
    const client = await getRedisClient();
    const key = getWebhookKey(sessionId);
    const sessionKey = getSessionKey(sessionId);
    
    // Store webhook data with expiration (30 days)
    await client.setEx(key, 30 * 24 * 60 * 60, JSON.stringify(data));
    
    // Also store session mapping for quick lookup
    await client.setEx(sessionKey, 30 * 24 * 60 * 60, JSON.stringify({ 
      fileId: data.fileId, 
      timestamp: data.timestamp 
    }));
    
    console.log('💾 Stored webhook status in Redis:', sessionId, data.fileId);
  } catch (error) {
    console.error('❌ Failed to store webhook status in Redis:', error);
    throw error;
  }
}

// Get webhook status data
export async function getWebhookStatus(sessionId: string): Promise<WebhookStatusData | null> {
  try {
    const client = await getRedisClient();
    const key = getWebhookKey(sessionId);
    const data = await client.get(key);
    
    if (data) {
      const parsed = JSON.parse(data) as WebhookStatusData;
      console.log('📊 Retrieved webhook status from Redis:', sessionId, parsed.fileId);
      return parsed;
    }
    
    return null;
  } catch (error) {
    console.error('❌ Failed to get webhook status from Redis:', error);
    return null;
  }
}

// Get file ID by session ID (quick lookup)
export async function getFileIdBySession(sessionId: string): Promise<string | null> {
  try {
    const client = await getRedisClient();
    const sessionKey = getSessionKey(sessionId);
    const data = await client.get(sessionKey);
    
    if (data) {
      const parsed = JSON.parse(data) as { fileId: string; timestamp: string };
      if (parsed.fileId) {
        console.log('🔍 Quick lookup found fileId:', sessionId, '→', parsed.fileId);
        return parsed.fileId;
      }
    }
    
    return null;
  } catch (error) {
    console.error('❌ Failed to get fileId by session from Redis:', error);
    return null;
  }
}

// Update webhook status
export async function updateWebhookStatus(sessionId: string, updates: Partial<WebhookStatusData>): Promise<void> {
  try {
    const client = await getRedisClient();
    const key = getWebhookKey(sessionId);
    const existing = await client.get(key);
    
    if (existing) {
      const parsed = JSON.parse(existing) as WebhookStatusData;
      const updated = { ...parsed, ...updates, timestamp: new Date().toISOString() };
      await client.setEx(key, 30 * 24 * 60 * 60, JSON.stringify(updated));
      console.log('🔄 Updated webhook status in Redis:', sessionId, updates);
    }
  } catch (error) {
    console.error('❌ Failed to update webhook status in Redis:', error);
    throw error;
  }
}

// Delete webhook status (cleanup)
export async function deleteWebhookStatus(sessionId: string): Promise<void> {
  try {
    const client = await getRedisClient();
    const key = getWebhookKey(sessionId);
    const sessionKey = getSessionKey(sessionId);
    
    await client.del(key);
    await client.del(sessionKey);
    
    console.log('🗑️ Deleted webhook status from Redis:', sessionId);
  } catch (error) {
    console.error('❌ Failed to delete webhook status from Redis:', error);
  }
}

// Store complete session data
export interface SessionData {
  prompt: string;
  videoCount: number;
  duration: number;
  resolution: string;
  style: string;
  toolSlug: string;
  toolTitle: string;
  createdAt: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  fileId?: string;
  error?: string;
}

export async function storeSessionData(sessionId: string, data: SessionData): Promise<void> {
  try {
    const client = await getRedisClient();
    const sessionKey = getSessionKey(sessionId);
    
    // Store complete session data with expiration (30 days)
    await client.setEx(sessionKey, 30 * 24 * 60 * 60, JSON.stringify({
      ...data,
      timestamp: new Date().toISOString()
    }));
    
    console.log('💾 Stored session data in Redis:', sessionId, `(${data.prompt.length} chars prompt)`);
  } catch (error) {
    console.error('❌ Failed to store session data in Redis:', error);
    throw error;
  }
}

export async function getSessionData(sessionId: string): Promise<SessionData | null> {
  try {
    const client = await getRedisClient();
    const sessionKey = getSessionKey(sessionId);
    const data = await client.get(sessionKey);
    
    if (data) {
      const parsed = JSON.parse(data) as SessionData;
      console.log('📊 Retrieved session data from Redis:', sessionId, parsed.status);
      return parsed;
    }
    
    return null;
  } catch (error) {
    console.error('❌ Failed to get session data from Redis:', error);
    return null;
  }
}

export async function updateSessionData(sessionId: string, updates: Partial<SessionData>): Promise<void> {
  try {
    const client = await getRedisClient();
    const sessionKey = getSessionKey(sessionId);
    const existing = await client.get(sessionKey);
    
    if (existing) {
      const parsed = JSON.parse(existing) as SessionData;
      const updated = { ...parsed, ...updates, timestamp: new Date().toISOString() };
      await client.setEx(sessionKey, 30 * 24 * 60 * 60, JSON.stringify(updated));
      console.log('🔄 Updated session data in Redis:', sessionId, updates);
    }
  } catch (error) {
    console.error('❌ Failed to update session data in Redis:', error);
    throw error;
  }
}

// Store prompt data (for long prompts that exceed Stripe metadata limits)
export async function storePrompt(sessionId: string, prompt: string): Promise<void> {
  try {
    const client = await getRedisClient();
    const key = getPromptKey(sessionId);
    
    // Store prompt with expiration (30 days)
    await client.setEx(key, 30 * 24 * 60 * 60, JSON.stringify({ 
      prompt, 
      timestamp: new Date().toISOString() 
    }));
    
    console.log('💾 Stored prompt in Redis:', sessionId, `(${prompt.length} chars)`);
  } catch (error) {
    console.error('❌ Failed to store prompt in Redis:', error);
    throw error;
  }
}

// Get prompt data
export async function getPrompt(sessionId: string): Promise<string | null> {
  try {
    const client = await getRedisClient();
    const key = getPromptKey(sessionId);
    const data = await client.get(key);
    
    if (data) {
      const parsed = JSON.parse(data) as { prompt: string; timestamp: string };
      if (parsed.prompt) {
        console.log('📝 Retrieved prompt from Redis:', sessionId, `(${parsed.prompt.length} chars)`);
        return parsed.prompt;
      }
    }
    
    return null;
  } catch (error) {
    console.error('❌ Failed to get prompt from Redis:', error);
    return null;
  }
}

// Health check for Redis connection
export async function checkKVHealth(): Promise<boolean> {
  try {
    const client = await getRedisClient();
    await client.ping();
    console.log('✅ Redis connection healthy');
    return true;
  } catch (error) {
    console.error('❌ Redis connection failed:', error);
    return false;
  }
} 