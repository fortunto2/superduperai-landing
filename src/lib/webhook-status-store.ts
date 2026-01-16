import { 
  storeWebhookStatus, 
  getWebhookStatus, 
  updateWebhookStatus, 
  deleteWebhookStatus,
  type WebhookStatusData 
} from './kv';

// Fallback in-memory storage (for development or KV failures)
const fallbackStore = new Map<string, WebhookStatusData>();

// Store webhook status (KV with fallback)
export async function storeWebhookStatusWithFallback(sessionId: string, data: WebhookStatusData): Promise<void> {
  try {
    // Try KV first
    await storeWebhookStatus(sessionId, data);
  } catch (error) {
    console.warn('⚠️ KV failed, using fallback store:', error);
    // Fallback to in-memory
    fallbackStore.set(sessionId, data);
  }
}

// Get webhook status (KV with fallback)
export async function getWebhookStatusWithFallback(sessionId: string): Promise<WebhookStatusData | null> {
  try {
    // Try KV first
    const kvData = await getWebhookStatus(sessionId);
    if (kvData) return kvData;
    
    // Fallback to in-memory
    const fallbackData = fallbackStore.get(sessionId);
    if (fallbackData) {
      console.log('📊 Retrieved from fallback store:', sessionId);
    }
    return fallbackData || null;
  } catch (error) {
    console.warn('⚠️ KV failed, checking fallback store:', error);
    return fallbackStore.get(sessionId) || null;
  }
}

// Update webhook status (KV with fallback)
export async function updateWebhookStatusWithFallback(sessionId: string, updates: Partial<WebhookStatusData>): Promise<void> {
  try {
    // Try KV first
    await updateWebhookStatus(sessionId, updates);
  } catch (error) {
    console.warn('⚠️ KV failed, updating fallback store:', error);
    // Update fallback
    const existing = fallbackStore.get(sessionId);
    if (existing) {
      fallbackStore.set(sessionId, { ...existing, ...updates, timestamp: new Date().toISOString() });
    }
  }
}

// Legacy functions for backward compatibility
export const webhookStatusStore = {
  set: (key: string, value: WebhookStatusData) => storeWebhookStatusWithFallback(key, value),
  get: (key: string) => getWebhookStatusWithFallback(key),
  has: (key: string) => fallbackStore.has(key),
  delete: (key: string) => {
    fallbackStore.delete(key);
    deleteWebhookStatus(key).catch(console.error);
  }
};

export type { WebhookStatusData }; 