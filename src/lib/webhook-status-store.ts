interface WebhookStatusData {
  status: 'pending' | 'processing' | 'completed' | 'error';
  fileId?: string;
  error?: string;
  timestamp?: string;
  toolSlug?: string;
  toolTitle?: string;
}

// In-memory storage for webhook status (in production, use Redis or database)
export const webhookStatusStore = new Map<string, WebhookStatusData>();

export type { WebhookStatusData }; 