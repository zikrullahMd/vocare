'use client';

import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';

interface Log {
  id: string;
  event_type: string;
  details: any;
  timestamp: string;
}

export default function LogsPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await fetch('/api/log');
      const data = await response.json();
      if (data.success) {
        setLogs(data.logs);
      }
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => {
    if (filter === 'all') return true;
    return log.event_type.includes(filter);
  });

  const getEventTypeColor = (eventType: string) => {
    if (eventType.includes('notification')) return 'bg-blue-100 text-blue-800';
    if (eventType.includes('pdf')) return 'bg-green-100 text-green-800';
    if (eventType.includes('error')) return 'bg-red-100 text-red-800';
    if (eventType.includes('upload')) return 'bg-purple-100 text-purple-800';
    return 'bg-gray-100 text-gray-800';
  };

  if (loading) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-2 border-gray-200 border-t-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600 font-medium">Loading logs...</p>
          </div>
        </div>
      );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-medium text-gray-900 mb-4">Activity Logs</h1>
          <p className="text-gray-600">System activities and events</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-1 mb-6 border-b border-gray-200">
          {[
            ['all', 'All'],
            ['pdf', 'PDF'],
            ['notification', 'Notifications'],
            ['upload', 'Uploads'],
            ['error', 'Errors']
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
                filter === key 
                  ? 'border-gray-900 text-gray-900' 
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Logs List */}
        <div className="border border-gray-200 rounded">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <p className="text-gray-500 text-lg">No logs found</p>
              <p className="text-gray-400 text-sm mt-1">System activities will appear here</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
              {filteredLogs.map((log) => (
                <div key={log.id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEventTypeColor(log.event_type)}`}>
                            {log.event_type.replace(/_/g, ' ')}
                          </span>
                      <span className="text-xs text-gray-500">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  {log.details && Object.keys(log.details).length > 0 && (
                    <div className="mt-2">
                      <details className="group">
                        <summary className="cursor-pointer text-xs text-gray-600 hover:text-gray-800">
                          <span className="group-open:hidden">View details</span>
                          <span className="hidden group-open:inline">Hide details</span>
                        </summary>
                        <div className="mt-2 p-2 bg-gray-50 rounded border border-gray-200">
                          <pre className="text-xs text-gray-700 overflow-x-auto whitespace-pre-wrap">
                            {JSON.stringify(log.details, null, 2)}
                          </pre>
                        </div>
                      </details>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
