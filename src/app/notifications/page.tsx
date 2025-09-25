'use client';

import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';

interface Notification {
  id: string;
  event_type: string;
  details: any;
  timestamp: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/log');
      const data = await response.json();
      if (data.success) {
        // Filter only notification-related logs
        const notificationLogs = data.logs.filter((log: any) => 
          log.event_type.includes('notification')
        );
        setNotifications(notificationLogs);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    return notification.event_type.includes(filter);
  });

  const getNotificationTypeColor = (eventType: string) => {
    if (eventType.includes('email')) return 'bg-blue-100 text-blue-800';
    if (eventType.includes('sms')) return 'bg-green-100 text-green-800';
    if (eventType.includes('push')) return 'bg-purple-100 text-purple-800';
    if (eventType.includes('sent')) return 'bg-emerald-100 text-emerald-800';
    if (eventType.includes('failed')) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getNotificationIcon = (eventType: string) => {
    if (eventType.includes('email')) {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      );
    }
    if (eventType.includes('sms')) {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      );
    }
    if (eventType.includes('push')) {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.828 7l2.586 2.586a2 2 0 002.828 0L12.828 7H4.828zM4.828 17h8a2 2 0 002-2V9a2 2 0 00-2-2H4.828" />
        </svg>
      );
    }
    return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.828 7l2.586 2.586a2 2 0 002.828 0L12.828 7H4.828zM4.828 17h8a2 2 0 002-2V9a2 2 0 00-2-2H4.828" />
      </svg>
    );
  };

  if (loading) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-2 border-gray-200 border-t-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600 font-medium">Loading notifications...</p>
          </div>
        </div>
      );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-medium text-gray-900 mb-4">Notifications</h1>
          <p className="text-gray-600">Sent notifications and their status</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-1 mb-6 border-b border-gray-200">
          {[
            ['all', 'All'],
            ['email', 'Email'],
            ['sms', 'SMS'],
            ['push', 'Push'],
            ['sent', 'Sent'],
            ['failed', 'Failed']
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

        {/* Notifications List */}
        <div className="border border-gray-200 rounded">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.828 7l2.586 2.586a2 2 0 002.828 0L12.828 7H4.828zM4.828 17h8a2 2 0 002-2V9a2 2 0 00-2-2H4.828" />
                </svg>
              </div>
              <p className="text-gray-500 text-lg">No notifications sent yet</p>
              <p className="text-gray-400 text-sm mt-1">Notifications will appear here when sent</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
              {filteredNotifications.map((notification) => (
                <div key={notification.id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center space-x-2">
                      {getNotificationIcon(notification.event_type)}
                      <span className="text-xs font-medium text-gray-700">
                        {notification.event_type.replace(/_notification_sent/g, '').replace(/_/g, ' ')}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(notification.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  {notification.details && (
                    <div className="space-y-1">
                      {notification.details.recipient && (
                        <p className="text-gray-700 text-sm">
                          <span className="font-medium">Recipient:</span> {notification.details.recipient.name || notification.details.recipient.email || 'Unknown'}
                        </p>
                      )}
                      {notification.details.message && (
                        <p className="text-gray-700 text-sm">
                          <span className="font-medium">Message:</span> {notification.details.message}
                        </p>
                      )}
                      {notification.details.document && (
                        <div className="mt-3">
                          <details className="group">
                            <summary className="cursor-pointer text-xs text-gray-600 hover:text-gray-800">
                              <span className="group-open:hidden">View Document</span>
                              <span className="hidden group-open:inline">Hide Document</span>
                            </summary>
                            <div className="mt-2 p-2 bg-gray-50 rounded border border-gray-200">
                              <p className="text-xs text-gray-700">
                                <span className="font-medium">Name:</span> {notification.details.document.name}
                              </p>
                                  <a href={notification.details.document.download_url} target="_blank" rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline text-xs break-all mt-1 block">
                                    {notification.details.document.download_url}
                                  </a>
                            </div>
                          </details>
                        </div>
                      )}
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
