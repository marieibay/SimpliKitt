
import React, { useState, useEffect } from 'react';

const LOREM_IPSUM_PARAGRAPH = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;

const LoremIpsumGenerator: React.FC = () => {
  const [numParagraphs, setNumParagraphs] = useState(3);
  const [generatedText, setGeneratedText] = useState('');
  const [copied, setCopied] = useState(false);

  const generateText = () => {
    if (numParagraphs > 0) {
      const paragraphs = Array.from({ length: numParagraphs }, () => LOREM_IPSUM_PARAGRAPH);
      setGeneratedText(paragraphs.join('\n\n'));
    } else {
      setGeneratedText('');
    }
  };
  
  useEffect(() => {
      generateText();
  }, []);

  const handleGenerate = () => {
    generateText();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <label htmlFor="num-paragraphs" className="text-sm font-medium text-gray-700">
          Number of Paragraphs:
        </label>
        <input
          type="number"
          id="num-paragraphs"
          min="1"
          max="50"
          value={numParagraphs}
          onChange={(e) => setNumParagraphs(parseInt(e.target.value, 10))}
          className="w-24 p-2 border border-gray-300 rounded-lg"
        />
        <button
          onClick={handleGenerate}
          className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          Generate
        </button>
      </div>
      
      <div>
        <label htmlFor="output-text" className="block text-sm font-medium text-gray-700 mb-1">
          Generated Text
        </label>
        <div className="relative">
          <textarea
            id="output-text"
            rows={12}
            readOnly
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
            value={generatedText}
          />
          {generatedText && (
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

export default LoremIpsumGenerator;
