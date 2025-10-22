import React, { useState, useEffect } from 'react';
import FileUpload from '../../components/FileUpload';
import { trackEvent } from '../../analytics';

declare global {
  interface Window {
    piexif: any;
  }
}

const ImageMetadataRemover: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [libReady, setLibReady] = useState(false);

    useEffect(() => {
        if (window.piexif) {
            setLibReady(true); return;
        }
        let attempts = 0;
        const interval = setInterval(() => {
            if (window.piexif) {
                setLibReady(true);
                clearInterval(interval);
            } else if (attempts++ > 35) {
                clearInterval(interval);
                setError("Metadata library (piexifjs) failed to load. Please refresh.");
            }
        }, 200);
        return () => clearInterval(interval);
    }, []);

    const handleFile = (selectedFile: File) => {
        if (selectedFile.type !== 'image/jpeg') {
            setError('This tool currently only supports JPEG files for metadata removal.');
            return;
        }
        setFile(selectedFile);
        setResultUrl(null);
        setError(null);
    };

    const removeMetadata = () => {
        if (!file || !libReady) return;
        setIsProcessing(true);
        setError(null);
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const imageDataUrl = e.target?.result as string;
                const newImageDataUrl = window.piexif.remove(imageDataUrl);
                setResultUrl(newImageDataUrl);
                trackEvent('image_metadata_removed');
            } catch (err) {
                setError("Could not remove metadata. The file may be corrupted.");
            } finally {
                setIsProcessing(false);
            }
        };
        reader.readAsDataURL(file);
    };

    if (resultUrl && file) {
        return (
            <div className="text-center space-y-4 p-6 bg-green-50 rounded-lg border">
                <h3 className="text-xl font-bold text-gray-800">Metadata Removed!</h3>
                <div className="flex justify-center gap-4">
                    <a href={resultUrl} download={`${file.name.replace(/\.[^/.]+$/, '')}-clean.jpg`} className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700">Download Clean Image</a>
                    <button onClick={() => { setFile(null); setResultUrl(null); }} className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300">Start Over</button>
                </div>
            </div>
        );
    }
    
    return (
        <div className="space-y-6">
            {!file ? (
                <FileUpload onFileUpload={handleFile} acceptedMimeTypes={['image/jpeg']} title="Upload a JPEG to Remove EXIF Data" />
            ) : (
                <div className="text-center p-4 bg-gray-50 border rounded-lg">
                    <p className="font-semibold">{file.name}</p>
                </div>
            )}
            
            {error && <p className="p-4 bg-red-50 text-red-700 rounded-lg">{error}</p>}

            {file && (
                <div className="text-center">
                    <button onClick={removeMetadata} disabled={isProcessing || !libReady} className="w-full max-w-xs px-5 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-300">
                        {isProcessing ? 'Processing...' : 'Remove Metadata'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default ImageMetadataRemover;
