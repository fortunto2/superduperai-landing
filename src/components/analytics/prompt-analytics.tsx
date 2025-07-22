"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  FileText, 
  TrendingUp, 
  Clock,
  RefreshCw,
  Eye
} from 'lucide-react';

interface PromptAnalytics {
  statistics: {
    totalPrompts: number;
    totalCharacters: number;
    averageLength: number;
    longestPrompt?: {
      sessionId: string;
      length: number;
      preview: string;
    };
    shortestPrompt?: {
      sessionId: string;
      length: number;
      preview: string;
    };
  };
  prompts: Array<{
    sessionId: string;
    length: number;
    preview: string;
    timestamp: string;
  }>;
  pagination: {
    limit: number;
    offset: number;
    total: number;
    hasMore: boolean;
  };
}

export default function PromptAnalytics() {
  const [analytics, setAnalytics] = useState<PromptAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async (offset = 0) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/analytics/prompts?limit=20&offset=${offset}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }
      
      const data = await response.json();
      setAnalytics(data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-6 h-6 animate-spin" />
        <span className="ml-2">Loading analytics...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500 mb-4">Error: {error}</p>
        <Button onClick={() => fetchAnalytics()}>Retry</Button>
      </div>
    );
  }

  if (!analytics) {
    return <div className="text-center p-8">No analytics data available</div>;
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Prompts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.statistics.totalPrompts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Characters</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.statistics.totalCharacters.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Length</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.statistics.averageLength}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Longest Prompt</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.statistics.longestPrompt?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {analytics.statistics.longestPrompt?.preview || 'N/A'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Prompts List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Recent Prompts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.prompts.map((prompt) => (
              <div key={prompt.sessionId} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">{prompt.length} chars</span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">{prompt.sessionId}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{prompt.preview}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {formatDate(prompt.timestamp)}
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(`/en/session/${prompt.sessionId}`, '_blank')}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {analytics.pagination.total > 0 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Showing {analytics.pagination.offset + 1} - {Math.min(analytics.pagination.offset + analytics.pagination.limit, analytics.pagination.total)} of {analytics.pagination.total}
              </p>
              <div className="flex gap-2">
                {analytics.pagination.offset > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchAnalytics(Math.max(0, analytics.pagination.offset - analytics.pagination.limit))}
                  >
                    Previous
                  </Button>
                )}
                {analytics.pagination.hasMore && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchAnalytics(analytics.pagination.offset + analytics.pagination.limit)}
                  >
                    Next
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 