import { useLanguage } from '../../context/LanguageContext';

const LanguageToggle = ({ className = '', compact = false }) => {
  const { language, setLanguage, t } = useLanguage();

  const isSpanish = language === 'es';
  const baseButtonClasses =
    'flex items-center justify-center gap-1 sm:gap-2 rounded-full border px-3 py-1.5 text-xs sm:text-sm font-semibold transition-colors';

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white p-1 shadow-sm ${className}`}
    >
      <button
        type="button"
        onClick={() => setLanguage('es')}
        className={`${baseButtonClasses} ${
          isSpanish
            ? 'bg-green-600 text-white border-green-600 shadow'
            : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
        }`}
      >
        <span className={compact ? 'text-sm' : 'text-base'}>🇵🇪</span>
        {!compact && <span>{t('settings.spanish')}</span>}
      </button>
      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`${baseButtonClasses} ${
          !isSpanish
            ? 'bg-green-600 text-white border-green-600 shadow'
            : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
        }`}
      >
        <span className={compact ? 'text-sm' : 'text-base'}>🇺🇸</span>
        {!compact && <span>{t('settings.english')}</span>}
      </button>
    </div>
  );
};

export default LanguageToggle;

