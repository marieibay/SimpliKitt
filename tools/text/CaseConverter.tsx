import React, { useState } from 'react';
import { trackEvent } from '../../analytics';

const CaseConverter: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const toSentenceCase = (str: string) => {
    return str.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
  };

  const toTitleCase = (str: string) => {
    return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const handleConvert = (type: string) => {
    let result = '';
    switch (type) {
      case 'uppercase':
        result = input.toUpperCase();
        break;
      case 'lowercase':
        result = input.toLowerCase();
        break;
      case 'sentencecase':
        result = toSentenceCase(input);
        break;
      case 'titlecase':
        result = toTitleCase(input);
        break;
    }
    setOutput(result);
    trackEvent('text_case_converted', { case_type: type });
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
          Input Text
        </label>
        <textarea
          id="input-text"
          rows={6}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
          placeholder="Paste or type your text here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>
      
      <div className="flex flex-wrap gap-3">
        <button onClick={() => handleConvert('uppercase')} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">UPPERCASE</button>
        <button onClick={() => handleConvert('lowercase')} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">lowercase</button>
        <button onClick={() => handleConvert('sentencecase')} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">Sentence case</button>
        <button onClick={() => handleConvert('titlecase')} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">Title Case</button>
      </div>

      <div>
        <label htmlFor="output-text" className="block text-sm font-medium text-gray-700 mb-1">
          Output Text
        </label>
        <div className="relative">
          <textarea
            id="output-text"
            rows={6}
            readOnly
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="Result will appear here..."
            value={output}
          />
          {output && (
            <button onClick={handleCopy} className="absolute top-2 right-2 px-3 py-1 bg-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-300">
              {copied ? 'Copied!' : 'Copy'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaseConverter;
