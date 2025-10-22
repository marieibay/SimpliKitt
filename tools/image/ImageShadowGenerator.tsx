import React, { useState, useRef, useEffect, useCallback } from 'react';
import FileUpload from '../../components/FileUpload';
import { trackEvent } from '../../analytics';

const ImageShadowGenerator: React.FC = () => {
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [shadow, setShadow] = useState({ offsetX: 10, offsetY: 10, blur: 15, color: '#000000' });
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

    const draw = useCallback(() => {
        if (!image || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        const padding = shadow.blur * 2;
        canvas.width = image.width + padding * 2;
        canvas.height = image.height + padding * 2;

        ctx.shadowOffsetX = shadow.offsetX;
        ctx.shadowOffsetY = shadow.offsetY;
        ctx.shadowBlur = shadow.blur;
        ctx.shadowColor = shadow.color;
        
        ctx.drawImage(image, padding, padding);
        
        setResultUrl(canvas.toDataURL('image/png'));
    }, [image, shadow]);

    useEffect(() => {
        draw();
    }, [draw]);

    const handleDownload = () => {
        if (!resultUrl) return;
        trackEvent('image_shadow_added');
        const link = document.createElement('a');
        link.href = resultUrl;
        link.download = 'shadow-image.png';
        link.click();
    };

    if (!image) {
        return <FileUpload onFileUpload={handleFile} acceptedMimeTypes={['image/png']} title="Upload PNG with Transparency" />;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 flex justify-center items-center bg-gray-100 p-4 rounded-lg border">
                {resultUrl ? <img src={resultUrl} alt="Preview" className="max-w-full max-h-[500px]" /> : <p>Loading...</p>}
                <canvas ref={canvasRef} className="hidden" />
            </div>
            <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                <div>
                    <label className="block text-sm font-medium">Offset X: {shadow.offsetX}px</label>
                    <input type="range" min="-50" max="50" value={shadow.offsetX} onChange={e => setShadow(s => ({...s, offsetX: Number(e.target.value)}))} className="w-full" />
                </div>
                 <div>
                    <label className="block text-sm font-medium">Offset Y: {shadow.offsetY}px</label>
                    <input type="range" min="-50" max="50" value={shadow.offsetY} onChange={e => setShadow(s => ({...s, offsetY: Number(e.target.value)}))} className="w-full" />
                </div>
                <div>
                    <label className="block text-sm font-medium">Blur: {shadow.blur}px</label>
                    <input type="range" min="0" max="50" value={shadow.blur} onChange={e => setShadow(s => ({...s, blur: Number(e.target.value)}))} className="w-full" />
                </div>
                <div>
                    <label className="block text-sm font-medium">Color</label>
                    <input type="color" value={shadow.color} onChange={e => setShadow(s => ({...s, color: e.target.value}))} className="w-full h-10 p-1 border rounded-md" />
                </div>
                <div className="pt-4 space-y-3">
                    <button onClick={handleDownload} className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700">Download Image</button>
                    <button onClick={() => setImage(null)} className="w-full text-sm text-blue-600 hover:underline">Use another image</button>
                </div>
            </div>
        </div>
    );
};

export default ImageShadowGenerator;
