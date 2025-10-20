import React, { useState, useEffect } from 'react';
import { trackEvent } from '../../analytics';

const UuidGuidGenerator: React.FC = () => {
  const [uuid, setUuid] = useState('');
  const [copied, setCopied] = useState(false);

  const generateUuid = () => {
    // crypto.randomUUID() is a modern, secure way to generate UUIDs
    if (crypto.randomUUID) {
      setUuid(crypto.randomUUID());
    } else {
      // Fallback for older browsers
      setUuid('xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0,
              v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      }));
    }
  };

  useEffect(() => {
    generateUuid();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(uuid);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleGenerateClick = () => {
      generateUuid();
      trackEvent('uuid_generated');
  }

  return (
    <div className="max-w-xl mx-auto space-y-6 text-center">
      <div>
        <label htmlFor="uuid-output" className="block text-sm font-medium text-gray-700 mb-2">
          Generated UUID/GUID
        </label>
        <div className="relative">
          <input
            id="uuid-output"
            type="text"
            readOnly
            className="w-full p-4 text-center border border-gray-300 rounded-lg bg-gray-50 font-mono text-lg"
            value={uuid}
          />
        </div>
      </div>
      
      <div className="flex justify-center gap-4">
        <button
          onClick={handleGenerateClick}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          Generate New UUID
        </button>
        <button
          onClick={handleCopy}
          className="px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition"
        >
          {copied ? 'Copied!' : 'Copy to Clipboard'}
        </button>
      </div>
    </div>
  );
};

export default UuidGuidGenerator;
