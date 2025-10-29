import { Link } from 'react-router-dom';
import ClientDashboard from './ClientDashboard';

const Dashboard = () => {
  // Get user role from localStorage
  const userRole = localStorage.getItem('userRole');
  
  // If user is a client, show client-specific dashboard
  if (userRole === 'client') {
    return <ClientDashboard />;
  }

  // Show admin/notary dashboard
  return (
    <div className="space-y-6">
      {/* Top Summary Cards (KPI Row) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Documents Validated */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-start justify-between mb-2">
            <div className="p-2 bg-green-50 rounded-lg">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xs text-green-600 font-medium">+12% this month</span>
          </div>
          <p className="text-sm text-gray-500 mb-1">Documents Validated</p>
          <h3 className="text-3xl font-bold text-gray-900">128</h3>
          <p className="text-xs text-gray-400 mt-2">PDFs verified as true copies</p>
        </div>

        {/* Pending Reviews */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-start justify-between mb-2">
            <div className="p-2 bg-yellow-50 rounded-lg">
              <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xs text-yellow-600 font-medium">Needs attention</span>
          </div>
          <p className="text-sm text-gray-500 mb-1">Pending Reviews</p>
          <h3 className="text-3xl font-bold text-gray-900">12</h3>
          <p className="text-xs text-gray-400 mt-2">Awaiting validation</p>
        </div>

        {/* Active Notaries */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-start justify-between mb-2">
            <div className="p-2 bg-blue-50 rounded-lg">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span className="text-xs text-blue-600 font-medium">37 zones covered</span>
          </div>
          <p className="text-sm text-gray-500 mb-1">Active Notaries</p>
          <h3 className="text-3xl font-bold text-gray-900">37</h3>
          <p className="text-xs text-gray-400 mt-2">With active service zones</p>
        </div>

        {/* Registered Clients */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 shadow-sm text-white">
          <div className="flex items-start justify-between mb-2">
            <div className="p-2 bg-white/20 rounded-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span className="text-xs text-green-100 font-medium">+28 this week</span>
          </div>
          <p className="text-sm text-green-100 mb-1">Registered Clients</p>
          <h3 className="text-3xl font-bold">213</h3>
          <p className="text-xs text-green-100 mt-2">Total active accounts</p>
        </div>
      </div>

      {/* Middle Section - Document Activity & Validation Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Document Activity Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-gray-900">Document Activity</h2>
              <span className="flex items-center gap-1 text-sm text-green-600">
                <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                Healthy
              </span>
            </div>
            <select className="text-sm text-gray-600 border border-gray-200 rounded-lg px-3 py-1.5">
              <option>Last 30 days</option>
              <option>Last 7 days</option>
              <option>Last 24 hours</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Validation Rate</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-900">91.4%</span>
                <span className="text-sm text-green-600">+5.2%</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Avg. Processing Time</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-900">2.3 hrs</span>
                <span className="text-sm text-green-600">-18%</span>
              </div>
            </div>
          </div>

          {/* Chart Placeholder */}
          <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
            <svg className="w-full h-full p-4" viewBox="0 0 400 150" fill="none">
              <path d="M10 140 Q50 120 70 100 T130 80 Q170 60 210 90 T270 70 Q310 50 350 80 T390 60" 
                    stroke="#10b981" 
                    strokeWidth="2" 
                    fill="none" />
              <path d="M10 140 Q50 120 70 100 T130 80 Q170 60 210 90 T270 70 Q310 50 350 80 T390 60 L390 140 L10 140 Z" 
                    fill="url(#gradient)" 
                    opacity="0.1" />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#f3f4f6" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Validation Success Rate */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Validation Success</h2>
          <p className="text-sm text-gray-500 mb-2">This Month</p>
          <h3 className="text-3xl font-bold text-gray-900 mb-2">128 / 140</h3>
          <p className="text-sm text-gray-600 mb-6">12 documents pending validation</p>
          
          {/* Circular Progress */}
          <div className="flex items-center justify-center mb-4">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="80" cy="80" r="70" stroke="#e5e7eb" strokeWidth="12" fill="none" />
                <circle 
                  cx="80" 
                  cy="80" 
                  r="70" 
                  stroke="#10b981" 
                  strokeWidth="12" 
                  fill="none"
                  strokeDasharray="440"
                  strokeDashoffset="44"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-gray-900">91%</span>
              </div>
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Success rate compared to last month</p>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Documents */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Documents</h2>
            <Link to="/dashboard/documents" className="text-sm text-blue-600 hover:text-blue-700">View all</Link>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">Contract_Agreement.pdf</p>
                <p className="text-xs text-gray-500">Validated • 2 hours ago</p>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">Done</span>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">Property_Deed.pdf</p>
                <p className="text-xs text-gray-500">Pending • 5 hours ago</p>
              </div>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded">Review</span>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">Notarized_Will.pdf</p>
                <p className="text-xs text-gray-500">Validated • 1 day ago</p>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">Done</span>
            </div>
          </div>
        </div>

        {/* Top Notaries */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Top Notaries</h2>
            <Link to="/dashboard/notaries" className="text-sm text-blue-600 hover:text-blue-700">View all</Link>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-l-4 border-green-500 pl-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  SW
                </div>
                <div>
                  <p className="font-medium text-gray-900">Sarah Williams</p>
                  <p className="text-xs text-gray-500">New York, NY</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-yellow-500">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-sm font-semibold text-gray-900">4.9</span>
                </div>
                <p className="text-xs text-gray-500">234 cases</p>
              </div>
            </div>
            <div className="flex items-center justify-between py-3 border-l-4 border-blue-500 pl-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  MC
                </div>
                <div>
                  <p className="font-medium text-gray-900">Michael Chen</p>
                  <p className="text-xs text-gray-500">Los Angeles, CA</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-yellow-500">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-sm font-semibold text-gray-900">4.8</span>
                </div>
                <p className="text-xs text-gray-500">189 cases</p>
              </div>
            </div>
            <div className="flex items-center justify-between py-3 border-l-4 border-indigo-500 pl-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  JM
                </div>
                <div>
                  <p className="font-medium text-gray-900">Jessica Martinez</p>
                  <p className="text-xs text-gray-500">Chicago, IL</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-yellow-500">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-sm font-semibold text-gray-900">4.7</span>
                </div>
                <p className="text-xs text-gray-500">156 cases</p>
              </div>
            </div>
          </div>
        </div>

        {/* Security & Compliance */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Security & Compliance</h2>
          
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-sm font-medium text-gray-900">SSL Encrypted</span>
              </div>
              <span className="text-xs text-green-600 font-medium">Active</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-sm font-medium text-gray-900">2FA Enabled</span>
              </div>
              <span className="text-xs text-green-600 font-medium">Active</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="text-sm font-medium text-gray-900">Password Update</span>
              </div>
              <span className="text-xs text-yellow-600 font-medium">90 days</span>
            </div>
          </div>

          <button className="w-full px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
            Review Security Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

