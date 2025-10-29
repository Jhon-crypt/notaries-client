import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import ServiceZoneMap from '../components/maps/ServiceZoneMap';

const JobEntry = () => {
  const { t } = useLanguage();
  
  const [sender, setSender] = useState({
    dni: '',
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
    console.log('Job Entry Data:', { sender, recipients });
    alert('Job submitted! (Demo - not connected to backend)');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          {t('jobEntry.title')}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Sender Information */}
        <div className="bg-white rounded-xl shadow-sm border-2 border-gray-300 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 uppercase">{t('jobEntry.sender')}</h2>
          
          <div className="space-y-4">
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recipients Table */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl shadow-sm border-2 border-gray-300 overflow-x-auto">
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

                  {/* Delivery Method */}
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50 border-r-2 border-gray-300">{t('jobEntry.deliveryMethod')}</td>
                    {recipients.map(recipient => (
                      <td key={`delivery-${recipient.id}`} className="px-4 py-3 border-r-2 border-gray-300">
                        <select
                          value={recipient.deliveryMethod}
                          onChange={(e) => handleRecipientChange(recipient.id, 'deliveryMethod', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm bg-gray-100"
                          required
                        >
                          <option value="">Seleccionar</option>
                          <option value="home">Domicilio</option>
                          <option value="office">Oficina</option>
                          <option value="pickup">Recoger</option>
                        </select>
                      </td>
                    ))}
                  </tr>

                  {/* Pickup Method */}
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
                          <option value="agent">Agente</option>
                          <option value="direct">Directo</option>
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
                        <label className="block">
                          <input
                            type="file"
                            accept=".pdf,application/pdf"
                            onChange={(e) => handleFileUpload(recipient.id, e.target.files[0])}
                            className="hidden"
                          />
                          <div className="px-4 py-2 bg-gray-500 text-white rounded-lg text-center cursor-pointer hover:bg-gray-600 transition-colors text-sm font-medium">
                            {t('jobEntry.uploadPDF')}
                          </div>
                        </label>
                        {recipient.pdfFile && (
                          <p className="text-xs text-green-600 mt-1 truncate">{recipient.pdfFile.name}</p>
                        )}
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sticky top-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">{t('jobEntry.serviceZones') || 'Zonas de Servicio'}</h3>
              <div className="h-96 bg-gray-100 rounded-lg overflow-hidden">
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

        {/* Total and Payment */}
        <div className="bg-white rounded-xl shadow-sm border-2 border-gray-300 p-6">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-gray-900">
              {t('jobEntry.total')} S/. {calculateTotal()}
            </div>
            <button
              type="submit"
              className="px-16 py-4 bg-blue-600 text-white text-2xl font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg uppercase"
            >
              {t('jobEntry.pay')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default JobEntry;

