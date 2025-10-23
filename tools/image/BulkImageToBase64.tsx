import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { trackEvent, trackGtagEvent } from '../../analytics';
import { UploadIcon } from '../../components/Icons';

const BulkImageToBase64: React.FC = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    
    const onDrop = (acceptedFiles: File[]) => {
        setFiles(prev => [...prev, ...acceptedFiles]);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp', '.svg'] }
    });
    
    const handleConvertAndDownload = async () => {
        if (files.length === 0) return;

        setIsProcessing(true);
        let outputText = '';

        for (const file of files) {
            const reader = new FileReader();
            const dataUrl = await new Promise<string>(resolve => {
                reader.onload = e => resolve(e.target?.result as string);
                reader.readAsDataURL(file);
            });
            outputText += `/* ${file.name} */\n`;
            outputText += `'${dataUrl}'\n\n`;
        }

        const blob = new Blob([outputText], { type: 'text/plain' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "base64-images.txt";
        link.click();
        
        trackEvent('bulk_images_to_base64', { count: files.length });
        trackGtagEvent('tool_used', {
            event_category: 'Image Tools',
            event_label: 'Bulk Image to Base64',
            tool_name: 'bulk-image-to-base64',
            is_download: true,
            file_count: files.length,
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
                    <button onClick={handleConvertAndDownload} disabled={isProcessing} className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-300">
                        {isProcessing ? `Converting ${files.length} images...` : `Convert ${files.length} Images & Download TXT`}
                    </button>
                </div>
            )}
        </div>
    );
};

export default BulkImageToBase64;