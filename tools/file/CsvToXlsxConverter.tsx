
import React, { useState } from 'react';
import FileUpload from '../../components/FileUpload';
import { trackGtagEvent } from '../../analytics';

declare global {
  interface Window { XLSX: any; }
}

const CsvToXlsxConverter: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [xlsxBlob, setXlsxBlob] = useState<Blob | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFile = (selectedFile: File) => {
        setFile(selectedFile);
        setError(null);
        setXlsxBlob(null);
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
                const csvData = e.target?.result as string;
                const worksheet = window.XLSX.utils.csv_to_sheet(csvData);
                const workbook = window.XLSX.utils.book_new();
                window.XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
                const wbout = window.XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
                const blob = new Blob([wbout], { type: 'application/octet-stream' });
                setXlsxBlob(blob);
                trackGtagEvent('tool_used', {
                    event_category: 'File Converters & Utilities',
                    event_label: 'CSV to Excel (XLSX) Converter',
                    tool_name: 'csv-to-excel-xlsx-converter',
                    is_download: true,
                });
            } catch (err) {
                setError("Failed to convert the file. Please ensure it's a valid CSV.");
            } finally {
                setIsProcessing(false);
            }
        };
        reader.onerror = () => {
            setError("Failed to read the file.");
            setIsProcessing(false);
        };
        reader.readAsText(fileToConvert);
    };

    const handleDownload = () => {
        if (!xlsxBlob || !file) return;
        const link = document.createElement('a');
        link.href = URL.createObjectURL(xlsxBlob);
        link.download = `${file.name.replace(/\.[^/.]+$/, "")}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    const handleReset = () => {
        setFile(null);
        setXlsxBlob(null);
        setError(null);
    };

    return (
        <div className="space-y-6">
            {!file ? (
                <FileUpload onFileUpload={handleFile} acceptedMimeTypes={['text/csv']} title="Upload a CSV file" />
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
            ) : xlsxBlob && (
                 <div className="text-center space-y-4">
                    <h3 className="text-xl font-bold text-gray-800">Conversion Successful!</h3>
                    <p className="text-gray-600">Your CSV file has been converted to XLSX.</p>
                    <button onClick={handleDownload} className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition">Download XLSX</button>
                    <button onClick={handleReset} className="ml-4 text-sm text-blue-600 hover:underline">Convert another file</button>
                </div>
            )}
        </div>
    );
};

export default CsvToXlsxConverter;
