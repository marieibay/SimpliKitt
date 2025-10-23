import React, { useState, useEffect, useRef } from 'react';
import { trackEvent, trackGtagEvent } from '../../analytics';

const Sha256HashGenerator: React.FC = () => {
  const [input, setInput] = useState('');
  const [hash, setHash] = useState('');
  const [copied, setCopied] = useState(false);
  const hasTrackedRef = useRef(false);

  useEffect(() => {
    const generateHash = async () => {
      if (input === '') {
        setHash('');
        hasTrackedRef.current = false;
        return;
      }
      try {
        const encoder = new TextEncoder();
        const data = encoder.encode(input);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        setHash(hashHex);
        if (!hasTrackedRef.current) {
            trackEvent('hash_generated');
            trackGtagEvent('tool_used', {
              event_category: 'Web & Developer Tools',
              event_label: 'SHA-256 Hash Generator',
              tool_name: 'sha-256-hash-generator',
            });
            hasTrackedRef.current = true;
        }
      } catch (error) {
        console.error('Hashing failed:', error);
        setHash('Error generating hash');
      }
    };

    generateHash();
  }, [input]);

  const handleCopy = () => {
    navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="input-text" className="block text-sm font-medium text-gray-700 mb-1">
          Input Text
        </label>
        <textarea
          id="input-text"
          rows={8}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
          placeholder="Enter text to generate SHA-256 hash..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>
      
      <div>
        <label htmlFor="output-hash" className="block text-sm font-medium text-gray-700 mb-1">
          SHA-256 Hash
        </label>
        <div className="relative">
          <textarea
            id="output-hash"
            rows={3}
            readOnly
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
            placeholder="Hash will be generated automatically..."
            value={hash}
          />
          {hash && (
            <button 
              onClick={handleCopy}
              className="absolute top-2 right-2 px-3 py-1 bg-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-300"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sha256HashGenerator;