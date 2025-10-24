import React, { useState, useEffect, useRef } from 'react';
import FileUpload from '../../components/FileUpload';
import { trackEvent, trackGtagEvent } from '../../analytics';
import { LoaderIcon } from '../../components/Icons';

const HeicToPngConverter: React.FC = () => {
    const [isReady, setIsReady] = useState(false);
    const [status, setStatus] = useState("Initializing...");
    const [libError, setLibError] = useState('');

    const [originalFile, setOriginalFile] = useState<File | null>(null);
    const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const heic2anyRef = useRef<any>(null);

    useEffect(() => {
        const loadLibrary = async () => {
            try {
                setStatus("Loading HEIC converter...");
                const heic2anyModule = await import('heic2any');
                heic2anyRef.current = heic2anyModule.default || heic2anyModule;
                setIsReady(true);
                setStatus("Ready");
            } catch (err) {
                console.error(err);
                setStatus("Error loading library");
                setLibError("Failed to load the HEIC library. Please refresh the page.");
            }
        };
        loadLibrary();
    }, []);

    const handleFile = (file: File) => {
        setOriginalFile(file);
        setConvertedUrl(null);
        setError(null);
        handleConvert(file);
    };

    const handleConvert = async (fileToConvert: File) => {
        if (!heic2anyRef.current) {
            setError("Conversion library not loaded. Please refresh and try again.");
            return;
        }
        setIsProcessing(true);
        setError(null);

        try {
            const conversionResult = await heic2anyRef.current({
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

    if (!isReady) {
        return (
            <div className="flex flex-col items-center justify-center bg-gray-50 p-6 rounded-lg border min-h-[300px]">
                <LoaderIcon className="w-12 h-12 text-blue-600 animate-spin mb-6" />
                <h2 className="text-xl font-bold text-gray-800 mb-2">Initializing Converter...</h2>
                <p className="text-gray-600">{status}</p>
                {libError && <p className="mt-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">{libError}</p>}
            </div>
        );
    }

    if (isProcessing) {
        return (
            <div className="text-center p-8 border-2 border-dashed border-gray-200 rounded-lg">
                <LoaderIcon className="w-10 h-10 text-blue-600 animate-spin mx-auto" />
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