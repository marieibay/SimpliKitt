import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { trackEvent } from '../../analytics';
import { UploadIcon } from '../../components/Icons';

declare global {
    interface Window { JSZip: any; }
}

const BulkImageToGrayscale: React.FC = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);

    const onDrop = (acceptedFiles: File[]) => {
        setFiles(prev => [...prev, ...acceptedFiles]);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] }
    });
    
    const handleConvertAndDownload = async () => {
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
            if(ctx) {
                ctx.drawImage(image, 0, 0);
                ctx.globalCompositeOperation = 'luminosity';
                ctx.fillStyle = 'white';
                ctx.fillRect(0,0, canvas.width, canvas.height);
                ctx.globalCompositeOperation = 'source-over';
            }

            const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));
            if(blob) {
                zip.file(file.name, blob);
            }
            URL.revokeObjectURL(image.src);
        }

        const content = await zip.generateAsync({ type: "blob" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(content);
        link.download = "grayscale-images.zip";
        link.click();
        
        trackEvent('bulk_images_to_grayscale', { count: files.length });
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
                    <button onClick={handleConvertAndDownload} disabled={isProcessing} className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-300">
                        {isProcessing ? `Converting ${files.length} images...` : `Convert ${files.length} Images to Grayscale & Download`}
                    </button>
                </div>
            )}
        </div>
    );
};

export default BulkImageToGrayscale;
