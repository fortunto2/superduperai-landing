import { kv } from '@vercel/kv';

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
    const key = getWebhookKey(sessionId);
    const sessionKey = getSessionKey(sessionId);
    
    // Store webhook data with expiration (30 days)
    await kv.set(key, data, { ex: 30 * 24 * 60 * 60 });
    
    // Also store session mapping for quick lookup
    await kv.set(sessionKey, { fileId: data.fileId, timestamp: data.timestamp }, { ex: 30 * 24 * 60 * 60 });
    
    console.log('💾 Stored webhook status in KV:', sessionId, data.fileId);
  } catch (error) {
    console.error('❌ Failed to store webhook status in KV:', error);
    throw error;
  }
}

// Get webhook status data
export async function getWebhookStatus(sessionId: string): Promise<WebhookStatusData | null> {
  try {
    const key = getWebhookKey(sessionId);
    const data = await kv.get<WebhookStatusData>(key);
    
    if (data) {
      console.log('📊 Retrieved webhook status from KV:', sessionId, data.fileId);
    }
    
    return data;
  } catch (error) {
    console.error('❌ Failed to get webhook status from KV:', error);
    return null;
  }
}

// Get file ID by session ID (quick lookup)
export async function getFileIdBySession(sessionId: string): Promise<string | null> {
  try {
    const sessionKey = getSessionKey(sessionId);
    const data = await kv.get<{ fileId: string; timestamp: string }>(sessionKey);
    
    if (data?.fileId) {
      console.log('🔍 Quick lookup found fileId:', sessionId, '→', data.fileId);
    }
    
    return data?.fileId || null;
  } catch (error) {
    console.error('❌ Failed to get fileId by session from KV:', error);
    return null;
  }
}

// Update webhook status
export async function updateWebhookStatus(sessionId: string, updates: Partial<WebhookStatusData>): Promise<void> {
  try {
    const key = getWebhookKey(sessionId);
    const existing = await kv.get<WebhookStatusData>(key);
    
    if (existing) {
      const updated = { ...existing, ...updates, timestamp: new Date().toISOString() };
      await kv.set(key, updated, { ex: 30 * 24 * 60 * 60 });
      console.log('🔄 Updated webhook status in KV:', sessionId, updates);
    }
  } catch (error) {
    console.error('❌ Failed to update webhook status in KV:', error);
    throw error;
  }
}

// Delete webhook status (cleanup)
export async function deleteWebhookStatus(sessionId: string): Promise<void> {
  try {
    const key = getWebhookKey(sessionId);
    const sessionKey = getSessionKey(sessionId);
    
    await kv.del(key);
    await kv.del(sessionKey);
    
    console.log('🗑️ Deleted webhook status from KV:', sessionId);
  } catch (error) {
    console.error('❌ Failed to delete webhook status from KV:', error);
  }
}

// Store prompt data (for long prompts that exceed Stripe metadata limits)
export async function storePrompt(sessionId: string, prompt: string): Promise<void> {
  try {
    const key = getPromptKey(sessionId);
    
    // Store prompt with expiration (30 days)
    await kv.set(key, { prompt, timestamp: new Date().toISOString() }, { ex: 30 * 24 * 60 * 60 });
    
    console.log('💾 Stored prompt in KV:', sessionId, `(${prompt.length} chars)`);
  } catch (error) {
    console.error('❌ Failed to store prompt in KV:', error);
    throw error;
  }
}

// Get prompt data
export async function getPrompt(sessionId: string): Promise<string | null> {
  try {
    const key = getPromptKey(sessionId);
    const data = await kv.get<{ prompt: string; timestamp: string }>(key);
    
    if (data?.prompt) {
      console.log('📝 Retrieved prompt from KV:', sessionId, `(${data.prompt.length} chars)`);
      return data.prompt;
    }
    
    return null;
  } catch (error) {
    console.error('❌ Failed to get prompt from KV:', error);
    return null;
  }
}

// Health check for KV connection
export async function checkKVHealth(): Promise<boolean> {
  try {
    await kv.ping();
    console.log('✅ KV connection healthy');
    return true;
  } catch (error) {
    console.error('❌ KV connection failed:', error);
    return false;
  }
} 