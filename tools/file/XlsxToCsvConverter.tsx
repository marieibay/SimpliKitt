import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import FileUpload from '../../components/FileUpload';

const XlsxToCsvConverter: React.FC = () => {
  const [csvData, setCsvData] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFile = async (file: File) => {
    setIsProcessing(true);
    setError(null);
    setCsvData(null);
    setFileName(file.name.replace(/\.[^/.]+$/, "") + '.csv');

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const csv = XLSX.utils.sheet_to_csv(worksheet);
      setCsvData(csv);
    } catch (err) {
      setError('Failed to process the XLSX file. Please ensure it is a valid file.');
      console.error(err);
    }
    setIsProcessing(false);
  };
  
  const handleDownload = () => {
    if (!csvData) return;
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.href) {
      URL.revokeObjectURL(link.href);
    }
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
  const handleReset = () => {
    setCsvData(null);
    setFileName('');
    setError(null);
  }

  return (
    <div className="space-y-6">
      {!csvData && !isProcessing && (
        <FileUpload 
            onFileUpload={handleFile} 
            acceptedMimeTypes={['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']}
            title="Upload an Excel (.xlsx) file"
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

      {csvData && (
        <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold">Conversion Successful!</h3>
            <p className="text-gray-600">Your XLSX file has been converted to CSV.</p>
            <div className="flex justify-center gap-4">
                <button 
                    onClick={handleDownload}
                    className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
                >
                    Download CSV
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

export default XlsxToCsvConverter;
