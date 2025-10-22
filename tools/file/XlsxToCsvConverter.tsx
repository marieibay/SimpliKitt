
import React, { useState } from 'react';
import FileUpload from '../../components/FileUpload';
import { trackGtagEvent } from '../../analytics';

declare global {
  interface Window { XLSX: any; }
}

const XlsxToCsvConverter: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [csv, setCsv] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFile = (selectedFile: File) => {
        setFile(selectedFile);
        setError(null);
        setCsv(null);
        convertFile(selectedFile);
    };

    const convertFile = (fileToConvert: File) => {
        if (!window.XLSX) {
            setError("XLSX library not loaded. Please refresh and try again.");
            return;
        }
        setIsProcessing(true);
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = window.XLSX.read(data, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const csvData = window.XLSX.utils.sheet_to_csv(worksheet);
                setCsv(csvData);
                trackGtagEvent('tool_used', {
                    event_category: 'File Converters & Utilities',
                    event_label: 'Excel (XLSX) to CSV Converter',
                    tool_name: 'excel-xlsx-to-csv-converter',
                    is_download: true,
                });
            } catch (err) {
                setError("Failed to convert the file. It might be corrupted or in an unsupported format.");
            } finally {
                setIsProcessing(false);
            }
        };
        reader.onerror = () => {
            setError("Failed to read the file.");
            setIsProcessing(false);
        };
        reader.readAsArrayBuffer(fileToConvert);
    };

    const handleDownload = () => {
        if (!csv || !file) return;
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${file.name.replace(/\.[^/.]+$/, "")}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    const handleReset = () => {
        setFile(null);
        setCsv(null);
        setError(null);
    };

    return (
        <div className="space-y-6">
            {!file ? (
                <FileUpload onFileUpload={handleFile} acceptedMimeTypes={['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']} title="Upload an XLSX file" />
            ) : isProcessing ? (
                <div className="text-center p-8 border-2 border-dashed rounded-lg">
                    <p className="text-lg font-semibold text-gray-700">Converting...</p>
                </div>
            ) : error ? (
                <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg">
                    <p className="font-semibold">An Error Occurred</p>
                    <p className="text-sm">{error}</p>
                    <button onClick={handleReset} className="mt-2 text-sm text-blue-600 hover:underline font-medium">Try again</button>
                </div>
            ) : csv && (
                 <div className="text-center space-y-4">
                    <h3 className="text-xl font-bold text-gray-800">Conversion Successful!</h3>
                    <p className="text-gray-600">Your XLSX file has been converted to CSV.</p>
                    <button onClick={handleDownload} className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition">Download CSV</button>
                    <button onClick={handleReset} className="ml-4 text-sm text-blue-600 hover:underline">Convert another file</button>
                </div>
            )}
        </div>
    );
};

export default XlsxToCsvConverter;
