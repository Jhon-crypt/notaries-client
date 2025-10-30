import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ServiceZoneMap from '../../components/maps/ServiceZoneMap';

const Signup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Personal Information & Role
    fullName: '',
    email: '',
    phone: '',
    role: 'notary', // 'notary' or 'client'
    
    // Step 2: Notary Information (only for notaries)
    licenseNumber: '',
    licenseIssueDate: '',
    licenseExpirationDate: '',
    state: '',
    officeAddress: '',
    officeCity: '',
    officeState: '',
    officeZipCode: '',
    serviceZones: '',
    specialization: '',
    maxDailyWorkload: '10',
    
    // Step 3: Account Security
    password: '',
    confirmPassword: ''
  });
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Skip step 2 if user is a client (not notary)
    if (step === 1 && formData.role === 'client') {
      setStep(3);
    } else if (step < 3) {
      setStep(step + 1);
    } else {
      // TODO: Implement actual registration logic
      console.log('Registration attempt:', formData);
      // Set authentication flag and user role
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', formData.role);
      localStorage.setItem('userName', formData.fullName);
      localStorage.setItem('userEmail', formData.email);
      navigate('/dashboard');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleBack = () => {
    if (step === 3 && formData.role === 'client') {
      setStep(1);
    } else if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 py-8 sm:py-12">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">NotaryChain</h1>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h2>
          <p className="text-gray-600">Join our secure document delivery platform</p>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
          <div className="flex items-center justify-between mb-8">
            {/* Show only 2 steps for clients and admins, 3 steps for notaries */}
            {formData.role === 'notary' ? (
              // Three steps for notaries
              [1, 2, 3].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                      step >= stepNumber 
                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' 
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {step > stepNumber ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : stepNumber}
                    </div>
                    <span className={`text-xs mt-2 font-medium ${step >= stepNumber ? 'text-green-600' : 'text-gray-500'}`}>
                      {stepNumber === 1 && 'Personal'}
                      {stepNumber === 2 && 'Notary Info'}
                      {stepNumber === 3 && 'Security'}
                    </span>
                  </div>
                  {stepNumber < 3 && (
                    <div className={`flex-1 h-1 mx-2 rounded ${step > stepNumber ? 'bg-green-600' : 'bg-gray-200'}`}></div>
                  )}
                </div>
              ))
            ) : (
              // Two steps for clients
              [1, 3].map((stepNumber, index) => (
                <div key={stepNumber} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                      step >= stepNumber 
                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' 
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {step > stepNumber ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : index + 1}
                    </div>
                    <span className={`text-xs mt-2 font-medium ${step >= stepNumber ? 'text-green-600' : 'text-gray-500'}`}>
                      {stepNumber === 1 && 'Personal'}
                      {stepNumber === 3 && 'Security'}
                    </span>
                  </div>
                  {index < 1 && (
                    <div className={`flex-1 h-1 mx-2 rounded ${step > stepNumber ? 'bg-green-600' : 'bg-gray-200'}`}></div>
                  )}
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Personal Information & Role Selection */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                </div>

                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    I am registering as a *
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, role: 'notary'})}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        formData.role === 'notary'
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <svg className={`w-8 h-8 ${formData.role === 'notary' ? 'text-green-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <span className={`text-sm font-medium ${formData.role === 'notary' ? 'text-green-700' : 'text-gray-700'}`}>
                          Notary
                        </span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({...formData, role: 'client'})}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        formData.role === 'client'
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <svg className={`w-8 h-8 ${formData.role === 'client' ? 'text-green-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className={`text-sm font-medium ${formData.role === 'client' ? 'text-green-700' : 'text-gray-700'}`}>
                          Client
                        </span>
                      </div>
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="user@example.com"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="+1 (555) 123-4567"
                    required
                  />
                </div>
              </div>
            )}

            {/* Step 2: Notary Information (Only for Notaries) */}
            {step === 2 && formData.role === 'notary' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Notary Credentials & Service Information</h3>
                  <p className="text-sm text-gray-600">Provide your license details and office location</p>
                </div>

                {/* License Information Section */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <h4 className="text-sm font-semibold text-blue-900 mb-3">License Information</h4>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 mb-2">
                        Notary License Number *
                      </label>
                      <input
                        type="text"
                        id="licenseNumber"
                        name="licenseNumber"
                        value={formData.licenseNumber}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        placeholder="NOT-2024-001"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="licenseIssueDate" className="block text-sm font-medium text-gray-700 mb-2">
                          Issue Date *
                        </label>
                        <input
                          type="date"
                          id="licenseIssueDate"
                          name="licenseIssueDate"
                          value={formData.licenseIssueDate}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="licenseExpirationDate" className="block text-sm font-medium text-gray-700 mb-2">
                          Expiration Date *
                        </label>
                        <input
                          type="date"
                          id="licenseExpirationDate"
                          name="licenseExpirationDate"
                          value={formData.licenseExpirationDate}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                    Licensed State *
                  </label>
                  <select
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    required
                  >
                    <option value="">Select a state</option>
                    <option value="NY">New York</option>
                    <option value="CA">California</option>
                    <option value="TX">Texas</option>
                    <option value="FL">Florida</option>
                    <option value="IL">Illinois</option>
                    <option value="PA">Pennsylvania</option>
                    <option value="OH">Ohio</option>
                  </select>
                </div>

                {/* Office Address Section */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-green-900 mb-3">Office Address</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="officeAddress" className="block text-sm font-medium text-gray-700 mb-2">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        id="officeAddress"
                        name="officeAddress"
                        value={formData.officeAddress}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        placeholder="123 Main Street, Suite 100"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="officeCity" className="block text-sm font-medium text-gray-700 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          id="officeCity"
                          name="officeCity"
                          value={formData.officeCity}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                          placeholder="New York"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="officeState" className="block text-sm font-medium text-gray-700 mb-2">
                          State *
                        </label>
                        <select
                          id="officeState"
                          name="officeState"
                          value={formData.officeState}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                          required
                        >
                          <option value="">State</option>
                          <option value="NY">NY</option>
                          <option value="CA">CA</option>
                          <option value="TX">TX</option>
                          <option value="FL">FL</option>
                          <option value="IL">IL</option>
                          <option value="PA">PA</option>
                          <option value="OH">OH</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="officeZipCode" className="block text-sm font-medium text-gray-700 mb-2">
                          ZIP Code *
                        </label>
                        <input
                          type="text"
                          id="officeZipCode"
                          name="officeZipCode"
                          value={formData.officeZipCode}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                          placeholder="10001"
                          maxLength="10"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Service Zones with Map */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Zones * <span className="text-xs text-gray-500">(Draw on map)</span>
                  </label>
                  <ServiceZoneMap 
                    value={formData.serviceZones}
                    onChange={(zones) => setFormData({ ...formData, serviceZones: zones })}
                  />
                </div>

                <div>
                  <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-2">
                    Specialization *
                  </label>
                  <select
                    id="specialization"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    required
                  >
                    <option value="">Select specialization</option>
                    <option value="Real Estate">Real Estate</option>
                    <option value="Legal Documents">Legal Documents</option>
                    <option value="Corporate">Corporate</option>
                    <option value="Estate Planning">Estate Planning</option>
                    <option value="General">General Notary Services</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="maxDailyWorkload" className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Daily Workload *
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      id="maxDailyWorkload"
                      name="maxDailyWorkload"
                      min="1"
                      max="50"
                      value={formData.maxDailyWorkload}
                      onChange={handleChange}
                      className="flex-1"
                    />
                    <span className="w-20 px-3 py-2 bg-gray-100 rounded-lg text-center font-semibold text-gray-900">
                      {formData.maxDailyWorkload}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Maximum number of documents you can process per day</p>
                </div>

                {/* Service Zone Preview */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-blue-900 mb-1">Service Zone Mapping</h4>
                      <p className="text-xs text-blue-700">
                        After registration, you'll be able to define your service zones on an interactive map in your profile settings.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Account Security */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Security</h3>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="Create a strong password"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">At least 8 characters with numbers and special characters</p>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="Re-enter your password"
                    required
                  />
                </div>

                {/* Terms and Conditions */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 mt-1"
                      required
                    />
                    <label htmlFor="terms" className="ml-3 text-sm text-gray-600">
                      I agree to the{' '}
                      <a href="#" className="text-green-600 hover:text-green-700 font-medium">
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a href="#" className="text-green-600 hover:text-green-700 font-medium">
                        Privacy Policy
                      </a>
                      . I understand that my notary credentials will be verified before account activation.
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 pt-4">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                >
                  Back
                </button>
              )}
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-sm hover:shadow-md"
              >
                {step === 3 ? 'Create Account' : 'Continue'}
              </button>
            </div>
          </form>
        </div>

        {/* Sign In Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-green-600 hover:text-green-700 font-semibold">
              Sign in
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          © 2024 NotaryChain. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Signup;

