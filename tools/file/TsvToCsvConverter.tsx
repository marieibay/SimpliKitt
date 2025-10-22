
import React, { useState } from 'react';
import FileUpload from '../../components/FileUpload';
import { trackGtagEvent } from '../../analytics';

const TsvToCsvConverter: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [csvContent, setCsvContent] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFile = (selectedFile: File) => {
        setFile(selectedFile);
        setError(null);
        setCsvContent(null);
        convertFile(selectedFile);
    };

    const convertFile = (fileToConvert: File) => {
        setIsProcessing(true);
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const tsvData = e.target?.result as string;
                const csvData = tsvData.replace(/\t/g, ',');
                setCsvContent(csvData);
                trackGtagEvent('tool_used', {
                    event_category: 'File Converters & Utilities',
                    event_label: 'TSV (Tab Separated) to CSV Converter',
                    tool_name: 'tsv-tab-separated-to-csv-converter',
                    is_download: true,
                });
            } catch (err) {
                setError("Failed to process the file.");
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
        if (!csvContent || !file) return;
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${file.name.replace(/\.[^/.]+$/, "")}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    const handleReset = () => {
        setFile(null);
        setCsvContent(null);
        setError(null);
    };

    return (
        <div className="space-y-6">
            {!file ? (
                <FileUpload onFileUpload={handleFile} acceptedMimeTypes={['text/tab-separated-values', 'text/plain']} title="Upload a TSV or TXT file" />
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
            ) : csvContent && (
                 <div className="text-center space-y-4">
                    <h3 className="text-xl font-bold text-gray-800">Conversion Successful!</h3>
                    <p className="text-gray-600">Your TSV file has been converted to CSV.</p>
                    <button onClick={handleDownload} className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition">Download CSV</button>
                    <button onClick={handleReset} className="ml-4 text-sm text-blue-600 hover:underline">Convert another file</button>
                </div>
            )}
        </div>
    );
};

export default TsvToCsvConverter;
