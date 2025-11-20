import { useMemo, useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import ServiceZoneMap from '../components/maps/ServiceZoneMap';
import { loadGoogleMaps } from '../utils/loadGoogleMaps';

const DEFAULT_NOTARY = {
  fullName: 'Carlic Bolomboy',
  email: 'carlic@gmail.com',
  phone: '+51 987 654 321',
  calLicense: 'CAL-123456',
  cnlLicense: 'CNL-654321',
  calIssueDate: '2023-01-10',
  calExpiryDate: '2025-01-10',
  maxDailyWorkload: '30',
  baseCharge: '35.00',
  workingHoursStart: '09:00',
  workingHoursEnd: '18:00',
  sameDayCutoff: '16:00',
  weekendDeliveries: false,
  notes: '',
  address: {
    street: 'Av. Javier Prado',
    number: '456',
    district: 'San Isidro',
    city: 'Lima',
    province: 'Lima',
    department: 'Lima',
    zip: '15046',
  },
};

const DEFAULT_CLIENT = {
  fullName: 'María González',
  email: 'maria.gonzalez@example.com',
  phone: '+51 912 345 678',
  documentId: 'DNI 41234567',
  address: {
    street: 'Jr. Los Tulipanes',
    number: '215',
    district: 'Miraflores',
    city: 'Lima',
    province: 'Lima',
    department: 'Lima',
    zip: '15074',
  },
};

const DEFAULT_ADMIN = {
  fullName: 'Ana Torres',
  email: 'ana.torres@notarychain.com',
  phone: '+51 955 123 456',
  role: 'Administrador General',
};

const Profile = () => {
  const { t } = useLanguage();
  const userRole = localStorage.getItem('userRole') || 'notary';

  const [notaryData, setNotaryData] = useState(() => {
    if (userRole !== 'notary') return DEFAULT_NOTARY;
    try {
      const stored = localStorage.getItem('notaryProfile');
      if (!stored) return DEFAULT_NOTARY;
      const parsed = JSON.parse(stored);
      return {
        ...DEFAULT_NOTARY,
        ...parsed,
        address: {
          ...DEFAULT_NOTARY.address,
          ...(parsed.address || {}),
        },
      };
    } catch {
      return DEFAULT_NOTARY;
    }
  });

  const [serviceZones, setServiceZones] = useState(() => {
    if (userRole !== 'notary') return '';
    return localStorage.getItem('notaryServiceZones') || '';
  });

  const [clientData, setClientData] = useState(() => {
    if (userRole !== 'client') return DEFAULT_CLIENT;
    try {
      const stored = localStorage.getItem('clientProfile');
      return stored ? JSON.parse(stored) : DEFAULT_CLIENT;
    } catch {
      return DEFAULT_CLIENT;
    }
  });

  const [adminData, setAdminData] = useState(() => {
    if (userRole !== 'admin') return DEFAULT_ADMIN;
    try {
      const stored = localStorage.getItem('adminProfile');
      return stored ? JSON.parse(stored) : DEFAULT_ADMIN;
    } catch {
      return DEFAULT_ADMIN;
    }
  });

  const [saveStatus, setSaveStatus] = useState(null);
  const [errors, setErrors] = useState({});
  const [clientSignatureStatus, setClientSignatureStatus] = useState(() => {
    return localStorage.getItem('clientSignatureStatus') || 'not_setup';
  });

  const parsedServiceZones = useMemo(() => {
    if (!serviceZones) return [];
    try {
      return JSON.parse(serviceZones);
    } catch {
      return [];
    }
  }, [serviceZones]);

  // Ensure Google Maps is loaded when profile page mounts (for notaries)
  useEffect(() => {
    if (userRole === 'notary') {
      loadGoogleMaps().catch(error => {
        console.warn('Google Maps could not be loaded:', error);
      });
    }
  }, [userRole]);

  const handleNotaryInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    if (name.startsWith('address.')) {
      const [, field] = name.split('.');
      setNotaryData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value,
        },
      }));
      return;
    }
    if (type === 'checkbox') {
      setNotaryData((prev) => ({
        ...prev,
        [name]: checked,
      }));
      return;
    }
    setNotaryData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClientInputChange = (event) => {
    const { name, value } = event.target;
    if (name.startsWith('address.')) {
      const [, field] = name.split('.');
      setClientData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value,
        },
      }));
      return;
    }
    setClientData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAdminInputChange = (event) => {
    const { name, value } = event.target;
    setAdminData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleServiceZoneChange = (zonesAsString) => {
    setServiceZones(zonesAsString);
    localStorage.setItem('notaryServiceZones', zonesAsString);
  };

  const handleSaveNotaryProfile = (event) => {
    event.preventDefault();
    const requiredFields = [
      'fullName',
      'email',
      'phone',
      'calLicense',
      'cnlLicense',
      'calIssueDate',
      'calExpiryDate',
      'maxDailyWorkload',
      'baseCharge',
      'workingHoursStart',
      'workingHoursEnd',
      'sameDayCutoff',
      'address.street',
      'address.number',
      'address.district',
      'address.city',
      'address.province',
      'address.department',
      'address.zip',
    ];

    const validationErrors = {};

    requiredFields.forEach((field) => {
      const value = field.startsWith('address.')
        ? notaryData.address[field.split('.')[1]]
        : notaryData[field];
      if (!value) {
        validationErrors[field] = t('profile.requiredField');
      }
    });

    if (!serviceZones || serviceZones === '[]') {
      validationErrors.serviceZones = t('profile.serviceAreaRequired');
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSaveStatus('error');
      return;
    }

    const payload = {
      ...notaryData,
      baseCharge: notaryData.baseCharge?.toString() || '0',
      weekendDeliveries: Boolean(notaryData.weekendDeliveries),
    };
    localStorage.setItem('notaryProfile', JSON.stringify(payload));
    setErrors({});
    setSaveStatus('success');
  };

  const handleSaveClientProfile = (event) => {
    event.preventDefault();
    const requiredFields = [
      'fullName',
      'email',
      'phone',
      'documentId',
      'address.street',
      'address.number',
      'address.district',
      'address.city',
      'address.province',
      'address.department',
      'address.zip',
    ];

    const validationErrors = {};

    requiredFields.forEach((field) => {
      const value = field.startsWith('address.')
        ? clientData.address[field.split('.')[1]]
        : clientData[field];
      if (!value) {
        validationErrors[field] = t('profile.requiredField');
      }
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSaveStatus('error');
      return;
    }

    localStorage.setItem('clientProfile', JSON.stringify(clientData));
    setErrors({});
    setSaveStatus('success');
  };

  const handleSaveAdminProfile = (event) => {
    event.preventDefault();

    if (!adminData.fullName || !adminData.email || !adminData.phone) {
      setErrors({
        admin: t('profile.requiredField'),
      });
      setSaveStatus('error');
      return;
    }

    localStorage.setItem('adminProfile', JSON.stringify(adminData));
    setErrors({});
    setSaveStatus('success');
  };

  const handleClientSignature = (action) => {
    if (action === 'setup') {
      setClientSignatureStatus('pending');
      localStorage.setItem('clientSignatureStatus', 'pending');
    } else if (action === 'later') {
      setClientSignatureStatus('later');
      localStorage.setItem('clientSignatureStatus', 'later');
    } else if (action === 'activate') {
      setClientSignatureStatus('active');
      localStorage.setItem('clientSignatureStatus', 'active');
    }
  };

  const renderStatusAlert = () => {
    if (saveStatus === 'success') {
      return (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          {t('profile.savedSuccess')}
        </div>
      );
    }

    if (saveStatus === 'error') {
  return (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {t('profile.savedError')}
        </div>
      );
    }

    return null;
  };

  const renderFieldError = (fieldKey) => {
    if (!errors[fieldKey]) return null;
    return <p className="mt-1 text-xs text-red-600">{errors[fieldKey]}</p>;
  };

  const renderNotaryProfile = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{t('profile.notaryTitle')}</h1>
            <p className="text-sm text-gray-600 mt-1">{t('profile.notarySubtitle')}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-xl font-semibold">
              {notaryData.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{notaryData.fullName}</p>
              <p className="text-xs text-gray-500">{notaryData.email}</p>
            </div>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            <span className="block h-2 w-2 rounded-full bg-emerald-500" />
            {t('profile.verifiedBadge')}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m2 5H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V17a2 2 0 01-2 2z" />
            </svg>
            {t('profile.calLicenseShort', { license: notaryData.calLicense })}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {t('profile.maxDailyWorkloadShort', { count: notaryData.maxDailyWorkload })}
          </span>
        </div>
      </div>

      <form onSubmit={handleSaveNotaryProfile} className="space-y-6">
        {renderStatusAlert()}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">{t('profile.contactInfo')}</h2>
              <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {t('profile.fullName')}
              </label>
              <input
                type="text"
                name="fullName"
                value={notaryData.fullName}
                onChange={handleNotaryInputChange}
                className={`mt-1 w-full rounded-lg border px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.fullName ? 'border-red-400 focus:ring-red-500' : 'border-gray-200'
                }`}
                placeholder="Nombre completo"
              />
              {renderFieldError('fullName')}
              </div>
              <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {t('profile.email')}
              </label>
              <input
                type="email"
                name="email"
                value={notaryData.email}
                onChange={handleNotaryInputChange}
                className={`mt-1 w-full rounded-lg border px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.email ? 'border-red-400 focus:ring-red-500' : 'border-gray-200'
                }`}
                placeholder="correo@notaria.pe"
              />
              {renderFieldError('email')}
              </div>
              <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {t('profile.phone')}
              </label>
              <input
                type="tel"
                name="phone"
                value={notaryData.phone}
                onChange={handleNotaryInputChange}
                className={`mt-1 w-full rounded-lg border px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.phone ? 'border-red-400 focus:ring-red-500' : 'border-gray-200'
                }`}
                placeholder="+51 900 000 000"
              />
              {renderFieldError('phone')}
              </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {t('profile.notes')}
              </label>
              <textarea
                name="notes"
                value={notaryData.notes}
                onChange={handleNotaryInputChange}
                rows={3}
                className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder={t('profile.notesPlaceholder')}
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">{t('profile.addressInfo')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {t('profile.street')}
                </label>
                <input
                  type="text"
                  name="address.street"
                  value={notaryData.address.street}
                  onChange={handleNotaryInputChange}
                  className={`mt-1 w-full rounded-lg border px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors['address.street'] ? 'border-red-400 focus:ring-red-500' : 'border-gray-200'
                  }`}
                  placeholder={t('profile.streetPlaceholder')}
                />
                {renderFieldError('address.street')}
        </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {t('profile.number')}
                </label>
                <input
                  type="text"
                  name="address.number"
                  value={notaryData.address.number}
                  onChange={handleNotaryInputChange}
                  className={`mt-1 w-full rounded-lg border px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors['address.number'] ? 'border-red-400 focus:ring-red-500' : 'border-gray-200'
                  }`}
                  placeholder="123"
                />
                {renderFieldError('address.number')}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {t('profile.district')}
                </label>
                <input
                  type="text"
                  name="address.district"
                  value={notaryData.address.district}
                  onChange={handleNotaryInputChange}
                  className={`mt-1 w-full rounded-lg border px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors['address.district'] ? 'border-red-400 focus:ring-red-500' : 'border-gray-200'
                  }`}
                  placeholder="Distrito"
                />
                {renderFieldError('address.district')}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {t('profile.city')}
                </label>
                <input
                  type="text"
                  name="address.city"
                  value={notaryData.address.city}
                  onChange={handleNotaryInputChange}
                  className={`mt-1 w-full rounded-lg border px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors['address.city'] ? 'border-red-400 focus:ring-red-500' : 'border-gray-200'
                  }`}
                  placeholder="Ciudad"
                />
                {renderFieldError('address.city')}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {t('profile.province')}
                </label>
                <input
                  type="text"
                  name="address.province"
                  value={notaryData.address.province}
                  onChange={handleNotaryInputChange}
                  className={`mt-1 w-full rounded-lg border px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors['address.province'] ? 'border-red-400 focus:ring-red-500' : 'border-gray-200'
                  }`}
                  placeholder="Provincia"
                />
                {renderFieldError('address.province')}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {t('profile.department')}
                </label>
                <input
                  type="text"
                  name="address.department"
                  value={notaryData.address.department}
                  onChange={handleNotaryInputChange}
                  className={`mt-1 w-full rounded-lg border px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors['address.department'] ? 'border-red-400 focus:ring-red-500' : 'border-gray-200'
                  }`}
                  placeholder="Departamento"
                />
                {renderFieldError('address.department')}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {t('profile.zipCode')}
                </label>
                <input
                  type="text"
                  name="address.zip"
                  value={notaryData.address.zip}
                  onChange={handleNotaryInputChange}
                  className={`mt-1 w-full rounded-lg border px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors['address.zip'] ? 'border-red-400 focus:ring-red-500' : 'border-gray-200'
                  }`}
                  placeholder="15000"
                />
                {renderFieldError('address.zip')}
              </div>
              </div>
            </div>
          </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">{t('profile.professionalInfo')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {t('profile.calLicenseNumber')}
              </label>
              <input
                type="text"
                name="calLicense"
                value={notaryData.calLicense}
                onChange={handleNotaryInputChange}
                className={`mt-1 w-full rounded-lg border px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.calLicense ? 'border-red-400 focus:ring-red-500' : 'border-gray-200'
                }`}
                placeholder="CAL-000000"
              />
              {renderFieldError('calLicense')}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {t('profile.cnlLicenseNumber')}
              </label>
              <input
                type="text"
                name="cnlLicense"
                value={notaryData.cnlLicense}
                onChange={handleNotaryInputChange}
                className={`mt-1 w-full rounded-lg border px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.cnlLicense ? 'border-red-400 focus:ring-red-500' : 'border-gray-200'
                }`}
                placeholder="CNL-000000"
              />
              {renderFieldError('cnlLicense')}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {t('profile.issueDate')}
              </label>
              <input
                type="date"
                name="calIssueDate"
                value={notaryData.calIssueDate}
                onChange={handleNotaryInputChange}
                className={`mt-1 w-full rounded-lg border px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.calIssueDate ? 'border-red-400 focus:ring-red-500' : 'border-gray-200'
                }`}
              />
              {renderFieldError('calIssueDate')}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {t('profile.expirationDate')}
              </label>
              <input
                type="date"
                name="calExpiryDate"
                value={notaryData.calExpiryDate}
                onChange={handleNotaryInputChange}
                className={`mt-1 w-full rounded-lg border px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.calExpiryDate ? 'border-red-400 focus:ring-red-500' : 'border-gray-200'
                }`}
              />
              {renderFieldError('calExpiryDate')}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {t('profile.maxWorkload')}
              </label>
              <input
                type="number"
                min="1"
                name="maxDailyWorkload"
                value={notaryData.maxDailyWorkload}
                onChange={handleNotaryInputChange}
                className={`mt-1 w-full rounded-lg border px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.maxDailyWorkload ? 'border-red-400 focus:ring-red-500' : 'border-gray-200'
                }`}
              />
              {renderFieldError('maxDailyWorkload')}
            </div>
          </div>
                </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{t('profile.serviceAreaTitle')}</h2>
              <p className="text-sm text-gray-600 mt-1">{t('profile.serviceAreaDescription')}</p>
                </div>
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-green-100 text-green-700 px-3 py-1 text-xs font-semibold">
                {t('profile.serviceAreaCount', { count: parsedServiceZones.length })}
              </div>
              {(!serviceZones || serviceZones === '[]') && (
                <div className="rounded-full bg-red-100 text-red-600 px-3 py-1 text-xs font-semibold">
                  {t('profile.serviceAreaMissing')}
                </div>
              )}
            </div>
          </div>

          <ServiceZoneMap onChange={handleServiceZoneChange} initialZones={serviceZones} />
          {renderFieldError('serviceZones')}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">{t('profile.servicePricingTitle')}</h2>
          <p className="text-sm text-gray-600">{t('profile.servicePricingDescription')}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {t('profile.baseChargeLabel')}
              </label>
              <input
                type="number"
                name="baseCharge"
                min="0"
                step="0.5"
                value={notaryData.baseCharge}
                onChange={handleNotaryInputChange}
                className={`mt-1 w-full rounded-lg border px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.baseCharge ? 'border-red-400 focus:ring-red-500' : 'border-gray-200'
                }`}
              />
              {renderFieldError('baseCharge')}
            </div>
            <div className="sm:col-span-2 bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-sm text-emerald-800">
              <p className="font-semibold mb-1">{t('profile.servicePricingHintTitle')}</p>
              <p>{t('profile.servicePricingHint')}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">{t('profile.workingHoursTitle')}</h2>
          <p className="text-sm text-gray-600">{t('profile.workingHoursDescription')}</p>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {t('profile.workdayStart')}
              </label>
              <input
                type="time"
                name="workingHoursStart"
                value={notaryData.workingHoursStart}
                onChange={handleNotaryInputChange}
                className={`mt-1 w-full rounded-lg border px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.workingHoursStart ? 'border-red-400 focus:ring-red-500' : 'border-gray-200'
                }`}
              />
              {renderFieldError('workingHoursStart')}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {t('profile.workdayEnd')}
              </label>
              <input
                type="time"
                name="workingHoursEnd"
                value={notaryData.workingHoursEnd}
                onChange={handleNotaryInputChange}
                className={`mt-1 w-full rounded-lg border px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.workingHoursEnd ? 'border-red-400 focus:ring-red-500' : 'border-gray-200'
                }`}
              />
              {renderFieldError('workingHoursEnd')}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {t('profile.sameDayCutoff')}
              </label>
              <input
                type="time"
                name="sameDayCutoff"
                value={notaryData.sameDayCutoff}
                onChange={handleNotaryInputChange}
                className={`mt-1 w-full rounded-lg border px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.sameDayCutoff ? 'border-red-400 focus:ring-red-500' : 'border-gray-200'
                }`}
              />
              {renderFieldError('sameDayCutoff')}
            </div>
            <label className="flex items-center gap-2 mt-6">
              <input
                type="checkbox"
                name="weekendDeliveries"
                checked={Boolean(notaryData.weekendDeliveries)}
                onChange={handleNotaryInputChange}
                className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span className="text-sm text-gray-700">{t('profile.allowWeekendDeliveries')}</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {t('profile.saveProfile')}
          </button>
        </div>
      </form>
    </div>
  );

  const renderClientSignatureBanner = () => {
    if (clientSignatureStatus === 'active') {
      return (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-700 shadow-sm">
          <div className="flex items-start gap-3">
            <svg className="h-5 w-5 flex-shrink-0 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <div>
              <p className="font-semibold">{t('profile.digitalSignatureActive')}</p>
              <p className="text-xs text-emerald-600">{t('profile.digitalSignatureActiveHint')}</p>
            </div>
            <button
              type="button"
              onClick={() => handleClientSignature('activate')}
              className="ml-auto inline-flex items-center gap-2 rounded-md bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
            >
              {t('profile.viewSignatureWallet')}
            </button>
          </div>
        </div>
      );
    }

    if (clientSignatureStatus === 'pending') {
      return (
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 text-sm text-blue-700 shadow-sm">
          <div className="flex items-start gap-3">
            <svg className="h-5 w-5 flex-shrink-0 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-semibold">{t('profile.digitalSignaturePending')}</p>
              <p className="text-xs text-blue-600">{t('profile.digitalSignaturePendingHint')}</p>
            </div>
          </div>
        </div>
      );
    }

    if (clientSignatureStatus === 'later') {
      return (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800 shadow-sm">
          <div className="flex items-start gap-3">
            <svg className="h-5 w-5 flex-shrink-0 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
                <div className="flex-1">
              <p className="font-semibold">{t('profile.digitalSignatureScheduled')}</p>
              <p className="text-xs text-amber-700">{t('profile.digitalSignatureScheduledHint')}</p>
            </div>
            <button
              type="button"
              onClick={() => setClientSignatureStatus('not_setup')}
              className="inline-flex items-center gap-1 rounded-md border border-amber-300 px-3 py-2 text-xs font-semibold text-amber-800 hover:bg-amber-100"
            >
              {t('profile.digitalSignatureResume')}
            </button>
                </div>
              </div>
      );
    }

    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-amber-100 p-3">
              <svg className="h-6 w-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
            <div>
              <h3 className="text-base font-semibold text-amber-900">{t('profile.digitalSignatureTitle')}</h3>
              <p className="text-sm text-amber-700">{t('profile.digitalSignatureDescription')}</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => handleClientSignature('setup')}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-700"
            >
              {t('profile.digitalSignatureSetupNow')}
            </button>
            <button
              type="button"
              onClick={() => handleClientSignature('later')}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-amber-300 px-4 py-2.5 text-sm font-semibold text-amber-800 hover:bg-amber-100"
            >
              {t('profile.digitalSignatureLater')}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderClientProfile = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{t('profile.clientTitle')}</h1>
            <p className="text-sm text-gray-600 mt-1">{t('profile.clientSubtitle')}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-semibold">
              {clientData.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{clientData.fullName}</p>
              <p className="text-xs text-gray-500">{clientData.email}</p>
            </div>
          </div>
        </div>
      </div>

      {renderStatusAlert()}
      {renderClientSignatureBanner()}

      <form onSubmit={handleSaveClientProfile} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">{t('profile.personalInfo')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {t('profile.fullName')}
              </label>
              <input
                type="text"
                name="fullName"
                value={clientData.fullName}
                onChange={handleClientInputChange}
                className={`mt-1 w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.fullName ? 'border-red-400 focus:ring-red-500' : 'border-gray-200'
                }`}
              />
              {renderFieldError('fullName')}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {t('profile.documentId')}
              </label>
              <input
                type="text"
                name="documentId"
                value={clientData.documentId}
                onChange={handleClientInputChange}
                className={`mt-1 w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.documentId ? 'border-red-400 focus:ring-red-500' : 'border-gray-200'
                }`}
                placeholder="DNI / CE / Pasaporte"
              />
              {renderFieldError('documentId')}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {t('profile.email')}
              </label>
              <input
                type="email"
                name="email"
                value={clientData.email}
                onChange={handleClientInputChange}
                className={`mt-1 w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? 'border-red-400 focus:ring-red-500' : 'border-gray-200'
                }`}
              />
              {renderFieldError('email')}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {t('profile.phone')}
              </label>
              <input
                type="tel"
                name="phone"
                value={clientData.phone}
                onChange={handleClientInputChange}
                className={`mt-1 w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.phone ? 'border-red-400 focus:ring-red-500' : 'border-gray-200'
                }`}
              />
              {renderFieldError('phone')}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">{t('profile.deliveryAddress')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {t('profile.street')}
              </label>
              <input
                type="text"
                name="address.street"
                value={clientData.address.street}
                onChange={handleClientInputChange}
                className={`mt-1 w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors['address.street'] ? 'border-red-400 focus:ring-red-500' : 'border-gray-200'
                }`}
              />
              {renderFieldError('address.street')}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {t('profile.number')}
              </label>
              <input
                type="text"
                name="address.number"
                value={clientData.address.number}
                onChange={handleClientInputChange}
                className={`mt-1 w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors['address.number'] ? 'border-red-400 focus:ring-red-500' : 'border-gray-200'
                }`}
              />
              {renderFieldError('address.number')}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {t('profile.district')}
              </label>
              <input
                type="text"
                name="address.district"
                value={clientData.address.district}
                onChange={handleClientInputChange}
                className={`mt-1 w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors['address.district'] ? 'border-red-400 focus:ring-red-500' : 'border-gray-200'
                }`}
              />
              {renderFieldError('address.district')}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {t('profile.city')}
              </label>
              <input
                type="text"
                name="address.city"
                value={clientData.address.city}
                onChange={handleClientInputChange}
                className={`mt-1 w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors['address.city'] ? 'border-red-400 focus:ring-red-500' : 'border-gray-200'
                }`}
              />
              {renderFieldError('address.city')}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {t('profile.province')}
              </label>
              <input
                type="text"
                name="address.province"
                value={clientData.address.province}
                onChange={handleClientInputChange}
                className={`mt-1 w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors['address.province'] ? 'border-red-400 focus:ring-red-500' : 'border-gray-200'
                }`}
              />
              {renderFieldError('address.province')}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {t('profile.department')}
              </label>
              <input
                type="text"
                name="address.department"
                value={clientData.address.department}
                onChange={handleClientInputChange}
                className={`mt-1 w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors['address.department'] ? 'border-red-400 focus:ring-red-500' : 'border-gray-200'
                }`}
              />
              {renderFieldError('address.department')}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {t('profile.zipCode')}
              </label>
              <input
                type="text"
                name="address.zip"
                value={clientData.address.zip}
                onChange={handleClientInputChange}
                className={`mt-1 w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors['address.zip'] ? 'border-red-400 focus:ring-red-500' : 'border-gray-200'
                }`}
              />
              {renderFieldError('address.zip')}
            </div>
                </div>
              </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {t('profile.saveProfile')}
          </button>
        </div>
      </form>
    </div>
  );

  const renderAdminProfile = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{t('profile.adminTitle')}</h1>
            <p className="text-sm text-gray-600 mt-1">{t('profile.adminSubtitle')}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-xl font-semibold">
              {adminData.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{adminData.fullName}</p>
              <p className="text-xs text-gray-500">{adminData.email}</p>
            </div>
          </div>
        </div>
      </div>

      {renderStatusAlert()}

      <form onSubmit={handleSaveAdminProfile} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">{t('profile.adminContact')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {t('profile.fullName')}
              </label>
              <input
                type="text"
                name="fullName"
                value={adminData.fullName}
                onChange={handleAdminInputChange}
                className={`mt-1 w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.admin ? 'border-red-400 focus:ring-red-500' : 'border-gray-200'
                }`}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {t('profile.email')}
              </label>
              <input
                type="email"
                name="email"
                value={adminData.email}
                onChange={handleAdminInputChange}
                className={`mt-1 w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.admin ? 'border-red-400 focus:ring-red-500' : 'border-gray-200'
                }`}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {t('profile.phone')}
              </label>
              <input
                type="tel"
                name="phone"
                value={adminData.phone}
                onChange={handleAdminInputChange}
                className={`mt-1 w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.admin ? 'border-red-400 focus:ring-red-500' : 'border-gray-200'
                }`}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {t('profile.adminRole')}
              </label>
              <input
                type="text"
                name="role"
                value={adminData.role}
                onChange={handleAdminInputChange}
                className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">{t('profile.adminSecurity')}</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <svg className="h-5 w-5 flex-shrink-0 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {t('profile.adminSecurityItem1')}
            </li>
            <li className="flex items-start gap-2">
              <svg className="h-5 w-5 flex-shrink-0 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {t('profile.adminSecurityItem2')}
            </li>
            <li className="flex items-start gap-2">
              <svg className="h-5 w-5 flex-shrink-0 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {t('profile.adminSecurityItem3')}
            </li>
            <li className="flex items-start gap-2">
              <svg className="h-5 w-5 flex-shrink-0 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {t('profile.adminSecurityItem4')}
            </li>
          </ul>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {t('profile.saveProfile')}
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="space-y-6">
      {userRole === 'notary' && renderNotaryProfile()}
      {userRole === 'client' && renderClientProfile()}
      {userRole === 'admin' && renderAdminProfile()}
    </div>
  );
};

export default Profile;

