import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

const LOCAL_KEY = 'systemSetupConfig_v1';

const defaultConfig = {
  serviceRates: {
    maxBasePrice: 60.0,
    standardSurchargePct: 0,
    fastSurchargePct: 50,
    urgentSurchargePct: 80,
    digitalCertFee: 5.0,
    serviceFeePct: 12,
    revenueSharePct: 35,
    coinPrice: 1.0,
  },
  deliveryWindows: {
    defaultStart: '09:00',
    defaultEnd: '18:00',
    sameDayCutoff: '14:00',
    allowWeekend: false,
    maxSecondaryDistanceKm: 15,
    maxSecondaryWorkload: 0.85,
  },
  notifications: {
    emailSubject: 'Your notarized document is ready',
    emailBody: 'Hello {{name}},\n\nYour document {{document}} has been processed. Access it here: {{link}}',
    smsTemplate: 'Doc {{document}} ready. Check your inbox.',
    notifyOn: {
      uploaded: true,
      certified: true,
      delivered: true,
    },
  },
};

const SystemSetup = () => {
  const { t } = useLanguage();
  const [config, setConfig] = useState(defaultConfig);
  const [status, setStatus] = useState('');

  // Check if user is admin (safety check)
  const userRole = localStorage.getItem('userRole');
  const isAdmin = userRole === 'admin';

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setConfig({
          serviceRates: {
            ...defaultConfig.serviceRates,
            ...(parsed.serviceRates || {}),
            coinPrice: parsed.serviceRates?.coinPrice ?? defaultConfig.serviceRates.coinPrice,
          },
          deliveryWindows: {
            ...defaultConfig.deliveryWindows,
            ...(parsed.deliveryWindows || {}),
          },
          notifications: {
            ...defaultConfig.notifications,
            ...(parsed.notifications || {}),
          },
        });
      }
    } catch {
      // ignore and fall back to defaults
    }
  }, []);

  const saveSection = (sectionMessage) => {
    const toSave = { ...config };
    localStorage.setItem(LOCAL_KEY, JSON.stringify(toSave));
    setStatus(sectionMessage);
    setTimeout(() => setStatus(''), 2500);
  };

  const update = (path, value) => {
    // path like 'serviceRates.basePrice' or 'notifications.notifyOn.uploaded'
    const parts = path.split('.');
    setConfig((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      let cur = next;
      for (let i = 0; i < parts.length - 1; i++) {
        cur = cur[parts[i]];
      }
      cur[parts[parts.length - 1]] = value;
      return next;
    });
  };

  // Show access denied if not admin
  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('common.accessDenied')}</h2>
          <p className="text-gray-600">{t('common.adminOnlyAccess')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">{t('admin.systemParametersTitle')}</h1>
        <p className="text-sm text-gray-600 mt-1">{t('admin.systemParametersDescription')}</p>
        {status && (
          <div className="mt-4 inline-block rounded-md bg-emerald-50 border border-emerald-200 px-3 py-2 text-sm text-emerald-700">
            {status}
          </div>
        )}
      </div>

      {/* Service Rates */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">{t('admin.parameters.serviceRatesTitle')}</h2>
        <p className="text-sm text-gray-600 mb-4">{t('admin.parameters.serviceRatesDescription')}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600">{t('admin.parameters.maxBasePriceLabel')}</label>
            <input
              type="number"
              value={config.serviceRates.maxBasePrice}
              onChange={(e) => update('serviceRates.maxBasePrice', parseFloat(e.target.value || 0))}
              className="mt-1 w-full rounded-lg border px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">{t('admin.parameters.standardSurchargeLabel')}</label>
            <input
              type="number"
              value={config.serviceRates.standardSurchargePct}
              onChange={(e) => update('serviceRates.standardSurchargePct', parseFloat(e.target.value || 0))}
              className="mt-1 w-full rounded-lg border px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">{t('admin.parameters.fastSurchargeLabel')}</label>
            <input
              type="number"
              value={config.serviceRates.fastSurchargePct}
              onChange={(e) => update('serviceRates.fastSurchargePct', parseInt(e.target.value || 0))}
              className="mt-1 w-full rounded-lg border px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">{t('admin.parameters.urgentSurchargeLabel')}</label>
            <input
              type="number"
              value={config.serviceRates.urgentSurchargePct}
              onChange={(e) => update('serviceRates.urgentSurchargePct', parseInt(e.target.value || 0))}
              className="mt-1 w-full rounded-lg border px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">{t('admin.parameters.digitalCertFeeLabel')}</label>
            <input
              type="number"
              value={config.serviceRates.digitalCertFee}
              onChange={(e) => update('serviceRates.digitalCertFee', parseFloat(e.target.value || 0))}
              className="mt-1 w-full rounded-lg border px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">{t('admin.parameters.serviceFeeLabel')}</label>
            <input
              type="number"
              value={config.serviceRates.serviceFeePct}
              onChange={(e) => update('serviceRates.serviceFeePct', parseFloat(e.target.value || 0))}
              className="mt-1 w-full rounded-lg border px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">{t('admin.parameters.revenueShareLabel')}</label>
            <input
              type="number"
              value={config.serviceRates.revenueSharePct}
              onChange={(e) => update('serviceRates.revenueSharePct', parseFloat(e.target.value || 0))}
              className="mt-1 w-full rounded-lg border px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">{t('admin.parameters.coinPriceLabel')}</label>
            <input
              type="number"
              step="0.01"
              value={config.serviceRates.coinPrice}
              onChange={(e) => {
                update('serviceRates.coinPrice', parseFloat(e.target.value || 0));
                // Also save to dedicated storage for easy access
                localStorage.setItem('coinPrice_v1', e.target.value);
              }}
              className="mt-1 w-full rounded-lg border px-3 py-2"
            />
            <p className="text-xs text-gray-500 mt-1">{t('admin.parameters.coinPriceHint')}</p>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => saveSection(t('admin.parameters.saveRatesSuccess'))}
            className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700"
          >
            {t('admin.parameters.saveRates')}
          </button>
        </div>
      </div>

      {/* Delivery Windows */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">{t('admin.parameters.deliveryWindowsTitle')}</h2>
        <p className="text-sm text-gray-600 mb-4">{t('admin.parameters.deliveryWindowsDescription')}</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-600">{t('admin.parameters.maxSecondaryDistanceLabel')}</label>
            <input
              type="number"
              value={config.deliveryWindows.maxSecondaryDistanceKm}
              onChange={(e) => update('deliveryWindows.maxSecondaryDistanceKm', parseFloat(e.target.value || 0))}
              className="mt-1 w-full rounded-lg border px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">{t('admin.parameters.maxSecondaryWorkloadLabel')}</label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="1"
              value={config.deliveryWindows.maxSecondaryWorkload}
              onChange={(e) => update('deliveryWindows.maxSecondaryWorkload', parseFloat(e.target.value || 0))}
              className="mt-1 w-full rounded-lg border px-3 py-2"
            />
            <p className="text-xs text-gray-500 mt-1">{t('admin.parameters.maxSecondaryWorkloadHint')}</p>
          </div>
          <div className="sm:col-span-3">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={config.deliveryWindows.allowWeekend}
                onChange={(e) => update('deliveryWindows.allowWeekend', e.target.checked)}
              />
              <span className="text-sm text-gray-600">{t('admin.parameters.allowWeekendLabel')}</span>
            </label>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => saveSection(t('admin.parameters.saveWindowsSuccess'))}
            className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700"
          >
            {t('admin.parameters.saveWindows')}
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">{t('admin.parameters.notificationsTitle')}</h2>
        <p className="text-sm text-gray-600 mb-4">{t('admin.parameters.notificationsDescription')}</p>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm text-gray-600">{t('admin.parameters.emailSubjectLabel')}</label>
            <input
              type="text"
              value={config.notifications.emailSubject}
              onChange={(e) => update('notifications.emailSubject', e.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">{t('admin.parameters.emailBodyLabel')}</label>
            <textarea
              rows={4}
              value={config.notifications.emailBody}
              onChange={(e) => update('notifications.emailBody', e.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">{t('admin.parameters.smsTemplateLabel')}</label>
            <input
              type="text"
              value={config.notifications.smsTemplate}
              onChange={(e) => update('notifications.smsTemplate', e.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={config.notifications.notifyOn.uploaded}
                onChange={(e) => update('notifications.notifyOn.uploaded', e.target.checked)}
              />
              <span className="text-sm text-gray-600">{t('admin.parameters.notifyUploadLabel')}</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={config.notifications.notifyOn.certified}
                onChange={(e) => update('notifications.notifyOn.certified', e.target.checked)}
              />
              <span className="text-sm text-gray-600">{t('admin.parameters.notifyCertifiedLabel')}</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={config.notifications.notifyOn.delivered}
                onChange={(e) => update('notifications.notifyOn.delivered', e.target.checked)}
              />
              <span className="text-sm text-gray-600">{t('admin.parameters.notifyDeliveredLabel')}</span>
            </label>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => saveSection(t('admin.parameters.saveNotificationsSuccess'))}
            className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700"
          >
            {t('admin.parameters.saveNotifications')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SystemSetup;


