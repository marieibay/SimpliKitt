import React, { useState } from 'react';
import FileUpload from '../../components/FileUpload';
import { trackEvent, trackGtagEvent } from '../../analytics';

declare global {
  interface Window {
    heic2any: any;
  }
}

const HeicToPngConverter: React.FC = () => {
    const [originalFile, setOriginalFile] = useState<File | null>(null);
    const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFile = (file: File) => {
        setOriginalFile(file);
        setConvertedUrl(null);
        setError(null);
        handleConvert(file);
    };

    const handleConvert = async (fileToConvert: File) => {
        if (!window.heic2any) {
            setError("Conversion library not loaded. Please refresh and try again.");
            return;
        }
        setIsProcessing(true);
        setError(null);

        try {
            const conversionResult = await window.heic2any({
                blob: fileToConvert,
                toType: "image/png",
            });

            const url = URL.createObjectURL(Array.isArray(conversionResult) ? conversionResult[0] : conversionResult);
            setConvertedUrl(url);

            trackEvent('heic_to_png_converted');
            trackGtagEvent('tool_used', {
                event_category: 'Image Tools',
                event_label: 'HEIC to PNG Converter',
                tool_name: 'heic-to-png-converter',
                is_download: true,
            });
        } catch (err) {
            console.error(err);
            setError("Failed to convert the HEIC file. It might be corrupted or in an unsupported format.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleReset = () => {
        setOriginalFile(null);
        if (convertedUrl) {
            URL.revokeObjectURL(convertedUrl);
        }
        setConvertedUrl(null);
        setError(null);
        setIsProcessing(false);
    };

    const getOutputFileName = () => {
        if (!originalFile) return 'converted.png';
        const name = originalFile.name.substring(0, originalFile.name.lastIndexOf('.'));
        return `${name}.png`;
    };

    if (isProcessing) {
        return (
            <div className="text-center p-8 border-2 border-dashed border-gray-200 rounded-lg">
                <svg className="animate-spin h-10 w-10 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-lg font-semibold text-gray-700 mt-4">Converting your HEIC file...</p>
                <p className="text-sm text-gray-500 mt-1">This may take a moment.</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg">
                <p className="font-semibold">Conversion Error</p>
                <p className="text-sm">{error}</p>
                <button onClick={handleReset} className="mt-2 text-sm text-blue-600 hover:underline font-medium">
                    Try another file
                </button>
            </div>
        );
    }

    if (convertedUrl) {
        return (
            <div className="text-center space-y-4 p-6 bg-green-50 rounded-lg border border-green-200">
                <h3 className="text-xl font-bold text-gray-800">Conversion Successful!</h3>
                <img src={convertedUrl} alt="Converted PNG" className="max-w-xs mx-auto rounded-lg border" />
                <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
                    <a href={convertedUrl} download={getOutputFileName()} className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition">
                        Download PNG
                    </a>
                    <button onClick={handleReset} className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition">
                        Convert Another
                    </button>
                </div>
            </div>
        );
    }
    
    return (
        <FileUpload
            onFileUpload={handleFile}
            acceptedMimeTypes={['image/heic', 'image/heif']}
            title="Upload a HEIC file to convert"
            description="Your iPhone photos will be converted to PNG format."
        />
    );
};

export default HeicToPngConverter;
