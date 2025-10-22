import React, { useState } from 'react';
import { trackEvent, trackGtagEvent } from '../../analytics';

const UrlEncoderDecoder: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const handleEncode = () => {
    setError('');
    setOutput(encodeURIComponent(input));
    if (input) {
      trackEvent('url_encoded');
      trackGtagEvent('tool_used', {
        event_category: 'Web & Developer Tools',
        event_label: 'URL Encoder/Decoder',
        tool_name: 'url-encoderdecoder',
        is_download: false,
        action: 'encode',
      });
    }
  };
  
  const handleDecode = () => {
    try {
      setError('');
      setOutput(decodeURIComponent(input));
      if (input) {
        trackEvent('url_decoded');
        trackGtagEvent('tool_used', {
          event_category: 'Web & Developer Tools',
          event_label: 'URL Encoder/Decoder',
          tool_name: 'url-encoderdecoder',
          is_download: false,
          action: 'decode',
        });
      }
    } catch (e) {
      setError('Invalid URI component to decode.');
      setOutput('');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="input-text" className="block text-sm font-medium text-gray-700 mb-1">
          Input
        </label>
        <textarea
          id="input-text"
          rows={6}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
          placeholder="Enter a string to encode or decode"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>
      
      <div className="flex flex-wrap gap-3">
        <button onClick={handleEncode} className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">Encode</button>
        <button onClick={handleDecode} className="px-5 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition">Decode</button>
      </div>

      <div>
        <label htmlFor="output-text" className="block text-sm font-medium text-gray-700 mb-1">
          Output
        </label>
        <div className="relative">
          <textarea
            id="output-text"
            rows={6}
            readOnly
            className={`w-full p-3 border rounded-lg bg-gray-50 transition ${error ? 'border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`}
            placeholder="Result will appear here..."
            value={output}
          />
          {output && !error && (
            <button onClick={handleCopy} className="absolute top-2 right-2 px-3 py-1 bg-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-300">
              {copied ? 'Copied!' : 'Copy'}
            </button>
          )}
        </div>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
};

export default UrlEncoderDecoder;