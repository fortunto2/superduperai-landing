"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Zap, Package, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getSingleVideoPrice, getTripleVideoPrice } from "@/lib/stripe-config";

interface Veo3PaymentButtonsProps {
  prompt: string;
  onPaymentClick?: (type: 'single' | 'triple') => void;
}

export function Veo3PaymentButtons({ prompt, onPaymentClick }: Veo3PaymentButtonsProps) {
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false);

  const handlePayment = async (type: 'single' | 'triple') => {
    if (!prompt.trim()) {
      toast.error('Please generate a prompt first');
      return;
    }

    setIsCreatingCheckout(true);
    onPaymentClick?.(type);

    try {
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: type === 'single' ? getSingleVideoPrice() : getTripleVideoPrice(),
          prompt: prompt.trim(),
          videoCount: type === 'single' ? 1 : 3,
          successUrl: `${window.location.origin}/en/veo3-status/{CHECKOUT_SESSION_ID}`,
          cancelUrl: window.location.href,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Single Video Option */}
          <div className="p-4 border rounded-lg hover:bg-background/80 dark:hover:bg-background/60 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                <span className="font-medium">Single Video</span>
              </div>
              <Badge variant="outline">$1.00</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Generate 1 AI video with your custom prompt
            </p>
            <Button
              onClick={() => handlePayment('single')}
              className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white"
              size="sm"
              disabled={isCreatingCheckout}
            >
              {isCreatingCheckout ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Buy for $1
                </>
              )}
            </Button>
          </div>

          {/* Triple Pack Option */}
          <div className="p-4 border-2 border-purple-200 dark:border-purple-700/50 rounded-lg bg-purple-50/50 dark:bg-purple-950/20 hover:bg-purple-50 dark:hover:bg-purple-950/30 transition-colors relative">
            <Badge 
              variant="secondary" 
              className="absolute -top-2 -right-2 bg-purple-600 dark:bg-purple-500 text-white text-xs"
            >
              Best Value
            </Badge>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                <span className="font-medium">Triple Pack</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm text-muted-foreground line-through">$3.00</span>
                <Badge variant="outline" className="bg-purple-600 dark:bg-purple-500 text-white">$2.00</Badge>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Generate 3 AI videos with your prompts
            </p>
            <Button
              onClick={() => handlePayment('triple')}
              className="w-full bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white"
              size="sm"
              disabled={isCreatingCheckout}
            >
              {isCreatingCheckout ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Buy for $2 (Save $1)
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="text-xs text-muted-foreground text-center pt-2 border-t">
          <p>✓ Instant access • ✓ No subscription • ✓ Secure Stripe payment</p>
        </div>
      </CardContent>
    </Card>
  );
} 