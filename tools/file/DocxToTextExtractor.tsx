import React, { useState } from 'react';
import FileUpload from '../../components/FileUpload';
import { trackEvent } from '../../analytics';

declare global {
  interface Window {
    mammoth: any;
  }
}

const DocxToTextExtractor: React.FC = () => {
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleFile = async (file: File) => {
    if (!window.mammoth) {
      setError("Text extraction library (mammoth.js) is not available. Please refresh the page.");
      return;
    }
    setIsProcessing(true);
    setError(null);
    setExtractedText(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await window.mammoth.extractRawText({ arrayBuffer });
      setExtractedText(result.value);
      trackEvent('docx_text_extracted', { characterCount: result.value.length });
    } catch (err) {
      setError("Failed to extract text. The file might be corrupted, encrypted, or not a valid .docx file.");
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = () => {
    if (!extractedText) return;
    navigator.clipboard.writeText(extractedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleReset = () => {
      setExtractedText(null);
      setError(null);
  }

  return (
    <div className="space-y-6">
      {extractedText === null && !isProcessing && (
        <FileUpload
          onFileUpload={handleFile}
          acceptedMimeTypes={['application/vnd.openxmlformats-officedocument.wordprocessingml.document']}
          title="Upload a DOCX file to extract text"
        />
      )}

      {isProcessing && (
        <div className="text-center p-8 border-2 border-dashed rounded-lg">
          <p className="text-lg font-semibold text-gray-700">Extracting text...</p>
        </div>
      )}

      {error && (
        <div className="text-center p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          <p>{error}</p>
          <button onClick={handleReset} className="mt-2 text-sm text-blue-600 hover:underline">Try again</button>
        </div>
      )}

      {extractedText !== null && (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Extracted Text</h3>
            <div className="relative">
                <textarea
                    readOnly
                    rows={12}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
                    value={extractedText}
                />
                <button onClick={handleCopy} className="absolute top-2 right-2 px-3 py-1 bg-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-300">
                    {copied ? 'Copied!' : 'Copy'}
                </button>
            </div>
            <button onClick={handleReset} className="text-sm text-blue-600 hover:underline">
                Extract from another file
            </button>
        </div>
      )}
    </div>
  );
};

export default DocxToTextExtractor;