import React, { useState, useRef, useEffect, useCallback } from 'react';
import FileUpload from '../../components/FileUpload';
import { trackEvent } from '../../analytics';

const ImageTintAdjuster: React.FC = () => {
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [tintColor, setTintColor] = useState('#ff0000');
    const [intensity, setIntensity] = useState(30);
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

    const applyTint = useCallback(() => {
        if (!image || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = image.width;
        canvas.height = image.height;
        
        ctx.drawImage(image, 0, 0);
        
        ctx.globalCompositeOperation = 'multiply';
        ctx.globalAlpha = intensity / 100;
        ctx.fillStyle = tintColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Reset for next draw
        ctx.globalAlpha = 1.0;
        ctx.globalCompositeOperation = 'source-over';
        
        setResultUrl(canvas.toDataURL('image/png'));
    }, [image, tintColor, intensity]);
    
    useEffect(() => {
        applyTint();
    }, [image, tintColor, intensity, applyTint]);

    const handleDownload = () => {
        if (!resultUrl) return;
        trackEvent('image_filter_applied', { filter: 'tint', color: tintColor, intensity });
        const link = document.createElement('a');
        link.href = resultUrl;
        link.download = 'tinted-image.png';
        link.click();
    };

    if (!image) {
        return <FileUpload onFileUpload={handleFile} acceptedMimeTypes={['image/jpeg', 'image/png', 'image/webp']} />;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 flex justify-center items-center bg-gray-100 p-4 rounded-lg border">
                {resultUrl ? <img src={resultUrl} alt="Preview" className="max-w-full max-h-[500px]" /> : <p>Loading...</p>}
                <canvas ref={canvasRef} className="hidden" />
            </div>
            <div className="space-y-6 bg-gray-50 p-4 rounded-lg">
                <div>
                    <label className="block text-sm font-medium">Tint Color</label>
                    <input type="color" value={tintColor} onChange={e => setTintColor(e.target.value)} className="w-full h-10 p-1 border rounded-md" />
                </div>
                 <div>
                    <label className="block text-sm font-medium">Intensity: {intensity}%</label>
                    <input type="range" min="0" max="100" value={intensity} onChange={e => setIntensity(parseInt(e.target.value))} className="w-full" />
                </div>
                <div className="pt-4 space-y-3">
                    <button onClick={handleDownload} disabled={!resultUrl} className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700">Download Image</button>
                    <button onClick={() => setImage(null)} className="w-full text-sm text-blue-600 hover:underline">Use another image</button>
                </div>
            </div>
        </div>
    );
};

export default ImageTintAdjuster;