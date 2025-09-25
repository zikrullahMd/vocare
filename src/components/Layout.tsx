'use client';

import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { LayoutProps, PDF, Log } from '../types';
import { fetchPDFs, fetchLogs } from '../lib/api';

export default function Layout({ children }: LayoutProps) {
  const [pdfs, setPdfs] = useState<PDF[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [pdfsResponse, logsResponse] = await Promise.all([
        fetchPDFs(),
        fetchLogs()
      ]);

      if (pdfsResponse.success && pdfsResponse.data) {
        setPdfs(pdfsResponse.data.pdfs);
      }
      if (logsResponse.success && logsResponse.data) {
        setLogs(logsResponse.data.logs);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-2 border-gray-200 border-t-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading system data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar pdfCount={pdfs.length} logCount={logs.length} />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}

