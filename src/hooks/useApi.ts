import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../constants';

// Generic API hook
export const useApi = <T>(endpoint: string, options?: RequestInit) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(endpoint, options);
        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.error || 'Failed to fetch data');
        }
        
        setData(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint, JSON.stringify(options)]);

  return { data, loading, error };
};

// Specific hooks for different endpoints
export const usePDFs = () => {
  return useApi(API_ENDPOINTS.PDFS);
};

export const useLogs = () => {
  return useApi(API_ENDPOINTS.LOGS);
};

export const useNotifications = () => {
  return useApi(API_ENDPOINTS.LOGS); // Notifications are filtered from logs
};
