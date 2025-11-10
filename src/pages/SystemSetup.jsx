import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

const LOCAL_KEY = 'systemSetupConfig_v1';

const defaultConfig = {
  serviceRates: {
    basePrice: 20.0,
    standardMultiplier: 1.0,
    fastSurchargePct: 50,
    urgentSurchargePct: 80,
    digitalCertFee: 5.0,
  },
  deliveryWindows: {
    defaultStart: '09:00',
    defaultEnd: '18:00',
    sameDayCutoff: '14:00',
    allowWeekend: false,
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

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      if (raw) setConfig(JSON.parse(raw));
    } catch (e) {
      // ignore and fall back to defaults
    }
  }, []);

  const saveSection = (sectionKey) => {
    const toSave = { ...config };
    localStorage.setItem(LOCAL_KEY, JSON.stringify(toSave));
    setStatus(`${sectionKey} saved`);
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
            <label className="block text-sm text-gray-600">Base price (S/.)</label>
            <input
              type="number"
              value={config.serviceRates.basePrice}
              onChange={(e) => update('serviceRates.basePrice', parseFloat(e.target.value || 0))}
              className="mt-1 w-full rounded-lg border px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Digital certification fee (S/.)</label>
            <input
              type="number"
              value={config.serviceRates.digitalCertFee}
              onChange={(e) => update('serviceRates.digitalCertFee', parseFloat(e.target.value || 0))}
              className="mt-1 w-full rounded-lg border px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Fast surcharge (%)</label>
            <input
              type="number"
              value={config.serviceRates.fastSurchargePct}
              onChange={(e) => update('serviceRates.fastSurchargePct', parseInt(e.target.value || 0))}
              className="mt-1 w-full rounded-lg border px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Urgent surcharge (%)</label>
            <input
              type="number"
              value={config.serviceRates.urgentSurchargePct}
              onChange={(e) => update('serviceRates.urgentSurchargePct', parseInt(e.target.value || 0))}
              className="mt-1 w-full rounded-lg border px-3 py-2"
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => saveSection('Service rates')}
            className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700"
          >
            Save rates
          </button>
        </div>
      </div>

      {/* Delivery Windows */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">{t('admin.parameters.deliveryWindowsTitle')}</h2>
        <p className="text-sm text-gray-600 mb-4">{t('admin.parameters.deliveryWindowsDescription')}</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-600">Default start</label>
            <input
              type="time"
              value={config.deliveryWindows.defaultStart}
              onChange={(e) => update('deliveryWindows.defaultStart', e.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Default end</label>
            <input
              type="time"
              value={config.deliveryWindows.defaultEnd}
              onChange={(e) => update('deliveryWindows.defaultEnd', e.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Same-day cutoff</label>
            <input
              type="time"
              value={config.deliveryWindows.sameDayCutoff}
              onChange={(e) => update('deliveryWindows.sameDayCutoff', e.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2"
            />
          </div>
          <div className="sm:col-span-3">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={config.deliveryWindows.allowWeekend}
                onChange={(e) => update('deliveryWindows.allowWeekend', e.target.checked)}
              />
              <span className="text-sm text-gray-600">Allow weekend deliveries</span>
            </label>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => saveSection('Delivery windows')}
            className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700"
          >
            Save windows
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">{t('admin.parameters.notificationsTitle')}</h2>
        <p className="text-sm text-gray-600 mb-4">{t('admin.parameters.notificationsDescription')}</p>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm text-gray-600">Email subject</label>
            <input
              type="text"
              value={config.notifications.emailSubject}
              onChange={(e) => update('notifications.emailSubject', e.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">{`Email body (use {{name}}, {{document}}, {{link}})`}</label>
            <textarea
              rows={4}
              value={config.notifications.emailBody}
              onChange={(e) => update('notifications.emailBody', e.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">{`SMS template (use {{document}})`}</label>
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
              <span className="text-sm text-gray-600">Notify on upload</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={config.notifications.notifyOn.certified}
                onChange={(e) => update('notifications.notifyOn.certified', e.target.checked)}
              />
              <span className="text-sm text-gray-600">Notify on certification</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={config.notifications.notifyOn.delivered}
                onChange={(e) => update('notifications.notifyOn.delivered', e.target.checked)}
              />
              <span className="text-sm text-gray-600">Notify on delivery</span>
            </label>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => saveSection('Notifications')}
            className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700"
          >
            Save notifications
          </button>
        </div>
      </div>
    </div>
  );
};

export default SystemSetup;


