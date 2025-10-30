import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import PDFUpload from '../components/documents/PDFUpload';

const Documents = () => {
  const { t } = useLanguage();
  const [showUpload, setShowUpload] = useState(false);
  const [documents, setDocuments] = useState([
    { id: 1, name: 'Contract_Agreement.pdf', client: 'John Doe', date: '2024-01-15', status: 'Verified', size: '2.4 MB', certifiedBy: 'Sarah Williams', documentType: 'Contract' },
    { id: 2, name: 'Property_Deed.pdf', client: 'Jane Smith', date: '2024-01-14', status: 'Pending', size: '1.8 MB', certifiedBy: 'Current User', documentType: 'Deed' },
    { id: 3, name: 'Notarized_Will.pdf', client: 'Robert Johnson', date: '2024-01-13', status: 'Verified', size: '3.2 MB', certifiedBy: 'Michael Chen', documentType: 'Will' },
    { id: 4, name: 'Power_of_Attorney.pdf', client: 'Emily Davis', date: '2024-01-12', status: 'Verified', size: '1.5 MB', certifiedBy: 'Jessica Martinez', documentType: 'Power of Attorney' },
  ]);

  const handleUploadSuccess = (uploadedFile) => {
    const newDoc = {
      id: documents.length + 1,
      name: uploadedFile.name,
      client: 'Pending Assignment',
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
      size: (uploadedFile.size / (1024 * 1024)).toFixed(2) + ' MB',
      certifiedBy: localStorage.getItem('userName') || 'Current User',
      documentType: uploadedFile.certification.originalDocumentType
    };
    setDocuments([newDoc, ...documents]);
    setShowUpload(false);
  };

  const userRole = localStorage.getItem('userRole') || 'client';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('nav.documents')}</h1>
          <p className="text-sm text-gray-600 mt-1">
            {userRole === 'notary' ? 'Upload and certify PDF documents' : 'View your certified documents'}
          </p>
        </div>
        {userRole === 'notary' && (
          <button 
            onClick={() => setShowUpload(!showUpload)}
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all flex items-center gap-2 shadow-sm hover:shadow-md"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {showUpload ? t('common.cancel') + ' ' + t('common.upload') : t('documents.uploadCertifyPDF')}
          </button>
        )}
      </div>

      {/* PDF Upload Component */}
      {showUpload && userRole === 'notary' && (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Upload & Certify New Document</h2>
          <PDFUpload onUploadSuccess={handleUploadSuccess} />
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-blue-500">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-sm text-gray-500">{t('client.totalDocuments')}</p>
          </div>
          <h3 className="text-3xl font-bold text-gray-900">{documents.length}</h3>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-green-500">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-gray-500">{t('statuses.verified')}</p>
          </div>
          <h3 className="text-3xl font-bold text-green-600">{documents.filter(d => d.status === 'Verified').length}</h3>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-yellow-500">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-gray-500">{t('dashboard.pendingReviews')}</p>
          </div>
          <h3 className="text-3xl font-bold text-yellow-600">{documents.filter(d => d.status === 'Pending').length}</h3>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-purple-500">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm text-gray-500">{t('dashboard.successRate')}</p>
          </div>
          <h3 className="text-3xl font-bold text-purple-600">28</h3>
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">{t('documents.documentList') || 'Document List'}</h2>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder={t('documents.searchDocuments')}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent">
                <option value="all">{t('documents.allStatuses')}</option>
                <option value="verified">{t('statuses.verified')}</option>
                <option value="pending">{t('statuses.pending')}</option>
              </select>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Document Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Certified By
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                        doc.status === 'Verified' ? 'bg-green-100' : 'bg-yellow-100'
                      }`}>
                        <svg className={`w-6 h-6 ${doc.status === 'Verified' ? 'text-green-600' : 'text-yellow-600'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                        <p className="text-xs text-gray-500">{doc.size}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                      {doc.documentType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {doc.client}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {doc.certifiedBy}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {doc.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full ${
                      doc.status === 'Verified' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {doc.status === 'Verified' && (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button className="text-blue-600 hover:text-blue-900 transition-colors">{t('common.view')}</button>
                      <button className="text-green-600 hover:text-green-900 transition-colors">{t('common.download')}</button>
                      {userRole === 'notary' || userRole === 'admin' && (
                        <button className="text-red-600 hover:text-red-900 transition-colors">{t('common.delete')}</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Documents;

