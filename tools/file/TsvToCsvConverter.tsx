import React, { useState } from 'react';
import FileUpload from '../../components/FileUpload';
import { trackEvent } from '../../analytics';

const TsvToCsvConverter: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [csvContent, setCsvContent] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (selectedFile: File) => {
    setFile(selectedFile);
    setCsvContent(null);
    setError(null);
  };

  const handleConvert = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }
    setIsProcessing(true);
    setError(null);

    try {
      const text = await file.text();
      const csv = text.replace(/\t/g, ',');
      setCsvContent(csv);
      trackEvent('file_converted', { from: 'tsv', to: 'csv' });
    } catch (err) {
      setError("Failed to read the file.");
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!csvContent || !file) return;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = file.name.replace(/\.[^/.]+$/, "") + '.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setFile(null);
    setCsvContent(null);
    setError(null);
    setIsProcessing(false);
  };

  if (isProcessing) {
    return (
      <div className="text-center p-8 border-2 border-dashed rounded-lg">
        <p className="text-lg font-semibold text-gray-700">Converting...</p>
      </div>
    );
  }
  
  if (csvContent) {
    return (
      <div className="text-center space-y-4">
        <h3 className="text-xl font-semibold">Conversion Successful!</h3>
        <p className="text-gray-600">Your TSV file is ready to be downloaded as a CSV.</p>
        <div className="flex justify-center gap-4">
          <button onClick={handleDownload} className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition">
            Download CSV
          </button>
          <button onClick={handleReset} className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition">
            Convert Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!file ? (
        <FileUpload 
          onFileUpload={handleFile} 
          acceptedMimeTypes={['text/tab-separated-values', 'text/plain']} 
          title="Upload a TSV or TXT file"
          description="Your tab-delimited file will be converted to comma-delimited."
        />
      ) : (
        <div className="text-center space-y-4">
          <p className="font-semibold">{file.name} selected.</p>
          <button onClick={handleConvert} className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
            Convert to CSV
          </button>
        </div>
      )}

      {error && (
        <div className="text-center p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default TsvToCsvConverter;
