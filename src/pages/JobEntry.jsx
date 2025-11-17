import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const MAP_PREVIEWS = {
  limaCentro:
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScyNDAnIGhlaWdodD0nMTYwJyB2aWV3Qm94PScwIDAgMjQwIDE2MCc+PHJlY3QgZmlsbD0nI0UwRjJGRScgd2lkdGg9JzI0MCcgaGVpZ2h0PScxNjAnLz48cGF0aCBkPSdNMjAgNDBMOTAgNjBMMTIwIDQwTDIwMCA3MCcgc3Ryb2tlPScjMDI4NEM3JyBzdHJva2Utd2lkdGg9JzYnIGZpbGw9J25vbmUnIHN0cm9rZS1saW5lY2FwPSdyb3VuZCcvPjxwYXRoIGQ9J00zMCAxMjBMMTEwIDkwTDE2MCAxMjBMMjEwIDExMCcgc3Ryb2tlPScjMzhCREY4JyBzdHJva2Utd2lkdGg9JzQnIGZpbGw9J25vbmUnIHN0cm9rZS1saW5lY2FwPSdyb3VuZCcvPjxjaXJjbGUgY3g9JzEyMCcgY3k9JzYwJyByPScxMCcgZmlsbD0nIzFENEVEOCcvPjxyZWN0IHg9JzE1MCcgeT0nMzAnIHdpZHRoPSc1MCcgaGVpZ2h0PSczMCcgZmlsbD0nI0ZCQkYyNCcgZmlsbC1vcGFjaXR5PScwLjYnIHN0cm9rZT0nI0Y1OUUwQicgc3Ryb2tlLXdpZHRoPSczJy8+PC9zdmc+',
  callao:
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScyNDAnIGhlaWdodD0nMTYwJyB2aWV3Qm94PScwIDAgMjQwIDE2MCc+PHJlY3QgZmlsbD0nI0ZFRjNDNycgd2lkdGg9JzI0MCcgaGVpZ2h0PScxNjAnLz48cGF0aCBkPSdNMTUgMzBMODUgNDVMMTQwIDM1TDIyMCA2MCcgc3Ryb2tlPScjRjU5RTBCJyBzdHJva2Utd2lkdGg9JzUnIGZpbGw9J25vbmUnIHN0cm9rZS1saW5lY2FwPSdyb3VuZCcvPjxwYXRoIGQ9J00yNSAxMzBMOTUgMTEwTDE1MCAxMjVMMjA1IDExNScgc3Ryb2tlPScjRDk3NzA2JyBzdHJva2Utd2lkdGg9JzQnIGZpbGw9J25vbmUnIHN0cm9rZS1saW5lY2FwPSdyb3VuZCcvPjxwb2x5Z29uIHBvaW50cz0nNjAsNjAgMTIwLDgwIDkwLDEyMCAzNSw5NScgZmlsbD0nI0ZDRDM0RCcgZmlsbC1vcGFjaXR5PScwLjU1JyBzdHJva2U9JyNGNTlFMEInIHN0cm9rZS13aWR0aD0nMycvPjxjaXJjbGUgY3g9JzE4MCcgY3k9JzgwJyByPScxMCcgZmlsbD0nI0I5MUMxQycvPjwvc3ZnPg==',
  surco:
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScyNDAnIGhlaWdodD0nMTYwJyB2aWV3Qm94PScwIDAgMjQwIDE2MCc+PHJlY3QgZmlsbD0nI0RDRkNFNycgd2lkdGg9JzI0MCcgaGVpZ2h0PScxNjAnLz48cGF0aCBkPSdNMjUgMzVMNzAgNjVMMTIwIDU1TDE5MCA3MCcgc3Ryb2tlPScjMjJDNTVFJyBzdHJva2Utd2lkdGg9JzUnIGZpbGw9J25vbmUnIHN0cm9rZS1saW5lY2FwPSdyb3VuZCcvPjxwYXRoIGQ9J00zNSAxNDBMMTIwIDEwMEwyMDAgMTMwJyBzdHJva2U9JyMxNTgwM0QnIHN0cm9rZS13aWR0aD0nNCcgZmlsbD0nbm9uZScgc3Ryb2tlLWxpbmVjYXA9J3JvdW5kJy8+PHBvbHlnb24gcG9pbnRzPSc5MCw0NSAxNTAsNjUgMTYwLDEwNSAxMTAsMTIwIDcwLDk1JyBmaWxsPScjODZFRkFDJyBmaWxsLW9wYWNpdHk9JzAuNicgc3Ryb2tlPScjMjJDNTVFJyBzdHJva2Utd2lkdGg9JzMnLz48Y2lyY2xlIGN4PSc3MCcgY3k9Jzk1JyByPSc5JyBmaWxsPScjMDQ3ODU3Jy8+PC9zdmc+',
};
const DEFAULT_PRICING = {
  baseCharge: 35,
  fastSurchargePct: 50,
  urgentSurchargePct: 80,
  digitalCertFee: 5,
};

