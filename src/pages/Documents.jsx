import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import PDFUpload from '../components/documents/PDFUpload';

const Documents = () => {
  const { t } = useLanguage();
  const [showUpload, setShowUpload] = useState(false);
  const [documents, setDocuments] = useState([
    {
      id: 1,
      confirmation: 'CN-10234',
      sender: 'Notaría Central Lima',
      dateSent: '2024-01-15',
      recipient: 'Luis Paredes',
      secondaryNotary: 'Notaría Surco Verde',
      status: 'delivered',
      category: 'secondary',
    },
    {
      id: 2,
      confirmation: 'CN-10218',
      sender: 'Notaría Surco Verde',
      dateSent: '2024-01-14',
      recipient: 'María Quispe',
      originatingNotary: 'Notaría Central Lima',
      status: 'pending_confirmation',
      category: 'incoming',
    },
    {
      id: 3,
      confirmation: 'CN-10209',
      sender: 'Notaría Callao Express',
      dateSent: '2024-01-13',
      recipient: 'Ana Flores',
      secondaryNotary: 'Notaría Miraflores',
      status: 'in_transit',
      category: 'secondary',
    },
    {
      id: 4,
      confirmation: 'CN-10197',
      sender: 'Notaría Miraflores',
      dateSent: '2024-01-12',
      recipient: 'Carlos Ríos',
      originatingNotary: 'Notaría Callao Express',
      status: 'delivered',
      category: 'incoming',
    },
  ]);

  const handleUploadSuccess = (uploadedFile) => {
    const newDoc = {
      id: documents.length + 1,
      confirmation: `CN-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      sender: localStorage.getItem('userName') || t('documents.currentNotaryFallback'),
      dateSent: new Date().toISOString().split('T')[0],
      recipient: uploadedFile.metadata?.recipient || t('documents.recipientPending'),
      secondaryNotary: t('documents.secondaryPending'),
      status: 'pending_confirmation',
      category: 'secondary',
    };
    setDocuments((prev) => [newDoc, ...prev]);
    setShowUpload(false);
  };

  const userRole = localStorage.getItem('userRole') || 'client';
  const signatureStatus = localStorage.getItem('clientSignatureStatus') || 'not_setup';
  const showSignatureReminder = userRole === 'client' && signatureStatus !== 'active';
  const isSignaturePending = signatureStatus === 'pending';
  const signatureReminderTitle = isSignaturePending ? t('client.signatureProcessingTitle') : t('client.digitalSignatureNotSetup');
  const signatureReminderDescription = isSignaturePending ? t('client.signatureProcessingDescription') : t('client.someDocsRequire');
  const signatureReminderAction = isSignaturePending ? t('client.trackSignatureRequest') : t('client.setupDigitalSignature');
  const currentNotaryName = localStorage.getItem('userName') || t('documents.currentNotaryFallback');
  const [filters, setFilters] = useState({ query: '', status: 'all', category: 'all' });

  const orderedDocuments = useMemo(() => {
    const secondary = documents.filter((doc) => doc.category === 'secondary');
    const incoming = documents.filter((doc) => doc.category === 'incoming');
    return [...secondary, ...incoming];
  }, [documents]);

  const filteredDocuments = useMemo(() => {
    const query = filters.query.trim().toLowerCase();
    return orderedDocuments.filter((doc) => {
      const matchesQuery =
        !query ||
        [doc.confirmation, doc.sender, doc.recipient, doc.secondaryNotary, doc.originatingNotary]
          .filter(Boolean)
          .some((field) => field.toLowerCase().includes(query));
      const matchesStatus = filters.status === 'all' || doc.status === filters.status;
      const matchesCategory = filters.category === 'all' || doc.category === filters.category;
      return matchesQuery && matchesStatus && matchesCategory;
    });
  }, [orderedDocuments, filters]);

  const sentToSecondaryCount = documents.filter((doc) => doc.category === 'secondary').length;
  const receivedFromOriginCount = documents.filter((doc) => doc.category === 'incoming').length;
  const pendingConfirmationCount = documents.filter((doc) => doc.status === 'pending_confirmation').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {userRole === 'client' ? t('nav.myDocuments') : t('nav.documents')}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {userRole === 'notary'
              ? t('documents.subtitleNotary', { name: currentNotaryName })
              : t('documents.subtitleClient')}
          </p>
        </div>
      {showSignatureReminder && (
        <div
          className={`rounded-xl border-2 p-4 sm:p-5 mb-6 ${
            isSignaturePending ? 'bg-blue-50 border-blue-200' : 'bg-amber-50 border-amber-200'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-start gap-3">
              <div
                className={`p-2 rounded-lg ${
                  isSignaturePending ? 'bg-blue-100' : 'bg-amber-100'
                }`}
              >
                <svg
                  className={`w-6 h-6 ${isSignaturePending ? 'text-blue-600' : 'text-amber-600'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={
                      isSignaturePending
                        ? 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                        : 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                    }
                  />
                </svg>
              </div>
              <div>
                <h2
                  className={`text-base font-semibold ${
                    isSignaturePending ? 'text-blue-900' : 'text-amber-900'
                  }`}
                >
                  {signatureReminderTitle}
                </h2>
                <p className={`text-sm mt-1 ${isSignaturePending ? 'text-blue-700' : 'text-amber-700'}`}>
                  {signatureReminderDescription}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard/profile"
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                  isSignaturePending
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-amber-600 text-white hover:bg-amber-700'
                }`}
              >
                {signatureReminderAction}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      )}

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
            <p className="text-sm text-gray-500">{t('documents.totalDocumentsLabel')}</p>
          </div>
          <h3 className="text-3xl font-bold text-gray-900">{documents.length}</h3>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-green-500">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-gray-500">{t('documents.sentToSecondaryLabel')}</p>
          </div>
          <h3 className="text-3xl font-bold text-green-600">{sentToSecondaryCount}</h3>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-purple-500">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm text-gray-500">{t('documents.receivedFromOriginLabel')}</p>
          </div>
          <h3 className="text-3xl font-bold text-purple-600">{receivedFromOriginCount}</h3>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-yellow-500">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-gray-500">{t('documents.pendingConfirmationLabel')}</p>
          </div>
          <h3 className="text-3xl font-bold text-yellow-600">{pendingConfirmationCount}</h3>
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">{t('documents.documentList') || 'Document List'}</h2>
            <div className="flex items-center gap-2 flex-wrap justify-end">
              <input
                type="text"
                placeholder={t('documents.searchDocuments')}
                value={filters.query}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    query: e.target.value,
                  }))
                }
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    status: e.target.value,
                  }))
                }
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">{t('documents.filterStatusAll')}</option>
                <option value="delivered">{t('documents.status.delivered')}</option>
                <option value="pending_confirmation">{t('documents.status.pending_confirmation')}</option>
                <option value="in_transit">{t('documents.status.in_transit')}</option>
              </select>
              <select
                value={filters.category}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    category: e.target.value,
                  }))
                }
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">{t('documents.filterCategoryAll')}</option>
                <option value="secondary">{t('documents.categorySecondary')}</option>
                <option value="incoming">{t('documents.categoryIncoming')}</option>
              </select>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('documents.confirmationColumn')}
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('documents.senderColumn')}
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('documents.dateSentColumn')}
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('documents.recipientColumn')}
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('documents.partnerNotaryColumn')}
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('documents.statusColumn')}
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('documents.actionsColumn')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDocuments.map((doc) => {
                const partner =
                  doc.category === 'secondary' ? doc.secondaryNotary : doc.originatingNotary;
                const statusColor =
                  doc.status === 'delivered'
                    ? 'bg-green-100 text-green-800'
                    : doc.status === 'pending_confirmation'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-purple-100 text-purple-800';
                const badgeColor =
                  doc.category === 'secondary'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600';

                return (
                  <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-mono text-sm text-gray-900">{doc.confirmation}</div>
                      <p className="text-xs text-gray-500">{t('documents.confirmationHint')}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-semibold text-gray-900">{doc.sender}</p>
                      <span className={`mt-1 inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${badgeColor}`}>
                        {doc.category === 'secondary'
                          ? t('documents.categorySecondary')
                          : t('documents.categoryIncoming')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {doc.dateSent}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {doc.recipient}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {partner || t('documents.partnerNotaryFallback')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex items-center gap-1 text-xs font-semibold rounded-full ${statusColor}`}>
                        {t(`documents.status.${doc.status}`)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button className="text-blue-600 hover:text-blue-900 transition-colors">
                          {t('common.view')}
                        </button>
                        <button className="text-green-600 hover:text-green-900 transition-colors">
                          {t('common.download')}
                        </button>
                        {(userRole === 'notary' || userRole === 'admin') && (
                          <button className="text-red-600 hover:text-red-900 transition-colors">
                            {t('common.delete')}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Documents;

