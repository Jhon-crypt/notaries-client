import { useMemo, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import ServiceZoneMap from '../components/maps/ServiceZoneMap';

const MAP_PREVIEWS = {
  limaCentro:
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScyNDAnIGhlaWdodD0nMTYwJyB2aWV3Qm94PScwIDAgMjQwIDE2MCc+PHJlY3QgZmlsbD0nI0UwRjJGRScgd2lkdGg9JzI0MCcgaGVpZ2h0PScxNjAnLz48cGF0aCBkPSdNMjAgNDBMOTAgNjBMMTIwIDQwTDIwMCA3MCcgc3Ryb2tlPScjMDI4NEM3JyBzdHJva2Utd2lkdGg9JzYnIGZpbGw9J25vbmUnIHN0cm9rZS1saW5lY2FwPSdyb3VuZCcvPjxwYXRoIGQ9J00zMCAxMjBMMTEwIDkwTDE2MCAxMjBMMjEwIDExMCcgc3Ryb2tlPScjMzhCREY4JyBzdHJva2Utd2lkdGg9JzQnIGZpbGw9J25vbmUnIHN0cm9rZS1saW5lY2FwPSdyb3VuZCcvPjxjaXJjbGUgY3g9JzEyMCcgY3k9JzYwJyByPScxMCcgZmlsbD0nIzFENEVEOCcvPjxyZWN0IHg9JzE1MCcgeT0nMzAnIHdpZHRoPSc1MCcgaGVpZ2h0PSczMCcgZmlsbD0nI0ZCQkYyNCcgZmlsbC1vcGFjaXR5PScwLjYnIHN0cm9rZT0nI0Y1OUUwQicgc3Ryb2tlLXdpZHRoPSczJy8+PC9zdmc+',
  callao:
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScyNDAnIGhlaWdodD0nMTYwJyB2aWV3Qm94PScwIDAgMjQwIDE2MCc+PHJlY3QgZmlsbD0nI0ZFRjNDNycgd2lkdGg9JzI0MCcgaGVpZ2h0PScxNjAnLz48cGF0aCBkPSdNMTUgMzBMODUgNDVMMTQwIDM1TDIyMCA2MCcgc3Ryb2tlPScjRjU5RTBCJyBzdHJva2Utd2lkdGg9JzUnIGZpbGw9J25vbmUnIHN0cm9rZS1saW5lY2FwPSdyb3VuZCcvPjxwYXRoIGQ9J00yNSAxMzBMOTUgMTEwTDE1MCAxMjVMMjA1IDExNScgc3Ryb2tlPScjRDk3NzA2JyBzdHJva2Utd2lkdGg9JzQnIGZpbGw9J25vbmUnIHN0cm9rZS1saW5lY2FwPSdyb3VuZCcvPjxwb2x5Z29uIHBvaW50cz0nNjAsNjAgMTIwLDgwIDkwLDEyMCAzNSw5NScgZmlsbD0nI0ZDRDM0RCcgZmlsbC1vcGFjaXR5PScwLjU1JyBzdHJva2U9JyNGNTlFMEInIHN0cm9rZS13aWR0aD0nMycvPjxjaXJjbGUgY3g9JzE4MCcgY3k9JzgwJyByPScxMCcgZmlsbD0nI0I5MUMxQycvPjwvc3ZnPg==',
  surco:
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScyNDAnIGhlaWdodD0nMTYwJyB2aWV3Qm94PScwIDAgMjQwIDE2MCc+PHJlY3QgZmlsbD0nI0RDRkNFNycgd2lkdGg9JzI0MCcgaGVpZ2h0PScxNjAnLz48cGF0aCBkPSdNMjUgMzVMNzAgNjVMMTIwIDU1TDE5MCA3MCcgc3Ryb2tlPScjMjJDNTVFJyBzdHJva2Utd2lkdGg9JzUnIGZpbGw9J25vbmUnIHN0cm9rZS1saW5lY2FwPSdyb3VuZCcvPjxwYXRoIGQ9J00zNSAxNDBMMTIwIDEwMEwyMDAgMTMwJyBzdHJva2U9JyMxNTgwM0QnIHN0cm9rZS13aWR0aD0nNCcgZmlsbD0nbm9uZScgc3Ryb2tlLWxpbmVjYXA9J3JvdW5kJy8+PHBvbHlnb24gcG9pbnRzPSc5MCw0NSAxNTAsNjUgMTYwLDEwNSAxMTAsMTIwIDcwLDk1JyBmaWxsPScjODZFRkFDJyBmaWxsLW9wYWNpdHk9JzAuNicgc3Ryb2tlPScjMjJDNTVFJyBzdHJva2Utd2lkdGg9JzMnLz48Y2lyY2xlIGN4PSc3MCcgY3k9Jzk1JyByPSc5JyBmaWxsPScjMDQ3ODU3Jy8+PC9zdmc+',
};
const JobEntry = () => {
  const { t } = useLanguage();
  
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
      cost: 0,
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
      },
      {
        id: 'notary-callao',
        name: 'Notaría Callao Express',
        zone: 'Callao y Aeropuerto',
        coverageAreas: 'Callao, Bellavista, La Perla',
        responseTime: '60 min',
        availability: 'Cobertura 24/7 para urgencias',
        mapImage: MAP_PREVIEWS.callao,
      },
      {
        id: 'notary-surco',
        name: 'Notaría Surco Verde',
        zone: 'Surco - San Borja',
        coverageAreas: 'Surco, San Borja, Miraflores',
        responseTime: '90 min',
        availability: 'Rondas vespertinas y nocturnas',
        mapImage: MAP_PREVIEWS.surco,
      },
    ],
    []
  );

  const [primaryNotary, setPrimaryNotary] = useState(notaryOptions[0]?.id || '');
  const [secondaryNotary, setSecondaryNotary] = useState(notaryOptions[1]?.id || notaryOptions[0]?.id || '');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCertificationModal, setShowCertificationModal] = useState(false);

  const handleSenderChange = (e) => {
    setSender({
      ...sender,
      [e.target.name]: e.target.value,
    });
  };

  const handleRecipientChange = (id, field, value) => {
    setRecipients(recipients.map(r => 
      r.id === id ? { ...r, [field]: value } : r
    ));
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
    setRecipients([
      ...recipients,
      {
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
        cost: 0,
      },
    ]);
  };

  const removeRecipient = (id) => {
    if (recipients.length > 1) {
      setRecipients(recipients.filter(r => r.id !== id));
    }
  };

  const calculateTotal = () => {
    return recipients.reduce((sum, r) => sum + (parseFloat(r.cost) || 0), 0).toFixed(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Job Entry Data:', { sender, recipients, primaryNotary, secondaryNotary });
    setShowPaymentModal(true);
  };

  const handlePrimarySelect = (id) => {
    setPrimaryNotary(id);
    if (id === secondaryNotary) {
      const fallback = notaryOptions.find((option) => option.id !== id)?.id || id;
      setSecondaryNotary(fallback);
    }
  };

  const handleSecondarySelect = (id) => {
    if (id === primaryNotary) {
      alert(t('jobEntry.secondaryMustDiffer'));
      return;
    }
    setSecondaryNotary(id);
  };

  const handleConfirmPayment = () => {
    setShowPaymentModal(false);
    setShowCertificationModal(true);
  };

  const handleCloseCertification = () => {
    setShowCertificationModal(false);
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

        {/* Recipients Grid with Map */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Recipients Table */}
          <div className="lg:col-span-2 space-y-4 overflow-hidden">
            {/* Mobile/Tablet: Horizontal scroll for table */}
            <div className="bg-white rounded-xl shadow-sm border-2 border-gray-300 overflow-x-auto -mx-4 sm:mx-0">
              <table className="w-full border-collapse">
                <thead className="bg-blue-500 border-b-2 border-gray-300">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-bold text-white border-r-2 border-blue-400"></th>
                    {recipients.map((recipient, index) => (
                      <th key={recipient.id} className="px-4 py-3 text-center text-sm font-bold text-white uppercase min-w-[220px] border-r-2 border-blue-400">
                        {t('jobEntry.recipient')} {index + 1}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-gray-300">
                  {/* Recipient Name */}
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50 border-r-2 border-gray-300">{t('jobEntry.recipientName')}</td>
                    {recipients.map(recipient => (
                      <td key={`name-${recipient.id}`} className="px-4 py-3 border-r-2 border-gray-300">
                        <input
                          type="text"
                          value={recipient.name}
                          onChange={(e) => handleRecipientChange(recipient.id, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                          placeholder="Nombre completo"
                          required
                        />
                      </td>
                    ))}
                  </tr>

                  {/* Street and Number */}
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50 border-r-2 border-gray-300">{t('jobEntry.streetNumber')}</td>
                    {recipients.map(recipient => (
                      <td key={`street-${recipient.id}`} className="px-4 py-3 border-r-2 border-gray-300">
                        <input
                          type="text"
                          value={recipient.street}
                          onChange={(e) => handleRecipientChange(recipient.id, 'street', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                          placeholder="Calle y número"
                          required
                        />
                      </td>
                    ))}
                  </tr>

                  {/* MZNA, LOTE, URB. */}
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50 border-r-2 border-gray-300">MZNA, LOTE, URB.</td>
                    {recipients.map(recipient => (
                      <td key={`mzna-${recipient.id}`} className="px-4 py-3 border-r-2 border-gray-300">
                        <input
                          type="text"
                          value={recipient.mznaLoteUrb}
                          onChange={(e) => handleRecipientChange(recipient.id, 'mznaLoteUrb', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                          placeholder="Manzana, Lote, Urbanización"
                        />
                      </td>
                    ))}
                  </tr>

                  {/* District */}
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50 border-r-2 border-gray-300">{t('jobEntry.district')}</td>
                    {recipients.map(recipient => (
                      <td key={`district-${recipient.id}`} className="px-4 py-3 border-r-2 border-gray-300">
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
                    ))}
                  </tr>

                  {/* Province */}
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50 border-r-2 border-gray-300">{t('jobEntry.province')}</td>
                    {recipients.map(recipient => (
                      <td key={`province-${recipient.id}`} className="px-4 py-3 border-r-2 border-gray-300">
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
                    ))}
                  </tr>

                  {/* Department */}
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50 border-r-2 border-gray-300">{t('jobEntry.department')}</td>
                    {recipients.map(recipient => (
                      <td key={`department-${recipient.id}`} className="px-4 py-3 border-r-2 border-gray-300">
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
                    ))}
                  </tr>

                  {/* Delivery Method - STANDARD/RÁPIDO/URGENTE */}
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50 border-r-2 border-gray-300">{t('jobEntry.deliveryMethod')}</td>
                    {recipients.map(recipient => (
                      <td key={`delivery-${recipient.id}`} className="px-4 py-3 border-r-2 border-gray-300">
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
                    ))}
                  </tr>

                  {/* Pickup Method - Now RECIBO DE CARGO */}
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50 border-r-2 border-gray-300">{t('jobEntry.pickupMethod')}</td>
                    {recipients.map(recipient => (
                      <td key={`pickup-${recipient.id}`} className="px-4 py-3 border-r-2 border-gray-300">
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
                    ))}
                  </tr>

                  {/* Leave at Door */}
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50 border-r-2 border-gray-300">{t('jobEntry.leaveAtDoor')}</td>
                    {recipients.map(recipient => (
                      <td key={`door-${recipient.id}`} className="px-4 py-3 text-center border-r-2 border-gray-300">
                        <input
                          type="checkbox"
                          checked={recipient.leaveAtDoor}
                          onChange={(e) => handleRecipientChange(recipient.id, 'leaveAtDoor', e.target.checked)}
                          className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                      </td>
                    ))}
                  </tr>

                  {/* Corresponding Agent */}
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50 border-r-2 border-gray-300">{t('jobEntry.correspondingAgent')}</td>
                    {recipients.map(recipient => (
                      <td key={`agent-${recipient.id}`} className="px-4 py-3 border-r-2 border-gray-300">
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
                    ))}
                  </tr>

                  {/* Upload PDF */}
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50 border-r-2 border-gray-300">{t('jobEntry.uploadPDF')}</td>
                    {recipients.map(recipient => (
                      <td key={`pdf-${recipient.id}`} className="px-4 py-3 border-r-2 border-gray-300">
                        <div className="flex flex-col gap-2">
                          {/* File Upload Button */}
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
                    ))}
                  </tr>

                  {/* Cost */}
                  <tr>
                    <td className="px-4 py-3 text-sm font-bold text-gray-900 bg-gray-50 border-r-2 border-gray-300">{t('jobEntry.cost')}</td>
                    {recipients.map(recipient => (
                      <td key={`cost-${recipient.id}`} className="px-4 py-3 border-r-2 border-gray-300">
                        <input
                          type="number"
                          step="0.01"
                          value={recipient.cost}
                          onChange={(e) => handleRecipientChange(recipient.id, 'cost', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                          placeholder="0.00"
                        />
                      </td>
                    ))}
                  </tr>

                  {/* Remove Button */}
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50 border-r-2 border-gray-300"></td>
                    {recipients.map(recipient => (
                      <td key={`remove-${recipient.id}`} className="px-4 py-3 text-center border-r-2 border-gray-300">
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
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Add Recipient Button */}
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

          {/* Map - Service Zones */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:sticky sm:top-6">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4">{t('jobEntry.serviceZones') || 'Zonas de Servicio'}</h3>
              <div className="h-64 sm:h-80 lg:h-96 bg-gray-100 rounded-lg overflow-hidden">
                <ServiceZoneMap
                  value=""
                  onChange={() => {}}
                />
              </div>
              <div className="mt-4 space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>Radio de Autonomía</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Agente más Cercano Fuera de Red</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Agente más Cercano En Red</span>
                </div>
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
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 uppercase">
                {t('jobEntry.primaryLabel')}
              </span>
              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 uppercase">
                {t('jobEntry.secondaryLabel')}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            {notaryOptions.map((notary) => {
              const isPrimary = primaryNotary === notary.id;
              const isSecondary = secondaryNotary === notary.id;
              return (
                <div
                  key={notary.id}
                  className={`border-2 rounded-xl p-4 sm:p-5 transition shadow-sm ${
                    isPrimary
                      ? 'border-green-500 shadow-lg'
                      : isSecondary
                        ? 'border-blue-400 shadow-md'
                        : 'border-gray-200'
                  }`}
                >
                  <img
                    src={notary.mapImage}
                    alt={`Mapa de cobertura de ${notary.name}`}
                    className="w-full h-36 sm:h-40 object-cover rounded-lg mb-4 border border-gray-200"
                  />
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{notary.name}</h3>
                      <p className="text-sm text-gray-500">{t('jobEntry.zoneLabel', { zone: notary.zone })}</p>
                    </div>
                    <div className="space-y-1 text-right">
                      {isPrimary && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {t('jobEntry.selectedPrimary')}
                        </span>
                      )}
                      {isSecondary && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {t('jobEntry.selectedSecondary')}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 space-y-2 text-sm text-gray-600">
                    <p className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.242a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {t('jobEntry.coverageAreas', { areas: notary.coverageAreas })}
                    </p>
                    <p className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {t('jobEntry.responseTime', { response: notary.responseTime })}
                    </p>
                    <p className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0-.552.895-1 2-1s2 .448 2 1-.895 1-2 1-2 .448-2 1 .895 1 2 1 2-.448 2-1" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8z" />
                      </svg>
                      {t('jobEntry.availability', { availability: notary.availability })}
                    </p>
                  </div>

                  <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handlePrimarySelect(notary.id)}
                      className={`px-4 py-2 rounded-lg font-semibold transition shadow-sm ${
                        isPrimary
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-green-50 text-green-700 hover:bg-green-100'
                      }`}
                    >
                      {isPrimary ? t('jobEntry.selectedPrimary') : t('jobEntry.selectAsPrimary')}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSecondarySelect(notary.id)}
                      className={`px-4 py-2 rounded-lg font-semibold transition shadow-sm ${
                        isSecondary
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                      }`}
                    >
                      {isSecondary ? t('jobEntry.selectedSecondary') : t('jobEntry.selectAsSecondary')}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-gray-500">
            {t('jobEntry.notarySelectionNote')}
          </p>
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
                  {notaryOptions.find((option) => option.id === primaryNotary)?.name}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span className="font-medium text-gray-700 uppercase">{t('jobEntry.secondaryLabel')}</span>
                <span className="font-semibold text-gray-900">
                  {notaryOptions.find((option) => option.id === secondaryNotary)?.name}
                </span>
              </div>
              <div className="flex items-center justify-between pt-3 mt-2 border-t border-dashed border-gray-200">
                <span className="text-base font-semibold text-gray-900">{t('jobEntry.totalToCharge')}</span>
                <span className="text-2xl font-bold text-blue-600">S/. {calculateTotal()}</span>
              </div>
            </div>

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

            <button
              type="button"
              onClick={handleCloseCertification}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 text-sm font-semibold text-white hover:bg-green-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {t('jobEntry.certificationClose')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobEntry;

