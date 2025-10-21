import React, { useState, useRef, useEffect, useCallback } from 'react';
import FileUpload from '../../components/FileUpload';
import { trackEvent } from '../../analytics';

const AddRoundedCornersToImage: React.FC = () => {
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [radius, setRadius] = useState(30);
    const [resultUrl, setResultUrl] = useState<string | null>(null);
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

    const addRoundedCorners = useCallback(() => {
        if (!image || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = image.width;
        canvas.height = image.height;
        
        ctx.beginPath();
        ctx.moveTo(radius, 0);
        ctx.lineTo(canvas.width - radius, 0);
        ctx.arcTo(canvas.width, 0, canvas.width, radius, radius);
        ctx.lineTo(canvas.width, canvas.height - radius);
        ctx.arcTo(canvas.width, canvas.height, canvas.width - radius, canvas.height, radius);
        ctx.lineTo(radius, canvas.height);
        ctx.arcTo(0, canvas.height, 0, canvas.height - radius, radius);
        ctx.lineTo(0, radius);
        ctx.arcTo(0, 0, radius, 0, radius);
        ctx.closePath();
        ctx.clip();
        
        ctx.drawImage(image, 0, 0);
        
        setResultUrl(canvas.toDataURL('image/png'));
    }, [image, radius]);
    
    useEffect(() => {
        addRoundedCorners();
    }, [image, radius, addRoundedCorners]);

    const handleDownload = () => {
        if (!resultUrl) return;
        trackEvent('image_rounded_corners_added', { radius });
        const link = document.createElement('a');
        link.href = resultUrl;
        link.download = 'rounded-image.png';
        link.click();
    };

    const handleReset = () => setImage(null);
    
    const maxRadius = image ? Math.min(image.width, image.height) / 2 : 50;

    if (!image) {
        return <FileUpload onFileUpload={handleFile} acceptedMimeTypes={['image/jpeg', 'image/png', 'image/webp']} />;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-center items-center bg-gray-100 p-4 rounded-lg border min-h-[300px]">
                {resultUrl ? <img src={resultUrl} alt="Preview" className="max-w-full max-h-[500px]" /> : <p>Loading...</p>}
                <canvas ref={canvasRef} className="hidden" />
            </div>
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <label className="block text-sm font-medium">Corner Radius: {radius}px</label>
                <input type="range" min="0" max={maxRadius} value={radius} onChange={e => setRadius(parseInt(e.target.value))} className="w-full" />
            </div>
            <div className="flex justify-center gap-4">
                <button onClick={handleDownload} disabled={!resultUrl} className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700">Download Image</button>
                <button onClick={handleReset} className="px-4 py-2 text-sm text-gray-600 hover:underline">Use another image</button>
            </div>
        </div>
    );
};

export default AddRoundedCornersToImage;
