import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { trackEvent } from '../../analytics';
import { UploadIcon } from '../../components/Icons';

declare global {
    interface Window { JSZip: any; }
}

const BatchImageRotator: React.FC = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [angle, setAngle] = useState(90);
    const [isProcessing, setIsProcessing] = useState(false);

    const onDrop = (acceptedFiles: File[]) => {
        setFiles(prev => [...prev, ...acceptedFiles]);
    };
    const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: { 'image/*': [] } });
    
    const handleRotateAndDownload = async () => {
        if (!files.length || !window.JSZip) return;
        setIsProcessing(true);
        const zip = new window.JSZip();

        for (const file of files) {
            const img = new Image();
            img.src = URL.createObjectURL(file);
            await new Promise(r => img.onload = r);
            
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d')!;
            
            const rad = angle * Math.PI / 180;
            if (angle === 90 || angle === -90) {
                canvas.width = img.height;
                canvas.height = img.width;
            } else {
                canvas.width = img.width;
                canvas.height = img.height;
            }

            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate(rad);
            ctx.drawImage(img, -img.width / 2, -img.height / 2);

            const blob = await new Promise<Blob|null>(res => canvas.toBlob(res, 'image/png'));
            if (blob) zip.file(file.name, blob);
            URL.revokeObjectURL(img.src);
        }
        
        const content = await zip.generateAsync({ type: "blob" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(content);
        link.download = "rotated-images.zip";
        link.click();
        
        trackEvent('batch_images_rotated', { count: files.length, angle });
        setIsProcessing(false);
        setFiles([]);
    };
    
    return (
        <div className="space-y-6">
            <div {...getRootProps()} className="p-8 border-2 border-dashed rounded-lg text-center cursor-pointer">
                <input {...getInputProps()} />
                <UploadIcon className="w-12 h-12 text-gray-400 mx-auto" />
                <p>Drop images here</p>
            </div>
            {files.length > 0 && (
                <div className="space-y-4">
                    <ul className="list-disc list-inside bg-gray-50 p-3 rounded-lg border max-h-48 overflow-y-auto">
                        {files.map((file, i) => <li key={i} className="text-sm truncate">{file.name}</li>)}
                    </ul>
                    <div>
                        <label className="text-sm">Rotation Angle</label>
                        <select value={angle} onChange={e => setAngle(+e.target.value)} className="w-full p-2 border rounded-md">
                            <option value="90">90° Clockwise</option>
                            <option value="-90">90° Counter-Clockwise</option>
                            <option value="180">180°</option>
                        </select>
                    </div>
                    <button onClick={handleRotateAndDownload} disabled={isProcessing} className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg disabled:bg-blue-300">
                        {isProcessing ? `Processing...` : `Rotate ${files.length} Images & Download`}
                    </button>
                </div>
            )}
        </div>
    );
};

export default BatchImageRotator;
