import { useLanguage } from '../context/LanguageContext';

const Notaries = () => {
  const { t } = useLanguage();
  // Get user role from localStorage
  const userRole = localStorage.getItem('userRole');
  const isAdmin = userRole === 'admin';

  const notaries = [
    { 
      id: 1, 
      name: 'Sarah Williams', 
      license: 'NOT-2024-001', 
      address: {
        street: '123 Broadway',
        city: 'New York',
        state: 'NY',
        zip: '10001'
      },
      phone: '+1 (212) 555-1234',
      specialization: 'Real Estate', 
      rating: 4.9, 
      cases: 234 
    },
    { 
      id: 2, 
      name: 'Michael Chen', 
      license: 'NOT-2024-002', 
      address: {
        street: '456 Sunset Blvd',
        city: 'Los Angeles',
        state: 'CA',
        zip: '90028'
      },
      phone: '+1 (323) 555-5678',
      specialization: 'Legal Documents', 
      rating: 4.8, 
      cases: 189 
    },
    { 
      id: 3, 
      name: 'Jessica Martinez', 
      license: 'NOT-2024-003', 
      address: {
        street: '789 Michigan Ave',
        city: 'Chicago',
        state: 'IL',
        zip: '60611'
      },
      phone: '+1 (312) 555-9012',
      specialization: 'Corporate', 
      rating: 4.7, 
      cases: 156 
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{t('notaries.notariesDirectory')}</h1>
        {/* Only admins can add notaries - notaries sign up themselves */}
        {isAdmin && (
          <div className="w-full sm:w-auto flex flex-col gap-2">
            <button className="w-full sm:w-auto px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 shadow-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-sm sm:text-base font-semibold">{t('notaries.verifyNewNotary')}</span>
            </button>
            <p className="text-xs sm:text-sm text-purple-700 bg-purple-50 border border-purple-200 rounded-lg px-3 py-2">
              {t('notaries.verifyExplanation')}
            </p>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <p className="text-sm text-gray-500 mb-2">{t('notaries.totalNotaries')}</p>
          <h3 className="text-3xl font-bold text-gray-900">45</h3>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <p className="text-sm text-gray-500 mb-2">{t('notaries.activeToday')}</p>
          <h3 className="text-3xl font-bold text-green-600">32</h3>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <p className="text-sm text-gray-500 mb-2">{t('notaries.avgRating')}</p>
          <h3 className="text-3xl font-bold text-yellow-600">4.8</h3>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <p className="text-sm text-gray-500 mb-2">{t('notaries.casesThisMonth')}</p>
          <h3 className="text-3xl font-bold text-blue-600">892</h3>
        </div>
      </div>

      {/* Notaries List */}
      <div className="space-y-3 sm:space-y-4">
        {notaries.map((notary) => (
          <div key={notary.id} className="bg-white rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
            {/* Mobile Layout: Stack everything */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Profile Section */}
              <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg sm:text-xl flex-shrink-0">
                  {notary.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">{notary.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-500 truncate">{t('admin.license')}: {notary.license}</p>
                  <div className="flex flex-col gap-2 mt-2">
                    <span className="text-xs sm:text-sm text-gray-600 flex items-start gap-1">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="flex-1">
                        {notary.address?.street && (
                          <span className="block">{notary.address.street}, {notary.address.city}, {notary.address.state} {notary.address.zip}</span>
                        )}
                        {!notary.address?.street && notary.location && (
                          <span>{notary.location}</span>
                        )}
                      </span>
                    </span>
                    {notary.phone && (
                      <span className="text-xs sm:text-sm text-gray-600 flex items-center gap-1">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span>{notary.phone}</span>
                      </span>
                    )}
                    <span className="text-xs sm:text-sm text-gray-600">
                      {notary.specialization || t('notaries.noSpecialty')}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Stats and Action Section */}
              <div className="flex items-center justify-between lg:justify-end gap-3 sm:gap-4 lg:gap-6 border-t lg:border-t-0 pt-4 lg:pt-0">
                <div className="flex items-center gap-3 sm:gap-4">
                  {/* Rating */}
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-yellow-500 mb-1">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="font-semibold text-gray-900 text-sm sm:text-base">{notary.rating}</span>
                    </div>
                    <p className="text-[10px] sm:text-xs text-gray-500">{t('dashboard.rating')}</p>
                  </div>
                  
                  {/* Cases */}
                  <div className="text-center">
                    <p className="text-base sm:text-lg font-semibold text-gray-900">{notary.cases}</p>
                    <p className="text-[10px] sm:text-xs text-gray-500">{t('dashboard.cases')}</p>
                  </div>
                </div>
                
                {/* View Profile Button */}
                <button className="px-3 sm:px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-xs sm:text-sm font-medium whitespace-nowrap">
                  {t('dashboard.viewProfile')}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notaries;

