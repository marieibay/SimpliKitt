import React, { useState, useEffect } from 'react';
import FileUpload from '../../components/FileUpload';
import { trackEvent } from '../../analytics';

declare global {
  interface Window {
    piexif: any;
  }
}

const ImageDpiChanger: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [dpi, setDpi] = useState<number>(300);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const [libReady, setLibReady] = useState(false);

    useEffect(() => {
        if (window.piexif) {
            setLibReady(true);
            return;
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
            setError('This tool currently only supports JPEG files for metadata modification.');
            return;
        }
        setFile(selectedFile);
        setResultUrl(null);
        setError(null);
    };

    const handleChangeDpi = () => {
        if (!file || !libReady) return;

        setIsProcessing(true);
        setError(null);
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const imageDataUrl = e.target?.result as string;
                const exifObj = window.piexif.load(imageDataUrl);
                
                exifObj['0th'][window.piexif.ImageIFD.XResolution] = [dpi, 1];
                exifObj['0th'][window.piexif.ImageIFD.YResolution] = [dpi, 1];
                exifObj['0th'][window.piexif.ImageIFD.ResolutionUnit] = 2; // Inches

                const exifBytes = window.piexif.dump(exifObj);
                const newImageDataUrl = window.piexif.insert(exifBytes, imageDataUrl);
                
                setResultUrl(newImageDataUrl);
                trackEvent('image_dpi_changed', { dpi });
            } catch (err) {
                console.error(err);
                setError("Could not modify DPI. The file may not have valid EXIF data or is corrupted.");
            } finally {
                setIsProcessing(false);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleReset = () => {
        setFile(null);
        setResultUrl(null);
        setError(null);
    };

    return (
        <div className="space-y-6">
            {!file ? (
                <FileUpload onFileUpload={handleFile} acceptedMimeTypes={['image/jpeg']} title="Upload a JPEG to Change DPI" />
            ) : (
                <div className="text-center p-4 bg-gray-50 border rounded-lg">
                    <p className="font-semibold">{file.name}</p>
                </div>
            )}
            
            {error && <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg"><p className="font-semibold">Error</p><p className="text-sm">{error}</p></div>}

            {file && !resultUrl && (
                <div className="space-y-4">
                    <div className="p-4 bg-gray-50 border rounded-lg">
                        <label htmlFor="dpi" className="block text-sm font-medium text-gray-700 mb-1">New DPI Value</label>
                        <select id="dpi" value={dpi} onChange={e => setDpi(Number(e.target.value))} className="w-full p-2 border-gray-300 rounded-md">
                            <option value={72}>72 DPI (Screen)</option>
                            <option value={96}>96 DPI (Windows Default)</option>
                            <option value={150}>150 DPI (Draft Print)</option>
                            <option value={300}>300 DPI (High-Quality Print)</option>
                        </select>
                         <p className="text-xs text-gray-500 mt-2">Note: This only changes the DPI value in the file's metadata, it does not change the pixel dimensions of the image.</p>
                    </div>
                    <button onClick={handleChangeDpi} disabled={isProcessing || !libReady} className="w-full px-5 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-300">
                        {isProcessing ? 'Processing...' : `Set DPI to ${dpi} and Download`}
                    </button>
                </div>
            )}

            {resultUrl && (
                <div className="text-center space-y-4 p-6 bg-green-50 rounded-lg border border-green-200">
                    <h3 className="text-xl font-bold text-gray-800">DPI Changed Successfully!</h3>
                    <div className="flex justify-center gap-4">
                        <a href={resultUrl} download={`${file?.name.replace(/\.[^/.]+$/, '')}-dpi${dpi}.jpg`} className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700">Download Image</a>
                        <button onClick={handleReset} className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300">Start Over</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageDpiChanger;