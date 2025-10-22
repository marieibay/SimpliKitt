
import React, { useState } from 'react';
import FileUpload from '../../components/FileUpload';
import { trackGtagEvent } from '../../analytics';

const FileChecksumCalculator: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [checksum, setChecksum] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const handleFile = (selectedFile: File) => {
        setFile(selectedFile);
        setError(null);
        setChecksum(null);
        calculateChecksum(selectedFile);
    };

    const calculateChecksum = async (fileToProcess: File) => {
        if (!crypto.subtle) {
            setError("Web Crypto API not supported in this browser. Please use a modern browser.");
            return;
        }
        setIsProcessing(true);
        try {
            const buffer = await fileToProcess.arrayBuffer();
            const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            setChecksum(hashHex);
            trackGtagEvent('tool_used', {
                event_category: 'File Converters & Utilities',
                event_label: 'File Checksum Calculator',
                tool_name: 'file-checksum-calculator',
                is_download: false,
                file_size: fileToProcess.size,
            });
        } catch (err) {
            setError("Failed to calculate checksum. The file might be too large or an error occurred.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleReset = () => {
        setFile(null);
        setChecksum(null);
        setError(null);
    };
    
    const handleCopy = () => {
        if (!checksum) return;
        navigator.clipboard.writeText(checksum);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <div className="space-y-6">
            {!file ? (
                <FileUpload onFileUpload={handleFile} acceptedMimeTypes={[]} title="Upload a file to calculate its checksum" />
            ) : isProcessing ? (
                <div className="text-center p-8 border-2 border-dashed rounded-lg">
                    <p className="text-lg font-semibold text-gray-700">Calculating Checksum...</p>
                </div>
            ) : error ? (
                <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg">
                    <p className="font-semibold">An Error Occurred</p>
                    <p className="text-sm">{error}</p>
                    <button onClick={handleReset} className="mt-2 text-sm text-blue-600 hover:underline font-medium">Try again</button>
                </div>
            ) : checksum && (
                 <div className="space-y-4">
                    <p className="text-center">SHA-256 Checksum for <strong>{file.name}</strong>:</p>
                    <div className="relative">
                        <textarea
                            readOnly
                            value={checksum}
                            className="w-full p-3 font-mono text-sm bg-gray-100 border rounded-lg"
                            rows={3}
                        />
                         <button onClick={handleCopy} className="absolute top-2 right-2 px-3 py-1 bg-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-300">
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                    <div className="text-center">
                        <button onClick={handleReset} className="text-sm text-blue-600 hover:underline">Calculate for another file</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FileChecksumCalculator;
