import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

const COINS_STORAGE_KEY = 'notaryCoins_v1';
const COIN_PRICE_KEY = 'coinPrice_v1';

const Coins = () => {
  const { t } = useLanguage();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [buyAmount, setBuyAmount] = useState(100);
  const [redeemAmount, setRedeemAmount] = useState(0);
  const [coinPrice, setCoinPrice] = useState(1.0); // Default price per coin

  useEffect(() => {
    // Load balance and transactions
    try {
      const stored = localStorage.getItem(COINS_STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        setBalance(data.balance || 0);
        setTransactions(data.transactions || []);
      }
    } catch (e) {
      console.warn('Failed to load coins data', e);
    }

    // Load coin price from admin settings
    try {
      // First check dedicated coin price storage (priority)
      const priceRaw = localStorage.getItem(COIN_PRICE_KEY);
      if (priceRaw) {
        setCoinPrice(parseFloat(priceRaw));
        return; // Use dedicated storage if available
      }
      // Fallback to system setup config
      const setupRaw = localStorage.getItem('systemSetupConfig_v1');
      if (setupRaw) {
        const parsed = JSON.parse(setupRaw);
        if (parsed?.serviceRates?.coinPrice) {
          setCoinPrice(parseFloat(parsed.serviceRates.coinPrice));
        }
      }
    } catch (e) {
      console.warn('Failed to load coin price', e);
    }
  }, []);

  const saveCoinsData = (newBalance, newTransaction) => {
    const updatedTransactions = [newTransaction, ...transactions].slice(0, 50); // Keep last 50
    const data = {
      balance: newBalance,
      transactions: updatedTransactions,
    };
    localStorage.setItem(COINS_STORAGE_KEY, JSON.stringify(data));
    setBalance(newBalance);
    setTransactions(updatedTransactions);
  };

  const handleBuyCoins = () => {
    const coinsToAdd = Math.floor(buyAmount / coinPrice);
    const totalCost = coinsToAdd * coinPrice;
    const newBalance = balance + coinsToAdd;

    const transaction = {
      id: Date.now(),
      type: 'purchase',
      amount: coinsToAdd,
      cost: totalCost,
      date: new Date().toISOString(),
      status: 'completed',
    };

    saveCoinsData(newBalance, transaction);
    setShowBuyModal(false);
    setBuyAmount(100);
  };

  const handleRedeemCoins = () => {
    if (redeemAmount > balance) {
      alert(t('coins.insufficientBalance'));
      return;
    }

    const cashValue = redeemAmount * coinPrice;
    const newBalance = balance - redeemAmount;

    const transaction = {
      id: Date.now(),
      type: 'redemption',
      amount: redeemAmount,
      cashValue: cashValue,
      date: new Date().toISOString(),
      status: 'pending',
    };

    saveCoinsData(newBalance, transaction);
    setShowRedeemModal(false);
    setRedeemAmount(0);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white rounded-full shadow-sm">
            <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6a6 3 0 110 6 6 3 0 010-6z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3c0 1.657-2.686 3-6 3s-6-1.343-6-3V9" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 13v3c0 1.657-2.686 3-6 3s-6-1.343-6-3v-3" />
            </svg>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-amber-900 mb-2">{t('coins.title')}</h1>
            <p className="text-sm sm:text-base text-amber-800 leading-relaxed mb-4">
              {t('coins.description')}
            </p>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{t('coins.currentBalance')}</p>
                  <p className="text-3xl font-bold text-amber-900">{balance.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {t('coins.coinPriceLabel')}: S/. {coinPrice.toFixed(2)}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowBuyModal(true)}
                    className="px-4 py-2 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition-colors"
                  >
                    {t('coins.buyCoins')}
                  </button>
                  <button
                    onClick={() => setShowRedeemModal(true)}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors"
                  >
                    {t('coins.redeemCoins')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">{t('coins.purchaseHistory')}</h2>
        {transactions.length === 0 ? (
          <p className="text-gray-500 text-center py-8">{t('coins.noTransactions')}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('coins.transactionType')}</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('coins.amount')}</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('coins.date')}</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('coins.status')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                        tx.type === 'purchase' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {tx.type === 'purchase' ? t('coins.purchase') : t('coins.redemption')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {tx.type === 'purchase' 
                        ? `+${tx.amount} (S/. ${tx.cost?.toFixed(2) || '0.00'})`
                        : `-${tx.amount} (S/. ${tx.cashValue?.toFixed(2) || '0.00'})`
                      }
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(tx.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                        tx.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {tx.status === 'completed' ? t('coins.completed') : t('coins.pending')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Buy Coins Modal */}
      {showBuyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t('coins.buyCoinsTitle')}</h2>
            <p className="text-sm text-gray-600 mb-6">{t('coins.buyCoinsDescription')}</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">{t('coins.amountToBuy')}</label>
                <input
                  type="number"
                  value={buyAmount}
                  onChange={(e) => setBuyAmount(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  min="0"
                  step="0.01"
                />
                <p className="text-xs text-gray-500 mt-2">
                  {t('coins.youWillReceive')}: {Math.floor(buyAmount / coinPrice).toLocaleString()} {t('coins.coins')} (S/. {coinPrice.toFixed(2)} {t('coins.perCoin')})
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">{t('coins.paymentMethod')}</label>
                <select className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500">
                  <option>{t('coins.creditCard')}</option>
                  <option>{t('coins.paypal')}</option>
                </select>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowBuyModal(false)}
                className="px-4 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleBuyCoins}
                className="px-4 py-3 rounded-lg bg-amber-600 text-white font-semibold hover:bg-amber-700 transition-colors"
              >
                {t('coins.confirmPurchase')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Redeem Coins Modal */}
      {showRedeemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t('coins.redeemCoinsTitle')}</h2>
            <p className="text-sm text-gray-600 mb-6">{t('coins.redeemCoinsDescription')}</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">{t('coins.amountToRedeem')}</label>
                <input
                  type="number"
                  value={redeemAmount}
                  onChange={(e) => setRedeemAmount(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  min="0"
                  max={balance}
                />
                <p className="text-xs text-gray-500 mt-2">
                  {t('coins.availableBalance')}: {balance.toLocaleString()} {t('coins.coins')}
                </p>
                {redeemAmount > 0 && (
                  <p className="text-sm text-orange-600 mt-2 font-semibold">
                    {t('coins.cashValue')}: S/. {(redeemAmount * coinPrice).toFixed(2)}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">{t('coins.bankAccount')}</label>
                <input
                  type="text"
                  placeholder={t('coins.bankAccountPlaceholder')}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowRedeemModal(false)}
                className="px-4 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleRedeemCoins}
                className="px-4 py-3 rounded-lg bg-orange-600 text-white font-semibold hover:bg-orange-700 transition-colors"
              >
                {t('coins.confirmRedemption')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Coins;
