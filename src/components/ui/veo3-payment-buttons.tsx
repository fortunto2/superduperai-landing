"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Zap, Video, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useStripePrices } from "@/hooks/use-stripe-prices";

interface Veo3PaymentButtonsProps {
  prompt: string;
  onPaymentClick?: () => void;
  toolSlug?: string;
  toolTitle?: string;
}

export function Veo3PaymentButtons({ prompt, onPaymentClick, toolSlug, toolTitle }: Veo3PaymentButtonsProps) {
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false);
  const { prices, mode, loading, error } = useStripePrices();

  const handlePayment = async () => {
    if (!prompt.trim()) {
      toast.error('Please generate a prompt first');
      return;
    }

    if (!prices) {
      toast.error('Prices not loaded yet, please try again');
      return;
    }

    setIsCreatingCheckout(true);
    onPaymentClick?.();

    try {
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: prices.single,
          quantity: 1,
          prompt: prompt.trim(),
          toolSlug: toolSlug,
          toolTitle: toolTitle,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();
      
      // No localStorage needed - webhook will handle file creation
      // Redirect directly to Stripe
      window.location.href = url;
      
    } catch (error) {
      console.error('❌ Checkout creation failed:', error);
      toast.error('Failed to create checkout session');
    } finally {
      setIsCreatingCheckout(false);
    }
  };

  if (!prompt.trim()) {
    return null;
  }

  if (loading) {
    return (
      <Card className="border-2 border-purple-500/50 bg-gradient-to-r from-purple-50/80 to-blue-50/80 dark:from-purple-950/30 dark:to-blue-950/30 dark:border-purple-400/30">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          <span>Loading payment options...</span>
        </CardContent>
      </Card>
    );
  }

  if (error || !prices) {
    return (
      <Card className="border-2 border-red-500/50 bg-gradient-to-r from-red-50/80 to-orange-50/80 dark:from-red-950/30 dark:to-orange-950/30 dark:border-red-400/30">
        <CardContent className="flex items-center justify-center py-8">
          <span className="text-red-600 dark:text-red-400">
            {error || 'Failed to load payment options'}
          </span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-purple-500/50 bg-gradient-to-r from-purple-50/80 to-blue-50/80 dark:from-purple-950/30 dark:to-blue-950/30 dark:border-purple-400/30">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Zap className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />
          Generate VEO3 Videos
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Your prompt is ready! Choose a plan to generate professional AI videos with Google VEO3.
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="max-w-md mx-auto">
          {/* Single Video Option */}
          <div className="p-6 border-2 border-blue-200 dark:border-blue-700/50 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Video className="w-5 h-5 text-blue-500 dark:text-blue-400" />
              <span className="font-semibold text-lg">Generate Video</span>
            </div>
            <div className="mb-4">
              <Badge variant="outline" className="bg-blue-600 dark:bg-blue-500 text-white text-lg px-4 py-1">
                $1.00
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Generate 1 high-quality AI video with your custom prompt
            </p>
            <Button
              onClick={handlePayment}
              className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white"
              size="lg"
              disabled={isCreatingCheckout}
            >
              {isCreatingCheckout ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Creating Payment...
                </>
              ) : (
                <>
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Generate Video for $1
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="text-xs text-muted-foreground text-center pt-2 border-t">
          <p>✓ Instant access • ✓ No subscription • ✓ Secure Stripe payment</p>
          {mode === 'test' && (
            <p className="text-yellow-600 dark:text-yellow-400 mt-1">
              🧪 Test mode - Use test card 4242 4242 4242 4242
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 