import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { trackEvent } from '../../analytics';
import { UploadIcon } from '../../components/Icons';

declare global {
    interface Window { JSZip: any; }
}

const BulkImageCompressor: React.FC = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [quality, setQuality] = useState(0.8);
    const [isProcessing, setIsProcessing] = useState(false);

    const onDrop = (acceptedFiles: File[]) => {
        setFiles(prev => [...prev, ...acceptedFiles]);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/jpeg': ['.jpeg', '.jpg'], 'image/png': ['.png'] }
    });
    
    const handleCompressAndDownload = async () => {
        if (files.length === 0) return;
        if (!window.JSZip) {
            alert("JSZip library not loaded. Please refresh.");
            return;
        }

        setIsProcessing(true);
        const zip = new window.JSZip();

        for (const file of files) {
            const image = new Image();
            image.src = URL.createObjectURL(file);
            await new Promise(resolve => image.onload = resolve);
            
            const canvas = document.createElement('canvas');
            canvas.width = image.width;
            canvas.height = image.height;
            
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(image, 0, 0);

            const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/jpeg', quality));
            if(blob) {
                zip.file(file.name.replace(/\.[^/.]+$/, ".jpg"), blob);
            }
            URL.revokeObjectURL(image.src);
        }

        const content = await zip.generateAsync({ type: "blob" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(content);
        link.download = "compressed-images.zip";
        link.click();
        
        trackEvent('bulk_images_compressed', { count: files.length, quality });
        setIsProcessing(false);
        setFiles([]);
    };

    return (
        <div className="space-y-6">
            <div {...getRootProps()} className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
                <input {...getInputProps()} />
                <UploadIcon className="w-12 h-12 text-gray-400 mx-auto" />
                <p>Drop images here, or click to select</p>
            </div>
            {files.length > 0 && (
                <div className="space-y-4">
                     <ul className="list-disc list-inside bg-gray-50 p-3 rounded-lg border max-h-48 overflow-y-auto">
                        {files.map((file, i) => <li key={i} className="text-sm truncate">{file.name}</li>)}
                    </ul>
                    <div>
                        <label className="block text-sm font-medium">Quality: {Math.round(quality * 100)}%</label>
                        <input type="range" min="0.1" max="1" step="0.05" value={quality} onChange={e => setQuality(+e.target.value)} className="w-full" />
                    </div>
                    <button onClick={handleCompressAndDownload} disabled={isProcessing} className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-300">
                        {isProcessing ? `Compressing ${files.length} images...` : `Compress ${files.length} Images & Download ZIP`}
                    </button>
                </div>
            )}
        </div>
    );
};

export default BulkImageCompressor;
