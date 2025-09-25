'use client';

import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';

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

export default function PDFsPage() {
  const [pdfs, setPdfs] = useState<PDF[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'size' | 'type'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    fetchPDFs();
  }, []);

  const fetchPDFs = async () => {
    try {
      const response = await fetch('/api/pdfs');
      const data = await response.json();
      if (data.success) {
        setPdfs(data.pdfs);
      }
    } catch (error) {
      console.error('Failed to fetch PDFs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedPDFs = pdfs
    .filter(pdf => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        pdf.id.toLowerCase().includes(searchLower) ||
        pdf.patient_id.toLowerCase().includes(searchLower) ||
        pdf.form_type.toLowerCase().includes(searchLower) ||
        pdf.doctor_id.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case 'size':
          const sizeA = parseInt(a.file_size) || 0;
          const sizeB = parseInt(b.file_size) || 0;
          comparison = sizeA - sizeB;
          break;
        case 'type':
          comparison = a.form_type.localeCompare(b.form_type);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const formatFileSize = (size: string) => {
    const bytes = parseInt(size);
    if (isNaN(bytes)) return 'Unknown';
    
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFormTypeColor = (formType: string) => {
    switch (formType.toLowerCase()) {
      case 'fillout': return 'bg-blue-100 text-blue-800';
      case 'template': return 'bg-green-100 text-green-800';
      case 'custom': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-2 border-gray-200 border-t-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600 font-medium">Loading documents...</p>
          </div>
        </div>
      );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-medium text-gray-900 mb-4">Documents</h1>
          <p className="text-gray-600">Generated PDF documents</p>
        </div>

        {/* Search and Sort Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search documents..."
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'size' | 'type')}
            >
              <option value="date">Date</option>
              <option value="size">Size</option>
              <option value="type">Type</option>
            </select>
            <select
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
            >
              <option value="desc">↓</option>
              <option value="asc">↑</option>
            </select>
          </div>
        </div>

        {/* PDFs Table */}
        <div className="border border-gray-200 rounded">
          {filteredAndSortedPDFs.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-500 text-lg">
                {searchTerm ? 'No documents match your search' : 'No documents generated yet'}
              </p>
              <p className="text-gray-400 text-sm mt-1">
                {searchTerm ? 'Try adjusting your search terms' : 'Generate your first PDF to get started'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Document ID</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Created</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Patient ID</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Doctor ID</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Size</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAndSortedPDFs.map((pdf) => (
                    <tr key={pdf.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{pdf.id.slice(0, 8)}...</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(pdf.created_at).toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getFormTypeColor(pdf.form_type)}`}>
                          {pdf.form_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{pdf.patient_id.slice(0, 8)}...</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{pdf.doctor_id.slice(0, 8)}...</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{formatFileSize(pdf.file_size)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            <a
                              href={pdf.download_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
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

      </div>
    </Layout>
  );
}
