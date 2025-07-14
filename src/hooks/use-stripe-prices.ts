import { useState, useEffect } from 'react';

interface StripePrices {
  single: string;
  triple: string;
}

interface StripePricesResponse {
  success: boolean;
  prices: StripePrices;
  mode: 'live' | 'test';
}

export function useStripePrices() {
  const [prices, setPrices] = useState<StripePrices | null>(null);
  const [mode, setMode] = useState<'live' | 'test'>('test');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch('/api/stripe-prices');
        const data: StripePricesResponse = await response.json();
        
        if (data.success) {
          setPrices(data.prices);
          setMode(data.mode);
        } else {
          setError('Failed to fetch prices');
        }
      } catch (err) {
        setError('Network error');
        console.error('Error fetching Stripe prices:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, []);

  return { prices, mode, loading, error };
} 