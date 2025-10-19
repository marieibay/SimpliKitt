import React, { useState } from 'react';
import FileUpload from '../../components/FileUpload';

const FileChecksumCalculator: React.FC = () => {
  const [checksum, setChecksum] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleFile = async (file: File) => {
    setIsProcessing(true);
    setError(null);
    setChecksum(null);
    setFileName(file.name);

    try {
      const buffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      setChecksum(hashHex);
    } catch (err) {
      setError('Failed to calculate checksum.');
      console.error(err);
    }
    setIsProcessing(false);
  };
  
  const handleCopy = () => {
    if (!checksum) return;
    navigator.clipboard.writeText(checksum);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setChecksum(null);
    setFileName('');
    setError(null);
  }

  return (
    <div className="space-y-6">
      {!checksum && !isProcessing && (
        <FileUpload 
            onFileUpload={handleFile} 
            acceptedMimeTypes={[]} // Accept all files
            title="Upload a file to calculate its SHA-256 checksum"
            description="All file types are accepted"
        />
      )}
      
      {isProcessing && (
        <div className="text-center p-8 border-2 border-dashed rounded-lg">
            <p className="text-lg font-semibold text-gray-700">Calculating checksum...</p>
        </div>
      )}

      {error && (
        <div className="text-center p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            <p>{error}</p>
            <button onClick={handleReset} className="mt-2 text-sm text-blue-600 hover:underline">Try again</button>
        </div>
      )}
      
      {checksum && (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Checksum for: <span className="font-normal text-gray-600">{fileName}</span></h3>
            <div className="relative">
                <textarea
                    readOnly
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
                    value={checksum}
                />
                 <button onClick={handleCopy} className="absolute top-2 right-2 px-3 py-1 bg-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-300">
                    {copied ? 'Copied!' : 'Copy'}
                </button>
            </div>
             <button onClick={handleReset} className="text-sm text-blue-600 hover:underline">
                Calculate for another file
            </button>
        </div>
      )}
    </div>
  );
};

export default FileChecksumCalculator;
