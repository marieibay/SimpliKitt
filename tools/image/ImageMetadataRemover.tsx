import React, { useState } from 'react';
import FileUpload from '../../components/FileUpload';
import { trackEvent } from '../../analytics';

const ImageMetadataRemover: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleFile = (selectedFile: File) => {
        setFile(selectedFile);
        setIsProcessing(true);
        
        const reader = new FileReader();
        reader.onload = e => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0);
                setResultUrl(canvas.toDataURL('image/jpeg', 0.95)); // Save as high quality JPEG
                setIsProcessing(false);
                trackEvent('image_metadata_removed');
            };
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(selectedFile);
    };

    const handleReset = () => {
        setFile(null);
        setResultUrl(null);
    };
    
    if (resultUrl && file) {
        return (
             <div className="text-center space-y-4 p-6 bg-green-50 rounded-lg border border-green-200">
                <h3 className="text-xl font-bold text-gray-800">Metadata Removed!</h3>
                <p className="text-gray-600">A clean version of <strong>{file.name}</strong> is ready.</p>
                <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
                    <a href={resultUrl} download={`clean-${file.name}`} className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition">Download Clean Image</a>
                    <button onClick={handleReset} className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition">Process Another</button>
                </div>
            </div>
        );
    }
    
    return (
        <div>
            {isProcessing ? (
                <div className="text-center p-8 border-2 border-dashed rounded-lg">
                    <p className="text-lg font-semibold text-gray-700">Removing metadata...</p>
                </div>
            ) : (
                <FileUpload onFileUpload={handleFile} acceptedMimeTypes={['image/jpeg']} title="Upload JPEG to Remove EXIF Data" />
            )}
        </div>
    );
};

export default ImageMetadataRemover;
