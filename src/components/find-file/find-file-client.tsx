"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';
import { Navbar } from '@/components/landing/navbar';
import { Footer } from '@/components/landing/footer';

interface FindFileClientProps {
  locale: string;
}

export default function FindFileClient({ locale }: FindFileClientProps) {
  const [sessionId, setSessionId] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  const handleSearch = async () => {
    const trimmedId = sessionId.trim();
    
    if (!trimmedId) {
      toast.error('Please enter a session ID');
      return;
    }

    if (!trimmedId.startsWith('cs_') && !trimmedId.startsWith('cs_live_')) {
      toast.error('Invalid session ID format. Should start with "cs_" or "cs_live_"');
      return;
    }

    setIsSearching(true);
    
    try {
      // Redirect to session lookup page
      router.push(`/${locale}/session/${trimmedId}`);
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to search. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Find Your File</h1>
              <p className="text-muted-foreground">
                Enter your session ID to locate your AI-generated content
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  File Finder
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Session ID
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="cs_live_a1... or cs_test_a1..."
                      value={sessionId}
                      onChange={(e) => setSessionId(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1 font-mono"
                    />
                    <Button 
                      onClick={handleSearch}
                      disabled={isSearching || !sessionId.trim()}
                      className="gap-2"
                    >
                      {isSearching ? (
                        <>Searching...</>
                      ) : (
                        <>
                          <Search className="w-4 h-4" />
                          Find
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <HelpCircle className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-muted-foreground">
                      <p className="font-medium mb-2">Where to find your Session ID:</p>
                      <ul className="space-y-1">
                        <li>• On your payment success page</li>
                        <li>• In your email receipt from Stripe</li>
                        <li>• In your browser history (payment-success URL)</li>
                        <li>• Starts with &quot;cs_live_&quot; or &quot;cs_test_&quot;</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    Don&apos;t have a session ID?
                  </p>
                  <Button 
                    onClick={() => router.push(`/${locale}/tool/veo3-prompt-generator`)}
                    variant="outline"
                    className="gap-2"
                  >
                    Generate New Video
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Examples */}
            <div className="mt-8 p-4 bg-muted/30 rounded-lg">
              <h3 className="font-medium mb-3">Example Session IDs:</h3>
              <div className="space-y-2 text-sm font-mono">
                <div className="flex items-center justify-between bg-background p-2 rounded">
                  <code className="text-green-600">cs_live_a1meQFqPnBfzLGKwVIlUUkEXdr4qTOqxdURfwoKO2BngSsyxh0upKxlos3</code>
                  <span className="text-xs text-muted-foreground ml-2">Live</span>
                </div>
                <div className="flex items-center justify-between bg-background p-2 rounded">
                  <code className="text-blue-600">cs_test_a1dPqg8hcnZVFgTWuGo0USQGRHOQ4z8vXbf9RlZU6VuAa0M8loKd7ZHjtp</code>
                  <span className="text-xs text-muted-foreground ml-2">Test</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer locale={locale} />
    </div>
  );
} 