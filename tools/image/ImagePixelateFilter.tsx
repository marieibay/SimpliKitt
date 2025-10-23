import React, { useState, useRef, useEffect, useCallback } from 'react';
import FileUpload from '../../components/FileUpload';
import { trackEvent, trackGtagEvent } from '../../analytics';

const ImagePixelateFilter: React.FC = () => {
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [pixelSize, setPixelSize] = useState(10);
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = e => {
            const img = new Image();
            img.onload = () => {
                setImage(img);
                setPixelSize(10);
            };
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    };

    const applyPixelate = useCallback(() => {
        if (!image || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        const size = pixelSize / 100;
        const w = canvas.width * size;
        const h = canvas.height * size;
        
        canvas.width = image.width;
        canvas.height = image.height;

        ctx.imageSmoothingEnabled = false;
        
        // Draw small version
        ctx.drawImage(image, 0, 0, w, h);
        
        // Draw back to full size
        ctx.drawImage(canvas, 0, 0, w, h, 0, 0, canvas.width, canvas.height);
        
        setResultUrl(canvas.toDataURL('image/png'));
    }, [image, pixelSize]);

    useEffect(() => {
        applyPixelate();
    }, [image, pixelSize, applyPixelate]);

    const handleDownload = () => {
        if (!resultUrl) return;
        trackEvent('image_filter_applied', { filter: 'pixelate', intensity: pixelSize });
        trackGtagEvent('tool_used', {
            event_category: 'Image Tools',
            event_label: 'Image Pixelate Filter',
            tool_name: 'image-pixelate-filter',
            is_download: true,
            pixel_size: pixelSize,
        });
        const link = document.createElement('a');
        link.href = resultUrl;
        link.download = `pixelated-image.png`;
        link.click();
    };

    const handleReset = () => setImage(null);
    
    if (!image) {
        return <FileUpload onFileUpload={handleFile} acceptedMimeTypes={['image/jpeg', 'image/png', 'image/webp']} />;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-center items-center bg-gray-100 p-4 rounded-lg border min-h-[300px]">
                {resultUrl ? (
                    <img src={resultUrl} alt="Pixelated preview" className="max-w-full max-h-[500px]" style={{ imageRendering: 'pixelated' }} />
                ) : (
                    <p>Pixelating...</p>
                )}
                <canvas ref={canvasRef} className="hidden" />
            </div>
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <label className="block text-sm font-medium">Pixel Size: {pixelSize}</label>
                <input type="range" min="1" max="50" value={pixelSize} onChange={e => setPixelSize(parseInt(e.target.value))} className="w-full" />
            </div>
            <div className="flex justify-center gap-4">
                <button onClick={handleDownload} disabled={!resultUrl} className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700">Download Image</button>
                <button onClick={handleReset} className="px-4 py-2 text-sm text-gray-600 hover:underline">Use another image</button>
            </div>
        </div>
    );
};

export default ImagePixelateFilter;