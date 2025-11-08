'use client';

import { useState } from 'react';
import { Button } from '@/components/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { RefreshCw } from 'lucide-react';

interface SyncLog {
  timestamp: string;
  message: string;
  status: 'info' | 'success' | 'warning' | 'error';
}

export function SyncButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<SyncLog[]>([]);
  const [showLogs, setShowLogs] = useState(false);
  const [useMockData, setUseMockData] = useState(false);

  const handleSync = async () => {
    setIsLoading(true);
    setLogs([]);
    setShowLogs(true);

    try {
      const response = await fetch('/api/platforms/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          platform: 'gumroad',
          useMockData,
        }),
      });

      const data = await response.json();

      if (data.logs) {
        setLogs(data.logs);
      }

      if (!response.ok) {
        console.error('Sync failed:', data);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Sync failed';
      setLogs([
        {
          timestamp: new Date().toISOString(),
          message,
          status: 'error',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-700 bg-green-50';
      case 'error':
        return 'text-red-700 bg-red-50';
      case 'warning':
        return 'text-yellow-700 bg-yellow-50';
      default:
        return 'text-gray-700 bg-gray-50';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <label className="flex items-center gap-2 text-sm mb-2">
            <input
              type="checkbox"
              checked={useMockData}
              onChange={(e) => setUseMockData(e.target.checked)}
              disabled={isLoading}
              className="rounded"
            />
            <span>Use mock data for testing</span>
          </label>
        </div>
        <Button
          onClick={handleSync}
          isLoading={isLoading}
          variant="primary"
          className="flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Sync Now
        </Button>
      </div>

      {showLogs && logs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Sync Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto font-mono text-xs">
              {logs.map((log, idx) => (
                <div key={idx} className={`p-2 rounded ${getStatusColor(log.status)}`}>
                  <div className="flex gap-2">
                    <span className="text-gray-500 flex-shrink-0">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                    <span className="flex-1">{log.message}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
