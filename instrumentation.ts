import { registerOTel } from '@vercel/otel';
import { AISDKExporter } from 'langsmith/vercel';

export function register() {
  registerOTel({
    serviceName: 'super-landing-veo3',
    traceExporter: new AISDKExporter(),
  });
} 