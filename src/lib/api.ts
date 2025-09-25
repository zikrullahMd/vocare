import { API_ENDPOINTS } from '../constants';
import { GeneratePDFRequest, GeneratePDFResponse, APIResponse, PDF, Log } from '../types';

// Generic API request function
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<APIResponse<T>> => {
  try {
    const response = await fetch(endpoint, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
};

// PDF Generation API
export const generatePDF = async (request: GeneratePDFRequest): Promise<APIResponse<GeneratePDFResponse>> => {
  return apiRequest<GeneratePDFResponse>(API_ENDPOINTS.GENERATE_PDF, {
    method: 'POST',
    body: JSON.stringify(request),
  });
};

// Logs API
export const fetchLogs = async (): Promise<APIResponse<{ logs: Log[] }>> => {
  return apiRequest<{ logs: Log[] }>(API_ENDPOINTS.LOGS);
};

export const createLog = async (logData: { event_type: string; details: any }): Promise<APIResponse> => {
  return apiRequest(API_ENDPOINTS.LOGS, {
    method: 'POST',
    body: JSON.stringify(logData),
  });
};

// PDFs API
export const fetchPDFs = async (): Promise<APIResponse<{ pdfs: PDF[] }>> => {
  return apiRequest<{ pdfs: PDF[] }>(API_ENDPOINTS.PDFS);
};

// Notifications API
export const sendNotification = async (notificationData: {
  type: string;
  recipient: { email?: string; phone?: string; name?: string };
  message: string;
  document?: { id: string; name: string; download_url: string };
  notification_types: string[];
}): Promise<APIResponse> => {
  return apiRequest(API_ENDPOINTS.NOTIFY, {
    method: 'POST',
    body: JSON.stringify(notificationData),
  });
};

// Utility function to handle API errors
export const handleApiError = (error: string): string => {
  // You can add custom error handling logic here
  console.error('API Error:', error);
  return error;
};

// Utility function to check if response is successful
export const isApiSuccess = <T>(response: APIResponse<T>): response is APIResponse<T> & { data: T } => {
  return response.success && response.data !== undefined;
};
