'use client';

import { useState } from 'react';
import Layout from '../components/Layout';
import PDFForm from '../components/PDFForm';
import { generatePDF, sendNotification } from '../lib/api';
import { GeneratePDFRequest } from '../types';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'landing' | 'form'>('landing');
  const [lastDoc, setLastDoc] = useState<{ id: string; url: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGeneratePDF = async (formData: any) => {
    setLoading(true);
    try {
      const request: GeneratePDFRequest = {
        type: 'fillout',
        form: 'a',
        notify: true,
        form_payload: formData
      };

      const response = await generatePDF(request);
      
      if (response.success && response.data) {
        setLastDoc({ id: response.data.id, url: response.data.file_url });
        setActiveTab('landing');

        // Send notification
        try {
          await sendNotification({
            type: 'pdf_ready',
            recipient: {
              email: 'patient@example.com',
              phone: '+1234567890',
              name: 'Max Mustermann'
            },
            message: 'Your care document is ready for download',
            document: {
              id: response.data.id,
              name: 'Care Document',
              download_url: response.data.file_url,
            },
            notification_types: ['email']
          });
        } catch (error) {
          console.error('Failed to send notification:', error);
        }
      } else {
        alert('Failed to generate PDF: ' + (response.error || 'Unknown error'));
      }
    } catch (error) {
      alert('Error generating PDF: ' + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-16">
        {activeTab === 'landing' && (
          <div className="text-center">
            {lastDoc && (
              <div className="p-4 border border-gray-200 rounded mb-8">
                <p className="text-sm text-gray-600 mb-2">Last generated</p>
                <a href={lastDoc.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Download PDF
                </a>
              </div>
            )}
            <h1 className="text-2xl font-medium text-gray-900 mb-4">Generate Care Document</h1>
            <p className="text-gray-600 mb-8">Create a new patient care PDF document.</p>
            <button
              onClick={() => setActiveTab('form')}
              className="bg-gray-900 text-white px-6 py-2 text-sm font-medium hover:bg-gray-800"
            >
              New Document
            </button>
          </div>
        )}

        {activeTab === 'form' && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-xl font-medium text-gray-900">Patient Details</h1>
              <button 
                onClick={() => setActiveTab('landing')} 
                className="text-sm text-gray-500 hover:text-gray-900"
              >
                ← Back
              </button>
            </div>
            <PDFForm onGenerate={handleGeneratePDF} loading={loading} lastDoc={lastDoc} />
          </div>
        )}
      </div>
    </Layout>
  );
}

