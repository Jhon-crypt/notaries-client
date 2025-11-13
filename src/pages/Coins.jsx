import { useLanguage } from '../context/LanguageContext';

const Coins = () => {
  const { t } = useLanguage();

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white rounded-full shadow-sm">
            <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6a6 3 0 110 6 6 3 0 010-6z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3c0 1.657-2.686 3-6 3s-6-1.343-6-3V9" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 13v3c0 1.657-2.686 3-6 3s-6-1.343-6-3v-3" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-amber-900 mb-2">{t('coins.title')}</h1>
            <p className="text-sm sm:text-base text-amber-800 leading-relaxed">
              {t('coins.description')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Coins;

