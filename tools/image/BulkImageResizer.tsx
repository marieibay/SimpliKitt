import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { trackEvent, trackGtagEvent } from '../../analytics';
import { UploadIcon } from '../../components/Icons';

declare global {
    interface Window { JSZip: any; }
}

const BulkImageResizer: React.FC = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [maxWidth, setMaxWidth] = useState(1024);
    const [isProcessing, setIsProcessing] = useState(false);

    const onDrop = (acceptedFiles: File[]) => {
        setFiles(prev => [...prev, ...acceptedFiles]);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] }
    });
    
    const handleResizeAndDownload = async () => {
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
            const ratio = image.width / image.height;
            canvas.width = maxWidth;
            canvas.height = maxWidth / ratio;
            
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(image, 0, 0, canvas.width, canvas.height);

            const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.9));
            if(blob) {
                zip.file(file.name, blob);
            }
            URL.revokeObjectURL(image.src);
        }

        const content = await zip.generateAsync({ type: "blob" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(content);
        link.download = "resized-images.zip";
        link.click();
        
        trackEvent('bulk_images_resized', { count: files.length, maxWidth });
        trackGtagEvent('tool_used', {
            event_category: 'Image Tools',
            event_label: 'Bulk Image Resizer',
            tool_name: 'bulk-image-resizer',
            is_download: true,
            file_count: files.length,
            max_width: maxWidth,
        });
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
                        <label className="block text-sm font-medium">Max Width: {maxWidth}px</label>
                        <input type="range" min="128" max="4096" step="128" value={maxWidth} onChange={e => setMaxWidth(+e.target.value)} className="w-full" />
                    </div>
                    <button onClick={handleResizeAndDownload} disabled={isProcessing} className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-300">
                        {isProcessing ? `Processing ${files.length} images...` : `Resize ${files.length} Images & Download ZIP`}
                    </button>
                </div>
            )}
        </div>
    );
};

export default BulkImageResizer;