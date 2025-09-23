'use client';

import { useState, useEffect } from 'react';

interface PDF {
  id: string;
  file_url: string;
  created_at: string;
  file_size: string;
  form_type: string;
  form_id: string;
  patient_id: string;
  doctor_id: string;
  download_url: string;
}

interface Log {
  id: string;
  event_type: string;
  details: any;
  timestamp: string;
}

export default function Home() {
  const [pdfs, setPdfs] = useState<PDF[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pdfs' | 'logs' | 'generate'>('generate');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [pdfsRes, logsRes] = await Promise.all([
        fetch('/api/pdfs'),
        fetch('/api/log')
      ]);

      const pdfsData = await pdfsRes.json();
      const logsData = await logsRes.json();

      if (pdfsData.success) setPdfs(pdfsData.pdfs);
      if (logsData.success) setLogs(logsData.logs);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'fillout',
          form: 'a',
          notify: true,
          form_payload: {
            patient_insurer_name: 'AOK Pflegekasse',
            patient_insured_fullname: 'Max Mustermann',
            patient_birth_date: '1949-02-01',
            patient_payer_id: '04879',
            patient_insured_id: 'A03248953',
            patient_status: '99999999',
            patient_facility_id: '123456789',
            patient_doctor_id: '987654321',
            patient_date: '2025-09-04',
            order_first: false,
            order_followup: true,
            order_accident: false,
            order_ser: false,
            care_prepare_med_box: true,
            care_administer_meds: true,
            care_injection_prepare: true,
            care_injection_im: false,
            care_injection_sc: true,
            glucose_first_or_new: false,
            glucose_intensified_insulin: true,
            comp_stockings_on: true,
            comp_bandages_apply: true,
            comp_side_right: true,
            comp_side_left: false,
            comp_side_both: false,
            wound_acute: false,
            wound_chronic: true,
            s37_support_care_37a: false,
            s37_hospital_avoid_37_1: true,
            s37_base_care: true,
            s37_household_care: true
          }
        })
      });

      const result = await response.json();
      if (result.success) {
        alert('PDF generated successfully!');
        fetchData();
        setActiveTab('pdfs');
      } else {
        alert('Failed to generate PDF: ' + result.error);
      }
    } catch (error) {
      alert('Error generating PDF: ' + error);
    } finally {
      setLoading(false);
    }
  };

  const sendNotification = async () => {
    try {
      const response = await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'pdf_ready',
          recipient: {
            email: 'patient@example.com',
            phone: '+1234567890',
            name: 'Max Mustermann'
          },
          message: 'Your care document is ready for download',
          document: {
            id: 'sample-doc-id',
            name: 'Care Document - Max Mustermann',
            download_url: 'https://example.com/doc.pdf'
          },
          notification_types: ['email', 'sms', 'push']
        })
      });

      const result = await response.json();
      if (result.success) {
        alert('Notifications sent successfully!');
        fetchData();
        setActiveTab('logs');
      } else {
        alert('Failed to send notifications: ' + result.error);
      }
    } catch (error) {
      alert('Error sending notifications: ' + error);
    }
  };

  if (loading && pdfs.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-2 border-slate-200 border-t-slate-900 mx-auto"></div>
          <p className="mt-4 text-slate-600 font-medium">Loading system data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Care Platform</h1>
          <p className="text-slate-600 text-lg">PDF Document Management System</p>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-white rounded-xl p-1 shadow-sm border border-slate-200">
          <button
            onClick={() => setActiveTab('generate')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'generate' 
                ? 'bg-slate-900 text-white shadow-sm' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Generate PDF
          </button>
          <button
            onClick={() => setActiveTab('pdfs')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'pdfs' 
                ? 'bg-slate-900 text-white shadow-sm' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Documents ({pdfs.length})
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'logs' 
                ? 'bg-slate-900 text-white shadow-sm' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Activity Logs ({logs.length})
          </button>
        </div>

        {/* Generate PDF Tab */}
        {activeTab === 'generate' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-slate-900 mb-2">Generate PDF Document</h2>
              <p className="text-slate-600">
                Create a new care document PDF with patient data and send notifications.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={generatePDF}
                disabled={loading}
                className="bg-slate-900 text-white px-8 py-3 rounded-xl font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  'Generate PDF'
                )}
              </button>
              <button
                onClick={sendNotification}
                className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-emerald-700 transition-colors duration-200"
              >
                Send Test Notification
              </button>
            </div>
          </div>
        )}

        {/* PDFs Tab */}
        {activeTab === 'pdfs' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-slate-900 mb-2">Document Library</h2>
              <p className="text-slate-600">Manage and download generated PDF documents</p>
            </div>
            {pdfs.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-slate-500 text-lg">No documents generated yet</p>
                <p className="text-slate-400 text-sm mt-1">Generate your first PDF to get started</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="px-6 py-4 text-left text-sm font-medium text-slate-600 uppercase tracking-wider">Document ID</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-slate-600 uppercase tracking-wider">Created</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-slate-600 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-slate-600 uppercase tracking-wider">Patient ID</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-slate-600 uppercase tracking-wider">Size</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-slate-600 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {pdfs.map((pdf) => (
                      <tr key={pdf.id} className="hover:bg-slate-50 transition-colors duration-150">
                        <td className="px-6 py-4 font-mono text-sm text-slate-900">{pdf.id.slice(0, 8)}...</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{new Date(pdf.created_at).toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                            {pdf.form_type}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono text-sm text-slate-600">{pdf.patient_id.slice(0, 8)}...</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{pdf.file_size}</td>
                        <td className="px-6 py-4">
                          <a
                            href={pdf.download_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-1.5 border border-slate-300 text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 transition-colors duration-150"
                          >
                            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Download
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Logs Tab */}
        {activeTab === 'logs' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-slate-900 mb-2">Activity Logs</h2>
              <p className="text-slate-600">Monitor system activities and events in real-time</p>
            </div>
            {logs.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <p className="text-slate-500 text-lg">No activity logs yet</p>
                <p className="text-slate-400 text-sm mt-1">System activities will appear here</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {logs.map((log) => (
                  <div key={log.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 hover:bg-slate-50 transition-colors duration-150">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-200 text-slate-800">
                          {log.event_type.replace(/_/g, ' ')}
                        </span>
                        <span className="text-sm text-slate-500">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    {log.details && Object.keys(log.details).length > 0 && (
                      <div className="mt-3">
                        <details className="group">
                          <summary className="cursor-pointer text-sm text-slate-600 hover:text-slate-800 transition-colors duration-150">
                            <span className="group-open:hidden">View details</span>
                            <span className="hidden group-open:inline">Hide details</span>
                          </summary>
                          <div className="mt-2 p-3 bg-white rounded-lg border border-slate-200">
                            <pre className="text-xs text-slate-700 overflow-x-auto whitespace-pre-wrap">
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
        )}
      </div>
    </div>
  );
}