import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const AdminDashboard = () => {
  const { t } = useLanguage();
  // Mock data for pending verifications
  const pendingNotaries = [
    { id: 1, name: 'Robert Johnson', email: 'robert.j@example.com', license: 'NOT-2024-045', state: 'CA', submittedDate: '2 hours ago' },
    { id: 2, name: 'Maria Garcia', email: 'maria.g@example.com', license: 'NOT-2024-046', state: 'TX', submittedDate: '5 hours ago' },
    { id: 3, name: 'David Lee', email: 'david.lee@example.com', license: 'NOT-2024-047', state: 'NY', submittedDate: '1 day ago' },
  ];

  const recentActivity = [
    { id: 1, type: 'notary_approved', user: 'Sarah Williams', action: 'Notary verified and approved', time: '30 minutes ago', icon: 'check' },
    { id: 2, type: 'document_validated', user: 'Michael Chen', action: 'Validated 5 documents', time: '1 hour ago', icon: 'document' },
    { id: 3, type: 'client_registered', user: 'Emily Davis', action: 'New client registered', time: '2 hours ago', icon: 'user' },
    { id: 4, type: 'system_update', user: 'System', action: 'Security patches applied', time: '4 hours ago', icon: 'shield' },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Admin Welcome Banner */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-700 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{t('admin.administratorDashboard')}</h1>
            <p className="text-purple-100">{t('admin.manageUsers')}</p>
          </div>
          <div className="hidden md:block">
            <svg className="w-20 h-20 text-purple-300 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Pending Notary Verifications Alert */}
      {pendingNotaries.length > 0 && (
        <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4 flex-1">
              <div className="p-3 bg-orange-100 rounded-lg">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-orange-900 mb-1">{t('admin.pendingVerifications')}</h3>
                <p className="text-sm text-orange-700 mb-4">
                  {pendingNotaries.length} {t('admin.applicationsAwaiting')}
                </p>
                <Link
                  to="/dashboard/notaries"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors"
                >
                  {t('admin.reviewApplications')}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-purple-100">
          <div className="flex items-start justify-between mb-2">
            <div className="p-2 bg-purple-50 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <span className="text-xs text-purple-600 font-medium">+15 {t('dashboard.thisWeek')}</span>
          </div>
          <p className="text-sm text-gray-500 mb-1">{t('admin.totalUsers')}</p>
          <h3 className="text-3xl font-bold text-gray-900">287</h3>
          <p className="text-xs text-gray-400 mt-2">{t('admin.acrossAllRoles')}</p>
        </div>

        {/* Active Notaries */}
        <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-green-100">
          <div className="flex items-start justify-between mb-2">
            <div className="p-2 bg-green-50 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="text-xs text-green-600 font-medium">45 {t('admin.verified')}</span>
          </div>
          <p className="text-sm text-gray-500 mb-1">{t('dashboard.activeNotaries')}</p>
          <h3 className="text-3xl font-bold text-gray-900">45</h3>
          <p className="text-xs text-gray-400 mt-2">3 {t('admin.pendingVerification')}</p>
        </div>

        {/* Documents Processed */}
        <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-blue-100">
          <div className="flex items-start justify-between mb-2">
            <div className="p-2 bg-blue-50 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-xs text-blue-600 font-medium">+128 {t('dashboard.thisMonth')}</span>
          </div>
          <p className="text-sm text-gray-500 mb-1">{t('admin.documentsProcessed')}</p>
          <h3 className="text-3xl font-bold text-gray-900">1,847</h3>
          <p className="text-xs text-gray-400 mt-2">{t('admin.totalValidated')}</p>
        </div>

        {/* System Health */}
        <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-emerald-100">
          <div className="flex items-start justify-between mb-2">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xs text-emerald-600 font-medium">{t('admin.optimal')}</span>
          </div>
          <p className="text-sm text-gray-500 mb-1">{t('admin.systemHealth')}</p>
          <h3 className="text-3xl font-bold text-gray-900">99.8%</h3>
          <p className="text-xs text-gray-400 mt-2">{t('admin.uptimeThisMonth')}</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Notary Verifications */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">{t('admin.pendingNotaryVerifications')}</h2>
              <Link to="/dashboard/notaries" className="text-sm text-purple-600 hover:text-purple-700 font-semibold">
                {t('common.viewAll')}
              </Link>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {pendingNotaries.map((notary) => (
              <div key={notary.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                      {notary.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-gray-900">{notary.name}</h3>
                      <p className="text-sm text-gray-500">{notary.email}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-600">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          {notary.license}
                        </span>
                        <span>•</span>
                        <span>{notary.state}</span>
                        <span>•</span>
                        <span className="text-orange-600 font-medium">{notary.submittedDate}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Reject">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <button className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors">
                      Verify
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent System Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
          </div>

          <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${
                    activity.type === 'notary_approved' ? 'bg-green-50' :
                    activity.type === 'document_validated' ? 'bg-blue-50' :
                    activity.type === 'client_registered' ? 'bg-purple-50' :
                    'bg-gray-50'
                  }`}>
                    {activity.icon === 'check' && (
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {activity.icon === 'document' && (
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    )}
                    {activity.icon === 'user' && (
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    )}
                    {activity.icon === 'shield' && (
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                    <p className="text-sm text-gray-600">{activity.action}</p>
                    <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Admin Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/dashboard/notaries" className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all group">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Manage Notaries</h3>
              <p className="text-sm text-gray-600">Verify, approve, and manage notary accounts</p>
            </div>
          </div>
        </Link>

        <Link to="/dashboard/clients" className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all group">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Manage Users</h3>
              <p className="text-sm text-gray-600">View and manage all client accounts</p>
            </div>
          </div>
        </Link>

        <Link to="/dashboard/settings" className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:border-emerald-300 hover:shadow-md transition-all group">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-emerald-50 rounded-lg group-hover:bg-emerald-100 transition-colors">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">System Settings</h3>
              <p className="text-sm text-gray-600">Configure platform settings and preferences</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Security & Compliance Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Security & Compliance</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">SSL Encrypted</p>
              <p className="text-xs text-green-600 font-medium">Active</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">2FA Enabled</p>
              <p className="text-xs text-green-600 font-medium">87% users</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Backup Status</p>
              <p className="text-xs text-green-600 font-medium">Last: 2h ago</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">API Status</p>
              <p className="text-xs text-green-600 font-medium">Operational</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

