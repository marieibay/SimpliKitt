import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import FileUpload from '../../components/FileUpload';
import { trackEvent } from '../../analytics';

const CsvToXlsxConverter: React.FC = () => {
  const [xlsxBlob, setXlsxBlob] = useState<Blob | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFile = async (file: File) => {
    setIsProcessing(true);
    setError(null);
    setXlsxBlob(null);
    setFileName(file.name.replace(/\.[^/.]+$/, "") + '.xlsx');

    try {
      const text = await file.text();
      // Simple parsing: split by lines, then by commas
      // For more complex CSVs, a dedicated parser would be better
      const data = text.split('\n').map(row => row.split(','));
      
      const ws = XLSX.utils.aoa_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([wbout], {type: 'application/octet-stream'});
      setXlsxBlob(blob);
    } catch (err) {
      setError('Failed to process the CSV file. Please ensure it is a valid file.');
      console.error(err);
    }
    setIsProcessing(false);
  };
  
  const handleDownload = () => {
    if (!xlsxBlob) return;
    trackEvent('file_converted_downloaded', { from: 'csv', to: 'xlsx', fileName });
    const link = document.createElement('a');
    if (link.href) {
      URL.revokeObjectURL(link.href);
    }
    link.href = URL.createObjectURL(xlsxBlob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
  const handleReset = () => {
    setXlsxBlob(null);
    setFileName('');
    setError(null);
  }

  return (
    <div className="space-y-6">
      {!xlsxBlob && !isProcessing && (
        <FileUpload 
            onFileUpload={handleFile} 
            acceptedMimeTypes={['text/csv']}
            title="Upload a CSV file"
        />
      )}
      
      {isProcessing && (
        <div className="text-center p-8 border-2 border-dashed rounded-lg">
            <p className="text-lg font-semibold text-gray-700">Processing your file...</p>
        </div>
      )}

      {error && (
        <div className="text-center p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            <p>{error}</p>
            <button onClick={handleReset} className="mt-2 text-sm text-blue-600 hover:underline">Try again</button>
        </div>
      )}

      {xlsxBlob && (
        <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold">Conversion Successful!</h3>
            <p className="text-gray-600">Your CSV file has been converted to XLSX.</p>
            <div className="flex justify-center gap-4">
                <button 
                    onClick={handleDownload}
                    className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
                >
                    Download XLSX
                </button>
                 <button 
                    onClick={handleReset}
                    className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition"
                >
                    Convert Another File
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default CsvToXlsxConverter;
