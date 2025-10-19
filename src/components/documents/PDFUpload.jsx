import { useState, useRef } from 'react';

const PDFUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [certification, setCertification] = useState({
    isTrueCopy: false,
    originalDocumentType: '',
    notes: ''
  });
  const fileInputRef = useRef(null);

  const validatePDF = (file) => {
    // Check if file is PDF
    if (file.type !== 'application/pdf') {
      setError('Only PDF files are allowed');
      return false;
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setError('File size must be less than 10MB');
      return false;
    }

    setError('');
    return true;
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOut = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      if (validatePDF(selectedFile)) {
        setFile(selectedFile);
      }
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && validatePDF(selectedFile)) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a PDF file');
      return;
    }

    if (!certification.isTrueCopy) {
      setError('Please certify that this is a true copy of the original');
      return;
    }

    if (!certification.originalDocumentType) {
      setError('Please specify the original document type');
      return;
    }

    setUploading(true);
    setError('');

    // Simulate upload delay
    setTimeout(() => {
      // TODO: Implement actual file upload to server
      console.log('Uploading file:', {
        file: file.name,
        size: file.size,
        certification
      });

      setUploading(false);
      if (onUploadSuccess) {
        onUploadSuccess({
          name: file.name,
          size: file.size,
          uploadDate: new Date().toISOString(),
          certification
        });
      }

      // Reset form
      setFile(null);
      setCertification({
        isTrueCopy: false,
        originalDocumentType: '',
        notes: ''
      });
    }, 2000);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Drag & Drop Zone */}
      <div
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 transition-all ${
          isDragging
            ? 'border-green-500 bg-green-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <div className="flex flex-col items-center gap-4">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
            file ? 'bg-green-100' : 'bg-gray-100'
          }`}>
            {file ? (
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            )}
          </div>

          {file ? (
            <div className="text-center">
              <p className="text-sm font-medium text-gray-900">{file.name}</p>
              <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
              <button
                type="button"
                onClick={() => setFile(null)}
                className="mt-2 text-sm text-red-600 hover:text-red-700"
              >
                Remove file
              </button>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-gray-700 font-medium mb-1">
                Drag and drop your PDF here
              </p>
              <p className="text-sm text-gray-500 mb-4">
                or click to browse
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm"
              >
                Select PDF File
              </button>
              <p className="text-xs text-gray-400 mt-2">
                Maximum file size: 10MB • PDF only
              </p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </div>

      {/* Certification Form */}
      {file && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 space-y-4">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-yellow-900 mb-4">Notary Certification Required</h3>
              
              {/* True Copy Certification */}
              <div className="flex items-start mb-4">
                <input
                  type="checkbox"
                  id="trueCopy"
                  checked={certification.isTrueCopy}
                  onChange={(e) => setCertification({...certification, isTrueCopy: e.target.checked})}
                  className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500 mt-0.5"
                />
                <label htmlFor="trueCopy" className="ml-3 text-sm text-gray-700">
                  <span className="font-semibold">I hereby certify</span> that this PDF document is a true, accurate, and complete copy of the original document presented to me, and that I have verified its authenticity as a licensed notary public.
                </label>
              </div>

              {/* Original Document Type */}
              <div className="mb-4">
                <label htmlFor="docType" className="block text-sm font-medium text-gray-700 mb-2">
                  Original Document Type *
                </label>
                <select
                  id="docType"
                  value={certification.originalDocumentType}
                  onChange={(e) => setCertification({...certification, originalDocumentType: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                >
                  <option value="">Select document type</option>
                  <option value="Contract">Contract / Agreement</option>
                  <option value="Deed">Property Deed</option>
                  <option value="Will">Last Will and Testament</option>
                  <option value="Power of Attorney">Power of Attorney</option>
                  <option value="Affidavit">Affidavit</option>
                  <option value="Birth Certificate">Birth Certificate</option>
                  <option value="Marriage Certificate">Marriage Certificate</option>
                  <option value="Other">Other Legal Document</option>
                </select>
              </div>

              {/* Additional Notes */}
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  rows="3"
                  value={certification.notes}
                  onChange={(e) => setCertification({...certification, notes: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  placeholder="Any additional information about the document or certification..."
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Upload Button */}
      {file && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading & Validating...
            </span>
          ) : (
            'Upload & Certify Document'
          )}
        </button>
      )}
    </div>
  );
};

export default PDFUpload;

