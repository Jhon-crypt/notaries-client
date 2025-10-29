import { useState } from 'react';
import { Link } from 'react-router-dom';

const ClientDashboard = () => {
  const [hasDigitalSignature, setHasDigitalSignature] = useState(false);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [signatureRequestSent, setSignatureRequestSent] = useState(false);

  // Mock data for received documents
  const recentDocuments = [
    {
      id: 1,
      name: 'Property_Deed.pdf',
      notary: 'Sarah Williams',
      date: '2 hours ago',
      status: 'verified',
      requiresSignature: true,
      signed: false
    },
    {
      id: 2,
      name: 'Contract_Agreement.pdf',
      notary: 'Michael Chen',
      date: '1 day ago',
      status: 'verified',
      requiresSignature: true,
      signed: true
    },
    {
      id: 3,
      name: 'Legal_Document.pdf',
      notary: 'Sarah Williams',
      date: '3 days ago',
      status: 'pending',
      requiresSignature: false,
      signed: false
    },
  ];

  const handleRequestSignature = () => {
    setSignatureRequestSent(true);
    setTimeout(() => setShowSignatureModal(false), 2000);
  };

  const handleGenerateOnTheFly = () => {
    setHasDigitalSignature(true);
    setShowSignatureModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome Back!</h1>
        <p className="text-blue-100">Access your notarized documents and manage your profile</p>
      </div>

      {/* Digital Signature Status */}
      {!hasDigitalSignature && (
        <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-amber-100 rounded-lg">
                <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-amber-900 mb-1">Digital Signature Not Set Up</h3>
                <p className="text-sm text-amber-700 mb-4">
                  Some documents require your digital signature. Set up your credentials to sign documents electronically.
                </p>
                <button
                  onClick={() => setShowSignatureModal(true)}
                  className="px-6 py-2.5 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition-colors"
                >
                  Set Up Digital Signature
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Documents */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-start justify-between mb-2">
            <div className="p-2 bg-blue-50 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-xs text-blue-600 font-medium">+3 this week</span>
          </div>
          <p className="text-sm text-gray-500 mb-1">Total Documents</p>
          <h3 className="text-3xl font-bold text-gray-900">12</h3>
          <p className="text-xs text-gray-400 mt-2">Received from notaries</p>
        </div>

        {/* Pending Signatures */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-start justify-between mb-2">
            <div className="p-2 bg-orange-50 rounded-lg">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <span className="text-xs text-orange-600 font-medium">Action needed</span>
          </div>
          <p className="text-sm text-gray-500 mb-1">Pending Signatures</p>
          <h3 className="text-3xl font-bold text-gray-900">1</h3>
          <p className="text-xs text-gray-400 mt-2">Awaiting your signature</p>
        </div>

        {/* Active Notaries */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-start justify-between mb-2">
            <div className="p-2 bg-green-50 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">Notaries Worked With</p>
          <h3 className="text-3xl font-bold text-gray-900">3</h3>
          <p className="text-xs text-gray-400 mt-2">Trusted notaries</p>
        </div>
      </div>

      {/* Recent Documents */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Recent Documents</h2>
            <Link
              to="/dashboard/documents"
              className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
            >
              View All
            </Link>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {recentDocuments.map((doc) => (
            <div key={doc.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-4 flex-1">
                  {/* Document Icon */}
                  <div className={`p-3 rounded-lg ${
                    doc.status === 'verified' ? 'bg-green-50' : 'bg-yellow-50'
                  }`}>
                    <svg className={`w-6 h-6 ${
                      doc.status === 'verified' ? 'text-green-600' : 'text-yellow-600'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>

                  {/* Document Info */}
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-gray-900 mb-1">{doc.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {doc.notary}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {doc.date}
                      </span>
                    </div>

                    {/* Signature Status */}
                    {doc.requiresSignature && (
                      <div className="mt-2">
                        {doc.signed ? (
                          <span className="inline-flex items-center gap-1 text-xs text-green-600 font-medium">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Signed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-orange-600 font-medium">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            Signature Required
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {/* Status Badge */}
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    doc.status === 'verified'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {doc.status === 'verified' ? 'Verified' : 'Pending'}
                  </span>

                  {/* Download Button */}
                  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>

                  {/* View Button */}
                  <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Find Notary */}
        <Link to="/dashboard/notaries" className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all group">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Find a Notary</h3>
              <p className="text-sm text-gray-600">Browse available notaries in your area</p>
            </div>
          </div>
        </Link>

        {/* Contact Support */}
        <button className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all group text-left">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Need Help?</h3>
              <p className="text-sm text-gray-600">Contact support for assistance</p>
            </div>
          </div>
        </button>
      </div>

      {/* Digital Signature Setup Modal */}
      {showSignatureModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Set Up Digital Signature</h3>
              <p className="text-sm text-gray-600">Choose how you want to set up your digital signature</p>
            </div>

            {signatureRequestSent ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-green-900">Request Sent!</p>
                    <p className="text-xs text-green-700">Check your email for instructions</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3 mb-6">
                {/* Option 1: Request Credentials */}
                <button
                  onClick={handleRequestSignature}
                  className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left group"
                >
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="font-semibold text-gray-900 group-hover:text-blue-600">Request Certificate</p>
                      <p className="text-xs text-gray-600 mt-1">We'll send you a verified digital certificate via email</p>
                    </div>
                  </div>
                </button>

                {/* Option 2: Generate On-the-Fly */}
                <button
                  onClick={handleGenerateOnTheFly}
                  className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all text-left group"
                >
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <div>
                      <p className="font-semibold text-gray-900 group-hover:text-green-600">Generate Now</p>
                      <p className="text-xs text-gray-600 mt-1">Create a temporary signature instantly (expires in 30 days)</p>
                    </div>
                  </div>
                </button>
              </div>
            )}

            {/* Close Button */}
            <button
              onClick={() => setShowSignatureModal(false)}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              {signatureRequestSent ? 'Close' : 'Cancel'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDashboard;

