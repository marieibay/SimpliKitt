import React, { useState, useRef, useEffect, useCallback } from 'react';
import FileUpload from '../../components/FileUpload';
import { trackEvent } from '../../analytics';

const ImageThresholdFilter: React.FC = () => {
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [threshold, setThreshold] = useState(128);
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = e => {
            const img = new Image();
            img.onload = () => setImage(img);
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    };

    const applyFilter = useCallback(() => {
        if (!image || !canvasRef.current) return;
        setIsProcessing(true);

        setTimeout(() => {
            const canvas = canvasRef.current!;
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            if (!ctx) return;

            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
                const brightness = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
                const value = brightness > threshold ? 255 : 0;
                data[i] = data[i + 1] = data[i + 2] = value;
            }
            ctx.putImageData(imageData, 0, 0);
            setResultUrl(canvas.toDataURL('image/png'));
            setIsProcessing(false);
        }, 50);
    }, [image, threshold]);
    
    useEffect(() => {
        if(image) applyFilter();
    }, [image, threshold, applyFilter]);

    const handleDownload = () => {
        if (!resultUrl) return;
        trackEvent('image_filter_applied', { filter: 'threshold', threshold });
        const link = document.createElement('a');
        link.href = resultUrl;
        link.download = 'threshold-image.png';
        link.click();
    };

    if (!image) {
        return <FileUpload onFileUpload={handleFile} acceptedMimeTypes={['image/jpeg', 'image/png', 'image/webp']} />;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-center items-center bg-gray-100 p-4 rounded-lg border min-h-[300px]">
                {isProcessing ? <p>Processing...</p> : resultUrl ? <img src={resultUrl} alt="Preview" className="max-w-full max-h-[500px]" /> : null}
                <canvas ref={canvasRef} className="hidden" />
            </div>
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <label className="block text-sm font-medium">Threshold: {threshold}</label>
                <input type="range" min="0" max="255" value={threshold} onChange={e => setThreshold(parseInt(e.target.value))} className="w-full" />
            </div>
            <div className="flex justify-center gap-4">
                <button onClick={handleDownload} disabled={!resultUrl} className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700">Download Image</button>
                <button onClick={() => setImage(null)} className="px-4 py-2 text-sm text-gray-600 hover:underline">Use another image</button>
            </div>
        </div>
    );
};

export default ImageThresholdFilter;