const JobEntry = () => {
  const { t } = useLanguage();

  const [notaryProfile, setNotaryProfile] = useState(null);
  const [serviceZones, setServiceZones] = useState([]);
  const [pricing, setPricing] = useState(DEFAULT_PRICING);
  const [workingHours, setWorkingHours] = useState({
    start: '09:00',
    end: '18:00',
    cutoff: '16:00',
    weekend: false,
  });
  const [secondaryFilters, setSecondaryFilters] = useState({
    query: '',
    maxDistance: 15,
    maxWorkload: 0.85,
  });
  const [confirmationNumber, setConfirmationNumber] = useState('');

  const [sender, setSender] = useState({
    dni: '',
    cellPhone: '',
    email: '',
    address: '',
  });

  const [recipients, setRecipients] = useState([
    {
      id: 1,
      name: '',
      street: '',
      mznaLoteUrb: '',
      district: '',
      province: '',
      department: '',
      deliveryMethod: '',
      pickupMethod: '',
      leaveAtDoor: false,
      agent: '',
      pdfFile: null,
      outsideServiceArea: false,
      cost: '0.00',
    },
  ]);

  const notaryOptions = useMemo(
    () => [
      {
        id: 'notary-centro',
        name: 'Notaría Central Lima',
        zone: 'Lima Centro',
        coverageAreas: 'Cercado, Lince, San Miguel',
        responseTime: '45 min',
        availability: 'Turno mañana y tarde',
        mapImage: MAP_PREVIEWS.limaCentro,
        distanceKm: 1.2,
        workload: 0.42,
      },
      {
        id: 'notary-callao',
        name: 'Notaría Callao Express',
        zone: 'Callao y Aeropuerto',
        coverageAreas: 'Callao, Bellavista, La Perla',
        responseTime: '60 min',
        availability: 'Cobertura 24/7 para urgencias',
        mapImage: MAP_PREVIEWS.callao,
        distanceKm: 4.8,
        workload: 0.67,
      },
      {
        id: 'notary-surco',
        name: 'Notaría Surco Verde',
        zone: 'Surco - San Borja',
        coverageAreas: 'Surco, San Borja, Miraflores',
        responseTime: '90 min',
        availability: 'Rondas vespertinas y nocturnas',
        mapImage: MAP_PREVIEWS.surco,
        distanceKm: 6.3,
        workload: 0.52,
      },
    ],
    []
  );

  const [secondaryNotary, setSecondaryNotary] = useState('');

  const filteredSecondaryNotaries = useMemo(() => {
    const text = secondaryFilters.query.trim().toLowerCase();
    return notaryOptions
      .filter((notary) => notary.distanceKm <= secondaryFilters.maxDistance)
      .filter((notary) => notary.workload <= secondaryFilters.maxWorkload)
      .filter((notary) => {
        if (!text) return true;
        return (
          notary.name.toLowerCase().includes(text) ||
          notary.zone.toLowerCase().includes(text) ||
          notary.coverageAreas.toLowerCase().includes(text)
        );
      })
      .sort((a, b) => {
        if (a.distanceKm !== b.distanceKm) {
          return a.distanceKm - b.distanceKm;
        }
        return a.workload - b.workload;
      });
  }, [notaryOptions, secondaryFilters]);

  const secondaryNotaryDetails = useMemo(
    () => notaryOptions.find((notary) => notary.id === secondaryNotary) || null,
    [notaryOptions, secondaryNotary]
  );

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCertificationModal, setShowCertificationModal] = useState(false);
  const [showPOSModal, setShowPOSModal] = useState(false);
  const [posProcessing, setPosProcessing] = useState(false);
  const [showDigitalSignaturePrompt, setShowDigitalSignaturePrompt] = useState(false);
  const [digitalSignatureChecked, setDigitalSignatureChecked] = useState(false);

  useEffect(() => {
    try {
      const profileRaw = localStorage.getItem('notaryProfile');
      if (profileRaw) {
        const parsed = JSON.parse(profileRaw);
        setNotaryProfile(parsed);

        setSender((prev) => ({
          ...prev,
          cellPhone: parsed.phone || prev.cellPhone,
          email: parsed.email || prev.email,
          address: parsed.address
            ? [
                parsed.address.street,
                parsed.address.number,
                parsed.address.district,
                parsed.address.province,
              ]
                .filter(Boolean)
                .join(', ')
            : prev.address,
        }));

        setPricing((prev) => ({
          ...prev,
          baseCharge: parsed.baseCharge ? parseFloat(parsed.baseCharge) || prev.baseCharge : prev.baseCharge,
        }));

        setWorkingHours({
          start: parsed.workingHoursStart || '09:00',
          end: parsed.workingHoursEnd || '18:00',
          cutoff: parsed.sameDayCutoff || '16:00',
          weekend: Boolean(parsed.weekendDeliveries),
        });
      }
    } catch (error) {
      console.warn('Unable to load notary profile', error);
    }

    try {
      const zonesRaw = localStorage.getItem('notaryServiceZones');
      if (zonesRaw) {
        const parsedZones = JSON.parse(zonesRaw || '[]');
        if (Array.isArray(parsedZones)) {
          setServiceZones(parsedZones);
        }
      }
    } catch (error) {
      console.warn('Unable to load notary service zones', error);
    }

    try {
      const setupRaw = localStorage.getItem('systemSetupConfig_v1');
      if (setupRaw) {
        const parsed = JSON.parse(setupRaw);
        const serviceRates = parsed?.serviceRates || {};
        setPricing((prev) => ({
          ...prev,
          baseCharge:
            prev.baseCharge === DEFAULT_PRICING.baseCharge && serviceRates.basePrice
              ? parseFloat(serviceRates.basePrice) || prev.baseCharge
              : prev.baseCharge,
          fastSurchargePct:
            serviceRates.fastSurchargePct ?? prev.fastSurchargePct,
          urgentSurchargePct:
            serviceRates.urgentSurchargePct ?? prev.urgentSurchargePct,
          digitalCertFee:
            serviceRates.digitalCertFee ?? prev.digitalCertFee,
        }));

        if (parsed?.deliveryWindows?.maxSecondaryDistanceKm) {
          setSecondaryFilters((prev) => ({
            ...prev,
            maxDistance: parsed.deliveryWindows.maxSecondaryDistanceKm,
          }));
        }
      }
    } catch (error) {
      console.warn('Unable to load system setup config', error);
    }
  }, []);

  // Check for digital signature when sender email is entered
  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole === 'client' && sender.email && !digitalSignatureChecked) {
      const signatureStatus = localStorage.getItem('clientSignatureStatus') || 'not_setup';
      if (signatureStatus === 'not_setup' || signatureStatus === 'later') {
        setShowDigitalSignaturePrompt(true);
        setDigitalSignatureChecked(true);
      }
    }
  }, [sender.email, digitalSignatureChecked]);

  const handleSenderChange = (e) => {
    setSender({
      ...sender,
      [e.target.name]: e.target.value,
    });
  };

  const recalculateCost = useCallback(
    (recipient) => {
      const base = parseFloat(pricing.baseCharge) || DEFAULT_PRICING.baseCharge;
      const method = recipient.deliveryMethod || 'standard';
      let multiplier = 1;

      if (method === 'fast') {
        multiplier += (pricing.fastSurchargePct || 0) / 100;
      } else if (method === 'urgent') {
        multiplier += (pricing.urgentSurchargePct || 0) / 100;
      }

      if (recipient.outsideServiceArea) {
        multiplier += 0.25;
      }

      const total = base * multiplier;
      return {
        ...recipient,
        cost: total ? total.toFixed(2) : '0.00',
      };
    },
    [pricing]
  );

  const handleRecipientChange = (id, field, value) => {
    setRecipients((prev) =>
      prev.map((recipient) => {
        if (recipient.id !== id) return recipient;

        const nextValue =
          field === 'leaveAtDoor' || field === 'outsideServiceArea'
            ? Boolean(value)
            : value;

        const updated = {
          ...recipient,
          [field]: nextValue,
        };

        return recalculateCost(updated);
      })
    );
  };

  const handleFileUpload = (id, file) => {
    if (file && file.type === 'application/pdf') {
      setRecipients(recipients.map(r => 
        r.id === id ? { ...r, pdfFile: file } : r
      ));
    } else {
      alert('Please upload a PDF file only');
    }
  };

  const addRecipient = () => {
    const newId = Math.max(...recipients.map(r => r.id)) + 1;
    const blankRecipient = recalculateCost({
      id: newId,
      name: '',
      street: '',
      mznaLoteUrb: '',
      district: '',
      province: '',
      department: '',
      deliveryMethod: '',
      pickupMethod: '',
      leaveAtDoor: false,
      agent: '',
      pdfFile: null,
      outsideServiceArea: false,
      cost: '0.00',
    });
    setRecipients((prev) => [...prev, blankRecipient]);
  };

  const removeRecipient = (id) => {
    if (recipients.length > 1) {
      setRecipients((prev) => prev.filter(r => r.id !== id));
    }
  };

  const requiresSecondary = useMemo(
    () => recipients.some((recipient) => recipient.outsideServiceArea),
    [recipients]
  );

  const calculateTotal = () => {
    return recipients.reduce((sum, r) => sum + (parseFloat(r.cost) || 0), 0).toFixed(2);
  };

  useEffect(() => {
    setRecipients((prev) => prev.map((recipient) => recalculateCost(recipient)));
  }, [recalculateCost]);

  useEffect(() => {
    if (requiresSecondary) {
      if (!secondaryNotary && filteredSecondaryNotaries.length) {
        setSecondaryNotary(filteredSecondaryNotaries[0].id);
      }
    } else if (secondaryNotary) {
      setSecondaryNotary('');
    }
  }, [requiresSecondary, filteredSecondaryNotaries, secondaryNotary]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (requiresSecondary && !secondaryNotary) {
      alert(t('jobEntry.secondaryRequiredAlert'));
      return;
    }
    console.log('Job Entry Data:', {
      sender,
      recipients,
      primaryNotary: notaryProfile?.fullName || 'Notario principal',
      secondaryNotary,
    });
    setShowPaymentModal(true);
  };

  const handleSecondarySelect = (id) => {
    setSecondaryNotary(id);
  };

  const handleConfirmPayment = () => {
    setShowPaymentModal(false);
    setShowPOSModal(true);
    setPosProcessing(true);
    
    // Simulate POS processing
    setTimeout(() => {
      setPosProcessing(false);
      const generated = `CN-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      setConfirmationNumber(generated);
      setShowPOSModal(false);
      setShowCertificationModal(true);
    }, 2500);
  };

  const handleCloseCertification = () => {
    setShowCertificationModal(false);
    setConfirmationNumber('');
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
          {t('jobEntry.title')}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Sender Information */}
        <div className="bg-white rounded-xl shadow-sm border-2 border-gray-300 p-4 sm:p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 uppercase">{t('jobEntry.sender')}</h2>
          {notaryProfile && (
            <p className="text-xs text-gray-500 mb-4">{t('jobEntry.senderAutoFilled')}</p>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                {t('jobEntry.dni')}
              </label>
              <input
                type="text"
                name="dni"
                value={sender.dni}
                onChange={handleSenderChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="12345678-9"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                {t('jobEntry.cellPhone')}
              </label>
              <input
                type="tel"
                name="cellPhone"
                value={sender.cellPhone}
                onChange={handleSenderChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="+51 999 999 999"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                {t('jobEntry.senderEmail')}
              </label>
              <input
                type="email"
                name="email"
                value={sender.email}
                onChange={handleSenderChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="correo@ejemplo.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                {t('jobEntry.address')}
              </label>
              <input
                type="text"
                name="address"
                value={sender.address}
                onChange={handleSenderChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Calle Principal 123"
                required
              />
            </div>
          </div>

          <div className="space-y-4">

            <div className="flex items-center gap-3">
              <label className="text-sm font-bold text-gray-900">
                {t('jobEntry.numRecipients')}:
              </label>
              <div className="px-4 py-2 bg-gray-100 border-2 border-gray-300 rounded-lg min-w-[60px] text-center font-bold">
                {recipients.length}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Recipients Table */}
            <div className="bg-white rounded-xl shadow-sm border-2 border-gray-200 p-4 sm:p-6 space-y-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-lg font-bold text-gray-900 uppercase">{t('jobEntry.recipient')}</h2>
                <div className="text-sm text-gray-500">
                  {t('jobEntry.numRecipients')}: <span className="font-semibold text-gray-900">{recipients.length}</span>
                </div>
              </div>

              {/* Desktop Table */}
              <div className="hidden md:block">
                <div className="overflow-x-auto">
                  <table className="w-full border-2 border-gray-300 rounded-lg">
                    <thead className="bg-gray-100 text-xs font-semibold uppercase text-gray-600">
                      <tr>
                        <th className="px-4 py-3 text-left border-r-2 border-gray-300">{t('jobEntry.recipient')}</th>
                        <th className="px-4 py-3 text-left border-r-2 border-gray-300">{t('jobEntry.recipientName')}</th>
                        <th className="px-4 py-3 text-left border-r-2 border-gray-300">{t('jobEntry.streetNumber')}</th>
                        <th className="px-4 py-3 text-left border-r-2 border-gray-300">{t('jobEntry.district')}</th>
                        <th className="px-4 py-3 text-left border-r-2 border-gray-300">{t('jobEntry.province')}</th>
                        <th className="px-4 py-3 text-left border-r-2 border-gray-300">{t('jobEntry.department')}</th>
                        <th className="px-4 py-3 text-left border-r-2 border-gray-300">{t('jobEntry.serviceAreaStatus')}</th>
                        <th className="px-4 py-3 text-left border-r-2 border-gray-300">{t('jobEntry.deliveryMethod')}</th>
                        <th className="px-4 py-3 text-left border-r-2 border-gray-300">{t('jobEntry.pickupMethod')}</th>
                        <th className="px-4 py-3 text-center border-r-2 border-gray-300">{t('jobEntry.leaveAtDoor')}</th>
                        <th className="px-4 py-3 text-left border-r-2 border-gray-300">{t('jobEntry.correspondingAgent')}</th>
                        <th className="px-4 py-3 text-left border-r-2 border-gray-300">{t('jobEntry.uploadPDF')}</th>
                        <th className="px-4 py-3 text-left border-r-2 border-gray-300">{t('jobEntry.cost')}</th>
                        <th className="px-4 py-3 text-center"> </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {recipients.map((recipient, index) => (
                        <tr key={recipient.id} className="border-t border-gray-200">
                          <td className="px-4 py-3 border-r-2 border-gray-300 text-xs font-semibold text-gray-500 uppercase">{index + 1}</td>
                          <td className="px-4 py-3 border-r-2 border-gray-300">
                            <input
                              type="text"
                              value={recipient.name}
                              onChange={(e) => handleRecipientChange(recipient.id, 'name', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                              placeholder={t('jobEntry.recipientName')}
                              required
                            />
                          </td>
                          <td className="px-4 py-3 border-r-2 border-gray-300">
                            <input
                              type="text"
                              value={recipient.street}
                              onChange={(e) => handleRecipientChange(recipient.id, 'street', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                              placeholder={t('jobEntry.streetNumber')}
                              required
                            />
                            <input
                              type="text"
                              value={recipient.mznaLoteUrb}
                              onChange={(e) => handleRecipientChange(recipient.id, 'mznaLoteUrb', e.target.value)}
                              className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                              placeholder={t('jobEntry.mznaLoteUrb')}
                            />
                          </td>
                          <td className="px-4 py-3 border-r-2 border-gray-300">
                            <select
                              value={recipient.district}
                              onChange={(e) => handleRecipientChange(recipient.id, 'district', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm bg-gray-100"
                              required
                            >
                              <option value="">{t('jobEntry.selectDistrict')}</option>
                              <option value="Miraflores">Miraflores</option>
                              <option value="San Isidro">San Isidro</option>
                              <option value="Surquillo">Surquillo</option>
                              <option value="La Molina">La Molina</option>
                            </select>
                          </td>
                          <td className="px-4 py-3 border-r-2 border-gray-300">
                            <select
                              value={recipient.province}
                              onChange={(e) => handleRecipientChange(recipient.id, 'province', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm bg-gray-100"
                              required
                            >
                              <option value="">{t('jobEntry.selectProvince')}</option>
                              <option value="Lima">Lima</option>
                              <option value="Callao">Callao</option>
                            </select>
                          </td>
                          <td className="px-4 py-3 border-r-2 border-gray-300">
                            <select
                              value={recipient.department}
                              onChange={(e) => handleRecipientChange(recipient.id, 'department', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm bg-gray-100"
                              required
                            >
                              <option value="">{t('jobEntry.selectDepartment')}</option>
                              <option value="Lima">Lima</option>
                              <option value="Callao">Callao</option>
                            </select>
                          </td>
                          <td className="px-4 py-3 border-r-2 border-gray-300">
                            <select
                              value={recipient.outsideServiceArea ? 'outside' : 'inside'}
                              onChange={(e) => handleRecipientChange(recipient.id, 'outsideServiceArea', e.target.value === 'outside')}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm bg-white font-semibold"
                            >
                              <option value="inside">{t('jobEntry.insideServiceArea')}</option>
                              <option value="outside">{t('jobEntry.outsideServiceArea')}</option>
                            </select>
                          </td>
                          <td className="px-4 py-3 border-r-2 border-gray-300">
                            <select
                              value={recipient.deliveryMethod}
                              onChange={(e) => handleRecipientChange(recipient.id, 'deliveryMethod', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm bg-gray-100 font-semibold"
                              required
                            >
                              <option value="">Seleccionar</option>
                              <option value="standard">{t('jobEntry.standard')} (+0%)</option>
                              <option value="fast">{t('jobEntry.fast')} (+50%)</option>
                              <option value="urgent">{t('jobEntry.urgent')} (+80%)</option>
                            </select>
                          </td>
                          <td className="px-4 py-3 border-r-2 border-gray-300">
                            <select
                              value={recipient.pickupMethod}
                              onChange={(e) => handleRecipientChange(recipient.id, 'pickupMethod', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm bg-gray-100"
                              required
                            >
                              <option value="">Seleccionar</option>
                              <option value="office">{t('jobEntry.pickupOffice')}</option>
                              <option value="email">{t('jobEntry.sendEmail')}</option>
                            </select>
                          </td>
                          <td className="px-4 py-3 text-center border-r-2 border-gray-300">
                            <input
                              type="checkbox"
                              checked={recipient.leaveAtDoor}
                              onChange={(e) => handleRecipientChange(recipient.id, 'leaveAtDoor', e.target.checked)}
                              className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                            />
                          </td>
                          <td className="px-4 py-3 border-r-2 border-gray-300">
                            <select
                              value={recipient.agent}
                              onChange={(e) => handleRecipientChange(recipient.id, 'agent', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm bg-gray-100"
                              required
                            >
                              <option value="">Seleccionar agente</option>
                              <option value="agent1">Agente 1 - Zona Norte</option>
                              <option value="agent2">Agente 2 - Zona Sur</option>
                              <option value="agent3">Agente 3 - Centro</option>
                            </select>
                          </td>
                          <td className="px-4 py-3 border-r-2 border-gray-300">
                            <div className="flex flex-col gap-2">
                              <label className="block">
                                <input
                                  type="file"
                                  accept=".pdf,application/pdf,image/*"
                                  capture="environment"
                                  onChange={(e) => handleFileUpload(recipient.id, e.target.files[0])}
                                  className="hidden"
                                />
                                <div className="px-4 py-2 bg-gray-500 text-white rounded-lg text-center cursor-pointer hover:bg-gray-600 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                  {t('jobEntry.uploadPDF')}
                                </div>
                              </label>
                              {recipient.pdfFile && (
                                <p className="text-xs text-green-600 truncate">✓ {recipient.pdfFile.name}</p>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 border-r-2 border-gray-300">
                            <div className="text-sm font-semibold text-gray-900">
                              S/. {parseFloat(recipient.cost || 0).toFixed(2)}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            {recipients.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeRecipient(recipient.id)}
                                className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors"
                              >
                                {t('jobEntry.removeRecipient')}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {recipients.map((recipient, index) => (
                  <div key={recipient.id} className="border border-gray-200 rounded-xl p-4 space-y-4 bg-white shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-semibold text-gray-900 uppercase">
                        {t('jobEntry.recipient')} {index + 1}
                      </div>
                      {recipients.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeRecipient(recipient.id)}
                          className="text-sm text-red-600 font-semibold hover:text-red-700"
                        >
                          {t('jobEntry.removeRecipient')}
                        </button>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">{t('jobEntry.recipientName')}</label>
                        <input
                          type="text"
                          value={recipient.name}
                          onChange={(e) => handleRecipientChange(recipient.id, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                          placeholder={t('jobEntry.recipientName')}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">{t('jobEntry.streetNumber')}</label>
                        <input
                          type="text"
                          value={recipient.street}
                          onChange={(e) => handleRecipientChange(recipient.id, 'street', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                          placeholder={t('jobEntry.streetNumber')}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">{t('jobEntry.mznaLoteUrb')}</label>
                        <input
                          type="text"
                          value={recipient.mznaLoteUrb}
                          onChange={(e) => handleRecipientChange(recipient.id, 'mznaLoteUrb', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                          placeholder={t('jobEntry.mznaLoteUrb')}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">{t('jobEntry.district')}</label>
                          <select
                            value={recipient.district}
                            onChange={(e) => handleRecipientChange(recipient.id, 'district', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm bg-gray-100"
                            required
                          >
                            <option value="">{t('jobEntry.selectDistrict')}</option>
                            <option value="Miraflores">Miraflores</option>
                            <option value="San Isidro">San Isidro</option>
                            <option value="Surquillo">Surquillo</option>
                            <option value="La Molina">La Molina</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">{t('jobEntry.province')}</label>
                          <select
                            value={recipient.province}
                            onChange={(e) => handleRecipientChange(recipient.id, 'province', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm bg-gray-100"
                            required
                          >
                            <option value="">{t('jobEntry.selectProvince')}</option>
                            <option value="Lima">Lima</option>
                            <option value="Callao">Callao</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">{t('jobEntry.department')}</label>
                          <select
                            value={recipient.department}
                            onChange={(e) => handleRecipientChange(recipient.id, 'department', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm bg-gray-100"
                            required
                          >
                            <option value="">{t('jobEntry.selectDepartment')}</option>
                            <option value="Lima">Lima</option>
                            <option value="Callao">Callao</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">{t('jobEntry.serviceAreaStatus')}</label>
                        <select
                          value={recipient.outsideServiceArea ? 'outside' : 'inside'}
                          onChange={(e) => handleRecipientChange(recipient.id, 'outsideServiceArea', e.target.value === 'outside')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm bg-white font-semibold"
                        >
                          <option value="inside">{t('jobEntry.insideServiceArea')}</option>
                          <option value="outside">{t('jobEntry.outsideServiceArea')}</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">{t('jobEntry.deliveryMethod')}</label>
                          <select
                            value={recipient.deliveryMethod}
                            onChange={(e) => handleRecipientChange(recipient.id, 'deliveryMethod', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm bg-gray-100 font-semibold"
                            required
                          >
                            <option value="">Seleccionar</option>
                            <option value="standard">{t('jobEntry.standard')} (+0%)</option>
                            <option value="fast">{t('jobEntry.fast')} (+50%)</option>
                            <option value="urgent">{t('jobEntry.urgent')} (+80%)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">{t('jobEntry.pickupMethod')}</label>
                          <select
                            value={recipient.pickupMethod}
                            onChange={(e) => handleRecipientChange(recipient.id, 'pickupMethod', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm bg-gray-100"
                            required
                          >
                            <option value="">Seleccionar</option>
                            <option value="office">{t('jobEntry.pickupOffice')}</option>
                            <option value="email">{t('jobEntry.sendEmail')}</option>
                          </select>
                        </div>
                      </div>

                      <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                        <input
                          type="checkbox"
                          checked={recipient.leaveAtDoor}
                          onChange={(e) => handleRecipientChange(recipient.id, 'leaveAtDoor', e.target.checked)}
                          className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        {t('jobEntry.leaveAtDoor')}
                      </label>

                      <div>
                        <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">{t('jobEntry.correspondingAgent')}</label>
                        <select
                          value={recipient.agent}
                          onChange={(e) => handleRecipientChange(recipient.id, 'agent', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm bg-gray-100"
                          required
                        >
                          <option value="">Seleccionar agente</option>
                          <option value="agent1">Agente 1 - Zona Norte</option>
                          <option value="agent2">Agente 2 - Zona Sur</option>
                          <option value="agent3">Agente 3 - Centro</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">{t('jobEntry.uploadPDF')}</label>
                        <label className="block">
                          <input
                            type="file"
                            accept=".pdf,application/pdf,image/*"
                            capture="environment"
                            onChange={(e) => handleFileUpload(recipient.id, e.target.files[0])}
                            className="hidden"
                          />
                          <div className="px-4 py-2 bg-gray-500 text-white rounded-lg text-center cursor-pointer hover:bg-gray-600 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            {t('jobEntry.uploadPDF')}
                          </div>
                        </label>
                        {recipient.pdfFile && (
                          <p className="text-xs text-green-600 truncate">✓ {recipient.pdfFile.name}</p>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase text-gray-500">{t('jobEntry.cost')}</span>
                        <span className="text-base font-bold text-gray-900">S/. {parseFloat(recipient.cost || 0).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addRecipient}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {t('jobEntry.addRecipient')}
              </button>
            </div>
          </div>

          {/* Coverage Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5 sm:sticky sm:top-6 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900">
                    {t('jobEntry.coverageSummaryTitle')}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {t('jobEntry.coverageSummarySubtitle')}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                  S/. {parseFloat(pricing.baseCharge || DEFAULT_PRICING.baseCharge).toFixed(2)}
                </span>
              </div>

              <div className="space-y-2 text-sm text-gray-700">
                <p>
                  <span className="font-semibold text-gray-900">{t('jobEntry.coverageWorkingHoursLabel')}:</span>{' '}
                  {t('jobEntry.coverageWorkingHoursValue', { start: workingHours.start, end: workingHours.end })}
                </p>
                <p>
                  <span className="font-semibold text-gray-900">{t('jobEntry.cutoffLabel')}:</span>{' '}
                  {t('jobEntry.cutoffValue', { cutoff: workingHours.cutoff })}
                </p>
                <p className={`flex items-center gap-2 ${workingHours.weekend ? 'text-green-600' : 'text-gray-600'}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {workingHours.weekend ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    )}
                  </svg>
                  {workingHours.weekend ? t('jobEntry.weekendAllowed') : t('jobEntry.weekendNotAllowed')}
                </p>
              </div>

              <div className="border-t border-dashed border-gray-200 pt-3 text-xs text-gray-600 space-y-2">
                <p>
                  {serviceZones.length
                    ? t('jobEntry.serviceZonesDefined', { count: serviceZones.length })
                    : t('jobEntry.serviceZonesMissing')}
                </p>
                <p>
                  {t('jobEntry.pricingHint', {
                    fast: pricing.fastSurchargePct,
                    urgent: pricing.urgentSurchargePct,
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Notary Assignment */}
        <div className="bg-white rounded-xl shadow-sm border-2 border-blue-200 p-4 sm:p-6 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">{t('jobEntry.assignedNotariesTitle')}</h2>
              <p className="text-sm text-gray-600 mt-1">{t('jobEntry.assignedNotariesSubtitle')}</p>
            </div>
            <span
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
                requiresSecondary ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {requiresSecondary ? t('jobEntry.secondaryRequiredBadge') : t('jobEntry.secondaryOptionalBadge')}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            <div className="border-2 border-green-100 rounded-xl p-4 space-y-3 bg-green-50/40">
              <h3 className="text-xs font-semibold uppercase text-green-700">{t('jobEntry.primaryLabel')}</h3>
              <p className="text-lg font-bold text-gray-900">
                {notaryProfile?.fullName || t('jobEntry.currentNotaryFallback')}
              </p>
              <div className="text-sm text-gray-600 space-y-1">
                <p>{t('jobEntry.primaryContactLine', { phone: notaryProfile?.phone || '—' })}</p>
                <p>{t('jobEntry.primaryEmailLine', { email: notaryProfile?.email || '—' })}</p>
                <p>
                  {t('jobEntry.primaryBaseChargeLine', {
                    amount: parseFloat(pricing.baseCharge || DEFAULT_PRICING.baseCharge).toFixed(2),
                  })}
                </p>
              </div>
            </div>

            <div className="border-2 border-blue-100 rounded-xl p-4 space-y-4 bg-blue-50/40">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-900">
                  {t('jobEntry.secondarySelectLabel')}
                </label>
                <select
                  value={secondaryNotary}
                  onChange={(e) => handleSecondarySelect(e.target.value)}
                  disabled={!requiresSecondary || !filteredSecondaryNotaries.length}
                  className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                >
                  {!requiresSecondary && <option value="">{t('jobEntry.secondaryDisabledOption')}</option>}
                  {filteredSecondaryNotaries.map((notary) => (
                    <option key={notary.id} value={notary.id}>
                      {t('jobEntry.secondaryOptionLabel', {
                        name: notary.name,
                        distance: notary.distanceKm.toFixed(1),
                        workload: Math.round(notary.workload * 100),
                      })}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500">
                  {requiresSecondary
                    ? filteredSecondaryNotaries.length
                      ? t('jobEntry.secondarySelectionHelp')
                      : t('jobEntry.secondaryNoResults')
                    : t('jobEntry.secondaryDisabledHint')}
                </p>
              </div>

              <div className="border border-dashed border-blue-200 rounded-lg p-3 space-y-3">
                <input
                  type="search"
                  value={secondaryFilters.query}
                  onChange={(e) =>
                    setSecondaryFilters((prev) => ({
                      ...prev,
                      query: e.target.value,
                    }))
                  }
                  placeholder={t('jobEntry.secondarySearchPlaceholder')}
                  className="w-full rounded-lg border border-blue-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-600">
                  <label className="flex flex-col gap-1">
                    <span className="font-semibold">
                      {t('jobEntry.maxDistanceLabel', { value: secondaryFilters.maxDistance })}
                    </span>
                    <input
                      type="range"
                      min="1"
                      max="25"
                      value={secondaryFilters.maxDistance}
                      onChange={(e) =>
                        setSecondaryFilters((prev) => ({
                          ...prev,
                          maxDistance: Number(e.target.value),
                        }))
                      }
                    />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="font-semibold">
                      {t('jobEntry.maxWorkloadLabel', { value: Math.round(secondaryFilters.maxWorkload * 100) })}
                    </span>
                    <input
                      type="range"
                      min="30"
                      max="100"
                      value={Math.round(secondaryFilters.maxWorkload * 100)}
                      onChange={(e) =>
                        setSecondaryFilters((prev) => ({
                          ...prev,
                          maxWorkload: Number(e.target.value) / 100,
                        }))
                      }
                    />
                  </label>
                </div>
              </div>

              <div className="space-y-3">
                {filteredSecondaryNotaries.map((notary) => (
                  <button
                    type="button"
                    key={notary.id}
                    onClick={() => handleSecondarySelect(notary.id)}
                    disabled={!requiresSecondary}
                    className={`w-full text-left border-2 rounded-lg p-3 transition ${
                      secondaryNotary === notary.id
                        ? 'border-blue-500 bg-blue-50 shadow-sm'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{notary.name}</p>
                      <p className="text-xs text-gray-500">{notary.coverageAreas}</p>
                    </div>
                    <div className="text-xs font-semibold text-blue-600 text-right">
                      {notary.distanceKm.toFixed(1)} km • {Math.round(notary.workload * 100)}%
                    </div>
                  </div>
                  <img
                    src={notary.mapImage}
                    alt={t('jobEntry.secondaryMapAlt', { name: notary.name })}
                    className="w-full h-28 object-cover rounded-lg mt-3 border border-blue-100"
                  />
                </button>
              ))}
              {!filteredSecondaryNotaries.length && (
                <p className="text-xs text-gray-500">{t('jobEntry.secondaryNoResults')}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Total and Payment */}
        <div className="bg-white rounded-xl shadow-sm border-2 border-gray-300 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xl sm:text-2xl font-bold text-gray-900">
              {t('jobEntry.total')} S/. {calculateTotal()}
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-8 sm:px-12 lg:px-16 py-3 sm:py-4 bg-blue-600 text-white text-lg sm:text-xl lg:text-2xl font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg uppercase"
            >
              {t('jobEntry.pay')}
            </button>
          </div>
        </div>
      </form>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-100 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.6 1M12 8v9m0-13c-4.418 0-8 2.239-8 5v6c0 2.761 3.582 5 8 5s8-2.239 8-5v-6c0-2.761-3.582-5-8-5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{t('jobEntry.paymentSummaryTitle')}</h3>
                <p className="text-sm text-gray-600">
                  {t('jobEntry.paymentSummaryDescription')}
                </p>
              </div>
            </div>

            <div className="border border-gray-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span className="font-medium text-gray-700 uppercase">{t('jobEntry.primaryLabel')}</span>
                <span className="font-semibold text-gray-900">
                  {notaryProfile?.fullName || t('jobEntry.currentNotaryFallback')}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span className="font-medium text-gray-700 uppercase">{t('jobEntry.secondaryLabel')}</span>
                <span className="font-semibold text-gray-900">
                  {secondaryNotaryDetails
                    ? secondaryNotaryDetails.name
                    : requiresSecondary
                      ? t('jobEntry.secondaryNotSelected')
                      : t('jobEntry.secondaryOptionalSummary')}
                </span>
              </div>
              <div className="flex items-center justify-between pt-3 mt-2 border-t border-dashed border-gray-200">
                <span className="text-base font-semibold text-gray-900">{t('jobEntry.totalToCharge')}</span>
                <span className="text-2xl font-bold text-blue-600">S/. {calculateTotal()}</span>
              </div>
            </div>

            <p className="mt-4 text-xs text-gray-500">{t('jobEntry.posHint')}</p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setShowPaymentModal(false)}
                className="px-4 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                type="button"
                onClick={handleConfirmPayment}
                className="px-4 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors shadow"
              >
                {t('jobEntry.confirmPayment')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POS Mockup Modal */}
      {showPOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {posProcessing ? (
                  <svg className="w-8 h-8 text-blue-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                ) : (
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {posProcessing ? t('jobEntry.posProcessing') : t('jobEntry.posSuccess')}
              </h3>
              <p className="text-sm text-gray-600">
                {posProcessing ? t('jobEntry.posProcessingMessage') : t('jobEntry.posSuccessMessage')}
              </p>
            </div>

            {posProcessing && (
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between text-sm text-gray-700 mb-2">
                  <span>{t('jobEntry.posAmount')}</span>
                  <span className="font-bold text-lg">S/. {calculateTotal()}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{t('jobEntry.posMethod')}</span>
                  <span>{t('jobEntry.posMethodValue')}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Digital Signature Prompt Modal */}
      {showDigitalSignaturePrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-amber-100 rounded-full">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{t('jobEntry.digitalSignaturePromptTitle')}</h3>
                <p className="text-sm text-gray-600">{t('jobEntry.digitalSignaturePromptDescription')}</p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowDigitalSignaturePrompt(false);
                  // Generate signature on the fly
                  localStorage.setItem('clientSignatureStatus', 'active');
                  alert(t('jobEntry.digitalSignatureGenerated'));
                }}
                className="px-4 py-3 rounded-lg bg-amber-600 text-white font-semibold hover:bg-amber-700 transition-colors"
              >
                {t('jobEntry.generateSignature')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowDigitalSignaturePrompt(false);
                  localStorage.setItem('clientSignatureStatus', 'later');
                }}
                className="px-4 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-colors"
              >
                {t('jobEntry.digitalSignatureLater')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Certification Modal */}
      {showCertificationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 text-center shadow-2xl">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5 4a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('jobEntry.certificationTitle')}</h3>
            <p className="text-sm text-gray-600 mb-6">{t('jobEntry.certificationSubtitle')}</p>

            <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-left space-y-3">
              <p className="text-sm text-green-800">
                {t('jobEntry.certificationBody')}
              </p>
              <ul className="list-disc list-inside text-sm text-green-700 space-y-1">
                <li>{t('jobEntry.certificationChecklist1')}</li>
                <li>{t('jobEntry.certificationChecklist2')}</li>
                <li>{t('jobEntry.certificationChecklist3')}</li>
              </ul>
            </div>

            <p className="mt-4 text-sm text-gray-600">
              {confirmationNumber
                ? t('jobEntry.confirmationSent', { confirmation: confirmationNumber })
                : t('jobEntry.confirmationPending')}
            </p>

            <button
              type="button"
              onClick={handleCloseCertification}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 text-sm font-semibold text-white hover:bg-green-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {t('jobEntry.certificationSend')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobEntry;