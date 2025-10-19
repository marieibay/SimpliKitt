
import React, { useState } from 'react';

const JsonFormatter: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFormat = () => {
    if (!input.trim()) {
      setError('Input JSON cannot be empty.');
      setOutput('');
      return;
    }
    try {
      const parsedJson = JSON.parse(input);
      const formattedJson = JSON.stringify(parsedJson, null, 2);
      setOutput(formattedJson);
      setError(null);
    } catch (e: any) {
      setError(`Invalid JSON: ${e.message}`);
      setOutput('');
    }
  };
  
  const handleMinify = () => {
    if (!input.trim()) {
      setError('Input JSON cannot be empty.');
      setOutput('');
      return;
    }
    try {
      const parsedJson = JSON.parse(input);
      const minifiedJson = JSON.stringify(parsedJson);
      setOutput(minifiedJson);
      setError(null);
    } catch (e: any) {
      setError(`Invalid JSON: ${e.message}`);
      setOutput('');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="input-json" className="block text-sm font-medium text-gray-700 mb-1">
            Input JSON
          </label>
          <textarea
            id="input-json"
            rows={15}
            className={`w-full p-3 border font-mono text-sm rounded-lg transition ${error ? 'border-red-400 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`}
            placeholder='{ "messy": "json", "goes": ["here"] }'
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={handleFormat} className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">Format</button>
          <button onClick={handleMinify} className="px-5 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition">Minify</button>
        </div>
        {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>}
      </div>
      
      <div>
        <label htmlFor="output-json" className="block text-sm font-medium text-gray-700 mb-1">
          Formatted JSON
        </label>
        <div className="relative">
          <pre className="h-[21.5rem] p-3 border border-gray-300 rounded-lg bg-gray-50 overflow-auto">
            <code className="text-sm font-mono whitespace-pre-wrap">{output || "Result will appear here..."}</code>
          </pre>
          {output && !error && (
            <button onClick={handleCopy} className="absolute top-2 right-2 px-3 py-1 bg-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-300">
              {copied ? 'Copied!' : 'Copy'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default JsonFormatter;
