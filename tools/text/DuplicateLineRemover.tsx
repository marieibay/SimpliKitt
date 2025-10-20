import React, { useState, useMemo } from 'react';
import { trackEvent } from '../../analytics';

const DuplicateLineRemover: React.FC = () => {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => {
    if (!input.trim()) {
      return '';
    }
    const lines = input.split('\n');
    
    // Case-insensitive duplicate removal, keeping first occurrence's casing
    const seen = new Set<string>();
    const uniqueLines: string[] = [];
    for (const line of lines) {
        const lowerLine = line.toLowerCase();
        if (!seen.has(lowerLine)) {
            seen.add(lowerLine);
            uniqueLines.push(line);
        }
    }
    return uniqueLines.join('\n');
  }, [input]);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    const originalLines = input.split('\n').length;
    const uniqueLines = output.split('\n').length;
    trackEvent('duplicate_lines_removed', { originalLines, uniqueLines, caseSensitive: false });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label htmlFor="input-text" className="block text-sm font-medium text-gray-700 mb-1">
          Input
        </label>
        <textarea
          id="input-text"
          rows={12}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
          placeholder="Paste your list here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="output-text" className="block text-sm font-medium text-gray-700 mb-1">
          Unique Lines
        </label>
        <div className="relative">
          <textarea
            id="output-text"
            rows={12}
            readOnly
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
            value={output}
          />
          {output && (
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

export default DuplicateLineRemover;